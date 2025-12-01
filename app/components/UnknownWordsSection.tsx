import React, { useMemo } from "react";
import { Link } from "react-router";
import type { WordEntry } from "~/types";
import type { DailyStats } from "~/db"; // Asegúrate de exportar esta interfaz en db.ts o types.ts
import { exportUnknownWordsCsv } from "~/utils/anki";
import { deleteWord, getSettings } from "~/db";
import { speak } from "~/utils/tts";
import {
  isWordReadyForReview,
  formatTimeUntilReview,
} from "~/utils/spaced-repetition";

interface UnknownWordsSectionProps {
  words: WordEntry[];
  dailyStats: DailyStats; // <--- NUEVA PROP
  onRemove: (wordLower: string) => void;
}

// Configuración del límite (debería coincidir con tu scheduler)
const DAILY_NEW_WORD_LIMIT = 15;

export default function UnknownWordsSection({
  words,
  dailyStats,
  onRemove,
}: UnknownWordsSectionProps) {
  // Calculamos las estadísticas "PARA HOY"
  const stats = useMemo(() => {
    const now = Date.now();

    // 1. Repasos Vencidos (Sin límite, hay que hacerlos todos)
    const reviewsDue = words.filter(
      (w) => w.srData && w.srData.nextReview <= now
    ).length;

    // 2. Palabras Nuevas (Total disponible en BD)
    const totalNewWordsInDb = words.filter((w) => !w.srData).length;

    // 3. Cuota de Nuevas Restante para hoy
    // (Límite - Lo que ya hiciste hoy)
    const newQuotaRemaining = Math.max(
      0,
      DAILY_NEW_WORD_LIMIT - dailyStats.newCardsStudied
    );

    // 4. Nuevas Reales a mostrar hoy (Mínimo entre lo que hay en BD y la cuota)
    const newCardsAvailableToday = Math.min(
      newQuotaRemaining,
      totalNewWordsInDb
    );

    // 5. Total de la sesión de hoy
    const totalDueToday = reviewsDue + newCardsAvailableToday;

    return {
      reviewsDue,
      newCardsAvailableToday,
      totalDueToday,
      totalCollection: words.length,
      newCardsDone: dailyStats.newCardsStudied,
    };
  }, [words, dailyStats]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-gray-200/30 dark:bg-gray-800/20 blur-3xl"></div>
          <div className="absolute -bottom-24 right-1/3 h-96 w-96 rounded-full bg-gray-300/20 dark:bg-gray-700/20 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <Link
                to="/"
                className="group flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/90 dark:bg-gray-800/90 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <span className="text-lg group-hover:-translate-x-1 transition-transform duration-200">
                  ←
                </span>
                <span>Volver</span>
              </Link>

              <div className="flex items-center space-x-4">
                {/* Botón Principal de Repaso */}
                <Link
                  to="/review"
                  className={`group relative px-6 py-3 font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md ${
                    stats.totalDueToday > 0
                      ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                  }`}
                  // Deshabilitar navegación si no hay nada, o dejar que el loader de /review muestre el mensaje de "Todo listo"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>{stats.totalDueToday > 0 ? "🚀" : "✅"}</span>
                    <span>Estudiar Hoy ({stats.totalDueToday})</span>
                  </span>
                </Link>
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-gray-700 to-gray-600 dark:from-gray-200 dark:to-gray-300 bg-clip-text text-transparent">
                  Tu Colección
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {stats.totalCollection === 0
                  ? "Tu biblioteca está vacía. ¡Lee textos para añadir palabras!"
                  : stats.totalDueToday === 0
                    ? "¡Has completado todos tus objetivos por hoy!"
                    : `Tienes ${stats.reviewsDue} repasos y puedes aprender ${stats.newCardsAvailableToday} palabras nuevas más hoy.`}
              </p>
            </div>
          </div>

          {words.length === 0 ? (
            // Estado vacío global
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm p-12 text-center">
              {/* ... (contenido igual al anterior) ... */}
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
              >
                <span>📖 Leer más textos</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* PANEL DE ESTADÍSTICAS DE HOY */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <span className="text-2xl">📅</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">
                        Objetivo Diario
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Límite: {DAILY_NEW_WORD_LIMIT} nuevas/día
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Card 1: Repasos */}
                  <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {stats.reviewsDue}
                    </div>
                    <div className="text-sm font-medium text-orange-800 dark:text-orange-300">
                      Repasos Vencidos
                    </div>
                    <div className="text-xs text-orange-600/70 mt-1">
                      Prioridad alta
                    </div>
                  </div>

                  {/* Card 2: Nuevas Disponibles */}
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.newCardsAvailableToday}
                    </div>
                    <div className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Nuevas Disponibles
                    </div>
                    <div className="text-xs text-blue-600/70 mt-1">
                      Has hecho {stats.newCardsDone}/{DAILY_NEW_WORD_LIMIT} hoy
                    </div>
                  </div>

                  {/* Card 3: Total Colección */}
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-center">
                    <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                      {stats.totalCollection}
                    </div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Guardadas
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Base de datos
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones Rápidas */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => exportUnknownWordsCsv()}
                  className="flex-1 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                  📥 Exportar CSV (Anki)
                </button>
              </div>

              {/* Lista de palabras (Igual que antes, pero mostrando status) */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">
                    Tu Vocabulario
                  </h3>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600">
                    Ordenado por fecha
                  </span>
                </div>

                <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                  {words.map((word) => (
                    <div
                      key={word.wordLower}
                      className="group p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {word.word}
                            </h4>
                            {/* Icono de audio ... */}
                            <button
                              onClick={async () => {
                                const s = await getSettings();
                                await speak(word.word, s.tts);
                              }}
                              className="text-gray-400 hover:text-blue-500"
                            >
                              🔊
                            </button>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {word.translation}
                          </p>

                          {/* Estado de la palabra */}
                          <div className="flex items-center space-x-4 text-xs md:text-sm">
                            {isWordReadyForReview(word) && word.srData ? (
                              <span className="text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded">
                                ⚠️ Repaso pendiente
                              </span>
                            ) : !word.srData ? (
                              <span className="text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">
                                ✨ Nueva
                              </span>
                            ) : (
                              <span className="text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded">
                                ✅ Aprendida (Próx:{" "}
                                {formatTimeUntilReview(word.srData.nextReview)})
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Botones individuales */}
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-2 text-red-400 hover:bg-red-50 rounded"
                            onClick={async () => {
                              if (confirm("¿Borrar?")) {
                                await deleteWord(word.wordLower);
                                onRemove(word.wordLower);
                              }
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
