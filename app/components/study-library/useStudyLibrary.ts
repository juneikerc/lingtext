import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { deletePhrase, deleteWord, getSettings } from "~/services/db";
import type { WordEntry } from "~/types";
import { speak } from "~/utils/tts";

import type {
  LibraryView,
  SortOption,
  StudyLibraryStats,
  UnknownWordsSectionProps,
} from "./types";
import {
  getSearchableText,
  INITIAL_VISIBLE_ITEMS,
  matchesView,
  SORT_OPTIONS,
  VIEW_OPTIONS,
  VISIBLE_ITEMS_STEP,
  MAX_WORDS_FOR_STORY,
} from "./utils";

export function useStudyLibrary({
  words,
  dailyStats,
  newCardsPerDay,
  onNewCardsPerDayChange,
  onRemove,
  onRemoveMany,
}: UnknownWordsSectionProps) {
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<LibraryView>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [visibleItems, setVisibleItems] = useState(INITIAL_VISIBLE_ITEMS);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [newCardsInput, setNewCardsInput] = useState(String(newCardsPerDay));
  const [isSavingNewCardsLimit, setIsSavingNewCardsLimit] = useState(false);
  const [showAlphaWarning, setShowAlphaWarning] = useState(true);
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

  const stats = useMemo<StudyLibraryStats>(() => {
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

  const loadMore = () => {
    setVisibleItems((current) => current + VISIBLE_ITEMS_STEP);
  };

  return {
    selectedWords,
    searchQuery,
    setSearchQuery,
    activeView,
    setActiveView,
    sortBy,
    setSortBy,
    newCardsInput,
    setNewCardsInput,
    isSavingNewCardsLimit,
    showAlphaWarning,
    setShowAlphaWarning,
    stats,
    viewCounts,
    sortedWords,
    visibleWords,
    selectedEntries,
    selectedInViewCount,
    hasMoreItems,
    isStoryDisabled,
    isBulkProcessing,
    activeSortLabel,
    activeViewLabel,
    toggleWordSelection,
    selectFilteredWords,
    clearSelection,
    handleSingleDelete,
    handleBulkDelete,
    handlePlayAudio,
    persistNewCardsLimit,
    loadMore,
  };
}
