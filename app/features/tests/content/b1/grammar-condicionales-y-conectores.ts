import { defineTest } from "../define-test";

export default defineTest({
  level: "b1",
  skill: "grammar",
  title: "Condicionales, conectores y tiempo verbal util",
  summary:
    "Practica estructuras que te permiten opinar, matizar y conectar mejor las ideas.",
  intro:
    "Aqui medimos si ya puedes pasar de frases sueltas a estructuras que dan mas control y autonomia al discurso.",
  questions: [
    {
      id: "b1-grammar-1",
      type: "multiple-choice",
      prompt: "Choose the best option.",
      description: "If I ___ more time, I'd join the course.",
      choices: [
        { id: "a", text: "have" },
        { id: "b", text: "had" },
        { id: "c", text: "will have" },
        { id: "d", text: "am having" },
      ],
      correctChoiceId: "b",
      explanation: "Second conditional uses past simple in the if-clause.",
      points: 25,
    },
    {
      id: "b1-grammar-2",
      type: "cloze",
      prompt: "Write the missing word.",
      sentence: "She has lived here ___ 2019.",
      answers: ["since"],
      explanation: "Use 'since' with a starting point in time.",
      points: 25,
    },
    {
      id: "b1-grammar-3",
      type: "reorder",
      prompt: "Order the words.",
      tokens: ["been", "have", "already", "they", "told"],
      answer: ["they", "have", "already", "been", "told"],
      explanation: "Present perfect passive structure.",
      points: 25,
    },
    {
      id: "b1-grammar-4",
      type: "multiple-choice",
      prompt: "Choose the correct option.",
      description: "I was tired, ___ I finished the report.",
      choices: [
        { id: "a", text: "because" },
        { id: "b", text: "so" },
        { id: "c", text: "but" },
        { id: "d", text: "although" },
      ],
      correctChoiceId: "c",
      explanation:
        "'But' shows contrast between being tired and finishing the report.",
      points: 25,
    },
  ],
});
