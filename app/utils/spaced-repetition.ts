import type { WordEntry, SpacedRepetitionData } from "~/types";

export type ReviewGrade = "again" | "hard" | "good" | "easy";

export interface ReviewGradeOption {
  id: ReviewGrade;
  label: string;
  shortLabel: string;
  quality: number;
}

export const REVIEW_GRADE_OPTIONS: ReviewGradeOption[] = [
  { id: "again", label: "Again", shortLabel: "Otra vez", quality: 1 },
  { id: "hard", label: "Hard", shortLabel: "Difícil", quality: 3 },
  { id: "good", label: "Good", shortLabel: "Bien", quality: 4 },
  { id: "easy", label: "Easy", shortLabel: "Fácil", quality: 5 },
];

/**
 * Determina si una palabra está lista para repaso
 * Si no tiene datos (es nueva), se considera lista.
 * Si tiene datos, se compara la fecha.
 */
export function isWordReadyForReview(word: WordEntry): boolean {
  if (!word.srData) return true; // Primera vez (Nueva)
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
    return `${days} día${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    return `${hours} h`;
  } else {
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return minutes > 0 ? `${minutes} min` : "< 1 min";
  }
}

export function formatReviewInterval(intervalInDays: number): string {
  if (intervalInDays < 1) {
    const totalMinutes = Math.max(1, Math.round(intervalInDays * 24 * 60));

    if (totalMinutes >= 60) {
      const hours = Math.round(totalMinutes / 60);
      return `${hours} h`;
    }

    return `${totalMinutes} min`;
  }

  if (intervalInDays < 30) {
    return `${Math.round(intervalInDays)} d`;
  }

  const months = intervalInDays / 30;
  if (months < 12) {
    return `${Math.round(months)} m`;
  }

  return `${Math.round(months / 12)} a`;
}

/**
 * Calcula estadísticas de palabras listas para repaso.
 * Útil para mostrar contadores en el UI.
 */
export function calculateReadyWords(words: WordEntry[]) {
  const ready = words.filter(isWordReadyForReview);
  return {
    ready: ready.length,
    total: words.length,
    percentage:
      words.length > 0 ? Math.round((ready.length / words.length) * 100) : 0,
  };
}

/**
 * Algoritmo SM-2 (Estilo Anki) Mejorado
 * * @param currentData Datos actuales de SR (undefined si es nueva)
 * @param quality Calidad de la respuesta: 0-5 (0=olvido total, 3=aprobado, 5=perfecto)
 */
export function calculateNextReview(
  currentData: SpacedRepetitionData | undefined,
  quality: number
): SpacedRepetitionData {
  const now = Date.now();

  // Valores por defecto si es una palabra nueva
  if (!currentData) {
    let initialInterval = 1;

    if (quality < 3) {
      initialInterval = 10 / (24 * 60);
    } else if (quality === 5) {
      initialInterval = 4;
    }

    return {
      easeFactor: 2.5,
      interval: initialInterval,
      repetitions: quality >= 3 ? 1 : 0,
      nextReview: now + initialInterval * 24 * 60 * 60 * 1000,
      reviewHistory: [{ date: now, quality, interval: initialInterval }],
    };
  }

  let { easeFactor, repetitions, interval } = currentData;

  if (quality < 3) {
    repetitions = 0;
    interval = 10 / (24 * 60);
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  } else if (quality === 3) {
    if (repetitions <= 1) {
      interval = Math.max(2, Math.round(interval * 1.2));
    } else {
      interval = Math.max(interval + 1, Math.round(interval * 1.2));
    }
    repetitions += 1;
    easeFactor = Math.max(1.3, easeFactor - 0.15);
  } else if (quality === 4) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6; // Salto clásico de Anki (1 día -> 6 días)
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
    easeFactor =
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  } else {
    if (repetitions === 0) {
      interval = 4;
    } else if (repetitions === 1) {
      interval = 8;
    } else {
      interval = Math.round(interval * easeFactor * 1.3);
    }
    repetitions += 1;
    easeFactor += 0.15;
  }

  if (easeFactor < 1.3) easeFactor = 1.3;

  // Calcular próxima fecha (timestamp)
  const nextReview = now + interval * 24 * 60 * 60 * 1000;

  // Mantener historial limitado a las últimas 20 revisiones para no llenar la DB
  const reviewHistory = [
    ...(currentData.reviewHistory || []),
    { date: now, quality, interval },
  ].slice(-20);

  return {
    easeFactor,
    interval,
    repetitions,
    nextReview,
    reviewHistory,
  };
}
