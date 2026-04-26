import { defineTest } from "../define-test";

export default defineTest({
  level: "a1",
  skill: "reading",
  title: "Un dia en la tienda del barrio",
  summary:
    "Practica lectura basica con compras, precios simples y acciones del dia a dia.",
  intro:
    "Esta prueba usa una escena cotidiana para revisar palabras frecuentes de comida y tienda.",
  passage:
    "Ben goes to the shop on Monday afternoon. He wants bread, eggs, and a bottle of water. The shop is small, but it has many things. A woman near the door buys apples and milk. Ben says hello to the shopkeeper and asks for six eggs. The bread is on the shelf next to the door. Ben pays with five pounds and puts the food in his green bag. At home, he gives the eggs to his mother. She makes dinner at seven o'clock.",
  questions: [
    {
      id: "a1-reading-shop-1",
      type: "multiple-choice",
      prompt: "¿Cuándo va Ben a la tienda?",
      choices: [
        { id: "a", text: "On Monday afternoon" },
        { id: "b", text: "On Sunday morning" },
        { id: "c", text: "On Friday night" },
        { id: "d", text: "On Tuesday evening" },
      ],
      correctChoiceId: "a",
      explanation: "La primera oración dice que Ben va el lunes por la tarde.",
      points: 25,
    },
    {
      id: "a1-reading-shop-2",
      type: "multiple-choice",
      prompt: "¿Qué pide Ben al tendero?",
      choices: [
        { id: "a", text: "Six eggs" },
        { id: "b", text: "Three apples" },
        { id: "c", text: "Two bottles" },
        { id: "d", text: "One cake" },
      ],
      correctChoiceId: "a",
      explanation: "Ben pide seis huevos al tendero.",
      points: 25,
    },
    {
      id: "a1-reading-shop-3",
      type: "cloze",
      prompt: "Completa la oración con una palabra del texto.",
      sentence: "Ben puts the food in his green ___.",
      answers: ["bag"],
      explanation: "El texto dice que pone la comida en su bolsa verde.",
      points: 25,
    },
    {
      id: "a1-reading-shop-4",
      type: "reorder",
      prompt: "Ordena las palabras correctamente.",
      tokens: ["makes", "dinner", "she", "at", "seven"],
      answer: ["she", "makes", "dinner", "at", "seven"],
      explanation: "La oración ordenada mantiene el sujeto al inicio.",
      points: 25,
    },
  ],
});
