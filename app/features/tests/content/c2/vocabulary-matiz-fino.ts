import { defineTest } from "../define-test";

export default defineTest({
  level: "c2",
  skill: "vocabulary",
  title: "Matiz fino y lenguaje analitico de alto nivel",
  summary:
    "Practica palabras que exigen distinciones sutiles, interpretacion y registro muy preciso.",
  intro:
    "La sesion trabaja el tipo de vocabulario que define un dominio experto mas alla de la simple correccion.",
  questions: [
    {
      id: "c2-vocabulary-1",
      type: "multiple-choice",
      prompt: "Choose the closest meaning.",
      description: "'Nuanced' means...",
      choices: [
        { id: "a", text: "showing subtle differences" },
        { id: "b", text: "easy to repeat" },
        { id: "c", text: "based on guesswork" },
        { id: "d", text: "lacking structure" },
      ],
      correctChoiceId: "a",
      explanation: "Nuanced language captures subtle distinctions.",
      points: 25,
    },
    {
      id: "c2-vocabulary-2",
      type: "cloze",
      prompt: "Complete the sentence.",
      sentence:
        "Her remarks were so ___ that several listeners missed the criticism entirely.",
      answers: ["subtle"],
      explanation: "'Subtle' fits the idea of indirect criticism.",
      points: 25,
    },
    {
      id: "c2-vocabulary-3",
      type: "reorder",
      prompt: "Build the expression.",
      tokens: ["shed", "light", "on", "it"],
      answer: ["shed", "light", "on", "it"],
      explanation: "'Shed light on' means to clarify something.",
      points: 25,
    },
    {
      id: "c2-vocabulary-4",
      type: "multiple-choice",
      prompt: "Choose the best word.",
      description: "A 'plausible' explanation is...",
      choices: [
        { id: "a", text: "unnecessarily complicated" },
        { id: "b", text: "credible and believable" },
        { id: "c", text: "entirely emotional" },
        { id: "d", text: "open to only one interpretation" },
      ],
      correctChoiceId: "b",
      explanation: "Plausible means believable, even if not yet proven.",
      points: 25,
    },
  ],
});
