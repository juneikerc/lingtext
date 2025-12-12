import {
  getAllUnknownWords,
  getAllPhrases,
  getDailyStats,
  type DailyStats,
} from "~/services/db";
import type { Route } from "./+types/words";
import { useState, useEffect, Suspense, lazy } from "react";
import type { WordEntry } from "~/types";

const UnknownWordsSection = lazy(
  () => import("~/components/UnknownWordsSection")
);

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Gestión de vocabulario | LingText" },
    {
      name: "description",
      content:
        "Gestiona tus palabras desconocidas marcadas durante tu tiempo de lectura.",
    },
    {
      name: "robots",
      content: "noindex",
    },
  ];
}

// Skeleton component for loading state
function WordsSkeleton() {
  return (
    <section className="relative overflow-hidden py-12 px-4 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-sky-500/10 dark:bg-sky-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-800">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
            Cargando vocabulario...
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-gray-100">
            Tu{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              Vocabulario
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Preparando tu lista de palabras...
          </p>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 animate-pulse shadow-sm"
            >
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto mb-2"></div>
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-20 mx-auto"></div>
            </div>
          ))}
        </div>

        {/* Word cards skeleton */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl animate-pulse"
              >
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-48"></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Words() {
  const [words, setWords] = useState<WordEntry[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [wordsData, phrases, stats] = await Promise.all([
          getAllUnknownWords(),
          getAllPhrases(),
          getDailyStats(),
        ]);

        if (!mounted) return;

        const phraseWords = phrases.map((p) => ({
          word: p.phrase,
          wordLower: p.phraseLower,
          translation: p.translation,
          status: "unknown" as const,
          addedAt: p.addedAt,
          srData: p.srData,
          isPhrase: true,
        }));

        setWords([...wordsData, ...phraseWords]);
        setDailyStats(stats);
      } catch (error) {
        console.error("[Words] Failed to load data:", error);
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

  const handleRemove = (wordLower: string) => {
    setWords((prev) => prev.filter((w) => w.wordLower !== wordLower));
  };

  if (isLoading) {
    return <WordsSkeleton />;
  }

  // Default stats if not loaded
  const stats = dailyStats ?? {
    date: new Date().toISOString().split("T")[0],
    newCardsStudied: 0,
  };

  return (
    <Suspense fallback={<WordsSkeleton />}>
      <UnknownWordsSection
        words={words}
        dailyStats={stats}
        onRemove={handleRemove}
      />
    </Suspense>
  );
}
