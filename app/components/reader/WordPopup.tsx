import React from "react";
import type { WordPopupState } from "./types";

interface WordPopupProps {
  popup: WordPopupState;
  isUnknown: boolean;
  onSpeak: (word: string, e: React.MouseEvent) => void;
  onMarkKnown: (lower: string) => void;
  onMarkUnknown: (lower: string, original: string, translation: string) => void;
}

export default function WordPopup({
  popup,
  isUnknown,
  onSpeak,
  onMarkKnown,
  onMarkUnknown,
}: WordPopupProps) {
  return (
    <div
      className="absolute min-w-[180px] max-w-[220px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 z-30"
      style={{
        left: Math.max(6, popup.x - 110),
        top: Math.max(6, popup.y - 60),
      }}
    >
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="font-semibold">{popup.word}</div>
        <div className="flex gap-2 items-center">
          <button
            className="hover:text-blue-600"
            onClick={(e) => onSpeak(popup.word, e)}
            title="Escuchar"
          >
            🔊
          </button>
          {isUnknown ? (
            <button
              className="px-2 py-0.5 text-xs rounded border border-green-600 hover:bg-green-100 dark:hover:bg-green-800 transition"
              onClick={() => onMarkKnown(popup.lower)}
            >
              Conocida
            </button>
          ) : (
            <button
              className="px-2 py-0.5 text-xs rounded border border-red-700 text-red-700 dark:border-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition"
              onClick={() =>
                onMarkUnknown(popup.lower, popup.word, popup.translation)
              }
            >
              Desconocida
            </button>
          )}
        </div>
      </div>
      <div className="px-4 py-2">
        <strong className="text-xl">🇪🇸 {popup.translation}</strong>
      </div>
    </div>
  );
}
