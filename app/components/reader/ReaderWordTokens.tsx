import React from "react";

import { normalizeWord, tokenize } from "../../utils/tokenize";

interface ReaderWordTokensProps {
  text: string;
  unknownSet: Set<string>;
  phrases: string[][];
  onWordClick: (e: React.MouseEvent<HTMLSpanElement>) => void;
  keyPrefix?: string;
}

export default function ReaderWordTokens({
  text,
  unknownSet,
  phrases,
  onWordClick,
  keyPrefix,
}: ReaderWordTokensProps) {
  const tokens = tokenize(text);
  const isPhraseToken: boolean[] = new Array(tokens.length).fill(false);

  const tryMatch = (startIdx: number, parts: string[]): number[] | null => {
    const indices: number[] = [];
    let p = 0;
    let j = startIdx;
    while (j < tokens.length && p < parts.length) {
      if (!tokens[j].isWord) {
        j++;
        continue;
      }
      const low = tokens[j].lower || normalizeWord(tokens[j].text);
      if (low !== parts[p]) return null;
      indices.push(j);
      p++;
      j++;
    }
    return p === parts.length ? indices : null;
  };

  for (let i = 0; i < tokens.length; i++) {
    if (!tokens[i].isWord) continue;
    for (const parts of phrases) {
      if (parts.length < 2) continue;
      const startLow = tokens[i].lower || normalizeWord(tokens[i].text);
      if (startLow !== parts[0]) continue;
      const matchIdxs = tryMatch(i, parts);
      if (matchIdxs) {
        for (const idx of matchIdxs) isPhraseToken[idx] = true;
      }
    }
  }

  return (
    <>
      {tokens.map((t, tokenIndex) => {
        const tokenKey = keyPrefix ? `${keyPrefix}-${tokenIndex}` : tokenIndex;
        if (!t.isWord) {
          return <span key={tokenKey}>{t.text}</span>;
        }
        const low = t.lower || normalizeWord(t.text);
        const isUnknown = unknownSet.has(low);
        const isPhrasePart = isPhraseToken[tokenIndex] === true;

        return (
          <span
            key={tokenKey}
            className={`word-token relative inline-block px-1 py-0.5 mx-0.5 rounded-lg cursor-pointer transition-all duration-200 group ${
              isUnknown
                ? "bg-yellow-200 dark:bg-yellow-700/40 text-yellow-900 dark:text-yellow-100 font-semibold shadow-lg border border-yellow-300 dark:border-yellow-600"
                : "hover:bg-blue-100 dark:hover:bg-blue-800/50 hover:text-blue-900 dark:hover:text-blue-100 hover:shadow-md"
            } ${isPhrasePart ? "underline decoration-green-500 decoration-2 underline-offset-4" : ""}`}
            data-lower={low}
            data-word={t.text}
            data-phrase-part={isPhrasePart ? "true" : undefined}
            onClick={onWordClick}
          >
            {t.text}
            {!isUnknown && (
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                Clic para traducir
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></span>
              </span>
            )}
            {isUnknown && (
              <span className="absolute -top-2 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></span>
            )}
          </span>
        );
      })}
    </>
  );
}
