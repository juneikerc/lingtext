/**
 * Tokenización de texto - COPIA EXACTA de app/utils/tokenize.ts
 * Es crítico que sea idéntico para que el matching de palabras funcione igual
 */

export interface Token {
  text: string;
  isWord: boolean;
  start: number;
  end: number;
  lower?: string;
}

const wordRe = /[A-Za-z]+(?:'[A-Za-z]+)?/g;

export function normalizeWord(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z']+/g, "");
}

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = wordRe.exec(input))) {
    const [w] = match;
    const start = match.index;
    const end = start + w.length;
    // push any gap before the word
    if (start > lastIndex) {
      tokens.push({
        text: input.slice(lastIndex, start),
        isWord: false,
        start: lastIndex,
        end: start,
      });
    }
    tokens.push({ text: w, isWord: true, start, end, lower: normalizeWord(w) });
    lastIndex = end;
  }
  if (lastIndex < input.length) {
    tokens.push({
      text: input.slice(lastIndex),
      isWord: false,
      start: lastIndex,
      end: input.length,
    });
  }
  return tokens;
}
