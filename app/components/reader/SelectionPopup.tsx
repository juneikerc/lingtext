import React from "react";
import type { SelectionPopupState } from "./types";

interface SelectionPopupProps {
  selPopup: SelectionPopupState;
  onSaveUnknowns: () => void;
  onClose: () => void;
}

export default function SelectionPopup({
  selPopup,
  onSaveUnknowns,
  onClose,
}: SelectionPopupProps) {
  return (
    <div
      className="absolute min-w-[320px] max-w-[400px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 z-30 overflow-hidden"
      style={{
        left: Math.max(6, selPopup.x - 160),
        top: Math.max(6, selPopup.y - 100),
      }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-sm">💭</span>
          </div>
          <div>
            <h3 className="font-bold text-lg">Selección múltiple</h3>
            <p className="text-purple-100 text-sm">Traducción de frase completa</p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-4">
        {/* Texto seleccionado */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">📝</span>
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Texto seleccionado</span>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-3">
            <p className="text-blue-800 dark:text-blue-200 font-medium italic text-center">
              "{selPopup.text.length > 100 ? selPopup.text.substring(0, 100) + '...' : selPopup.text}"
            </p>
          </div>
        </div>

        {/* Traducciones disponibles */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">🇪🇸</span>
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Traducciones disponibles ({selPopup.translations.length})
            </span>
          </div>

          {selPopup.translations.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selPopup.translations.map((t, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{t.word}:</span>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{t.translation || "—"}</span>
                    </div>
                    <div className="ml-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-2xl">🤔</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                No hay traducciones locales disponibles para esta selección
              </p>
            </div>
          )}
        </div>

        {/* Información adicional */}
        {selPopup.translations.length > 0 && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">💡</span>
              </div>
              <p className="text-amber-800 dark:text-amber-200 text-sm">
                Estas traducciones se basan en palabras individuales que ya conoces. Puedes guardar toda la selección como palabras desconocidas para estudiarlas juntas.
              </p>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          {selPopup.translations.length > 0 && (
            <button
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
              onClick={onSaveUnknowns}
            >
              <span>📚</span>
              <span>Guardar como desconocidas</span>
            </button>
          )}

          <button
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-200"
            onClick={onClose}
          >
            <span>✕</span>
            <span>Cerrar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
