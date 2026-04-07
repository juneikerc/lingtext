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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="w-24 h-24 mx-auto mb-6 bg-[#0F9EDA]/5]/10 border border-[#0F9EDA]/20]/30 rounded-2xl flex items-center justify-center shadow-sm">
            <span className="text-4xl">🎉</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Sesión al día!
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Terminaste la cola actual y dejaste registradas las nuevas
            prioridades de repaso.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8 text-left bg-gray-50 border border-gray-200 p-4 rounded-xl">
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
              <div className="text-2xl font-bold text-[#0F9EDA]">
                {sessionStats.good + sessionStats.easy}
              </div>
            </div>
          </div>

          <Link
            to="/words"
            className="inline-flex items-center justify-center w-full px-6 py-4 bg-[#0F9EDA] text-white font-bold rounded-xl hover:bg-[#0D8EC4] transition-colors duration-200 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
          >
            Volver
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-[#0F9EDA]/5]/10 blur-3xl"></div>
          <div className="absolute -bottom-24 right-1/3 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/words"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-700 font-medium border border-gray-300 hover:bg-gray-50 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
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
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 ${
                    isActive
                      ? "border-[#0F9EDA] bg-[#0F9EDA] text-white]]"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{filter.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {counts[filter.mode]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Review 2.0
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {!currentWord.srData ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#0F9EDA]/5 text-[#0A7AAB]]/10]">
                  ✨ NUEVA TARJETA
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                  🔄 VENCIDA
                </span>
              )}
              {currentWord.isPhrase && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-700">
                  💬 FRASE
                </span>
              )}
            </div>
          </div>

          {currentWord.srData && (
            <div className="mb-8 grid grid-cols-3 gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="text-center">
                <div className="text-xs uppercase tracking-wider text-gray-500">
                  Repeticiones
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {currentWord.srData.repetitions}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs uppercase tracking-wider text-gray-500">
                  Intervalo actual
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {formatReviewInterval(currentWord.srData.interval)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs uppercase tracking-wider text-gray-500">
                  Próximo repaso
                </div>
                <div className="text-lg font-bold text-gray-900">
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

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
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
                className="rounded-lg border border-gray-300 px-3 py-2 text-gray-600 transition-colors duration-200 hover:bg-gray-100"
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
