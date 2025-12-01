import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import type { WordEntry } from "~/types";
import {
  deleteWord,
  getSettings,
  putUnknownWord,
  getPhrase,
  putPhrase,
  deletePhrase,
  incrementNewCardsCount,
} from "~/services/db";
import { speak } from "~/utils/tts";
import {
  calculateNextReview,
  formatTimeUntilReview,
} from "~/utils/spaced-repetition";
import { tokenize, normalizeWord } from "~/utils/tokenize";
import Card from "./reviewMode/Card";

interface ReviewModeProps {
  words: WordEntry[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onRefresh: () => void;
  totalWords: number;
  onRetryWord: (word: WordEntry) => void;
}

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

  const handleAnswer = async (remembered: boolean) => {
    if (!currentWord || processing) return;

    setProcessing(true);

    try {
      // Calidad simplificada: 5 (perfecto) o 1 (fallo)
      // Podrías añadir botones para "Difícil" (3) o "Fácil" (4) en el futuro
      const quality = remembered ? 5 : 1;

      // Detectar si es carta NUEVA (sin datos previos)
      const isNewCard = !currentWord.srData;

      const newSrData = calculateNextReview(currentWord.srData, quality);

      if (remembered) {
        // --- ACIERTO ---

        // Guardar en BD
        if (currentWord.isPhrase) {
          const existing = await getPhrase(currentWord.wordLower);
          if (existing) {
            await putPhrase({ ...existing, srData: newSrData });
          } else {
            // Reconstrucción de frase si no existía en store
            const parts = tokenize(currentWord.word)
              .filter((t) => t.isWord)
              .map((t) => t.lower || normalizeWord(t.text));
            await putPhrase({
              phrase: currentWord.word,
              phraseLower: currentWord.wordLower,
              translation: currentWord.translation,
              parts,
              addedAt: currentWord.addedAt,
              srData: newSrData,
            });
          }
        } else {
          await putUnknownWord({
            word: currentWord.word,
            wordLower: currentWord.wordLower,
            translation: currentWord.translation,
            status: "unknown",
            addedAt: currentWord.addedAt,
            voice: currentWord.voice,
            srData: newSrData,
          });
        }

        // Incrementar contador de límites DIARIOS solo si era nueva
        if (isNewCard) {
          await incrementNewCardsCount();
        }

        setSessionStats((prev) => ({
          ...prev,
          correct: prev.correct + 1,
          total: prev.total + 1,
        }));

        // Avanzar
        setTimeout(() => {
          if (currentIndex < words.length - 1) {
            onNext();
          } else {
            onRefresh();
          }
        }, 1000);
      } else {
        // --- FALLO ---
        setSessionStats((prev) => ({
          ...prev,
          incorrect: prev.incorrect + 1,
          total: prev.total + 1,
        }));

        // Reencolar para verla de nuevo en esta misma sesión
        onRetryWord(currentWord);

        setTimeout(() => {
          if (currentIndex < words.length - 1) {
            onNext();
          } else {
            onRefresh();
          }
        }, 2000);
      }
    } catch (err) {
      console.error("Error al guardar repaso:", err);
    } finally {
      setProcessing(false);
    }
  };

  const markAsKnown = async () => {
    if (!currentWord) return;
    if (currentWord.isPhrase) {
      await deletePhrase(currentWord.wordLower);
    } else {
      await deleteWord(currentWord.wordLower);
    }
    onRefresh();

    setSessionStats((prev) => ({
      ...prev,
      correct: prev.correct + 1,
      total: prev.total + 1,
    }));

    if (currentIndex < words.length - 1) {
      onNext();
    }
  };

  // Pantalla de "Sesión Terminada"
  if (!currentWord) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-gray-950 dark:via-purple-950/10 dark:to-pink-950/10 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-4xl">🎉</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            ¡Sesión al día!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Has repasado todas las palabras pendientes y cumplido tu cuota de
            nuevas palabras por hoy.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8 text-left bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl">
            <div>
              <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                Aciertos
              </div>
              <div className="text-2xl font-bold text-green-600">
                {sessionStats.correct}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                Repasos
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {sessionStats.total}
              </div>
            </div>
          </div>

          <Link
            to="/words"
            className="inline-flex items-center justify-center w-full px-6 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:scale-[1.02] transition-all duration-200 shadow-xl"
          >
            Volver a la Biblioteca
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-purple-200/30 dark:bg-purple-900/20 blur-3xl"></div>
          <div className="absolute -bottom-24 right-1/3 h-96 w-96 rounded-full bg-blue-200/30 dark:bg-blue-900/20 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Simplificado */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/words"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              ← Salir
            </Link>
            <div className="text-sm font-mono text-gray-400">
              {currentIndex + 1} / {totalWords}
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Repaso Espaciado
            </h1>
            {/* Indicador de Nueva vs Repaso */}
            <div className="flex justify-center">
              {!currentWord.srData ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                  ✨ NUEVA PALABRA
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300">
                  🔄 REPASO
                </span>
              )}
            </div>
          </div>

          {/* Estadísticas de la palabra (Opcional: solo mostrar si es repaso) */}
          {currentWord.srData && (
            <div className="flex justify-center gap-6 mb-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-900 dark:text-white">
                  {currentWord.srData.repetitions}
                </span>
                <span className="text-xs">Repeticiones</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-900 dark:text-white">
                  {currentWord.srData.interval}d
                </span>
                <span className="text-xs">Intervalo</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-900 dark:text-white">
                  {formatTimeUntilReview(currentWord.srData.nextReview)}
                </span>
                <span className="text-xs">Próximo</span>
              </div>
            </div>
          )}

          {/* Tarjeta Principal */}
          <Card
            word={currentWord}
            showTranslation={showTranslation}
            setShowTranslation={setShowTranslation}
            handleAnswer={handleAnswer}
            processing={processing}
          />
        </div>
      </div>
    </div>
  );
}
