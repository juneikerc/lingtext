import { generateSessionDeck } from "~/utils/scheduler";
import type { Route } from "./+types/review";
import { useState, useEffect, Suspense, lazy } from "react";
import type { WordEntry, PhraseEntry } from "~/types";
import LoadingSpinner from "~/components/LoadingSpinner";
import { Link } from "react-router"; // Usamos Link para navegación interna más rápida

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

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  // 1. Usamos el Scheduler Inteligente
  const { deck, limitReached, stats } = await generateSessionDeck();

  // 2. Normalización: Asegurar que las frases tengan el flag 'isPhrase'
  // El scheduler devuelve WordEntry y PhraseEntry mezclados.
  // Detectamos frases por la existencia de la propiedad 'parts' (si tus tipos lo permiten)
  const formattedDeck = deck.map((item) => {
    // Si tiene 'parts', asumimos que es una frase (comprobación básica basada en tus tipos)
    if ("parts" in item) {
      return {
        ...item,
        isPhrase: true,
        status: "unknown", // Asegurar compatibilidad
      } as WordEntry & { isPhrase: boolean };
    }
    return item;
  });

  const url = new URL(request.url);
  const selectedWord = url.searchParams.get("word");

  return {
    words: formattedDeck,
    selectedWord,
    totalSessionWords: formattedDeck.length,
    limitReached, // Booleano: ¿Se detuvo por límite diario?
    dailyStats: stats, // Datos: { newCardsStudied: 5, date: ... }
  };
}

export default function Review({ loaderData }: Route.ComponentProps) {
  const {
    words: initialWords,
    selectedWord,
    totalSessionWords,
    limitReached,
    dailyStats,
  } = loaderData;

  const [words, setWords] = useState<WordEntry[]>(initialWords);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Si hay una palabra específica seleccionada por URL, intentamos saltar a ella
  useEffect(() => {
    if (selectedWord && words.length > 0) {
      const index = words.findIndex((w) => w.wordLower === selectedWord);
      if (index !== -1) {
        setCurrentWordIndex(index);
      }
    }
  }, [selectedWord, words]);

  const refreshWords = async () => {
    // Recargar para generar un nuevo mazo o actualizar estado
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
    // Añadir la palabra al final de la lista actual para reintento inmediato
    setWords((prevWords) => [...prevWords, word]);
  };

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
    <Suspense
      fallback={<LoadingSpinner message="Preparando sesión de estudio..." />}
    >
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
