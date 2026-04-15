import { defineTest } from "../define-test";

export default defineTest({
  level: "a2",
  skill: "grammar",
  title: "Pasado simple, comparativos y planes cercanos",
  summary:
    "Refuerza estructuras tipicas de A2 para contar experiencias y comparar cosas o personas.",
  intro:
    "Aqui pones a prueba si ya controlas tiempos y estructuras muy comunes cuando dejas el nivel inicial puro.",
  questions: [
    {
      id: "a2-grammar-1",
      type: "multiple-choice",
      prompt: "Choose the correct form.",
      description: "Yesterday, we ___ a bus to the museum.",
      choices: [
        { id: "a", text: "take" },
        { id: "b", text: "took" },
        { id: "c", text: "taken" },
        { id: "d", text: "takes" },
      ],
      correctChoiceId: "b",
      explanation: "'Yesterday' signals past simple, so use 'took'.",
      points: 25,
    },
    {
      id: "a2-grammar-2",
      type: "cloze",
      prompt: "Write the missing word.",
      sentence: "There aren't ___ apples left in the basket.",
      answers: ["any"],
      explanation: "Use 'any' in negative sentences.",
      points: 25,
    },
    {
      id: "a2-grammar-3",
      type: "reorder",
      prompt: "Order the sentence.",
      tokens: ["going", "to", "are", "we", "cook", "tonight"],
      answer: ["we", "are", "going", "to", "cook", "tonight"],
      explanation: "Future plan with 'be going to'.",
      points: 25,
    },
    {
      id: "a2-grammar-4",
      type: "multiple-choice",
      prompt: "Choose the best option.",
      description: "My sister is ___ than me.",
      choices: [
        { id: "a", text: "tall" },
        { id: "b", text: "taller" },
        { id: "c", text: "more tall" },
        { id: "d", text: "the tallest" },
      ],
      correctChoiceId: "b",
      explanation: "The comparative form of 'tall' is 'taller'.",
      points: 25,
    },
  ],
});
