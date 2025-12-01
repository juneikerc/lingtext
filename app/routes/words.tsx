import {
  getAllUnknownWords,
  getAllPhrases,
  getDailyStats,
} from "~/services/db";
import type { Route } from "./+types/words";
import { useState, Suspense, lazy } from "react";
import type { WordEntry } from "~/types";
import LoadingSpinner from "~/components/LoadingSpinner";

const UnknownWordsSection = lazy(
  () => import("~/components/UnknownWordsSection")
);

export async function clientLoader() {
  // Cargamos palabras, frases y estadísticas del día en paralelo
  const [words, phrases, dailyStats] = await Promise.all([
    getAllUnknownWords(),
    getAllPhrases(),
    getDailyStats(),
  ]);

  const phraseWords = phrases.map((p) => ({
    word: p.phrase,
    wordLower: p.phraseLower,
    translation: p.translation,
    status: "unknown" as const,
    addedAt: p.addedAt,
    srData: p.srData,
    isPhrase: true,
  }));

  return {
    words: [...words, ...phraseWords],
    dailyStats, // <--- PASAMOS LAS ESTADÍSTICAS AL COMPONENTE
  };
}

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

export default function Words({ loaderData }: Route.ComponentProps) {
  const { words: initialWords, dailyStats } = loaderData;
  const [words, setWords] = useState<WordEntry[]>(initialWords);

  const handleRemove = (wordLower: string) => {
    setWords((prev) => prev.filter((w) => w.wordLower !== wordLower));
  };

  return (
    <Suspense fallback={<LoadingSpinner message="Cargando vocabulario..." />}>
      <UnknownWordsSection
        words={words}
        dailyStats={dailyStats} // <--- PASAMOS EL PROP
        onRemove={handleRemove}
      />
    </Suspense>
  );
}
