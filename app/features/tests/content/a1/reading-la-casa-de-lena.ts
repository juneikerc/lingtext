import { defineTest } from "../define-test";

export default defineTest({
  level: "a1",
  skill: "reading",
  title: "La casa de Lena y objetos familiares",
  summary:
    "Lee una descripcion simple de una casa y reconoce personas, lugares y objetos cotidianos.",
  intro:
    "Una lectura breve para practicar vocabulario basico de casa, familia y ubicaciones faciles.",
  passage:
    "Lena lives in a small house with her father and her cat, Mimi. The house has two bedrooms, a kitchen, a bathroom, and a living room. Lena's bedroom is next to the bathroom. She has a blue desk, a white chair, and three books on her bed. In the kitchen, her father makes rice and soup for dinner. Mimi sits under the table and waits for food. After dinner, Lena watches a short video in the living room. Then she puts her books in her bag because she has school in the morning.",
  questions: [
    {
      id: "a1-reading-house-1",
      type: "multiple-choice",
      prompt: "¿Con quién vive Lena?",
      choices: [
        { id: "a", text: "Her mother and brother" },
        { id: "b", text: "Her father and her cat" },
        { id: "c", text: "Her sister and dog" },
        { id: "d", text: "Her aunt and cousin" },
      ],
      correctChoiceId: "b",
      explanation: "El texto dice que Lena vive con su padre y su gato, Mimi.",
      points: 25,
    },
    {
      id: "a1-reading-house-2",
      type: "multiple-choice",
      prompt: "¿Dónde está el dormitorio de Lena?",
      choices: [
        { id: "a", text: "Next to the bathroom" },
        { id: "b", text: "Under the kitchen" },
        { id: "c", text: "Behind the garden" },
        { id: "d", text: "Near the supermarket" },
      ],
      correctChoiceId: "a",
      explanation: "El texto indica que su dormitorio está junto al baño.",
      points: 25,
    },
    {
      id: "a1-reading-house-3",
      type: "cloze",
      prompt: "Completa la oración del texto.",
      sentence: "Mimi sits under the ___.",
      answers: ["table"],
      explanation: "La palabra que falta es 'table'.",
      points: 25,
    },
    {
      id: "a1-reading-house-4",
      type: "reorder",
      prompt: "Ordena las palabras para formar una oración.",
      tokens: ["has", "school", "she", "morning", "in", "the"],
      answer: ["she", "has", "school", "in", "the", "morning"],
      explanation: "La oración sigue el orden sujeto + verbo + complemento.",
      points: 25,
    },
  ],
});
