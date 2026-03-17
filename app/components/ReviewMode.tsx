import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  deletePhrase,
  getPhrase,
  incrementNewCardsCount,
  putPhrase,
  putUnknownWord,
} from "~/services/db";
import type { WordEntry } from "~/types";
import type { SessionDeckCounts, SessionDeckMode } from "~/utils/scheduler";
import {
  calculateNextReview,
  formatReviewInterval,
  formatTimeUntilReview,
  REVIEW_GRADE_OPTIONS,
  type ReviewGrade,
} from "~/utils/spaced-repetition";
import { normalizeWord, tokenize } from "~/utils/tokenize";
import Card from "./reviewMode/Card";

interface ReviewModeProps {
  words: WordEntry[];
  activeMode: SessionDeckMode;
  counts: SessionDeckCounts;
  currentIndex: number;
  onModeChange: (mode: SessionDeckMode) => void;
  onNext: () => void;
  onPrev: () => void;
  onRefresh: () => void;
  totalWords: number;
  onRetryWord: (word: WordEntry) => void;
}

const FILTER_OPTIONS: Array<{ mode: SessionDeckMode; label: string }> = [
  { mode: "all", label: "Todo" },
  { mode: "phrases", label: "Solo frases" },
  { mode: "new", label: "Solo nuevas" },
  { mode: "due", label: "Solo vencidas" },
];

export default function ReviewMode({
  words,
  activeMode,
  counts,
  currentIndex,
  onModeChange,
  onNext,
  onPrev,
  onRefresh,
  onRetryWord,
  totalWords,
}: ReviewModeProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
    total: 0,
  });
  const [processing, setProcessing] = useState(false);

  const currentWord = words[currentIndex];

  useEffect(() => {
    setShowTranslation(false);
  }, [currentIndex]);

  const answerOptions = useMemo(() => {
    if (!currentWord) {
      return [];
    }

    return REVIEW_GRADE_OPTIONS.map((option) => {
      const nextReview = calculateNextReview(
        currentWord.srData,
        option.quality
      );

      return {
        ...option,
        intervalLabel: formatReviewInterval(nextReview.interval),
      };
    });
  }, [currentWord]);

  const handleAnswer = useCallback(
    async (grade: ReviewGrade) => {
      if (!currentWord || processing) return;

      const selectedOption = REVIEW_GRADE_OPTIONS.find(
        (option) => option.id === grade
      );
      if (!selectedOption) return;

      setProcessing(true);

      try {
        const isNewCard = !currentWord.srData;
        const newSrData = calculateNextReview(
          currentWord.srData,
          selectedOption.quality
        );
        const updatedWord = { ...currentWord, srData: newSrData };

        if (currentWord.isPhrase) {
          const existing = await getPhrase(currentWord.wordLower);
          if (existing) {
            await putPhrase({ ...existing, srData: newSrData });
          } else {
            const parts = tokenize(currentWord.word)
              .filter((token) => token.isWord)
              .map((token) => token.lower || normalizeWord(token.text));

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

        if (isNewCard) {
          await incrementNewCardsCount();
        }

        setSessionStats((prev) => ({
          ...prev,
          [grade]: prev[grade] + 1,
          total: prev.total + 1,
        }));

        if (grade === "again") {
          onRetryWord(updatedWord);
        }

        window.setTimeout(
          () => {
            if (currentIndex < words.length - 1) {
              onNext();
            } else {
              onRefresh();
            }
          },
          grade === "again" ? 350 : 250
        );
      } catch (err) {
        console.error("Error al guardar repaso:", err);
      } finally {
        setProcessing(false);
      }
    },
    [
      currentIndex,
      currentWord,
      onNext,
      onRefresh,
      onRetryWord,
      processing,
      words.length,
    ]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (processing || !currentWord) {
        return;
      }

      if (!showTranslation && (event.key === " " || event.key === "Enter")) {
        event.preventDefault();
        setShowTranslation(true);
        return;
      }

      if (showTranslation) {
        const gradeMap: Record<string, ReviewGrade> = {
          "1": "again",
          "2": "hard",
          "3": "good",
          "4": "easy",
        };

        const grade = gradeMap[event.key];
        if (grade) {
          event.preventDefault();
          void handleAnswer(grade);
          return;
        }
      }

      if (event.key === "ArrowLeft" && currentIndex > 0) {
        event.preventDefault();
        onPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentIndex,
    currentWord,
    handleAnswer,
    onPrev,
    processing,
    showTranslation,
  ]);

  const removeCurrentPhrase = useCallback(async () => {
    if (!currentWord?.isPhrase) {
      return;
    }

    await deletePhrase(currentWord.wordLower);
    onRefresh();
  }, [currentWord, onRefresh]);

  if (!currentWord) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center p-8 max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="w-24 h-24 mx-auto mb-6 bg-indigo-100 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl flex items-center justify-center shadow-sm">
            <span className="text-4xl">🎉</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            ¡Sesión al día!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Terminaste la cola actual y dejaste registradas las nuevas
            prioridades de repaso.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8 text-left bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 p-4 rounded-xl">
            <div>
              <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                Again
              </div>
              <div className="text-2xl font-bold text-red-600">
                {sessionStats.again}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                Good + Easy
              </div>
              <div className="text-2xl font-bold text-indigo-600">
                {sessionStats.good + sessionStats.easy}
              </div>
            </div>
          </div>

          <Link
            to="/words"
            className="inline-flex items-center justify-center w-full px-6 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-950"
          >
            Volver a la Biblioteca
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-indigo-500/10 dark:bg-indigo-400/5 blur-3xl"></div>
          <div className="absolute -bottom-24 right-1/3 h-96 w-96 rounded-full bg-sky-500/10 dark:bg-sky-400/5 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/words"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-medium border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-950"
            >
              ← Salir
            </Link>
            <div className="text-sm font-mono text-gray-400">
              {currentIndex + 1} / {totalWords}
            </div>
          </div>

          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {FILTER_OPTIONS.map((filter) => {
              const isActive = filter.mode === activeMode;

              return (
                <button
                  key={filter.mode}
                  type="button"
                  onClick={() => onModeChange(filter.mode)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-950 ${
                    isActive
                      ? "border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                  }`}
                >
                  <span>{filter.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {counts[filter.mode]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Review 2.0
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {!currentWord.srData ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300">
                  ✨ NUEVA TARJETA
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                  🔄 VENCIDA
                </span>
              )}
              {currentWord.isPhrase && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300">
                  💬 FRASE
                </span>
              )}
            </div>
          </div>

          {currentWord.srData && (
            <div className="mb-8 grid grid-cols-3 gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="text-center">
                <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Repeticiones
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {currentWord.srData.repetitions}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Intervalo actual
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {formatReviewInterval(currentWord.srData.interval)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Próximo repaso
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {formatTimeUntilReview(currentWord.srData.nextReview)}
                </div>
              </div>
            </div>
          )}

          <Card
            word={currentWord}
            showTranslation={showTranslation}
            setShowTranslation={setShowTranslation}
            handleAnswer={handleAnswer}
            answerOptions={answerOptions}
            processing={processing}
          />

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span>1 Again</span>
              <span>2 Hard</span>
              <span>3 Good</span>
              <span>4 Easy</span>
            </div>
            {currentWord.isPhrase ? (
              <button
                type="button"
                onClick={() => void removeCurrentPhrase()}
                className="rounded-lg border border-gray-300 px-3 py-2 text-gray-600 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Eliminar frase
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
