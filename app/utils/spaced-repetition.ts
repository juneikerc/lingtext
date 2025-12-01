import type { WordEntry, SpacedRepetitionData } from "~/types";

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
    // Si la calidad es baja (<3), programamos para muy pronto (ej. 1 hora o 1 día)
    // Si es alta, empezamos con 1 día.
    const initialInterval = quality >= 3 ? 1 : 0.04; // 0.04 días ~= 1 hora

    return {
      easeFactor: 2.5,
      interval: initialInterval,
      repetitions: quality >= 3 ? 1 : 0,
      nextReview: now + initialInterval * 24 * 60 * 60 * 1000,
      reviewHistory: [{ date: now, quality, interval: initialInterval }],
    };
  }

  let { easeFactor, repetitions, interval } = currentData;

  if (quality >= 3) {
    // --- RESPUESTA CORRECTA ---
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6; // Salto clásico de Anki (1 día -> 6 días)
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;

    // Ajustar Ease Factor (fórmula estándar SM-2)
    // EF' = EF + (0.1 - (5-q) * (0.08 + (5-q)*0.02))
    easeFactor =
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    // No dejar que el factor baje de 1.3 (para evitar el "infierno de repasos")
    if (easeFactor < 1.3) easeFactor = 1.3;
  } else {
    // --- RESPUESTA INCORRECTA ---
    repetitions = 0;
    interval = 1; // Reiniciar a 1 día
    // Nota: En implementaciones estrictas de Anki, a veces se reduce el Ease Factor aquí,
    // pero mantenerlo suele ser menos frustrante para el usuario.
  }

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
