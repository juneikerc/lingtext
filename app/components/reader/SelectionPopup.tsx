import React from "react";
import type { SelectionPopupState } from "./types";
import { isTranslationJson } from "~/helpers/isTranslationJson";

interface SelectionPopupProps {
  selPopup: SelectionPopupState;
  onSpeak: (text: string, e: React.MouseEvent) => void;
  onClose: () => void;
  onSavePhrase: (text: string, translation: string) => void;
}

export default function SelectionPopup({
  selPopup,
  onSpeak,
  onClose,
  onSavePhrase,
}: SelectionPopupProps) {
  const viewportWidth =
    typeof window !== "undefined" ? window.innerWidth : 1200;
  const popupWidth = Math.min(400, Math.max(280, viewportWidth - 24));
  const left = Math.min(
    Math.max(12, selPopup.x - popupWidth / 2),
    viewportWidth - popupWidth - 12
  );
  const top = Math.max(12, selPopup.y - 100);

  return (
    <div
      className="absolute w-full backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 z-30 overflow-hidden"
      style={{ left, top, width: popupWidth }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white/95">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0F9EDA]/10 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-4 h-4 text-[#0F9EDA]"
            >
              <path
                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-800">
            Texto seleccionado
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            onClick={(e) => onSpeak(selPopup.text, e)}
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
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
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

      {/* Texto seleccionado */}
      <div className="px-4 pt-3 bg-white/95">
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
          <p className="text-sm text-gray-700 italic leading-relaxed">
            &ldquo;
            {selPopup.text.length > 100
              ? selPopup.text.substring(0, 100) + "..."
              : selPopup.text}
            &rdquo;
          </p>
        </div>
      </div>

      {/* Traducción */}
      <div className="px-4 py-3 bg-white/95">
        <div className="bg-[#0F9EDA]/5 border border-[#0F9EDA]/10 rounded-xl p-3">
          {selPopup.isLoading ? (
            <div className="flex items-center justify-center gap-2 py-1">
              <span className="w-4 h-4 border-2 border-[#0F9EDA] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-500">Traduciendo...</span>
            </div>
          ) : isTranslationJson(selPopup.translation) ? (
            <div className="space-y-2">
              {(() => {
                const parsed = JSON.parse(selPopup.translation);
                return Object.entries(parsed.info).map(
                  ([category, translations]) => (
                    <div key={category}>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#0F9EDA]/60">
                        {category}
                      </p>
                      <p className="text-sm text-gray-800">
                        {(translations as string[]).join(", ")}
                      </p>
                    </div>
                  )
                );
              })()}
            </div>
          ) : (
            <span className="text-base font-bold text-gray-900">
              {selPopup.translation}
            </span>
          )}
          {selPopup.disclaimer && (
            <p className="text-[11px] text-gray-400 mt-1.5 leading-tight">
              {selPopup.disclaimer}
            </p>
          )}
        </div>
      </div>

      {/* Acciones */}
      <div className="px-4 pb-4 bg-white/95 border-t border-gray-100 pt-3 space-y-2">
        <button
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border bg-green-50 text-green-700 border-green-200 ${
            selPopup.isLoading
              ? "opacity-60 cursor-not-allowed"
              : "hover:bg-green-100 hover:shadow-sm"
          }`}
          onClick={() => onSavePhrase(selPopup.text, selPopup.translation)}
          disabled={selPopup.isLoading}
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
          Guardar frase
        </button>

        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
          onClick={(e) => onSpeak(selPopup.text, e)}
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
          Escuchar
        </button>
      </div>
    </div>
  );
}
