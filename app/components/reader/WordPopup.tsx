import React from "react";
import type { WordPopupState } from "./types";
import { isTranslationJson } from "~/helpers/isTranslationJson";
import { useReaderPreferences } from "./ReaderPreferencesContext";

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
  const { preferences } = useReaderPreferences();
  const isDark = preferences.theme === "dark-soft";

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
      className="absolute w-full backdrop-blur-sm rounded-xl shadow-lg border z-30 overflow-hidden max-h-[70vh] overflow-y-auto"
      style={{
        left,
        top,
        width: popupWidth,
        backgroundColor: "var(--reader-surface-bg)",
        color: "var(--reader-text-color)",
        borderColor: "var(--reader-border-color)",
      }}
    >
      {/* Header con la palabra */}
      <div
        className="p-4"
        style={{ backgroundColor: "var(--reader-muted-bg)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--reader-border-color)" }}
            >
              <span className="text-sm">📖</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">{popup.word}</h3>
              <p className="text-sm" style={{ opacity: 0.6 }}>
                Palabra seleccionada
              </p>
            </div>
          </div>
          <button
            className="p-2 rounded-lg transition-colors duration-200 hover:opacity-80"
            onClick={(e) => onSpeak(popup.word, e)}
            title="Escuchar pronunciación"
          >
            <span className="text-xl">🔊</span>
          </button>
          <button
            className="ml-1 p-2 rounded-lg transition-colors duration-200 hover:opacity-80"
            onClick={onClose}
            title="Cerrar"
          >
            <span className="text-lg">✕</span>
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-4">
        {/* Traducción */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <div
              className="w-5 h-5 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--reader-border-color)" }}
            >
              <span className="text-xs">🇪🇸</span>
            </div>
            <span className="font-semibold" style={{ opacity: 0.7 }}>
              Traducción
            </span>
          </div>
          <div
            className="rounded-lg p-3 border"
            style={{
              backgroundColor: "var(--reader-muted-bg)",
              borderColor: "var(--reader-border-color)",
            }}
          >
            {popup.isLoading ? (
              <div
                className="flex items-center justify-center gap-2 text-sm"
                style={{ opacity: 0.6 }}
              >
                <span
                  className="w-4 h-4 border-2 rounded-full animate-spin"
                  style={{
                    borderColor: "var(--reader-accent-color)",
                    borderTopColor: "transparent",
                  }}
                />
                <span>Traduciendo...</span>
              </div>
            ) : isTranslationJson(popup.translation) ? (
              <div className="space-y-2">
                {(() => {
                  const parsed = JSON.parse(popup.translation);
                  return Object.entries(parsed.info).map(
                    ([category, translations]) => (
                      <div key={category}>
                        <p
                          className="text-sm font-semibold"
                          style={{ opacity: 0.6 }}
                        >
                          {category}
                        </p>
                        <p>{(translations as string[]).join(", ")}</p>
                      </div>
                    )
                  );
                })()}
              </div>
            ) : (
              <span className="text-xl font-bold">{popup.translation}</span>
            )}
          </div>
        </div>

        {/* Estado de la palabra */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <div
              className="w-5 h-5 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--reader-border-color)" }}
            >
              <span className="text-xs">🎯</span>
            </div>
            <span className="font-semibold" style={{ opacity: 0.7 }}>
              Estado
            </span>
          </div>
          <div
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${
              isUnknown
                ? isDark
                  ? "bg-orange-900/20 text-orange-400 border-orange-800/50"
                  : "bg-orange-50 text-orange-700 border-orange-200"
                : isDark
                  ? "bg-green-900/20 text-green-400 border-green-800/50"
                  : "bg-green-50 text-green-700 border-green-200"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-2 ${
                isUnknown ? "bg-orange-500" : "bg-green-500"
              }`}
            ></span>
            {isUnknown ? "Por aprender" : "Conocida"}
          </div>
        </div>

        {/* Acciones */}
        <div className="space-y-2">
          <div className="text-sm font-medium mb-3" style={{ opacity: 0.7 }}>
            Acciones rápidas:
          </div>

          <div className="grid grid-cols-1 gap-2">
            {isUnknown ? (
              <button
                className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 shadow-sm border ${
                  isDark
                    ? "bg-green-900/20 text-green-400 border-green-800/50"
                    : "bg-green-50 text-green-700 border-green-200"
                } ${
                  popup.isLoading
                    ? "opacity-60 cursor-not-allowed"
                    : isDark
                      ? "hover:bg-green-800/40 hover:shadow-md"
                      : "hover:bg-green-100 hover:shadow-md"
                }`}
                onClick={() => onMarkKnown(popup.lower)}
                disabled={popup.isLoading}
              >
                <span>✅</span>
                <span>Marcar como conocida</span>
              </button>
            ) : (
              <button
                className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 shadow-sm border ${
                  isDark
                    ? "bg-orange-900/20 text-orange-400 border-orange-800/50"
                    : "bg-orange-50 text-orange-700 border-orange-200"
                } ${
                  popup.isLoading
                    ? "opacity-60 cursor-not-allowed"
                    : isDark
                      ? "hover:bg-orange-800/40 hover:shadow-md"
                      : "hover:bg-orange-100 hover:shadow-md"
                }`}
                onClick={() =>
                  onMarkUnknown(popup.lower, popup.word, popup.translation)
                }
                disabled={popup.isLoading}
              >
                <span>🎓</span>
                <span>Marcar para repasar</span>
              </button>
            )}

            <button
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 border"
              style={{
                backgroundColor: "var(--reader-muted-bg)",
                borderColor: "var(--reader-border-color)",
              }}
              onClick={(e) => onSpeak(popup.word, e)}
            >
              <span>🔊</span>
              <span>Escuchar de nuevo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
