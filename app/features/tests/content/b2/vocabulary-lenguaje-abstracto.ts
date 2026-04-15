import { defineTest } from "../define-test";

export default defineTest({
  level: "b2",
  skill: "vocabulary",
  title: "Lenguaje abstracto y collocations de analisis",
  summary:
    "Practica vocabulario mas flexible para ideas, proyectos, cambios y argumentacion.",
  intro:
    "Esta sesion trabaja el salto hacia un vocabulario menos concreto y mas util para opiniones complejas.",
  questions: [
    {
      id: "b2-vocabulary-1",
      type: "multiple-choice",
      prompt: "Choose the closest meaning.",
      description: "'Convincing' means...",
      choices: [
        { id: "a", text: "hard to remember" },
        { id: "b", text: "able to make others believe" },
        { id: "c", text: "impossible to measure" },
        { id: "d", text: "easy to ignore" },
      ],
      correctChoiceId: "b",
      explanation: "A convincing argument makes people accept or believe it.",
      points: 25,
    },
    {
      id: "b2-vocabulary-2",
      type: "cloze",
      prompt: "Complete the sentence.",
      sentence: "The company plans to ___ its services abroad next year.",
      answers: ["expand"],
      explanation: "'Expand' fits the business context naturally.",
      points: 25,
    },
    {
      id: "b2-vocabulary-3",
      type: "reorder",
      prompt: "Build the collocation.",
      tokens: ["raise", "awareness", "about", "it"],
      answer: ["raise", "awareness", "about", "it"],
      explanation: "'Raise awareness' is the standard collocation.",
      points: 25,
    },
    {
      id: "b2-vocabulary-4",
      type: "multiple-choice",
      prompt: "Choose the best word.",
      description: "If something is 'temporary', it is...",
      choices: [
        { id: "a", text: "permanent" },
        { id: "b", text: "limited in time" },
        { id: "c", text: "fully predictable" },
        { id: "d", text: "extremely expensive" },
      ],
      correctChoiceId: "b",
      explanation: "Temporary things do not last forever.",
      points: 25,
    },
  ],
});
