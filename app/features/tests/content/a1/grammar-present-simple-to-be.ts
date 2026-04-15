import { defineTest } from "../define-test";

export default defineTest({
  level: "a1",
  skill: "grammar",
  title: "Present simple y verb to be en accion",
  summary:
    "Practica estructuras esenciales para presentarte, describir personas y hablar de rutinas.",
  intro:
    "Esta sesion se centra en las piezas gramaticales que mas se repiten cuando todavia estas construyendo base.",
  questions: [
    {
      id: "a1-grammar-1",
      type: "multiple-choice",
      prompt: "Choose the correct option.",
      description: "She ___ from Chile.",
      choices: [
        { id: "a", text: "am" },
        { id: "b", text: "is" },
        { id: "c", text: "are" },
        { id: "d", text: "be" },
      ],
      correctChoiceId: "b",
      explanation: "For he, she and it in the present of 'to be', use 'is'.",
      points: 25,
    },
    {
      id: "a1-grammar-2",
      type: "cloze",
      prompt: "Write the missing verb.",
      sentence: "We ___ lunch at noon every day.",
      answers: ["have"],
      hint: "Use the base form in present simple.",
      explanation: "With 'we', the present simple uses the base form 'have'.",
      points: 25,
    },
    {
      id: "a1-grammar-3",
      type: "reorder",
      prompt: "Order the sentence correctly.",
      tokens: ["play", "I", "soccer", "after", "school"],
      answer: ["I", "play", "soccer", "after", "school"],
      explanation:
        "Simple present sentence order is subject + verb + complement.",
      points: 25,
    },
    {
      id: "a1-grammar-4",
      type: "multiple-choice",
      prompt: "Choose the correct option.",
      description: "There ___ two books on the table.",
      choices: [
        { id: "a", text: "is" },
        { id: "b", text: "am" },
        { id: "c", text: "are" },
        { id: "d", text: "be" },
      ],
      correctChoiceId: "c",
      explanation: "Use 'are' with plural nouns like 'two books'.",
      points: 25,
    },
  ],
});
