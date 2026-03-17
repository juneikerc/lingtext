import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  deletePhrase,
  deleteWord,
  getSettings,
  type DailyStats,
} from "~/services/db";
import type { WordEntry } from "~/types";
import { exportUnknownWordsCsv } from "~/utils/anki";
import {
  formatTimeUntilReview,
  isWordReadyForReview,
} from "~/utils/spaced-repetition";
import { speak } from "~/utils/tts";
import { isTranslationJson } from "~/helpers/isTranslationJson";
import StoryGenerator from "./StoryGenerator";

interface UnknownWordsSectionProps {
  words: WordEntry[];
  dailyStats: DailyStats;
  newCardsPerDay: number;
  onNewCardsPerDayChange: (newCardsPerDay: number) => Promise<void>;
  onRemove: (wordLower: string) => void;
  onRemoveMany: (wordLowers: string[]) => void;
}

type LibraryView = "all" | "new" | "due" | "phrases";
type SortOption = "newest" | "oldest" | "alpha" | "next-review";

const MAX_WORDS_FOR_STORY = 20;
const INITIAL_VISIBLE_ITEMS = 60;
const VISIBLE_ITEMS_STEP = 60;

const VIEW_OPTIONS: Array<{ id: LibraryView; label: string }> = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "due", label: "Due" },
  { id: "phrases", label: "Phrases" },
];

const SORT_OPTIONS: Array<{ id: SortOption; label: string }> = [
  { id: "newest", label: "Mas recientes" },
  { id: "oldest", label: "Mas antiguas" },
  { id: "alpha", label: "A-Z" },
  { id: "next-review", label: "Proximo repaso" },
];

function getTranslationSections(translation: string) {
  if (!isTranslationJson(translation)) {
    return null;
  }

  try {
    const parsed = JSON.parse(translation) as {
      info?: Record<string, string[]>;
    };

    if (!parsed.info) {
      return null;
    }

    return Object.entries(parsed.info).map(([category, translations]) => ({
      category,
      text: translations.join(", "),
    }));
  } catch {
    return null;
  }
}

function getSearchableText(word: WordEntry) {
  const sections = getTranslationSections(word.translation);

  if (!sections) {
    return `${word.word} ${word.translation}`.toLowerCase();
  }

  return `${word.word} ${sections
    .map((section) => `${section.category} ${section.text}`)
    .join(" ")}`.toLowerCase();
}

function getWordState(word: WordEntry, now: number) {
  if (!word.srData) {
    return "new";
  }

  if (word.srData.nextReview <= now) {
    return "due";
  }

  return "scheduled";
}

function matchesView(word: WordEntry, view: LibraryView, now: number) {
  if (view === "phrases") {
    return Boolean(word.isPhrase);
  }

  if (view === "new") {
    return !word.srData;
  }

  if (view === "due") {
    return Boolean(word.srData && word.srData.nextReview <= now);
  }

  return true;
}

function getReviewHref(view: LibraryView) {
  if (view === "all") {
    return "/review";
  }

  return `/review?mode=${view}`;
}

export default function UnknownWordsSection({
  words,
  dailyStats,
  newCardsPerDay,
  onNewCardsPerDayChange,
  onRemove,
  onRemoveMany,
}: UnknownWordsSectionProps) {
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [showStoryGenerator, setShowStoryGenerator] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<LibraryView>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [visibleItems, setVisibleItems] = useState(INITIAL_VISIBLE_ITEMS);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [newCardsInput, setNewCardsInput] = useState(String(newCardsPerDay));
  const [isSavingNewCardsLimit, setIsSavingNewCardsLimit] = useState(false);
  const deferredSearchQuery = useDeferredValue(
    searchQuery.trim().toLowerCase()
  );

  useEffect(() => {
    setNewCardsInput(String(newCardsPerDay));
  }, [newCardsPerDay]);

  useEffect(() => {
    const availableWordLowers = new Set(words.map((word) => word.wordLower));

    setSelectedWords((previous) => {
      const next = new Set(
        [...previous].filter((wordLower) => availableWordLowers.has(wordLower))
      );

      if (next.size === previous.size) {
        return previous;
      }

      return next;
    });
  }, [words]);

  useEffect(() => {
    setVisibleItems(INITIAL_VISIBLE_ITEMS);
  }, [activeView, deferredSearchQuery, sortBy]);

  const stats = useMemo(() => {
    const now = Date.now();
    const reviewsDue = words.filter(
      (word) => word.srData && word.srData.nextReview <= now
    ).length;
    const totalNewWordsInDb = words.filter((word) => !word.srData).length;
    const phrasesCount = words.filter((word) => word.isPhrase).length;
    const newQuotaRemaining = Math.max(
      0,
      newCardsPerDay - dailyStats.newCardsStudied
    );
    const newCardsAvailableToday = Math.min(
      newQuotaRemaining,
      totalNewWordsInDb
    );

    return {
      reviewsDue,
      newCardsAvailableToday,
      totalDueToday: reviewsDue + newCardsAvailableToday,
      totalCollection: words.length,
      newCardsDone: dailyStats.newCardsStudied,
      phrasesCount,
      scheduledCount: Math.max(
        0,
        words.length - reviewsDue - totalNewWordsInDb
      ),
    };
  }, [dailyStats.newCardsStudied, newCardsPerDay, words]);

  const viewCounts = useMemo(() => {
    const now = Date.now();

    return {
      all: words.length,
      new: words.filter((word) => matchesView(word, "new", now)).length,
      due: words.filter((word) => matchesView(word, "due", now)).length,
      phrases: words.filter((word) => matchesView(word, "phrases", now)).length,
    };
  }, [words]);

  const filteredWords = useMemo(() => {
    const now = Date.now();

    return words.filter((word) => {
      if (!matchesView(word, activeView, now)) {
        return false;
      }

      if (!deferredSearchQuery) {
        return true;
      }

      return getSearchableText(word).includes(deferredSearchQuery);
    });
  }, [activeView, deferredSearchQuery, words]);

  const sortedWords = useMemo(() => {
    const sorted = [...filteredWords];

    sorted.sort((left, right) => {
      if (sortBy === "oldest") {
        return left.addedAt - right.addedAt;
      }

      if (sortBy === "alpha") {
        return left.word.localeCompare(right.word, undefined, {
          sensitivity: "base",
        });
      }

      if (sortBy === "next-review") {
        const leftReview = left.srData?.nextReview ?? Number.POSITIVE_INFINITY;
        const rightReview =
          right.srData?.nextReview ?? Number.POSITIVE_INFINITY;

        if (leftReview !== rightReview) {
          return leftReview - rightReview;
        }

        return right.addedAt - left.addedAt;
      }

      return right.addedAt - left.addedAt;
    });

    return sorted;
  }, [filteredWords, sortBy]);

  const visibleWords = useMemo(
    () => sortedWords.slice(0, visibleItems),
    [sortedWords, visibleItems]
  );

  const selectedEntries = useMemo(
    () => words.filter((word) => selectedWords.has(word.wordLower)),
    [selectedWords, words]
  );

  const selectedInViewCount = useMemo(
    () =>
      filteredWords.filter((word) => selectedWords.has(word.wordLower)).length,
    [filteredWords, selectedWords]
  );

  const hasMoreItems = visibleItems < sortedWords.length;
  const isStoryDisabled =
    selectedWords.size === 0 || selectedWords.size > MAX_WORDS_FOR_STORY;

  const toggleWordSelection = (wordLower: string) => {
    setSelectedWords((previous) => {
      const next = new Set(previous);

      if (next.has(wordLower)) {
        next.delete(wordLower);
      } else {
        next.add(wordLower);
      }

      return next;
    });
  };

  const selectFilteredWords = () => {
    setSelectedWords((previous) => {
      const next = new Set(previous);

      for (const word of sortedWords) {
        next.add(word.wordLower);
      }

      return next;
    });
  };

  const clearSelection = () => {
    setSelectedWords(new Set());
  };

  const handleStoryGeneratorClose = () => {
    setShowStoryGenerator(false);
  };

  const handleStoryGeneratorSuccess = () => {
    setSelectedWords(new Set());
  };

  const handleSingleDelete = async (word: WordEntry) => {
    const confirmed = window.confirm(
      `Eliminar ${word.isPhrase ? "la frase" : "la palabra"} "${word.word}"?`
    );

    if (!confirmed) {
      return;
    }

    if (word.isPhrase) {
      await deletePhrase(word.wordLower);
    } else {
      await deleteWord(word.wordLower);
    }

    setSelectedWords((previous) => {
      if (!previous.has(word.wordLower)) {
        return previous;
      }

      const next = new Set(previous);
      next.delete(word.wordLower);
      return next;
    });
    onRemove(word.wordLower);
  };

  const handleBulkDelete = async () => {
    if (selectedEntries.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Eliminar ${selectedEntries.length} elemento(s) seleccionados?`
    );

    if (!confirmed) {
      return;
    }

    setIsBulkProcessing(true);

    try {
      await Promise.all(
        selectedEntries.map((entry) =>
          entry.isPhrase
            ? deletePhrase(entry.wordLower)
            : deleteWord(entry.wordLower)
        )
      );
      onRemoveMany(selectedEntries.map((entry) => entry.wordLower));
      setSelectedWords(new Set());
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handlePlayAudio = async (word: string) => {
    const settings = await getSettings();
    await speak(word, settings.tts);
  };

  const persistNewCardsLimit = async () => {
    const parsedValue = Number.parseInt(newCardsInput, 10);
    const nextValue = Number.isFinite(parsedValue)
      ? Math.min(100, Math.max(0, parsedValue))
      : newCardsPerDay;

    setNewCardsInput(String(nextValue));

    if (nextValue === newCardsPerDay) {
      return;
    }

    setIsSavingNewCardsLimit(true);

    try {
      await onNewCardsPerDayChange(nextValue);
    } finally {
      setIsSavingNewCardsLimit(false);
    }
  };

  const activeSortLabel =
    SORT_OPTIONS.find((option) => option.id === sortBy)?.label ??
    "Mas recientes";
  const activeViewLabel =
    VIEW_OPTIONS.find((option) => option.id === activeView)?.label ?? "All";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-indigo-500/10 dark:bg-indigo-400/5 blur-3xl"></div>
          <div className="absolute -bottom-24 right-1/3 h-96 w-96 rounded-full bg-sky-500/10 dark:bg-sky-400/5 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 self-start rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-950"
            >
              <span className="text-lg">←</span>
              <span>Volver</span>
            </Link>

            <div className="flex flex-wrap gap-3">
              <Link
                to={getReviewHref(activeView)}
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white transition-colors duration-200 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
              >
                {activeView === "all"
                  ? "Estudiar hoy"
                  : `Repasar ${activeViewLabel}`}
              </Link>
              <button
                type="button"
                onClick={() => void exportUnknownWordsCsv(words)}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-950"
              >
                Exportar biblioteca
              </button>
            </div>
          </div>

          <div className="mb-8 text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100 md:text-4xl">
              Biblioteca de estudio
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-400">
              Organiza tu vocabulario como una cola de estudio real: busca,
              filtra, ordena y lanza sesiones segun el tipo de tarjeta que
              quieras trabajar.
            </p>
          </div>

          {words.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-indigo-200 bg-indigo-100 text-4xl dark:border-indigo-800 dark:bg-indigo-900/20">
                <span>📚</span>
              </div>
              <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
                Tu biblioteca esta vacia
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-gray-600 dark:text-gray-400">
                Marca palabras o frases mientras lees y volveran aqui listas
                para repasar, exportar o convertir en historias.
              </p>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-950"
              >
                <span>📖 Leer mas textos</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-xl border border-amber-100 bg-amber-50 p-5 text-center dark:border-amber-900/30 dark:bg-amber-900/10">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {stats.reviewsDue}
                  </div>
                  <div className="text-sm font-medium text-amber-800 dark:text-amber-300">
                    Due
                  </div>
                </div>
                <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5 text-center dark:border-indigo-900/30 dark:bg-indigo-900/10">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {stats.newCardsAvailableToday}
                  </div>
                  <div className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
                    New para hoy
                  </div>
                  <div className="mt-1 text-xs text-indigo-600/80 dark:text-indigo-300/80">
                    {stats.newCardsDone}/{newCardsPerDay} ya estudiadas
                  </div>
                </div>
                <div className="rounded-xl border border-sky-100 bg-sky-50 p-5 text-center dark:border-sky-900/30 dark:bg-sky-900/10">
                  <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                    {stats.phrasesCount}
                  </div>
                  <div className="text-sm font-medium text-sky-800 dark:text-sky-300">
                    Phrases
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5 text-center dark:border-gray-800 dark:bg-gray-900">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.totalCollection}
                  </div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total guardadas
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-5 rounded-xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-900/30 dark:bg-indigo-900/10">
                  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                        Nuevas por dia en review
                      </h3>
                      <p className="mt-1 text-sm text-indigo-700/80 dark:text-indigo-300/80">
                        Ajusta cuantas tarjetas nuevas sin repasar entran en la
                        sesion diaria.
                      </p>
                    </div>

                    <div className="flex items-end gap-3">
                      <div>
                        <label
                          htmlFor="new-cards-per-day"
                          className="mb-2 block text-xs font-medium uppercase tracking-wider text-indigo-800 dark:text-indigo-300"
                        >
                          Limite diario
                        </label>
                        <input
                          id="new-cards-per-day"
                          type="number"
                          min={0}
                          max={100}
                          inputMode="numeric"
                          value={newCardsInput}
                          onChange={(event) =>
                            setNewCardsInput(event.target.value)
                          }
                          onBlur={() => void persistNewCardsLimit()}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.currentTarget.blur();
                            }
                          }}
                          className="w-28 rounded-xl border border-indigo-200 bg-white px-4 py-3 text-gray-900 outline-none transition-colors duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-indigo-800 dark:bg-gray-950 dark:text-gray-100"
                        />
                      </div>
                      <div className="pb-3 text-xs text-indigo-700/80 dark:text-indigo-300/80">
                        {isSavingNewCardsLimit
                          ? "Guardando..."
                          : "Enter o blur para guardar"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div className="flex-1">
                    <label
                      htmlFor="words-search"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Buscar en expresion o significado
                    </label>
                    <input
                      id="words-search"
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Ej. take off, remember, phrasal verb..."
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-colors duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500"
                    />
                  </div>

                  <div className="w-full lg:w-64">
                    <label
                      htmlFor="words-sort"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Orden
                    </label>
                    <select
                      id="words-sort"
                      value={sortBy}
                      onChange={(event) =>
                        setSortBy(event.target.value as SortOption)
                      }
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-colors duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-5 flex flex-wrap gap-3">
                  {VIEW_OPTIONS.map((option) => {
                    const isActive = option.id === activeView;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setActiveView(option.id)}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 ${
                          isActive
                            ? "border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-gray-800"
                        }`}
                      >
                        <span>{option.label}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {viewCounts[option.id]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/60 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {selectedWords.size > 0
                        ? `${selectedWords.size} seleccionadas`
                        : `${sortedWords.length} resultado(s)`}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Vista activa: {activeViewLabel} · Orden: {activeSortLabel}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={selectFilteredWords}
                      disabled={sortedWords.length === 0}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      Seleccionar resultados
                    </button>
                    <button
                      type="button"
                      onClick={clearSelection}
                      disabled={selectedWords.size === 0}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      Limpiar seleccion
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        void exportUnknownWordsCsv(selectedEntries)
                      }
                      disabled={selectedWords.size === 0}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      Exportar seleccion
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowStoryGenerator(true)}
                      disabled={isStoryDisabled}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 dark:disabled:bg-gray-800 dark:disabled:text-gray-500"
                    >
                      Generar historia
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleBulkDelete()}
                      disabled={selectedWords.size === 0 || isBulkProcessing}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 dark:disabled:bg-gray-800 dark:disabled:text-gray-500"
                    >
                      Eliminar seleccion
                    </button>
                  </div>
                </div>

                {selectedWords.size > MAX_WORDS_FOR_STORY ? (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-300">
                    Para generar historias, deja la seleccion en{" "}
                    {MAX_WORDS_FOR_STORY}
                    tarjetas o menos. Las acciones masivas siguen funcionando.
                  </div>
                ) : null}
              </div>

              {sortedWords.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <div className="mb-3 text-4xl">🔎</div>
                  <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                    No hay resultados para esta vista
                  </h2>
                  <p className="mb-6 text-gray-600 dark:text-gray-400">
                    Prueba otra vista, limpia la busqueda o cambia el orden para
                    encontrar lo que buscas.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      Limpiar busqueda
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveView("all")}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-indigo-700"
                    >
                      Volver a All
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex flex-col gap-3 border-b border-gray-200 px-6 py-4 dark:border-gray-800 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">
                        Biblioteca activa
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Mostrando {visibleWords.length} de {sortedWords.length}{" "}
                        · {selectedInViewCount} seleccionadas en esta vista
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Render incremental para listas largas
                    </div>
                  </div>

                  <div className="divide-y divide-gray-200/70 dark:divide-gray-800">
                    {visibleWords.map((word) => {
                      const now = Date.now();
                      const translationSections = getTranslationSections(
                        word.translation
                      );
                      const wordState = getWordState(word, now);

                      return (
                        <div
                          key={word.wordLower}
                          className={`p-5 transition-colors duration-200 ${
                            selectedWords.has(word.wordLower)
                              ? "bg-indigo-50/70 dark:bg-indigo-900/10"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          }`}
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex min-w-0 flex-1 gap-4">
                              <input
                                type="checkbox"
                                checked={selectedWords.has(word.wordLower)}
                                onChange={() =>
                                  toggleWordSelection(word.wordLower)
                                }
                                className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-700"
                              />

                              <div className="min-w-0 flex-1">
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                  <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                    {word.word}
                                  </h4>
                                  {word.isPhrase ? (
                                    <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-700 dark:bg-sky-900/20 dark:text-sky-300">
                                      Phrase
                                    </span>
                                  ) : null}
                                  {wordState === "due" ? (
                                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                                      Due
                                    </span>
                                  ) : null}
                                  {wordState === "new" ? (
                                    <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300">
                                      New
                                    </span>
                                  ) : null}
                                  {wordState === "scheduled" ? (
                                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                                      Scheduled
                                    </span>
                                  ) : null}
                                </div>

                                {translationSections ? (
                                  <div className="mb-3 space-y-2">
                                    {translationSections.map((section) => (
                                      <div key={section.category}>
                                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                          {section.category}
                                        </p>
                                        <p className="text-gray-900 dark:text-gray-100">
                                          {section.text}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="mb-3 text-gray-600 dark:text-gray-400">
                                    {word.translation}
                                  </p>
                                )}

                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                  <span>
                                    Guardada{" "}
                                    {new Date(
                                      word.addedAt
                                    ).toLocaleDateString()}
                                  </span>
                                  {word.srData ? (
                                    <span>
                                      Proximo:{" "}
                                      {formatTimeUntilReview(
                                        word.srData.nextReview
                                      )}
                                    </span>
                                  ) : (
                                    <span>Lista para primera pasada</span>
                                  )}
                                  {isWordReadyForReview(word) && word.srData ? (
                                    <span className="font-medium text-amber-600 dark:text-amber-300">
                                      Repaso pendiente
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                              <button
                                type="button"
                                onClick={() => void handlePlayAudio(word.word)}
                                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
                              >
                                🔊 Escuchar
                              </button>
                              {wordState === "due" || wordState === "new" ? (
                                <Link
                                  to={`/review?mode=${wordState}&word=${encodeURIComponent(word.wordLower)}`}
                                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
                                >
                                  Abrir review
                                </Link>
                              ) : null}
                              <button
                                type="button"
                                onClick={() => void handleSingleDelete(word)}
                                className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors duration-200 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30 dark:focus-visible:ring-offset-gray-900"
                              >
                                🗑 Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {hasMoreItems ? (
                    <div className="border-t border-gray-200 px-6 py-4 text-center dark:border-gray-800">
                      <button
                        type="button"
                        onClick={() =>
                          setVisibleItems(
                            (current) => current + VISIBLE_ITEMS_STEP
                          )
                        }
                        className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
                      >
                        Cargar{" "}
                        {Math.min(
                          VISIBLE_ITEMS_STEP,
                          sortedWords.length - visibleItems
                        )}{" "}
                        mas
                      </button>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showStoryGenerator ? (
        <StoryGenerator
          selectedWords={Array.from(selectedWords)}
          words={words}
          onClose={handleStoryGeneratorClose}
          onSuccess={handleStoryGeneratorSuccess}
        />
      ) : null}
    </div>
  );
}
