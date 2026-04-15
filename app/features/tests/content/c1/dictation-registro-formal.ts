import { defineTest } from "../define-test";

export default defineTest({
  level: "c1",
  skill: "dictation",
  title: "Dictado avanzado con registro formal",
  summary:
    "Escucha frases mas densas y valida precision en estructuras largas y tono elevado.",
  intro:
    "El dictado de C1 obliga a sostener detalle, ritmo y ortografia cuando la frase ya lleva mas carga informativa.",
  questions: [
    {
      id: "c1-dictation-1",
      type: "dictation",
      prompt: "Listen and write the sentence.",
      transcript: "The proposal was revised in light of recent data",
      maxAttempts: 5,
      hintLabel: "Formal register",
      points: 25,
    },
    {
      id: "c1-dictation-2",
      type: "dictation",
      prompt: "Listen and write the sentence.",
      transcript: "Few people had anticipated such a rapid shift",
      maxAttempts: 5,
      hintLabel: "Prediction and change",
      points: 25,
    },
    {
      id: "c1-dictation-3",
      type: "dictation",
      prompt: "Listen and write the sentence.",
      transcript: "She rarely compromises unless the evidence is strong",
      maxAttempts: 5,
      hintLabel: "Condition and habit",
      points: 25,
    },
    {
      id: "c1-dictation-4",
      type: "dictation",
      prompt: "Listen and write the sentence.",
      transcript: "We should reassess the scope before moving ahead",
      maxAttempts: 5,
      hintLabel: "Project planning",
      points: 25,
    },
  ],
});
