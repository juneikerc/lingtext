import React from "react";
import { normalizeWord, tokenize } from "../../utils/tokenize";

interface ReaderTextProps {
  content: string;
  unknownSet: Set<string>;
  onWordClick: (e: React.MouseEvent<HTMLSpanElement>) => void;
}

export default function ReaderText({ content, unknownSet, onWordClick }: ReaderTextProps) {
  return (
    <div
      id="reader-text"
      className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-4 leading-relaxed text-lg whitespace-pre-line break-words min-h-[120px] select-text"
    >
      {tokenize(content).map((t, idx) => {
        if (!t.isWord) return <span key={idx}>{t.text}</span>;
        const low = t.lower || normalizeWord(t.text);
        const isUnknown = unknownSet.has(low);
        return (
          <span
            key={idx}
            className={
              `word-token cursor-pointer transition rounded px-1` +
              (isUnknown
                ? " bg-yellow-200 dark:bg-yellow-700/40 text-yellow-900 dark:text-yellow-100 font-semibold"
                : " hover:bg-blue-100 dark:hover:bg-blue-800/50")
            }
            data-lower={low}
            data-word={t.text}
            onClick={onWordClick}
          >
            {t.text}
          </span>
        );
      })}
    </div>
  );
}
