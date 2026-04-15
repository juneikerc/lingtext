import { defineTest } from "../define-test";

export default defineTest({
  level: "c1",
  skill: "vocabulary",
  title: "Consenso, matiz y vocabulario de registro alto",
  summary:
    "Trabaja lenguaje mas abstracto, persuasivo y academico sin perder naturalidad.",
  intro:
    "La sesion se enfoca en ese vocabulario que no solo entiendes, sino que ya deberias poder reconocer con matiz.",
  questions: [
    {
      id: "c1-vocabulary-1",
      type: "multiple-choice",
      prompt: "Choose the closest meaning.",
      description: "'Feasible' means...",
      choices: [
        { id: "a", text: "possible and practical" },
        { id: "b", text: "highly creative" },
        { id: "c", text: "difficult to explain" },
        { id: "d", text: "dangerous by nature" },
      ],
      correctChoiceId: "a",
      explanation: "A feasible plan is one that can realistically be done.",
      points: 25,
    },
    {
      id: "c1-vocabulary-2",
      type: "cloze",
      prompt: "Complete the sentence.",
      sentence: "The committee reached a ___ after several hours of debate.",
      answers: ["consensus"],
      explanation: "'Reach a consensus' is the correct collocation.",
      points: 25,
    },
    {
      id: "c1-vocabulary-3",
      type: "reorder",
      prompt: "Build the expression.",
      tokens: ["draw", "attention", "to", "it"],
      answer: ["draw", "attention", "to", "it"],
      explanation: "'Draw attention to' is the standard expression.",
      points: 25,
    },
    {
      id: "c1-vocabulary-4",
      type: "multiple-choice",
      prompt: "Choose the best word.",
      description: "An argument that is 'compelling' is...",
      choices: [
        { id: "a", text: "hard to ignore because it is persuasive" },
        { id: "b", text: "too long to follow" },
        { id: "c", text: "based only on emotion" },
        { id: "d", text: "full of contradictions" },
      ],
      correctChoiceId: "a",
      explanation: "Compelling means strongly persuasive or convincing.",
      points: 25,
    },
  ],
});
