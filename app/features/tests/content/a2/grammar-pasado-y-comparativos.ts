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
      prompt: "Elige la forma correcta.",
      description: "Yesterday, we ___ a bus to the museum.",
      choices: [
        { id: "a", text: "take" },
        { id: "b", text: "took" },
        { id: "c", text: "taken" },
        { id: "d", text: "takes" },
      ],
      correctChoiceId: "b",
      explanation: "'Yesterday' indica pasado simple, así que se usa 'took'.",
      points: 25,
    },
    {
      id: "a2-grammar-2",
      type: "cloze",
      prompt: "Escribe la palabra que falta.",
      sentence: "There aren't ___ apples left in the basket.",
      answers: ["any"],
      explanation: "Usa 'any' en oraciones negativas.",
      points: 25,
    },
    {
      id: "a2-grammar-3",
      type: "reorder",
      prompt: "Ordena la oración.",
      tokens: ["going", "to", "are", "we", "cook", "tonight"],
      answer: ["we", "are", "going", "to", "cook", "tonight"],
      explanation: "Plan futuro con 'be going to'.",
      points: 25,
    },
    {
      id: "a2-grammar-4",
      type: "multiple-choice",
      prompt: "Elige la mejor opción.",
      description: "My sister is ___ than me.",
      choices: [
        { id: "a", text: "tall" },
        { id: "b", text: "taller" },
        { id: "c", text: "more tall" },
        { id: "d", text: "the tallest" },
      ],
      correctChoiceId: "b",
      explanation: "La forma comparativa de 'tall' es 'taller'.",
      points: 25,
    },
  ],
});
