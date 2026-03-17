import { getAllPhrases, getAllUnknownWords } from "../services/db";
import type { WordEntry } from "../types";

function toCsvCell(s: string): string {
  const escaped = s.replace(/"/g, '""');
  return '"' + escaped + '"';
}

function normalizeExportEntries(entries: WordEntry[]): WordEntry[] {
  return [...entries].sort((a, b) => b.addedAt - a.addedAt);
}

export async function exportUnknownWordsCsv(
  entries?: WordEntry[],
  filename = "ling-text-words.csv"
): Promise<void> {
  let normalizedEntries = entries;

  if (!entries) {
    const [words, phrases] = await Promise.all([
      getAllUnknownWords(),
      getAllPhrases(),
    ]);

    normalizedEntries = normalizeExportEntries([
      ...words,
      ...phrases.map((phrase) => ({
        word: phrase.phrase,
        wordLower: phrase.phraseLower,
        translation: phrase.translation,
        status: "unknown" as const,
        addedAt: phrase.addedAt,
        srData: phrase.srData,
        isPhrase: true,
      })),
    ]);
  }

  const exportEntries = normalizeExportEntries(normalizedEntries ?? []);
  const header = ["Expression", "Meaning"];
  const lines = [header.map(toCsvCell).join(",")];

  for (const entry of exportEntries) {
    lines.push([entry.word, entry.translation || ""].map(toCsvCell).join(","));
  }

  const content = lines.join("\n");
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
