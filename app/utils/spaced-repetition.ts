import type { WordEntry, SpacedRepetitionData } from "~/types";

/**
 * Determina si una palabra está lista para repaso basado en su algoritmo de repetición espaciada
 */
export function isWordReadyForReview(word: WordEntry): boolean {
  if (!word.srData) return true; // Primera vez
  return Date.now() >= word.srData.nextReview;
}

/**
 * Formatea el tiempo restante hasta el próximo repaso
 */
export function formatTimeUntilReview(nextReview: number): string {
  const now = Date.now();
  const diff = nextReview - now;

  if (diff <= 0) return "Ahora";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) {
    return `${days} día${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hora${hours > 1 ? 's' : ''}`;
  } else {
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return minutes > 0 ? `${minutes} min` : "Menos de 1 minuto";
  }
}

/**
 * Calcula estadísticas de palabras listas para repaso
 */
export function calculateReadyWords(words: WordEntry[]) {
  const ready = words.filter(isWordReadyForReview);
  return {
    ready: ready.length,
    total: words.length,
    percentage: words.length > 0 ? Math.round((ready.length / words.length) * 100) : 0
  };
}

/**
 * Algoritmo de repetición espaciada (versión simplificada con 2 niveles)
 */
export function calculateNextReview(
  currentData: SpacedRepetitionData | undefined,
  quality: number // 1 = incorrecto, 5 = correcto
): SpacedRepetitionData {
  const now = Date.now();
  const easeFactor = currentData?.easeFactor ?? 2.5;
  const repetitions = currentData?.repetitions ?? 0;

  let newInterval: number;
  let newRepetitions: number;

  if (quality >= 3) {
    // Respuesta correcta
    if (repetitions === 0) {
      newInterval = 1; // Primera repetición exitosa: 1 día
      newRepetitions = 1;
    } else if (repetitions === 1) {
      newInterval = 3; // Segunda repetición exitosa: 3 días
      newRepetitions = 2;
    } else {
      // Repeticiones posteriores: intervalo progresivo
      newInterval = Math.round((currentData?.interval ?? 1) * easeFactor);
      newRepetitions = repetitions + 1;
    }
  } else {
    // Respuesta incorrecta
    newInterval = 1; // Reiniciar a 1 día
    newRepetitions = 0; // Reiniciar repeticiones
  }

  // Calcular próxima fecha de revisión
  const nextReview = now + (newInterval * 24 * 60 * 60 * 1000);

  // Agregar al historial
  const reviewHistory = currentData?.reviewHistory ?? [];
  reviewHistory.push({
    date: now,
    quality,
    interval: newInterval,
  });

  return {
    easeFactor: quality >= 3 ? easeFactor : 2.5, // Mantener o reiniciar factor de facilidad
    interval: newInterval,
    repetitions: newRepetitions,
    nextReview,
    reviewHistory: reviewHistory.slice(-10), // Mantener solo las últimas 10 revisiones
  };
}
