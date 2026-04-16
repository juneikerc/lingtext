import { defineTest } from "../define-test";

export default defineTest({
  level: "c2",
  skill: "dictation",
  title: "Dictado de alta precision y discurso complejo",
  summary:
    "Escucha oraciones cargadas de matiz y manten exactitud aunque la estructura sea exigente.",
  intro:
    "Este dictado esta pensado para usuarios que quieren medir detalle real cuando el ingles ya opera a maxima densidad.",
  questions: [
    {
      id: "c2-dictation-1",
      type: "dictation",
      prompt: "Listen and write the sentence.",
      audioUrl: "/audio/tests/c2/c2-dictation-1.mp3",
      transcript: "The conclusion was persuasive without being overstated",
      maxAttempts: 5,
      hintLabel: "Academic tone",
      points: 25,
    },
    {
      id: "c2-dictation-2",
      type: "dictation",
      prompt: "Listen and write the sentence.",
      audioUrl: "/audio/tests/c2/c2-dictation-2.mp3",
      transcript: "Few would dispute the breadth of her expertise",
      maxAttempts: 5,
      hintLabel: "Evaluation and stance",
      points: 25,
    },
    {
      id: "c2-dictation-3",
      type: "dictation",
      prompt: "Listen and write the sentence.",
      audioUrl: "/audio/tests/c2/c2-dictation-3.mp3",
      transcript:
        "Its apparent simplicity concealed several difficult trade offs",
      maxAttempts: 5,
      hintLabel: "Analytical register",
      points: 25,
    },
    {
      id: "c2-dictation-4",
      type: "dictation",
      prompt: "Listen and write the sentence.",
      audioUrl: "/audio/tests/c2/c2-dictation-4.mp3",
      transcript: "Had they intervened earlier the outcome might have differed",
      maxAttempts: 5,
      hintLabel: "Inverted conditional",
      points: 25,
    },
  ],
});
