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
    "Tom wakes up at seven every day. He has bread and tea for breakfast, then he walks to the bus stop with his sister. After school, they play football in the park for thirty minutes.",
  questions: [
    {
      id: "a1-reading-1",
      type: "multiple-choice",
      prompt: "What is the text mainly about?",
      description: "Read the text and choose the best summary.",
      choices: [
        { id: "a", text: "Tom's daily routine" },
        { id: "b", text: "Tom's summer vacation" },
        { id: "c", text: "Tom's favorite movie" },
        { id: "d", text: "Tom's trip to London" },
      ],
      correctChoiceId: "a",
      explanation:
        "The passage describes a normal day for Tom from morning to afternoon.",
      points: 25,
    },
    {
      id: "a1-reading-2",
      type: "multiple-choice",
      prompt: "What does Tom drink for breakfast?",
      choices: [
        { id: "a", text: "Milk" },
        { id: "b", text: "Tea" },
        { id: "c", text: "Coffee" },
        { id: "d", text: "Juice" },
      ],
      correctChoiceId: "b",
      explanation: "The text says he has bread and tea for breakfast.",
      points: 25,
    },
    {
      id: "a1-reading-3",
      type: "cloze",
      prompt: "Complete the sentence from the text.",
      sentence: "After school, Tom and his sister play ___ in the park.",
      answers: ["football"],
      explanation: "The activity after school is football.",
      points: 25,
    },
    {
      id: "a1-reading-4",
      type: "reorder",
      prompt: "Put the words in the correct order.",
      clue: "Use the information from the text.",
      tokens: ["walks", "Tom", "to", "the", "bus", "stop"],
      answer: ["Tom", "walks", "to", "the", "bus", "stop"],
      explanation: "This is the sentence pattern used in the passage.",
      points: 25,
    },
  ],
});
