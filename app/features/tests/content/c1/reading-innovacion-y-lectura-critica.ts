import { defineTest } from "../define-test";

export default defineTest({
  level: "c1",
  skill: "reading",
  title: "Innovacion, implementacion y lectura critica",
  summary:
    "Interpreta posicion, contraste y critica implicita dentro de un texto mas denso.",
  intro:
    "Esta prueba busca medir si ya puedes leer entre lineas y seguir una tesis con vocabulario mas exigente.",
  questions: [
    {
      id: "c1-reading-1",
      type: "multiple-choice",
      prompt: "What criticism does the writer make?",
      passage:
        "Some organizations celebrate innovation so enthusiastically that they forget the slower work required to make new ideas usable. A clever prototype may attract attention, but without documentation, training and support, it rarely changes everyday practice. The real challenge is not producing novelty; it is embedding it into routines people can actually maintain.",
      choices: [
        { id: "a", text: "People dislike new technology" },
        {
          id: "b",
          text: "Innovation is often praised without enough implementation work",
        },
        { id: "c", text: "Training is too expensive to matter" },
        { id: "d", text: "Routines should never change" },
      ],
      correctChoiceId: "b",
      explanation:
        "The writer argues that organizations focus on novelty more than implementation.",
      points: 25,
    },
    {
      id: "c1-reading-2",
      type: "multiple-choice",
      prompt: "What does 'embedding it into routines' imply?",
      passage:
        "Some organizations celebrate innovation so enthusiastically that they forget the slower work required to make new ideas usable. A clever prototype may attract attention, but without documentation, training and support, it rarely changes everyday practice. The real challenge is not producing novelty; it is embedding it into routines people can actually maintain.",
      choices: [
        { id: "a", text: "Hiding the idea from staff" },
        { id: "b", text: "Turning the idea into regular practice" },
        { id: "c", text: "Removing old systems immediately" },
        { id: "d", text: "Reducing the cost of the prototype" },
      ],
      correctChoiceId: "b",
      explanation: "Embedding means integrating it into normal workflows.",
      points: 25,
    },
    {
      id: "c1-reading-3",
      type: "cloze",
      prompt: "Complete the phrase.",
      sentence:
        "A clever prototype may attract attention, but without documentation, training and support, it rarely changes everyday ___.",
      answers: ["practice"],
      explanation: "The writer refers to everyday practice.",
      points: 25,
    },
    {
      id: "c1-reading-4",
      type: "reorder",
      prompt: "Order the words.",
      clue: "Use the final insight from the passage.",
      tokens: ["the", "real", "challenge", "is", "implementation"],
      answer: ["the", "real", "challenge", "is", "implementation"],
      explanation: "The text contrasts novelty with implementation.",
      points: 25,
    },
  ],
});
