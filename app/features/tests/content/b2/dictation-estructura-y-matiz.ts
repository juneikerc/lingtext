import { defineTest } from "../define-test";

export default defineTest({
  level: "b2",
  skill: "dictation",
  title: "Dictado con estructura flexible y mas matiz",
  summary:
    "Escucha frases con modales, comparaciones y orden mas variable sin perder precision.",
  intro:
    "El foco esta en sostener comprension auditiva cuando la frase ya no sigue un patron tan simple.",
  questions: [
    {
      id: "b2-dictation-1",
      type: "dictation",
      prompt: "Listen and write the sentence.",
      transcript: "The results were better than we expected",
      maxAttempts: 5,
      hintLabel: "Comparison and expectations",
      points: 25,
    },
    {
      id: "b2-dictation-2",
      type: "dictation",
      prompt: "Listen and write the sentence.",
      transcript: "She might have missed the earlier train",
      maxAttempts: 5,
      hintLabel: "Possibility in the past",
      points: 25,
    },
    {
      id: "b2-dictation-3",
      type: "dictation",
      prompt: "Listen and write the sentence.",
      transcript: "We need a clearer strategy for growth",
      maxAttempts: 5,
      hintLabel: "Business planning",
      points: 25,
    },
    {
      id: "b2-dictation-4",
      type: "dictation",
      prompt: "Listen and write the sentence.",
      transcript: "He rarely speaks unless it is necessary",
      maxAttempts: 5,
      hintLabel: "Habit and condition",
      points: 25,
    },
  ],
});
