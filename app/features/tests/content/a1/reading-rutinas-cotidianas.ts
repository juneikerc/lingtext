import { defineTest } from "../define-test";

export default defineTest({
  level: "a1",
  skill: "reading",
  title: "Rutinas cotidianas y detalles simples",
  summary:
    "Lee una escena diaria corta y detecta ideas basicas sin perderte en el texto.",
  intro:
    "Una prueba breve centrada en acciones del dia a dia, horarios y detalles faciles de localizar.",
  passage:
    "Tom wakes up at seven every day because his school starts at eight thirty. He opens the window, makes his bed, and goes to the kitchen with his sister Anna. For breakfast, Tom has bread and tea, while Anna drinks milk and eats an apple. At seven forty-five, they leave the house together and walk to the bus stop near the small supermarket. Their mother works in the supermarket, so she waves at them from the door. After school, Tom and Anna do their homework at the kitchen table. Then they go to the park and play football with two friends for thirty minutes. In the evening, Tom reads a short story before dinner because he likes quiet time at home.",
  questions: [
    {
      id: "a1-reading-1",
      type: "multiple-choice",
      prompt: "¿De qué trata principalmente el texto?",
      description: "Read the text and choose the best summary.",
      choices: [
        { id: "a", text: "Tom's daily routine" },
        { id: "b", text: "Tom's summer vacation" },
        { id: "c", text: "Tom's favorite movie" },
        { id: "d", text: "Tom's trip to London" },
      ],
      correctChoiceId: "a",
      explanation:
        "El texto describe un día normal de Tom desde la mañana hasta la tarde.",
      points: 25,
    },
    {
      id: "a1-reading-2",
      type: "multiple-choice",
      prompt: "¿Qué toma Tom en el desayuno?",
      choices: [
        { id: "a", text: "Milk" },
        { id: "b", text: "Tea" },
        { id: "c", text: "Coffee" },
        { id: "d", text: "Juice" },
      ],
      correctChoiceId: "b",
      explanation: "El texto dice que toma pan y té en el desayuno.",
      points: 25,
    },
    {
      id: "a1-reading-3",
      type: "cloze",
      prompt: "Completa la oración del texto.",
      sentence: "After school, Tom and his sister play ___ in the park.",
      answers: ["football"],
      explanation: "La actividad después del colegio es fútbol.",
      points: 25,
    },
    {
      id: "a1-reading-4",
      type: "reorder",
      prompt: "Ordena las palabras correctamente.",
      clue: "Use the information from the text.",
      tokens: ["reads", "story", "Tom", "short", "a"],
      answer: ["Tom", "reads", "a", "short", "story"],
      explanation: "Este es el patrón de oración usado en el texto.",
      points: 25,
    },
  ],
});
