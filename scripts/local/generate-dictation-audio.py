#!/usr/bin/env python3

from __future__ import annotations

import argparse
import ast
import asyncio
import re
import sys
from dataclasses import dataclass
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
CONTENT_ROOT = REPO_ROOT / "app" / "features" / "tests" / "content"
PUBLIC_ROOT = REPO_ROOT / "public"

QUESTION_BLOCK_RE = re.compile(
    r"\{\s*id:\s*\"(?P<id>[^\"]+)\"(?P<body>.*?)\n\s*\}",
    re.DOTALL,
)


@dataclass(frozen=True)
class DictationEntry:
    question_id: str
    transcript: str
    audio_url: str
    source_file: Path

    @property
    def output_path(self) -> Path:
        if not self.audio_url.startswith("/"):
            raise ValueError(
                f"{self.question_id} uses a non-root audioUrl: {self.audio_url}"
            )

        output_path = PUBLIC_ROOT / self.audio_url.lstrip("/")
        output_path.resolve().relative_to(PUBLIC_ROOT.resolve())
        return output_path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Generate all dictation test audio files from the static "
            "transcripts defined in app/features/tests/content."
        )
    )
    parser.add_argument(
        "--voice",
        default="en-US-AriaNeural",
        help="edge-tts voice name to use. Default: en-US-AriaNeural",
    )
    parser.add_argument(
        "--rate",
        default="+0%",
        help="Speech rate passed to edge-tts. Default: +0%%",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite existing audio files instead of skipping them.",
    )
    parser.add_argument(
        "--level",
        choices=["a1", "a2", "b1", "b2", "c1", "c2"],
        help="Generate audio only for one CEFR level.",
    )
    parser.add_argument(
        "--question-id",
        help="Generate audio only for a specific dictation question id.",
    )
    return parser.parse_args()


def extract_string_field(field_name: str, block: str, question_id: str) -> str:
    field_pattern = re.compile(
        rf"{field_name}:\s*(?P<literal>\"(?:\\.|[^\"\\])*\")",
        re.DOTALL,
    )
    match = field_pattern.search(block)
    if not match:
        raise ValueError(f"Missing {field_name} in {question_id}")

    return ast.literal_eval(match.group("literal"))


def collect_dictation_entries() -> list[DictationEntry]:
    entries: list[DictationEntry] = []

    for source_file in sorted(CONTENT_ROOT.glob("*/dictation-*.ts")):
        content = source_file.read_text(encoding="utf-8")
        for block_match in QUESTION_BLOCK_RE.finditer(content):
            block = block_match.group(0)
            if 'type: "dictation"' not in block:
                continue

            question_id = block_match.group("id")
            transcript = extract_string_field("transcript", block, question_id)
            audio_url = extract_string_field("audioUrl", block, question_id)
            entries.append(
                DictationEntry(
                    question_id=question_id,
                    transcript=transcript,
                    audio_url=audio_url,
                    source_file=source_file,
                )
            )

    if not entries:
        raise ValueError("No dictation entries were found.")

    return entries


def filter_entries(
    entries: list[DictationEntry], level: str | None, question_id: str | None
) -> list[DictationEntry]:
    filtered = entries

    if level:
        filtered = [
            entry for entry in filtered if f"/audio/tests/{level}/" in entry.audio_url
        ]

    if question_id:
        filtered = [
            entry for entry in filtered if entry.question_id == question_id
        ]

    if not filtered:
        raise ValueError("No dictation entries matched the requested filters.")

    return filtered


async def generate_audio(
    entries: list[DictationEntry], voice: str, rate: str, force: bool
) -> tuple[int, int]:
    try:
        import edge_tts
    except ImportError as exc:  # pragma: no cover - runtime dependency check
        raise RuntimeError(
            "edge-tts is not installed. Install it first with "
            "`python3 -m pip install edge-tts`."
        ) from exc

    created = 0
    skipped = 0

    for entry in entries:
        output_path = entry.output_path
        output_path.parent.mkdir(parents=True, exist_ok=True)

        if output_path.exists() and not force:
            skipped += 1
            print(f"skip  {entry.question_id} -> {output_path}")
            continue

        print(f"write {entry.question_id} -> {output_path}")
        communicate = edge_tts.Communicate(
            text=entry.transcript,
            voice=voice,
            rate=rate,
        )
        await communicate.save(str(output_path))
        created += 1

    return created, skipped


async def main() -> int:
    args = parse_args()

    try:
        entries = collect_dictation_entries()
        entries = filter_entries(entries, args.level, args.question_id)
        created, skipped = await generate_audio(
            entries=entries,
            voice=args.voice,
            rate=args.rate,
            force=args.force,
        )
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    print(
        f"Done. {created} file(s) generated, {skipped} file(s) skipped, "
        f"{len(entries)} total."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
