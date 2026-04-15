import type { TestDefinition, TestResultBand } from "../types";

const DEFAULT_RESULT_BANDS: TestResultBand[] = [
  {
    minScore: 85,
    label: "Fuerte",
    summary:
      "Mantienes buen control para este nivel. Ya puedes combinar este test con lectura real en LingText.",
  },
  {
    minScore: 60,
    label: "En progreso",
    summary:
      "Tienes base util, pero aun hay patrones que conviene reforzar con practica frecuente.",
  },
  {
    minScore: 0,
    label: "Por reforzar",
    summary:
      "Este nivel todavia exige apoyo. Te conviene alternar tests cortos con lecturas mas guiadas.",
  },
];

type TestDraft = Omit<
  TestDefinition,
  "instructions" | "durationMinutes" | "resultBands"
> &
  Partial<
    Pick<TestDefinition, "instructions" | "durationMinutes" | "resultBands">
  >;

export function defineTest(test: TestDraft): TestDefinition {
  return {
    ...test,
    instructions:
      test.instructions ??
      (test.skill === "dictation"
        ? "Escucha la frase, escribe exactamente lo que oyes y usa las pistas solo cuando las necesites."
        : "Responde cada pregunta y avanza para ver tu resultado final al terminar la sesion."),
    durationMinutes:
      test.durationMinutes ?? (test.skill === "dictation" ? 6 : 5),
    resultBands: test.resultBands ?? DEFAULT_RESULT_BANDS,
  };
}
