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
      className="absolute min-w-[280px] max-w-[320px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 z-30 overflow-hidden"
      style={{
        left: Math.max(6, popup.x - 140),
        top: Math.max(6, popup.y - 80),
      }}
    >
      {/* Header con la palabra */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-sm">📖</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">{popup.word}</h3>
              <p className="text-blue-100 text-sm">Palabra seleccionada</p>
            </div>
          </div>
          <button
            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
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
            <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">🇪🇸</span>
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Traducción</span>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl p-3">
            <span className="text-xl font-bold text-green-800 dark:text-green-200">
              {popup.translation}
            </span>
          </div>
        </div>

        {/* Estado de la palabra */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">🎯</span>
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Estado</span>
          </div>
          <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
            isUnknown
              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
              : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
          }`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${
              isUnknown ? "bg-yellow-500" : "bg-green-500"
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
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
                onClick={() => onMarkKnown(popup.lower)}
              >
                <span>✅</span>
                <span>Marcar como conocida</span>
              </button>
            ) : (
              <button
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/25"
                onClick={() =>
                  onMarkUnknown(popup.lower, popup.word, popup.translation)
                }
              >
                <span>🎓</span>
                <span>Marcar para repasar</span>
              </button>
            )}

            <button
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-200"
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
