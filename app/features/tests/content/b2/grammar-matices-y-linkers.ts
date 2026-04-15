import { defineTest } from "../define-test";

export default defineTest({
  level: "b2",
  skill: "grammar",
  title: "Matices verbales, inversion ligera y linkers",
  summary:
    "Pon a prueba estructuras que marcan diferencia entre un ingles correcto y uno mas fino.",
  intro:
    "Aqui importa menos la mecanica basica y mas tu capacidad de elegir la estructura precisa para el contexto.",
  questions: [
    {
      id: "b2-grammar-1",
      type: "multiple-choice",
      prompt: "Choose the best option.",
      description: "By the time we arrived, the film ___.",
      choices: [
        { id: "a", text: "already started" },
        { id: "b", text: "has already started" },
        { id: "c", text: "had already started" },
        { id: "d", text: "was already start" },
      ],
      correctChoiceId: "c",
      explanation: "Past perfect shows the film started before we arrived.",
      points: 25,
    },
    {
      id: "b2-grammar-2",
      type: "cloze",
      prompt: "Write the missing word.",
      sentence: "I wish I ___ more confident during interviews.",
      answers: ["were"],
      explanation: "After 'I wish' for unreal present situations, use 'were'.",
      points: 25,
    },
    {
      id: "b2-grammar-3",
      type: "reorder",
      prompt: "Order the sentence.",
      tokens: ["been", "might", "have", "they", "warned"],
      answer: ["they", "might", "have", "been", "warned"],
      explanation: "Modal perfect passive structure.",
      points: 25,
    },
    {
      id: "b2-grammar-4",
      type: "multiple-choice",
      prompt: "Choose the correct linker.",
      description:
        "The launch was delayed; ___, the team used the extra time to improve the design.",
      choices: [
        { id: "a", text: "however" },
        { id: "b", text: "therefore" },
        { id: "c", text: "as a result" },
        { id: "d", text: "in addition" },
      ],
      correctChoiceId: "a",
      explanation:
        "'However' signals the contrast between delay and positive use of time.",
      points: 25,
    },
  ],
});
