import type { DailyStats } from "~/services/db";
import type { WordEntry } from "~/types";

export interface UnknownWordsSectionProps {
  words: WordEntry[];
  dailyStats: DailyStats;
  newCardsPerDay: number;
  onNewCardsPerDayChange: (newCardsPerDay: number) => Promise<void>;
  onRemove: (wordLower: string) => void;
  onRemoveMany: (wordLowers: string[]) => void;
}

export type LibraryView = "all" | "new" | "due" | "phrases";
export type SortOption = "newest" | "oldest" | "alpha" | "next-review";

export interface StudyLibraryStats {
  reviewsDue: number;
  newCardsAvailableToday: number;
  totalDueToday: number;
  totalCollection: number;
  newCardsDone: number;
  phrasesCount: number;
  scheduledCount: number;
}
