import {
  getAllUnknownWords,
  getAllPhrases,
  getDailyStats,
  getSettings,
  type DailyStats,
} from "~/services/db";
import type { WordEntry } from "~/types";
import { DEFAULT_NEW_CARDS_PER_DAY } from "~/services/db/settings";

export type SessionDeckMode = "all" | "phrases" | "new" | "due";

export interface SessionDeckCounts {
  all: number;
  phrases: number;
  new: number;
  due: number;
}

function buildDeckForMode(
  mode: SessionDeckMode,
  reviewsDue: WordEntry[],
  newItemsToStudy: WordEntry[]
): WordEntry[] {
  if (mode === "phrases") {
    return [...reviewsDue, ...newItemsToStudy].filter((item) => item.isPhrase);
  }

  if (mode === "new") {
    return newItemsToStudy;
  }

  if (mode === "due") {
    return reviewsDue;
  }

  return [...reviewsDue, ...newItemsToStudy];
}

export async function generateSessionDeck(
  mode: SessionDeckMode = "all",
  limitNew?: number
): Promise<{
  deck: WordEntry[];
  stats: DailyStats;
  limitReached: boolean;
  counts: SessionDeckCounts;
}> {
  // 1. Cargar todo el contenido y las estadísticas
  const [words, phrases, dailyStats, settings] = await Promise.all([
    getAllUnknownWords(),
    getAllPhrases(),
    getDailyStats(),
    getSettings(),
  ]);
  const effectiveNewLimit = Math.max(
    0,
    limitNew ?? settings.review.newCardsPerDay ?? DEFAULT_NEW_CARDS_PER_DAY
  );

  // Unificar palabras y frases
  const phraseItems: WordEntry[] = phrases.map((phrase) => ({
    word: phrase.phrase,
    wordLower: phrase.phraseLower,
    translation: phrase.translation,
    status: "unknown",
    addedAt: phrase.addedAt,
    srData: phrase.srData,
    isPhrase: true,
  }));
  const allItems = [...words, ...phraseItems];
  const now = Date.now();

  // ---------------------------------------------------------
  // PASO A: REPASOS (Prioridad Máxima - Sin límite)
  // Incluimos TODAS las palabras cuya fecha de revisión ya pasó
  // ---------------------------------------------------------
  const reviewsDue = allItems
    .filter((item) => item.srData && item.srData.nextReview <= now)
    .sort((a, b) => a.srData!.nextReview - b.srData!.nextReview); // Las más antiguas primero

  // ---------------------------------------------------------
  // PASO B: NUEVAS TARJETAS (Limitadas por día)
  // Son las que no tienen srData
  // ---------------------------------------------------------
  const newItems = allItems.filter((item) => !item.srData);

  // Ver cuántas nuevas ya estudiamos hoy según la DB
  const newCardsDoneToday = dailyStats.newCardsStudied;

  // Calcular cupo restante (Ej: 15 límite - 5 hechas = 10 restantes)
  const remainingSlots = Math.max(0, effectiveNewLimit - newCardsDoneToday);

  // Tomar solo las necesarias del montón de nuevas
  const newItemsToStudy = newItems.slice(0, remainingSlots);

  // ---------------------------------------------------------
  // PASO C: ARMAR EL MAZO FINAL
  // ---------------------------------------------------------

  // Opción 1: Estilo Clásico (Primero repasos, luego nuevas)
  const deck = buildDeckForMode(mode, reviewsDue, newItemsToStudy);

  const counts: SessionDeckCounts = {
    all: buildDeckForMode("all", reviewsDue, newItemsToStudy).length,
    phrases: buildDeckForMode("phrases", reviewsDue, newItemsToStudy).length,
    new: buildDeckForMode("new", reviewsDue, newItemsToStudy).length,
    due: buildDeckForMode("due", reviewsDue, newItemsToStudy).length,
  };

  /* Opción 2: Mezclado (Si prefieres que salgan salpicadas)
   const deck = [...reviewsDue, ...newItemsToStudy].sort(() => Math.random() - 0.5);
  */

  return {
    deck,
    stats: dailyStats,
    counts,
    // True si hay más palabras nuevas disponibles pero el límite diario nos detuvo
    limitReached: remainingSlots === 0 && newItems.length > 0,
  };
}
