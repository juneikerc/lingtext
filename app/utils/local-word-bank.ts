import data from "~/data/1000-words.json";
import { normalizeWord } from "~/utils/tokenize";

type LocalWordBankEntry = {
  word: string;
  definition: string;
};

const wordBank = new Map<string, string>();

for (const item of data as LocalWordBankEntry[]) {
  const normalized = normalizeWord(item.word || "");
  const definition = item.definition?.trim() || "";

  if (!normalized || !definition || wordBank.has(normalized)) {
    continue;
  }

  wordBank.set(normalized, definition);
}

export function getLocalWordMeaning(word: string): string | null {
  const normalized = normalizeWord(word);

  if (!normalized) {
    return null;
  }

  return wordBank.get(normalized) ?? null;
}
