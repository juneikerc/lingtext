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
      prompt: "Elige la opción correcta.",
      description: "She ___ from Chile.",
      choices: [
        { id: "a", text: "am" },
        { id: "b", text: "is" },
        { id: "c", text: "are" },
        { id: "d", text: "be" },
      ],
      correctChoiceId: "b",
      explanation: "Para he, she e it en presente de 'to be', se usa 'is'.",
      points: 25,
    },
    {
      id: "a1-grammar-2",
      type: "cloze",
      prompt: "Escribe el verbo que falta.",
      sentence: "We ___ lunch at noon every day.",
      answers: ["have"],
      hint: "Use the base form in present simple.",
      explanation: "Con 'we', el presente simple usa la forma base 'have'.",
      points: 25,
    },
    {
      id: "a1-grammar-3",
      type: "reorder",
      prompt: "Ordena la oración correctamente.",
      tokens: ["play", "I", "soccer", "after", "school"],
      answer: ["I", "play", "soccer", "after", "school"],
      explanation:
        "El orden en presente simple es sujeto + verbo + complemento.",
      points: 25,
    },
    {
      id: "a1-grammar-4",
      type: "multiple-choice",
      prompt: "Elige la opción correcta.",
      description: "There ___ two books on the table.",
      choices: [
        { id: "a", text: "is" },
        { id: "b", text: "am" },
        { id: "c", text: "are" },
        { id: "d", text: "be" },
      ],
      correctChoiceId: "c",
      explanation: "Usa 'are' con sustantivos plurales como 'two books'.",
      points: 25,
    },
  ],
});
