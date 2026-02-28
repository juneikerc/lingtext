export function normalizeIslandSentencesText(raw: string): string {
  return raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

export function splitIslandSentences(raw: string): string[] {
  const normalized = normalizeIslandSentencesText(raw);
  if (!normalized) return [];

  return normalized
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
