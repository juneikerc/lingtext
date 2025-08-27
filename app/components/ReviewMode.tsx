import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import type { WordEntry, SpacedRepetitionData } from "~/types";
import { deleteWord, getSettings, putUnknownWord } from "~/db";
import { speak } from "~/utils/tts";

interface ReviewModeProps {
  words: WordEntry[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onRefresh: () => void;
  totalWords: number;
  onRetryWord: (word: WordEntry) => void; // Nueva prop para añadir palabra al final
}

// Algoritmo de repetición espaciada (versión simplificada con 2 niveles)
const calculateNextReview = (
  currentData: SpacedRepetitionData | undefined,
  quality: number // 1 = incorrecto, 5 = correcto
): SpacedRepetitionData => {
  const now = Date.now();
  const easeFactor = currentData?.easeFactor ?? 2.5;
  const repetitions = currentData?.repetitions ?? 0;

  let newInterval: number;
  let newRepetitions: number;

  if (quality >= 3) {
    // Respuesta correcta
    if (repetitions === 0) {
      newInterval = 1; // Primera repetición exitosa: 1 día
      newRepetitions = 1;
    } else if (repetitions === 1) {
      newInterval = 3; // Segunda repetición exitosa: 3 días
      newRepetitions = 2;
    } else {
      // Repeticiones posteriores: intervalo progresivo
      newInterval = Math.round((currentData?.interval ?? 1) * easeFactor);
      newRepetitions = repetitions + 1;
    }
  } else {
    // Respuesta incorrecta
    newInterval = 1; // Reiniciar a 1 día
    newRepetitions = 0; // Reiniciar repeticiones
  }

  // Calcular próxima fecha de revisión
  const nextReview = now + (newInterval * 24 * 60 * 60 * 1000);

  // Agregar al historial
  const reviewHistory = currentData?.reviewHistory ?? [];
  reviewHistory.push({
    date: now,
    quality,
    interval: newInterval,
  });

  return {
    easeFactor: quality >= 3 ? easeFactor : 2.5, // Mantener o reiniciar factor de facilidad
    interval: newInterval,
    repetitions: newRepetitions,
    nextReview,
    reviewHistory: reviewHistory.slice(-10), // Mantener solo las últimas 10 revisiones
  };
};

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
    return "Menos de 1 hora";
  }
};

export default function ReviewMode({
  words,
  currentIndex,
  onNext,
  onPrev,
  onRefresh,
  onRetryWord,
  totalWords,
}: ReviewModeProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0,
  });
  const [processing, setProcessing] = useState(false);

  const currentWord = words[currentIndex];

  useEffect(() => {
    setShowTranslation(false);
  }, [currentIndex]);

  const playAudio = async () => {
    if (!currentWord) return;
    const settings = await getSettings();
    await speak(currentWord.word, settings.tts);
  };

  const handleShowTranslation = () => {
    setShowTranslation(true);
  };

  const handleAnswer = async (remembered: boolean) => {
    if (!currentWord || processing) return;

    setProcessing(true);

    try {
      const quality = remembered ? 5 : 1;
      const newSrData = calculateNextReview(currentWord.srData, quality);

      if (remembered) {
        // Respuesta correcta: actualizar datos SR y continuar
        await putUnknownWord({
          word: currentWord.word,
          wordLower: currentWord.wordLower,
          translation: currentWord.translation,
          status: "unknown",
          addedAt: currentWord.addedAt,
          voice: currentWord.voice,
          srData: newSrData,
        });

        setSessionStats(prev => ({
          ...prev,
          correct: prev.correct + 1,
          total: prev.total + 1,
        }));

        // Avanzar automáticamente después de un delay
        setTimeout(() => {
          if (currentIndex < words.length - 1) {
            onNext();
          } else {
            onRefresh(); // Refrescar para actualizar el orden
          }
        }, 1000);
      } else {
        // Respuesta incorrecta: añadir al final de la lista para reintento en la misma sesión
        // Solo actualizar estadísticas, no guardar en BD aún
        setSessionStats(prev => ({
          ...prev,
          incorrect: prev.incorrect + 1,
          total: prev.total + 1,
        }));

        // Añadir la palabra al final de la lista para reintento
        onRetryWord(currentWord);

        // Avanzar automáticamente después de mostrar la respuesta
        setTimeout(() => {
          if (currentIndex < words.length - 1) {
            onNext();
          } else {
            onRefresh();
          }
        }, 2000); // Dar tiempo para ver la respuesta correcta
      }
    } finally {
      setProcessing(false);
    }
  };

  const markAsKnown = async () => {
    if (!currentWord) return;
    await deleteWord(currentWord.wordLower);
    onRefresh();

    if (currentIndex >= words.length - 1) {
      setSessionStats(prev => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setSessionStats(prev => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }));
      onNext();
    }
  };

  if (!currentWord) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-gray-950 dark:via-purple-950/10 dark:to-pink-950/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center">
            <span className="text-4xl">🎉</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Sesión completada
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            ¡Excelente trabajo! Has completado todos los repasos programados para hoy.
          </p>
          <Link
            to="/words"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
          >
            <span>📚 Volver al vocabulario</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="relative">
        {/* Elementos decorativos de fondo - más sutiles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-gray-200/30 dark:bg-gray-800/20 blur-3xl"></div>
          <div className="absolute -bottom-24 right-1/3 h-96 w-96 rounded-full bg-gray-300/20 dark:bg-gray-700/20 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <Link
                to="/words"
                className="group flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/90 dark:bg-gray-800/90 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <span className="text-lg group-hover:-translate-x-1 transition-transform duration-200">←</span>
                <span>Vocabulario</span>
              </Link>

              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {currentIndex + 1} de {totalWords}
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 mb-4 text-sm font-medium text-gray-600 bg-gray-100/80 dark:bg-gray-800/80 dark:text-gray-400 rounded-full border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                <span className="w-2 h-2 bg-gray-500 rounded-full mr-2 animate-pulse"></span>
                Modo Repaso Inteligente
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-gray-700 to-gray-600 dark:from-gray-200 dark:to-gray-300 bg-clip-text text-transparent">
                  ¿Recuerdas esta palabra?
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                El algoritmo de repetición espaciada optimiza tu aprendizaje
              </p>
            </div>
          </div>

          {/* Estadísticas de sesión */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">{sessionStats.correct}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Correctas</div>
            </div>
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-red-700 dark:text-red-400">{sessionStats.incorrect}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Incorrectas</div>
            </div>
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{Math.round(sessionStats.total > 0 ? (sessionStats.correct / sessionStats.total) * 100 : 0)}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Precisión</div>
            </div>
          </div>

          {/* Información del algoritmo SR */}
          {currentWord.srData && (
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm p-4 mb-8">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <span>Repeticiones: <span className="font-semibold text-gray-700 dark:text-gray-300">{currentWord.srData.repetitions}</span></span>
                  <span>Factor: <span className="font-semibold text-gray-700 dark:text-gray-300">{currentWord.srData.easeFactor}</span></span>
                  <span>Intervalo: <span className="font-semibold text-gray-700 dark:text-gray-300">{currentWord.srData.interval}d</span></span>
                </div>
                <div className="text-right">
                  <span>Próximo repaso: <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {formatTimeUntilReview(currentWord.srData.nextReview)}
                  </span></span>
                </div>
              </div>
            </div>
          )}

          {/* Tarjeta de repaso */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg overflow-hidden">
            {/* Palabra */}
            <div className="p-8 text-center border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                  {currentWord.word}
                </h2>
                <button
                  onClick={playAudio}
                  className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  title="Escuchar pronunciación"
                >
                  <span className="text-xl">🔊</span>
                </button>
              </div>

              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  <span>Agregada: {new Date(currentWord.addedAt).toLocaleDateString()}</span>
                </span>
              </div>
            </div>

            {/* Área de respuesta */}
            <div className="p-8">
              {showTranslation ? (
                <div className="space-y-6">
                  {/* Respuesta correcta */}
                  <div className="text-center">
                    <div className="inline-flex items-center px-6 py-2 mb-4 text-lg font-medium text-gray-700 bg-gray-100/80 dark:bg-gray-700/80 dark:text-gray-300 rounded-full border border-gray-200/50 dark:border-gray-600/50">
                      <span className="text-xl mr-2">🇪🇸</span>
                      <span>{currentWord.translation}</span>
                    </div>
                  </div>

                  {/* Botones de confirmación */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => handleAnswer(true)}
                      className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800/40 border border-green-200 dark:border-green-800/50 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                    >
                      <span>✅</span>
                      <span>La recordaba</span>
                    </button>
                    <button
                      onClick={() => handleAnswer(false)}
                      disabled={processing}
                      className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/40 border border-red-200 dark:border-red-800/50 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md disabled:opacity-50"
                    >
                      <span>❌</span>
                      <span>No la recordaba</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                      ¿Recuerdas el significado de esta palabra?
                    </p>

                    <button
                      onClick={handleShowTranslation}
                      className="flex items-center justify-center space-x-3 px-8 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                    >
                      <span>👁️</span>
                      <span>Mostrar traducción</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navegación */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={onPrev}
              disabled={currentIndex === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-white/90 dark:bg-gray-800/90 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:text-gray-400 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              <span>←</span>
              <span>Anterior</span>
            </button>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              Progreso: {currentIndex + 1} / {totalWords}
            </div>

            <button
              onClick={onNext}
              disabled={currentIndex === words.length - 1}
              className="flex items-center space-x-2 px-4 py-2 bg-white/90 dark:bg-gray-800/90 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:text-gray-400 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              <span>Siguiente</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
