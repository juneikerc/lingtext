import {
  getAllUnknownWords,
  getAllPhrases,
  getDailyStats,
  type DailyStats,
} from "~/services/db";
import type { WordEntry, PhraseEntry } from "~/types";

// CONFIGURACIÓN: Aquí defines tu límite por defecto (ej. 15)
const DEFAULT_NEW_LIMIT = 7;

export async function generateSessionDeck(
  limitNew: number = DEFAULT_NEW_LIMIT
): Promise<{
  deck: WordEntry[];
  stats: DailyStats;
  limitReached: boolean;
}> {
  // 1. Cargar todo el contenido y las estadísticas
  const [words, phrases, dailyStats] = await Promise.all([
    getAllUnknownWords(),
    getAllPhrases(),
    getDailyStats(),
  ]);

  // Unificar palabras y frases
  const allItems = [...words, ...phrases] as WordEntry[];
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
  const remainingSlots = Math.max(0, limitNew - newCardsDoneToday);

  // Tomar solo las necesarias del montón de nuevas
  const newItemsToStudy = newItems.slice(0, remainingSlots);

  // ---------------------------------------------------------
  // PASO C: ARMAR EL MAZO FINAL
  // ---------------------------------------------------------

  // Opción 1: Estilo Clásico (Primero repasos, luego nuevas)
  const deck = [...reviewsDue, ...newItemsToStudy];

  /* Opción 2: Mezclado (Si prefieres que salgan salpicadas)
   const deck = [...reviewsDue, ...newItemsToStudy].sort(() => Math.random() - 0.5);
  */

  return {
    deck,
    stats: dailyStats,
    // True si hay más palabras nuevas disponibles pero el límite diario nos detuvo
    limitReached: remainingSlots === 0 && newItems.length > 0,
  };
}
