/**
 * SubtitleOverlay - Versión adaptada de ReaderText para YouTube
 * Renderiza subtítulos con palabras clickeables
 */

import React, { useMemo } from "react";
import { normalizeWord, tokenize } from "@/utils/tokenize";

interface SubtitleOverlayProps {
  text: string;
  unknownSet: Set<string>;
  phrases: string[][];
  onWordClick: (word: string, lower: string, x: number, y: number) => void;
}

export default function SubtitleOverlay({
  text,
  unknownSet,
  phrases,
  onWordClick,
}: SubtitleOverlayProps) {
  if (!text) return null;

  const tokens = tokenize(text);

  const phrasesByFirstWord = useMemo(() => {
    const map = new Map<string, string[][]>();
    for (const parts of phrases) {
      if (parts.length < 2) continue;
      const first = parts[0];
      const existing = map.get(first);
      if (existing) {
        existing.push(parts);
      } else {
        map.set(first, [parts]);
      }
    }
    return map;
  }, [phrases]);

  // Marcar tokens que pertenecen a frases guardadas
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

    const startLow = tokens[i].lower || normalizeWord(tokens[i].text);
    const candidates = phrasesByFirstWord.get(startLow);
    if (!candidates) continue;

    for (const parts of candidates) {
      const matchIdxs = tryMatch(i, parts);
      if (matchIdxs) {
        for (const idx of matchIdxs) isPhraseToken[idx] = true;
      }
    }
  }

  const handleClick = (
    e: React.MouseEvent<HTMLSpanElement>,
    word: string,
    lower: string
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onWordClick(word, lower, rect.left + rect.width / 2, rect.top);
  };

  return (
    <div className="lingtext-subtitle-overlay">
      {tokens.map((t, idx) => {
        if (!t.isWord) {
          return <span key={idx}>{t.text}</span>;
        }

        const low = t.lower || normalizeWord(t.text);
        const isUnknown = unknownSet.has(low);
        const isPhrasePart = isPhraseToken[idx];

        return (
          <span
            key={idx}
            className={`lingtext-word ${isUnknown ? "lingtext-unknown" : ""} ${isPhrasePart ? "lingtext-phrase" : ""}`}
            onClick={(e) => handleClick(e, t.text, low)}
          >
            {t.text}
          </span>
        );
      })}
    </div>
  );
}
