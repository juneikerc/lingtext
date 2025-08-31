import { getAllUnknownWords } from "~/db";
import type { Route } from "./+types/review";
import { useState, useEffect } from "react";
import type { WordEntry } from "~/types";
import ReviewMode from "~/components/ReviewMode";

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

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const allWords = await getAllUnknownWords();

  // Filtrar solo palabras listas para repaso
  const wordsReadyForReview = allWords.filter((word) => {
    // Primera vez que se ve la palabra
    if (!word.srData) return true;

    // Verificar si ya pasó la fecha del próximo repaso
    return Date.now() >= word.srData.nextReview;
  });

  // Ordenar por fecha de próximo repaso (las más antiguas primero)
  wordsReadyForReview.sort((a, b) => {
    const aNextReview = a.srData?.nextReview ?? 0;
    const bNextReview = b.srData?.nextReview ?? 0;
    return aNextReview - bNextReview;
  });

  const url = new URL(request.url);
  const selectedWord = url.searchParams.get("word");

  return {
    words: wordsReadyForReview,
    selectedWord,
    totalWords: allWords.length,
    readyWordsCount: wordsReadyForReview.length,
  };
}

export default function Review({ loaderData }: Route.ComponentProps) {
  const {
    words: initialWords,
    selectedWord,
    totalWords,
    readyWordsCount,
  } = loaderData;
  const [words, setWords] = useState<WordEntry[]>(initialWords);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Si hay una palabra específica seleccionada, empezamos con ella
  useEffect(() => {
    if (selectedWord) {
      const index = words.findIndex((w) => w.wordLower === selectedWord);
      if (index !== -1) {
        setCurrentWordIndex(index);
      }
    }
  }, [selectedWord, words]);

  const refreshWords = async () => {
    // Refrescar la página para obtener palabras actualizadas
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
    // Añadir la palabra al final de la lista para reintento
    setWords((prevWords) => [...prevWords, word]);
  };

  // Si no hay palabras listas para repaso
  if (words.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-gray-950 dark:via-purple-950/10 dark:to-pink-950/10 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center">
            <span className="text-4xl">⏰</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            No hay palabras para repasar
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Todas las palabras están programadas para repasos futuros. Has hecho
            un excelente trabajo manteniendo tu rutina de estudio.
          </p>

          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {readyWordsCount} / {totalWords}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                palabras listas para repaso
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/words"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
            >
              <span>📚 Gestionar vocabulario</span>
            </a>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <span>📖 Leer más textos</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ReviewMode
      words={words}
      currentIndex={currentWordIndex}
      onNext={nextWord}
      onPrev={prevWord}
      onRefresh={refreshWords}
      onRetryWord={handleRetryWord}
      totalWords={words.length}
    />
  );
}
