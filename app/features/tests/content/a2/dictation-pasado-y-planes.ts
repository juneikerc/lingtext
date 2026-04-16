import { defineTest } from "../define-test";

export default defineTest({
  level: "a2",
  skill: "dictation",
  title: "Dictado cotidiano con pasado y planes",
  summary:
    "Escucha frases mas largas y consolida ortografia, contracciones y estructuras comunes.",
  intro:
    "Este dictado sube un poco la dificultad con frases de planes, experiencias recientes y contexto diario.",
  questions: [
    {
      id: "a2-dictation-1",
      type: "dictation",
      prompt: "Listen and write the sentence.",
      audioUrl: "/audio/tests/a2/a2-dictation-1.mp3",
      transcript: "We took the train to the coast",
      maxAttempts: 5,
      hintLabel: "Past trip",
      points: 25,
    },
    {
      id: "a2-dictation-2",
      type: "dictation",
      prompt: "Listen and write the sentence.",
      audioUrl: "/audio/tests/a2/a2-dictation-2.mp3",
      transcript: "My cousin is cooking dinner tonight",
      maxAttempts: 5,
      hintLabel: "Plan for tonight",
      points: 25,
    },
    {
      id: "a2-dictation-3",
      type: "dictation",
      prompt: "Listen and write the sentence.",
      audioUrl: "/audio/tests/a2/a2-dictation-3.mp3",
      transcript: "There are some books on the chair",
      maxAttempts: 5,
      hintLabel: "Objects at home",
      points: 25,
    },
    {
      id: "a2-dictation-4",
      type: "dictation",
      prompt: "Listen and write the sentence.",
      audioUrl: "/audio/tests/a2/a2-dictation-4.mp3",
      transcript: "I didn't call you after lunch",
      maxAttempts: 5,
      hintLabel: "Negative sentence in the past",
      points: 25,
    },
  ],
});
