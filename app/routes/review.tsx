import {
  generateSessionDeck,
  type SessionDeckCounts,
  type SessionDeckMode,
} from "~/utils/scheduler";
import type { Route } from "./+types/review";
import { useState, useEffect, Suspense, lazy } from "react";
import type { WordEntry } from "~/types";
import { type DailyStats } from "~/services/db";
import { Link, useSearchParams } from "react-router";

const ReviewMode = lazy(() => import("~/components/ReviewMode"));

export function meta(_args: Route.MetaArgs) {
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
    <div className="min-h-screen bg-white">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-12">
        {/* Header skeleton */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 bg-gray-100 rounded-full border border-gray-200">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
            Preparando sesión de repaso...
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900">
            Repaso de{" "}
            <span className="text-indigo-600">
              Vocabulario
            </span>
          </h1>
        </div>

        {/* Card skeleton */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 animate-pulse">
          {/* Progress bar skeleton */}
          <div className="h-2 bg-gray-200 rounded-full mb-8"></div>

          {/* Word skeleton */}
          <div className="text-center mb-8">
            <div className="h-10 bg-gray-200 rounded-xl w-48 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-100 rounded-lg w-64 mx-auto"></div>
          </div>

          {/* Buttons skeleton */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
          </div>

          {/* Rating buttons skeleton */}
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-14 bg-gray-200 rounded-xl"
              ></div>
            ))}
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="mt-6 flex justify-center gap-8">
          <div className="text-center animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-8 mx-auto mb-1"></div>
            <div className="h-3 bg-gray-100 rounded w-16"></div>
          </div>
          <div className="text-center animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-8 mx-auto mb-1"></div>
            <div className="h-3 bg-gray-100 rounded w-16"></div>
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
  counts: SessionDeckCounts;
}

const REVIEW_FILTERS: Array<{
  mode: SessionDeckMode;
  label: string;
  emptyLabel: string;
}> = [
  { mode: "all", label: "Todo", emptyLabel: "No hay tarjetas para este modo" },
  {
    mode: "phrases",
    label: "Solo frases",
    emptyLabel: "No hay frases para repasar ahora",
  },
  {
    mode: "new",
    label: "Solo nuevas",
    emptyLabel: "No quedan tarjetas nuevas disponibles",
  },
  {
    mode: "due",
    label: "Solo vencidas",
    emptyLabel: "No hay repasos vencidos ahora mismo",
  },
];

function isSessionDeckMode(value: string | null): value is SessionDeckMode {
  return (
    value === "all" || value === "phrases" || value === "new" || value === "due"
  );
}

function ReviewFilters({
  activeMode,
  counts,
  onChange,
}: {
  activeMode: SessionDeckMode;
  counts: SessionDeckCounts;
  onChange: (mode: SessionDeckMode) => void;
}) {
  return (
    <div className="mb-8 flex flex-wrap justify-center gap-3">
      {REVIEW_FILTERS.map((filter) => {
        const isActive = filter.mode === activeMode;

        return (
          <button
            key={filter.mode}
            type="button"
            onClick={() => onChange(filter.mode)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
              isActive
                ? "border-indigo-600 bg-indigo-600 text-white"
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
  );
}

export default function Review() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<ReviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [words, setWords] = useState<WordEntry[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const searchMode = searchParams.get("mode");
  const activeMode: SessionDeckMode = isSessionDeckMode(searchMode)
    ? searchMode
    : "all";

  // Load data on mount
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const { deck, limitReached, stats, counts } =
          await generateSessionDeck(activeMode);

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
          counts,
        });
        setWords(formattedDeck);
        setCurrentWordIndex(0);
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
  }, [activeMode]);

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

  const handleModeChange = (mode: SessionDeckMode) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);

      if (mode === "all") {
        next.delete("mode");
      } else {
        next.set("mode", mode);
      }

      next.delete("word");
      return next;
    });
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
  const counts = data?.counts ?? {
    all: 0,
    phrases: 0,
    new: 0,
    due: 0,
  };
  const activeFilter = REVIEW_FILTERS.find(
    (filter) => filter.mode === activeMode
  );

  // ============================================================
  // ESTADO: SIN PALABRAS (Dos variantes: Fin real o Límite)
  // ============================================================
  if (words.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <ReviewFilters
            activeMode={activeMode}
            counts={counts}
            onChange={handleModeChange}
          />

          {/* ÍCONO */}
          <div
            className={`w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center border shadow-sm ${
              limitReached
                ? "bg-amber-100 border-amber-200"
                : "bg-indigo-100 border-indigo-200"
            }`}
          >
            <span className="text-4xl">{limitReached ? "🛑" : "🎉"}</span>
          </div>

          {/* TÍTULO */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {limitReached ? "Límite diario alcanzado" : "¡Todo al día!"}
          </h2>

          {/* DESCRIPCIÓN */}
          <p className="text-gray-600 mb-8">
            {counts[activeMode] === 0 && activeMode !== "all"
              ? activeFilter?.emptyLabel
              : limitReached
                ? `Has estudiado ${dailyStats.newCardsStudied} palabras nuevas hoy. Es importante descansar para asimilar lo aprendido.`
                : "No hay más repasos pendientes por ahora. Has hecho un excelente trabajo manteniendo tu rutina."}
          </p>

          {/* TARJETA DE ESTADÍSTICAS DIARIAS */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
            <div className="grid grid-cols-2 gap-4 divide-x divide-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-1">
                  {dailyStats.newCardsStudied}
                </div>
                <div className="text-xs uppercase tracking-wider text-gray-500">
                  Nuevas Hoy
                </div>
              </div>
              <div className="text-center pl-4">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {/* Aquí podrías sumar repasos si guardaras esa estadística en dailyStats también */}
                  Done
                </div>
                <div className="text-xs uppercase tracking-wider text-gray-500">
                  Estado
                </div>
              </div>
            </div>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/words"
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <span>📚 Gestionar vocabulario</span>
            </Link>

            {/* Si hay límite alcanzado, sugerimos seguir leyendo */}
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 font-medium rounded-xl bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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
        activeMode={activeMode}
        counts={counts}
        onModeChange={handleModeChange}
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
