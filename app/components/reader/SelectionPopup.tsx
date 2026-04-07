import React from "react";
import type { SelectionPopupState } from "./types";
import { isTranslationJson } from "~/helpers/isTranslationJson";

interface SelectionPopupProps {
  selPopup: SelectionPopupState;
  onClose: () => void;
  onSavePhrase: (text: string, translation: string) => void;
}

export default function SelectionPopup({
  selPopup,
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
      className="absolute w-full bg-white/95 backdrop-blur-sm text-gray-900 rounded-xl shadow-lg border border-gray-200/50 z-30 overflow-hidden max-h-[70vh] overflow-y-auto"
      style={{
        left,
        top,
        width: popupWidth,
      }}
    >
      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-5 h-5 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">📝</span>
            </div>
            <span className="font-semibold text-gray-700">
              Texto seleccionado
            </span>
            <button
              className="ml-auto p-1.5 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              onClick={onClose}
              title="Cerrar"
            >
              <span className="text-sm">✕</span>
            </button>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-gray-900 font-medium italic text-center">
              "
              {selPopup.text.length > 100
                ? selPopup.text.substring(0, 100) + "..."
                : selPopup.text}
              "
            </p>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 text-gray-900 p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-sm">💭</span>
          </div>
          <div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="text-xl font-bold text-gray-900 text-center">
                {selPopup.isLoading ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <span className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <span>Traduciendo...</span>
                  </div>
                ) : isTranslationJson(selPopup.translation) ? (
                  <div className="space-y-2">
                    {(() => {
                      const parsed = JSON.parse(selPopup.translation);
                      return Object.entries(parsed.info).map(
                        ([category, translations]) => (
                          <div key={category}>
                            <p className="text-sm font-semibold text-gray-600">
                              {category}
                            </p>
                            <p className="text-gray-900">
                              {(translations as string[]).join(", ")}
                            </p>
                          </div>
                        )
                      );
                    })()}
                  </div>
                ) : (
                  <span className="text-xl font-bold text-gray-900">
                    {selPopup.translation}
                  </span>
                )}
              </div>
            </div>
            {/* Acciones para la selección */}
            <div className="mt-4 flex gap-2 justify-center">
              <button
                className={`px-4 py-2 bg-green-100 text-green-700 rounded-lg border border-green-200 transition-colors ${
                  selPopup.isLoading
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-green-200/60"
                }`}
                onClick={() =>
                  onSavePhrase(selPopup.text, selPopup.translation)
                }
                title="Guardar como frase compuesta"
                disabled={selPopup.isLoading}
              >
                Guardar palabra compuesta | frase
              </button>
              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors"
                onClick={onClose}
                title="Cerrar"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
