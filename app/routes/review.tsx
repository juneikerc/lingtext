import { generateSessionDeck } from "~/utils/scheduler";
import type { Route } from "./+types/review";
import { useState, useEffect, Suspense, lazy } from "react";
import type { WordEntry } from "~/types";
import { type DailyStats } from "~/services/db";
import { Link } from "react-router";

const ReviewMode = lazy(() => import("~/components/ReviewMode"));

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Repaso de vocabulario | LingText" },
    {
      name: "description",
      content:
        "Repasa las palabras que has marcado como desconocidas durante tu tiempo de lectura.",
    },
    {
      name: "robots",
      content: "noindex",
    },
  ];
}

// Skeleton component for loading state
function ReviewSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-gray-950 dark:via-purple-950/10 dark:to-pink-950/10">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-12">
        {/* Header skeleton */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-purple-600 bg-purple-100/80 dark:bg-purple-900/30 dark:text-purple-300 rounded-full border border-purple-200/50 dark:border-purple-800/50 backdrop-blur-sm">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
            Preparando sesión de repaso...
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent">
              Repaso de Vocabulario
            </span>
          </h1>
        </div>

        {/* Card skeleton */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-8 animate-pulse">
          {/* Progress bar skeleton */}
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-8"></div>

          {/* Word skeleton */}
          <div className="text-center mb-8">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-48 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-lg w-64 mx-auto"></div>
          </div>

          {/* Buttons skeleton */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>

          {/* Rating buttons skeleton */}
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl"
              ></div>
            ))}
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="mt-6 flex justify-center gap-8">
          <div className="text-center animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-8 mx-auto mb-1"></div>
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-16"></div>
          </div>
          <div className="text-center animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-8 mx-auto mb-1"></div>
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ReviewData {
  words: WordEntry[];
  selectedWord: string | null;
  limitReached: boolean;
  dailyStats: DailyStats;
}

export default function Review() {
  const [data, setData] = useState<ReviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [words, setWords] = useState<WordEntry[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Load data on mount
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const { deck, limitReached, stats } = await generateSessionDeck();

        if (!mounted) return;

        // Normalize: ensure phrases have 'isPhrase' flag
        const formattedDeck = deck.map((item) => {
          if ("parts" in item) {
            return {
              ...item,
              isPhrase: true,
              status: "unknown",
            } as WordEntry & { isPhrase: boolean };
          }
          return item;
        });

        const url = new URL(window.location.href);
        const selectedWord = url.searchParams.get("word");

        setData({
          words: formattedDeck,
          selectedWord,
          limitReached,
          dailyStats: stats,
        });
        setWords(formattedDeck);
      } catch (error) {
        console.error("[Review] Failed to load data:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  // Handle selected word from URL
  useEffect(() => {
    if (data?.selectedWord && words.length > 0) {
      const index = words.findIndex((w) => w.wordLower === data.selectedWord);
      if (index !== -1) {
        setCurrentWordIndex(index);
      }
    }
  }, [data?.selectedWord, words]);

  const refreshWords = async () => {
    window.location.reload();
  };

  const nextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    }
  };

  const prevWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
    }
  };

  const handleRetryWord = (word: WordEntry) => {
    setWords((prevWords) => [...prevWords, word]);
  };

  // Show skeleton while loading
  if (isLoading) {
    return <ReviewSkeleton />;
  }

  // Default stats
  const dailyStats = data?.dailyStats ?? {
    date: new Date().toISOString().split("T")[0],
    newCardsStudied: 0,
  };
  const limitReached = data?.limitReached ?? false;

  // ============================================================
  // ESTADO: SIN PALABRAS (Dos variantes: Fin real o Límite)
  // ============================================================
  if (words.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-gray-950 dark:via-purple-950/10 dark:to-pink-950/10 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          {/* ÍCONO */}
          <div
            className={`w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg ${limitReached ? "bg-gradient-to-r from-orange-400 to-red-500 shadow-orange-500/20" : "bg-gradient-to-r from-green-400 to-blue-500 shadow-blue-500/20"}`}
          >
            <span className="text-4xl">{limitReached ? "🛑" : "🎉"}</span>
          </div>

          {/* TÍTULO */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {limitReached ? "Límite diario alcanzado" : "¡Todo al día!"}
          </h2>

          {/* DESCRIPCIÓN */}
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {limitReached
              ? `Has estudiado ${dailyStats.newCardsStudied} palabras nuevas hoy. Es importante descansar para asimilar lo aprendido.`
              : "No hay más repasos pendientes por ahora. Has hecho un excelente trabajo manteniendo tu rutina."}
          </p>

          {/* TARJETA DE ESTADÍSTICAS DIARIAS */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6 mb-8">
            <div className="grid grid-cols-2 gap-4 divide-x divide-gray-200 dark:divide-gray-700">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {dailyStats.newCardsStudied}
                </div>
                <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Nuevas Hoy
                </div>
              </div>
              <div className="text-center pl-4">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {/* Aquí podrías sumar repasos si guardaras esa estadística en dailyStats también */}
                  Done
                </div>
                <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Estado
                </div>
              </div>
            </div>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/words"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
            >
              <span>📚 Gestionar vocabulario</span>
            </Link>

            {/* Si hay límite alcanzado, sugerimos seguir leyendo */}
            <Link
              to="/"
              className={`inline-flex items-center justify-center px-6 py-3 font-medium rounded-xl transition-all duration-200 border ${limitReached ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 hover:bg-gray-50" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"}`}
            >
              <span>📖 Leer textos</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<ReviewSkeleton />}>
      <ReviewMode
        words={words}
        currentIndex={currentWordIndex}
        onNext={nextWord}
        onPrev={prevWord}
        onRefresh={refreshWords}
        onRetryWord={handleRetryWord}
        totalWords={words.length}
      />
    </Suspense>
  );
}
