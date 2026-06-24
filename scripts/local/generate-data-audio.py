#!/usr/bin/env python3

from __future__ import annotations

import argparse
import asyncio
import json
import re
import sys
import unicodedata
from dataclasses import dataclass
from pathlib import Path
from typing import Literal
from uuid import uuid4


REPO_ROOT = Path(__file__).resolve().parents[2]
DATA_ROOT = REPO_ROOT / "app" / "data"
PUBLIC_ROOT = REPO_ROOT / "public"

Collection = Literal["english-phrases", "english-words-500", "vocabulary"]
VALID_COLLECTIONS: tuple[Collection, ...] = (
    "english-phrases",
    "english-words-500",
    "vocabulary",
)


@dataclass(frozen=True)
class AudioEntry:
    collection: Collection
    text: str
    source: str

    @property
    def output_path(self) -> Path:
        return (
            PUBLIC_ROOT
            / "audio"
            / "data"
            / self.collection
            / f"{slugify_audio_text(self.text)}-{hash_text(self.text)}.mp3"
        )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Generate static MP3 files for the English text rendered by "
            "the vocabulary, phrases, and 500 words pages."
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
        "--dry-run",
        action="store_true",
        help="Print what would be generated without writing files.",
    )
    parser.add_argument(
        "--collection",
        choices=VALID_COLLECTIONS,
        help="Generate only one collection.",
    )
    parser.add_argument(
        "--concurrency",
        type=int,
        default=6,
        help="Number of audio files to generate in parallel. Default: 6",
    )
    return parser.parse_args()


def slugify_audio_text(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value.strip().lower())
    without_diacritics = "".join(
        char for char in normalized if not unicodedata.combining(char)
    )
    slug = re.sub(r"[^a-z0-9\s-]", "", without_diacritics)
    slug = re.sub(r"\s+", "-", slug)
    slug = re.sub(r"-+", "-", slug).strip("-")
    return slug[:72].rstrip("-") or "audio"


def hash_text(value: str) -> str:
    hash_value = 0x811C9DC5
    utf16_code_units = value.strip().encode("utf-16-le")

    for index in range(0, len(utf16_code_units), 2):
        code_unit = utf16_code_units[index] | (utf16_code_units[index + 1] << 8)
        hash_value ^= code_unit
        hash_value = (hash_value * 0x01000193) & 0xFFFFFFFF

    return base36(hash_value).rjust(7, "0")


def base36(value: int) -> str:
    if value == 0:
        return "0"

    digits = "0123456789abcdefghijklmnopqrstuvwxyz"
    result = ""

    while value:
        value, remainder = divmod(value, 36)
        result = digits[remainder] + result

    return result


def read_json(path: Path) -> object:
    return json.loads(path.read_text(encoding="utf-8"))


def collect_phrases() -> list[AudioEntry]:
    data = read_json(DATA_ROOT / "phrases.json")
    if not isinstance(data, list):
        raise ValueError("phrases.json must contain a list.")

    entries: list[AudioEntry] = []

    for index, item in enumerate(data):
        if not isinstance(item, dict):
            continue

        phrase = str(item.get("phrase", "")).strip()
        if phrase:
            entries.append(
                AudioEntry(
                    collection="english-phrases",
                    text=phrase,
                    source=f"phrases.json[{index}].phrase",
                )
            )

    return entries


def collect_words_500() -> list[AudioEntry]:
    data = read_json(DATA_ROOT / "1000-words.json")
    if not isinstance(data, list):
        raise ValueError("1000-words.json must contain a list.")

    sorted_items = sorted(
        data[:500],
        key=lambda item: int(item.get("index", "0")) if isinstance(item, dict) else 0,
    )
    entries: list[AudioEntry] = []

    for item in sorted_items:
        if not isinstance(item, dict):
            continue

        index = str(item.get("index", "")).strip()
        word = str(item.get("word", "")).strip()
        example_sentence = str(item.get("example_sentence", "")).strip()

        if word:
            entries.append(
                AudioEntry(
                    collection="english-words-500",
                    text=word,
                    source=f"1000-words.json[{index}].word",
                )
            )

        if example_sentence:
            entries.append(
                AudioEntry(
                    collection="english-words-500",
                    text=example_sentence,
                    source=f"1000-words.json[{index}].example_sentence",
                )
            )

    return entries


def collect_vocabulary() -> list[AudioEntry]:
    entries: list[AudioEntry] = []

    for path in sorted(DATA_ROOT.glob("vocabulary-*.json")):
        data = read_json(path)
        if not isinstance(data, list):
            raise ValueError(f"{path.name} must contain a list.")

        for category_index, category in enumerate(data):
            if not isinstance(category, dict):
                continue

            vocabulary = category.get("vocabulary", [])
            if not isinstance(vocabulary, list):
                continue

            for item_index, item in enumerate(vocabulary):
                if not isinstance(item, dict):
                    continue

                word = str(item.get("word", "")).strip()
                sentence = str(item.get("sentence", "")).strip()
                prefix = f"{path.name}[{category_index}].vocabulary[{item_index}]"

                if word:
                    entries.append(
                        AudioEntry(
                            collection="vocabulary",
                            text=word,
                            source=f"{prefix}.word",
                        )
                    )

                if sentence:
                    entries.append(
                        AudioEntry(
                            collection="vocabulary",
                            text=sentence,
                            source=f"{prefix}.sentence",
                        )
                    )

    return entries


def collect_entries(collection: Collection | None) -> list[AudioEntry]:
    collectors = {
        "english-phrases": collect_phrases,
        "english-words-500": collect_words_500,
        "vocabulary": collect_vocabulary,
    }

    selected = [collection] if collection else list(VALID_COLLECTIONS)
    entries: list[AudioEntry] = []

    for selected_collection in selected:
        entries.extend(collectors[selected_collection]())

    unique_entries: dict[tuple[Collection, str], AudioEntry] = {}

    for entry in entries:
        unique_entries.setdefault((entry.collection, entry.text), entry)

    return list(unique_entries.values())


async def generate_audio(
    entries: list[AudioEntry],
    voice: str,
    rate: str,
    force: bool,
    dry_run: bool,
    concurrency: int,
) -> tuple[int, int]:
    edge_tts = None

    if not dry_run:
        try:
            import edge_tts
        except ImportError as exc:  # pragma: no cover - runtime dependency check
            raise RuntimeError(
                "edge-tts is not installed. Install it first with "
                "`python3 -m pip install edge-tts`."
            ) from exc

    to_create: list[AudioEntry] = []
    skipped = 0

    for entry in entries:
        output_path = entry.output_path

        if output_path.exists() and output_path.stat().st_size > 0 and not force:
            skipped += 1
            continue

        to_create.append(entry)

    if dry_run:
        for entry in to_create:
            print(f"would write {entry.collection} {entry.source} -> {entry.output_path}")
        return len(to_create), skipped

    total = len(entries)
    created = 0
    semaphore = asyncio.Semaphore(max(1, concurrency))

    async def write_entry(entry: AudioEntry) -> None:
        async with semaphore:
            output_path = entry.output_path
            output_path.parent.mkdir(parents=True, exist_ok=True)
            temp_path = output_path.with_name(
                f".{output_path.stem}.{uuid4().hex}.tmp{output_path.suffix}"
            )
            communicate = edge_tts.Communicate(
                text=entry.text,
                voice=voice,
                rate=rate,
            )
            try:
                await communicate.save(str(temp_path))
                temp_path.replace(output_path)
            except Exception:
                temp_path.unlink(missing_ok=True)
                raise

    print(
        f"Generating {len(to_create)} file(s), skipping {skipped} existing, "
        f"{total} total, concurrency={max(1, concurrency)}."
    )

    tasks = [asyncio.create_task(write_entry(entry)) for entry in to_create]

    for task in asyncio.as_completed(tasks):
        await task
        created += 1

        if created % 50 == 0 or created == len(to_create):
            completed = created + skipped
            progress = (completed / total) * 100
            print(
                f"Progress: {completed}/{total} ({progress:.1f}%) "
                f"created={created} skipped={skipped}"
            )

    return created, skipped


async def main() -> int:
    args = parse_args()

    try:
        entries = collect_entries(args.collection)
        if not entries:
            raise ValueError("No audio entries were found.")

        created, skipped = await generate_audio(
            entries=entries,
            voice=args.voice,
            rate=args.rate,
            force=args.force,
            dry_run=args.dry_run,
            concurrency=args.concurrency,
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
