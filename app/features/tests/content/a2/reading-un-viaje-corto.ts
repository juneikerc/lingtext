import { defineTest } from "../define-test";

export default defineTest({
  level: "a2",
  skill: "reading",
  title: "Un viaje corto y cambios de plan",
  summary:
    "Lee un relato sencillo sobre transporte, horarios y decisiones durante un viaje.",
  intro:
    "Una lectura A2 para seguir eventos en pasado y entender detalles concretos de un plan.",
  passage:
    "On Friday, Daniel and his friend Sofia travelled by bus to a small town near the lake. They wanted to visit the old castle, but the museum inside it was closed because of repairs. At first, they were disappointed. Then they found a market in the main square and bought sandwiches, fruit, and a map of walking routes. After lunch, they followed a path around the lake. The weather was cloudy, but it did not rain. Daniel took photos of the boats, and Sofia wrote notes for her travel blog. They returned home at six and agreed that the day was different from their plan, but still enjoyable.",
  questions: [
    {
      id: "a2-reading-trip-1",
      type: "multiple-choice",
      prompt: "¿Por qué no visitaron el museo del castillo?",
      choices: [
        { id: "a", text: "It was closed for repairs" },
        { id: "b", text: "They lost their tickets" },
        { id: "c", text: "The bus was too late" },
        { id: "d", text: "It started snowing" },
      ],
      correctChoiceId: "a",
      explanation: "El museo estaba cerrado por reparaciones.",
      points: 25,
    },
    {
      id: "a2-reading-trip-2",
      type: "multiple-choice",
      prompt: "¿Qué compraron en el mercado?",
      choices: [
        { id: "a", text: "Sandwiches, fruit, and a map" },
        { id: "b", text: "Tickets, coffee, and gloves" },
        { id: "c", text: "Books, shoes, and a camera" },
        { id: "d", text: "Soup, tea, and postcards" },
      ],
      correctChoiceId: "a",
      explanation: "El texto menciona sandwiches, fruta y un mapa de rutas.",
      points: 25,
    },
    {
      id: "a2-reading-trip-3",
      type: "cloze",
      prompt: "Completa la oración del texto.",
      sentence: "Sofia wrote notes for her travel ___.",
      answers: ["blog"],
      explanation: "La palabra que falta es 'blog'.",
      points: 25,
    },
    {
      id: "a2-reading-trip-4",
      type: "reorder",
      prompt: "Ordena las palabras para formar una oración.",
      tokens: ["did", "not", "it", "rain"],
      answer: ["it", "did", "not", "rain"],
      explanation:
        "La negación en pasado simple usa 'did not' antes del verbo base.",
      points: 25,
    },
  ],
});
