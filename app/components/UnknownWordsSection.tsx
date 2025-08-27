import React from "react";
import { Link } from "react-router";
import type { WordEntry } from "~/types";
import { exportUnknownWordsCsv } from "~/utils/anki";
import { deleteWord, getSettings } from "~/db";
import { speak } from "~/utils/tts";

// Función para determinar si una palabra está lista para repaso
const isWordReadyForReview = (word: WordEntry): boolean => {
  if (!word.srData) return true; // Primera vez
  return Date.now() >= word.srData.nextReview;
};

// Función para formatear tiempo restante
const formatTimeUntilReview = (nextReview: number): string => {
  const now = Date.now();
  const diff = nextReview - now;

  if (diff <= 0) return "Ahora";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) {
    return `${days} día${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hora${hours > 1 ? 's' : ''}`;
  } else {
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${minutes} min`;
  }
};

// Función para calcular palabras listas para repaso
const calculateReadyWords = (words: WordEntry[]) => {
  const ready = words.filter(isWordReadyForReview);
  return {
    ready: ready.length,
    total: words.length,
    percentage: words.length > 0 ? Math.round((ready.length / words.length) * 100) : 0
  };
};

interface UnknownWordsSectionProps {
  words: WordEntry[];
  onRemove: (wordLower: string) => void;
}

export default function UnknownWordsSection({ words, onRemove }: UnknownWordsSectionProps) {
  const readyStats = calculateReadyWords(words);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 dark:from-gray-950 dark:via-blue-950/10 dark:to-indigo-950/10">
      <div className="relative">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-blue-400/5 blur-3xl"></div>
          <div className="absolute -bottom-24 right-1/3 h-96 w-96 rounded-full bg-indigo-400/5 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Header elegante */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <Link
                to="/"
                className="group flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-900/80 hover:bg-blue-500 hover:text-white text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
              >
                <span className="text-lg group-hover:-translate-x-1 transition-transform duration-200">←</span>
                <span>Volver</span>
              </Link>

              <div className="flex items-center space-x-4">
                <Link
                  to="/review"
                  className="group relative px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>🎯</span>
                    <span>Repasar ({readyStats.ready})</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 mb-4 text-sm font-medium text-blue-600 bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-300 rounded-full border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                Vocabulario Personal
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Palabras por Aprender
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {words.length === 0
                  ? "¡Excelente! No tienes palabras pendientes de aprender."
                  : `Tienes ${words.length} ${words.length === 1 ? 'palabra' : 'palabras'} para dominar. ¡Sigue practicando!`
                }
              </p>
            </div>
          </div>

          {words.length === 0 ? (
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">🎉</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                ¡Todas las palabras aprendidas!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                No hay palabras desconocidas pendientes. Lee más textos para continuar expandiendo tu vocabulario.
              </p>
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
              >
                <span>📖 Leer más textos</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Estadísticas del algoritmo SR */}
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                      <span className="text-xl">🎯</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">Repetición Espaciada</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Estado de tu vocabulario</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{readyStats.ready}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Listas para repaso</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{readyStats.total - readyStats.ready}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">En proceso</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{readyStats.percentage}%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Progreso</div>
                  </div>
                </div>
              </div>

              {/* Acciones rápidas */}
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <span className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-xs">⚡</span>
                  </span>
                  Acciones Rápidas
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => exportUnknownWordsCsv()}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
                  >
                    <span>📥</span>
                    <span>Exportar a Anki</span>
                  </button>
                  <Link
                    to="/review"
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                  >
                    <span>🎯</span>
                    <span>Modo Repaso ({readyStats.ready})</span>
                  </Link>
                </div>
              </div>

              {/* Lista de palabras */}
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">Palabras Desconocidas</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Haz clic en las palabras para escuchar su pronunciación</p>
                </div>

                <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                  {words.map((word) => (
                    <div key={word.wordLower} className="group p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {word.word}
                            </h4>
                            <button
                              onClick={async () => {
                                const settings = await getSettings();
                                await speak(word.word, settings.tts);
                              }}
                              className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors duration-200"
                              title={`Escuchar "${word.word}"`}
                              aria-label={`Escuchar "${word.word}"`}
                            >
                              <span className="text-lg">🔊</span>
                            </button>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">{word.translation}</p>

                          {/* Información del algoritmo SR */}
                          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-2">
                              <span className={`w-2 h-2 rounded-full ${
                                isWordReadyForReview(word) ? 'bg-green-400' : 'bg-orange-400'
                              }`}></span>
                              <span className={isWordReadyForReview(word) ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}>
                                {isWordReadyForReview(word) ? 'Lista para repaso' : `Próximo repaso: ${formatTimeUntilReview(word.srData!.nextReview)}`}
                              </span>
                            </div>

                            {word.srData && (
                              <>
                                <span>Repeticiones: <span className="font-semibold text-purple-600">{word.srData.repetitions}</span></span>
                                <span>Factor: <span className="font-semibold text-blue-600">{word.srData.easeFactor}</span></span>
                                <span>Intervalo: <span className="font-semibold text-green-600">{word.srData.interval}d</span></span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          {isWordReadyForReview(word) && (
                            <Link
                              to={`/review?word=${word.wordLower}`}
                              className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-colors duration-200 font-medium"
                            >
                              Repasar
                            </Link>
                          )}
                          <button
                            type="button"
                            title={`Eliminar "${word.word}"`}
                            aria-label={`Eliminar "${word.word}"`}
                            className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors duration-200"
                            onClick={async () => {
                              const ok = confirm(`¿Eliminar "${word.word}" de tu lista de aprendizaje?`);
                              if (!ok) return;
                              await deleteWord(word.wordLower);
                              onRemove(word.wordLower);
                            }}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
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
