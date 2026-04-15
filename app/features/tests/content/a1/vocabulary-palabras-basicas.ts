import { defineTest } from "../define-test";

export default defineTest({
  level: "a1",
  skill: "vocabulary",
  title: "Palabras basicas para moverte en lo diario",
  summary:
    "Trabaja opuestos, objetos comunes y combinaciones faciles de reconocer.",
  intro:
    "La idea aqui es validar si ya manejas vocabulario basico de casa, comida, acciones y descripciones simples.",
  questions: [
    {
      id: "a1-vocabulary-1",
      type: "multiple-choice",
      prompt: "Choose the correct meaning.",
      description: "'Quiet' means...",
      choices: [
        { id: "a", text: "without much noise" },
        { id: "b", text: "very expensive" },
        { id: "c", text: "full of people" },
        { id: "d", text: "very fast" },
      ],
      correctChoiceId: "a",
      explanation: "'Quiet' describes a place or person with little noise.",
      points: 25,
    },
    {
      id: "a1-vocabulary-2",
      type: "cloze",
      prompt: "Complete the sentence.",
      sentence: "I wear shoes on my ___.",
      answers: ["feet", "foot"],
      explanation: "The natural plural form is 'feet'.",
      points: 25,
    },
    {
      id: "a1-vocabulary-3",
      type: "reorder",
      prompt: "Build the common expression.",
      tokens: ["cup", "a", "of", "tea"],
      answer: ["a", "cup", "of", "tea"],
      explanation: "'A cup of tea' is the natural collocation.",
      points: 25,
    },
    {
      id: "a1-vocabulary-4",
      type: "multiple-choice",
      prompt: "Choose the best word for the sentence.",
      description: "The opposite of 'small' is...",
      choices: [
        { id: "a", text: "slow" },
        { id: "b", text: "big" },
        { id: "c", text: "short" },
        { id: "d", text: "low" },
      ],
      correctChoiceId: "b",
      explanation: "'Big' is the direct opposite of 'small'.",
      points: 25,
    },
  ],
});
