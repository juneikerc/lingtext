import React from "react";
import type { WordPopupState } from "./types";
import { isTranslationJson } from "~/helpers/isTranslationJson";

interface WordPopupProps {
  popup: WordPopupState;
  isUnknown: boolean;
  onSpeak: (word: string, e: React.MouseEvent) => void;
  onMarkKnown: (lower: string) => void;
  onMarkUnknown: (lower: string, original: string, translation: string) => void;
  onClose: () => void;
}

export default function WordPopup({
  popup,
  isUnknown,
  onSpeak,
  onMarkKnown,
  onMarkUnknown,
  onClose,
}: WordPopupProps) {
  const viewportWidth =
    typeof window !== "undefined" ? window.innerWidth : 1200;
  const popupWidth = Math.min(320, Math.max(260, viewportWidth - 24));
  const left = Math.min(
    Math.max(12, popup.x - popupWidth / 2),
    viewportWidth - popupWidth - 12
  );
  const top = Math.max(12, popup.y - 80);

  return (
    <div
      className="absolute w-full backdrop-blur-md rounded-2xl shadow-xl border z-30 overflow-hidden"
      style={{
        left,
        top,
        width: popupWidth,
        backgroundColor: "var(--reader-surface-bg)",
        color: "var(--reader-text-color)",
        borderColor: "var(--reader-border-color)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{
          borderColor: "var(--reader-border-color)",
          backgroundColor: "var(--reader-muted-bg)",
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: "var(--reader-accent-color)",
              opacity: 0.12,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-4 h-4"
              style={{ color: "var(--reader-accent-color)" }}
            >
              <path
                d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-base truncate">{popup.word}</h3>
            <p className="text-[11px] opacity-50">Palabra seleccionada</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            className="p-2 rounded-lg transition-colors duration-200 hover:opacity-70"
            onClick={(e) => onSpeak(popup.word, e)}
            title="Escuchar"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <polygon
                points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.54 8.46a5 5 0 0 1 0 7.07"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="p-2 rounded-lg transition-colors duration-200 hover:opacity-70"
            onClick={onClose}
            title="Cerrar"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                d="M18 6 6 18M6 6l12 12"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Traducción */}
      <div className="px-4 pt-3 pb-2">
        <div
          className="rounded-xl p-3 border"
          style={{
            backgroundColor: "var(--reader-muted-bg)",
            borderColor: "var(--reader-border-color)",
          }}
        >
          {popup.isLoading ? (
            <div className="flex items-center justify-center gap-2 py-1">
              <span
                className="w-4 h-4 border-2 rounded-full animate-spin"
                style={{
                  borderColor: "var(--reader-accent-color)",
                  borderTopColor: "transparent",
                }}
              />
              <span className="text-sm opacity-60">Traduciendo...</span>
            </div>
          ) : isTranslationJson(popup.translation) ? (
            <div className="space-y-2">
              {(() => {
                const parsed = JSON.parse(popup.translation);
                return Object.entries(parsed.info).map(
                  ([category, translations]) => (
                    <div key={category}>
                      <p className="text-[11px] font-semibold uppercase tracking-wide opacity-50">
                        {category}
                      </p>
                      <p className="text-sm">
                        {(translations as string[]).join(", ")}
                      </p>
                    </div>
                  )
                );
              })()}
            </div>
          ) : (
            <span className="text-lg font-bold">{popup.translation}</span>
          )}
          {popup.disclaimer && (
            <p className="text-[11px] opacity-50 mt-1.5 leading-tight">
              {popup.disclaimer}
            </p>
          )}
        </div>
      </div>

      {/* Estado */}
      <div className="px-4 py-2">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
            isUnknown
              ? "bg-orange-50 text-orange-700 border-orange-200"
              : "bg-green-50 text-green-700 border-green-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${isUnknown ? "bg-orange-500" : "bg-green-500"}`}
          />
          {isUnknown ? "Por aprender" : "Conocida"}
        </div>
      </div>

      {/* Acciones */}
      <div className="px-4 pb-4 pt-1 space-y-2">
        {isUnknown ? (
          <button
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border bg-green-50 text-green-700 border-green-200 ${
              popup.isLoading
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-green-100 hover:shadow-sm"
            }`}
            onClick={() => onMarkKnown(popup.lower)}
            disabled={popup.isLoading}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <polyline
                points="20 6 9 17 4 12"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Marcar como conocida
          </button>
        ) : (
          <button
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border bg-orange-50 text-orange-700 border-orange-200 ${
              popup.isLoading
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-orange-100 hover:shadow-sm"
            }`}
            onClick={() =>
              onMarkUnknown(popup.lower, popup.word, popup.translation)
            }
            disabled={popup.isLoading}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                d="M12 20h9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Marcar para repasar
          </button>
        )}

        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border hover:shadow-sm"
          style={{
            backgroundColor: "var(--reader-muted-bg)",
            borderColor: "var(--reader-border-color)",
          }}
          onClick={(e) => onSpeak(popup.word, e)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <polygon
              points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.07 4.93a10 10 0 0 1 0 14.14"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Escuchar de nuevo
        </button>
      </div>
    </div>
  );
}
