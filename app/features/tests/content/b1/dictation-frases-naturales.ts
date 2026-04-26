import { defineTest } from "../define-test";

export default defineTest({
  level: "b1",
  skill: "dictation",
  title: "Dictado intermedio con frases naturales",
  summary:
    "Escucha oraciones mas fluidas y trabaja precision sin salir de un ingles todavia funcional.",
  intro:
    "El reto aqui ya no es solo oir palabras aisladas, sino seguir ritmo, orden y combinaciones frecuentes.",
  questions: [
    {
      id: "b1-dictation-1",
      type: "dictation",
      prompt: "Escucha y escribe la oración.",
      audioUrl: "/audio/tests/b1/b1-dictation-1.mp3",
      transcript: "I would rather stay home tonight",
      maxAttempts: 5,
      hintLabel: "Preference",
      points: 25,
    },
    {
      id: "b1-dictation-2",
      type: "dictation",
      prompt: "Escucha y escribe la oración.",
      audioUrl: "/audio/tests/b1/b1-dictation-2.mp3",
      transcript: "She has worked here since March",
      maxAttempts: 5,
      hintLabel: "Present perfect",
      points: 25,
    },
    {
      id: "b1-dictation-3",
      type: "dictation",
      prompt: "Escucha y escribe la oración.",
      audioUrl: "/audio/tests/b1/b1-dictation-3.mp3",
      transcript: "We need to make a quick decision",
      maxAttempts: 5,
      hintLabel: "Work context",
      points: 25,
    },
    {
      id: "b1-dictation-4",
      type: "dictation",
      prompt: "Escucha y escribe la oración.",
      audioUrl: "/audio/tests/b1/b1-dictation-4.mp3",
      transcript: "They were waiting outside the station",
      maxAttempts: 5,
      hintLabel: "Past continuous",
      points: 25,
    },
  ],
});
