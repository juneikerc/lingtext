import React, { memo, useMemo } from "react";

import { normalizeWord, tokenize } from "../../utils/tokenize";
import type { ReaderPhraseIndex } from "./ReaderLexiconContext";
import { useReaderPreferences } from "./ReaderPreferencesContext";

interface ReaderWordTokensProps {
  text: string;
  unknownSet: Set<string>;
  phraseIndex: ReaderPhraseIndex;
  onWordClick: (e: React.MouseEvent<HTMLSpanElement>) => void;
  keyPrefix?: string;
}

function ReaderWordTokens({
  text,
  unknownSet,
  phraseIndex,
  onWordClick,
  keyPrefix,
}: ReaderWordTokensProps) {
  const { preferences } = useReaderPreferences();
  const isDark = preferences.theme === "dark-soft";
  const tokens = useMemo(() => tokenize(text), [text]);

  const isPhraseToken = useMemo(() => {
    const phraseFlags: boolean[] = new Array(tokens.length).fill(false);

    const tryMatch = (startIdx: number, parts: string[]): number[] | null => {
      const indices: number[] = [];
      let partIndex = 0;
      let tokenIndex = startIdx;

      while (tokenIndex < tokens.length && partIndex < parts.length) {
        if (!tokens[tokenIndex].isWord) {
          tokenIndex++;
          continue;
        }

        const lower =
          tokens[tokenIndex].lower || normalizeWord(tokens[tokenIndex].text);
        if (lower !== parts[partIndex]) {
          return null;
        }

        indices.push(tokenIndex);
        partIndex++;
        tokenIndex++;
      }

      return partIndex === parts.length ? indices : null;
    };

    for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
      if (!tokens[tokenIndex].isWord) continue;

      const startLower =
        tokens[tokenIndex].lower || normalizeWord(tokens[tokenIndex].text);
      const candidates = phraseIndex.get(startLower);
      if (!candidates || candidates.length === 0) continue;

      for (const parts of candidates) {
        const matchIndices = tryMatch(tokenIndex, parts);
        if (!matchIndices) continue;

        for (const matchIndex of matchIndices) {
          phraseFlags[matchIndex] = true;
        }
      }
    }

    return phraseFlags;
  }, [phraseIndex, tokens]);

  return (
    <>
      {tokens.map((t, tokenIndex) => {
        const tokenKey = keyPrefix ? `${keyPrefix}-${tokenIndex}` : tokenIndex;
        if (!t.isWord) {
          return (
            <span key={tokenKey} className="whitespace-pre-wrap">
              {t.text}
            </span>
          );
        }
        const low = t.lower || normalizeWord(t.text);
        const isUnknown = unknownSet.has(low);
        const isPhrasePart = isPhraseToken[tokenIndex] === true;

        return (
          <span
            key={tokenKey}
            className={`word-token relative inline-block px-1 py-0.5 mx-0.5 rounded-lg cursor-pointer transition-all duration-200 group ${
              isUnknown
                ? isDark
                  ? "bg-yellow-700/40 text-yellow-100 font-semibold shadow-lg border border-yellow-600"
                  : "bg-yellow-200 text-yellow-900 font-semibold shadow-lg border border-yellow-300"
                : "reader-token-hover hover:shadow-md"
            } ${isPhrasePart ? "underline decoration-2 underline-offset-4" : ""}`}
            data-lower={low}
            data-word={t.text}
            data-phrase-part={isPhrasePart ? "true" : undefined}
            onClick={onWordClick}
          >
            {t.text}
            {!isUnknown && (
              <span
                aria-hidden="true"
                className="reader-copy-tooltip absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none select-none whitespace-nowrap z-10"
              >
                Clic para traducir
                <span className="reader-copy-tooltip-arrow absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent"></span>
              </span>
            )}
            {isUnknown && (
              <span
                className={`absolute -top-2 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 animate-pulse ${
                  isDark ? "border-gray-900" : "border-white"
                }`}
              ></span>
            )}
          </span>
        );
      })}
    </>
  );
}

const MemoizedReaderWordTokens = memo(ReaderWordTokens);

MemoizedReaderWordTokens.displayName = "ReaderWordTokens";

export default MemoizedReaderWordTokens;
