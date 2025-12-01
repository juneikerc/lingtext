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
  console.log(selPopup);

  return (
    <div
      className="absolute min-w-[320px] max-w-[400px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-gray-900 dark:text-gray-100 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 z-30 overflow-hidden"
      style={{
        left: Math.max(6, selPopup.x - 160),
        top: Math.max(6, selPopup.y - 100),
      }}
    >
      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">📝</span>
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Texto seleccionado
            </span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
            <p className="text-gray-900 dark:text-gray-100 font-medium italic text-center">
              "
              {selPopup.text.length > 100
                ? selPopup.text.substring(0, 100) + "..."
                : selPopup.text}
              "
            </p>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
            <span className="text-sm">💭</span>
          </div>
          <div>
            <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center">
                {isTranslationJson(selPopup.translation) ? (
                  <div className="space-y-2">
                    {(() => {
                      const parsed = JSON.parse(selPopup.translation);
                      return Object.entries(parsed.info).map(
                        ([category, translations]) => (
                          <div key={category}>
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                              {category}
                            </p>
                            <p className="text-gray-900 dark:text-gray-100">
                              {(translations as string[]).join(", ")}
                            </p>
                          </div>
                        )
                      );
                    })()}
                  </div>
                ) : (
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {selPopup.translation}
                  </span>
                )}
              </div>
            </div>
            {/* Acciones para la selección */}
            <div className="mt-4 flex gap-2 justify-center">
              <button
                className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-200/60 dark:hover:bg-green-800/50 transition-colors"
                onClick={() =>
                  onSavePhrase(selPopup.text, selPopup.translation)
                }
                title="Guardar como frase compuesta"
              >
                Guardar palabra compuesta | frase
              </button>
              <button
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
