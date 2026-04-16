import { defineTest } from "../define-test";

export default defineTest({
  level: "a1",
  skill: "dictation",
  title: "Primer dictado con frases cortas y claras",
  summary:
    "Escucha frases sencillas y completa el dictado con ayuda progresiva cuando haga falta.",
  intro:
    "Un dictado pensado para afinar el oido principiante con oraciones cortas y vocabulario muy frecuente.",
  questions: [
    {
      id: "a1-dictation-1",
      type: "dictation",
      prompt: "Listen and write the sentence.",
      audioUrl: "/audio/tests/a1/a1-dictation-1.mp3",
      transcript: "I like apples and bananas",
      maxAttempts: 5,
      hintLabel: "Daily food vocabulary",
      points: 25,
    },
    {
      id: "a1-dictation-2",
      type: "dictation",
      prompt: "Listen and write the sentence.",
      audioUrl: "/audio/tests/a1/a1-dictation-2.mp3",
      transcript: "My brother is at home",
      maxAttempts: 5,
      hintLabel: "Family and place",
      points: 25,
    },
    {
      id: "a1-dictation-3",
      type: "dictation",
      prompt: "Listen and write the sentence.",
      audioUrl: "/audio/tests/a1/a1-dictation-3.mp3",
      transcript: "We study English every day",
      maxAttempts: 5,
      hintLabel: "Simple routine",
      points: 25,
    },
    {
      id: "a1-dictation-4",
      type: "dictation",
      prompt: "Listen and write the sentence.",
      audioUrl: "/audio/tests/a1/a1-dictation-4.mp3",
      transcript: "The bus is very late",
      maxAttempts: 5,
      hintLabel: "Transport and time",
      points: 25,
    },
  ],
});
