import { isTranslationJson } from "~/helpers/isTranslationJson";
import type { WordEntry } from "~/types";

import type { LibraryView, SortOption } from "./types";

export const MAX_WORDS_FOR_STORY = 20;
export const INITIAL_VISIBLE_ITEMS = 60;
export const VISIBLE_ITEMS_STEP = 60;

export const VIEW_OPTIONS: Array<{ id: LibraryView; label: string }> = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "due", label: "Due" },
  { id: "phrases", label: "Phrases" },
];

export const SORT_OPTIONS: Array<{ id: SortOption; label: string }> = [
  { id: "newest", label: "Mas recientes" },
  { id: "oldest", label: "Mas antiguas" },
  { id: "alpha", label: "A-Z" },
  { id: "next-review", label: "Proximo repaso" },
];

export function getTranslationSections(translation: string) {
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

export function getSearchableText(word: WordEntry) {
  const sections = getTranslationSections(word.translation);

  if (!sections) {
    return `${word.word} ${word.translation}`.toLowerCase();
  }

  return `${word.word} ${sections
    .map((section) => `${section.category} ${section.text}`)
    .join(" ")}`.toLowerCase();
}

export function getWordState(word: WordEntry, now: number) {
  if (!word.srData) {
    return "new";
  }

  if (word.srData.nextReview <= now) {
    return "due";
  }

  return "scheduled";
}

export function matchesView(word: WordEntry, view: LibraryView, now: number) {
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

export function getReviewHref(view: LibraryView) {
  if (view === "all") {
    return "/review";
  }

  return `/review?mode=${view}`;
}
