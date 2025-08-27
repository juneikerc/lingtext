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
      className="absolute min-w-[280px] max-w-[320px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-gray-900 dark:text-gray-100 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 z-30 overflow-hidden"
      style={{
        left: Math.max(6, popup.x - 140),
        top: Math.max(6, popup.y - 80),
      }}
    >
      {/* Header con la palabra */}
      <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
              <span className="text-sm">📖</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">{popup.word}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Palabra seleccionada</p>
            </div>
          </div>
          <button
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
            onClick={(e) => onSpeak(popup.word, e)}
            title="Escuchar pronunciación"
          >
            <span className="text-xl">🔊</span>
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-4">
        {/* Traducción */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">🇪🇸</span>
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Traducción</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {popup.translation}
            </span>
          </div>
        </div>

        {/* Estado de la palabra */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">🎯</span>
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Estado</span>
          </div>
          <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
            isUnknown
              ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50"
              : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50"
          }`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${
              isUnknown ? "bg-orange-500" : "bg-green-500"
            }`}></span>
            {isUnknown ? "Por aprender" : "Conocida"}
          </div>
        </div>

        {/* Acciones */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Acciones rápidas:
          </div>

          <div className="grid grid-cols-1 gap-2">
            {isUnknown ? (
              <button
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800/40 border border-green-200 dark:border-green-800/50 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                onClick={() => onMarkKnown(popup.lower)}
              >
                <span>✅</span>
                <span>Marcar como conocida</span>
              </button>
            ) : (
              <button
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-800/40 border border-orange-200 dark:border-orange-800/50 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                onClick={() =>
                  onMarkUnknown(popup.lower, popup.word, popup.translation)
                }
              >
                <span>🎓</span>
                <span>Marcar para repasar</span>
              </button>
            )}

            <button
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-lg transition-all duration-200"
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
