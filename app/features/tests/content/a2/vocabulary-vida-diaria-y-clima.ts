import { defineTest } from "../define-test";

export default defineTest({
  level: "a2",
  skill: "vocabulary",
  title: "Vida diaria, clima y collocations comunes",
  summary:
    "Practica vocabulario util para moverte en ciudad, estudio y conversaciones rutinarias.",
  intro:
    "La sesion mezcla palabras frecuentes con expresiones naturales que empiezan a sonar mas reales en A2.",
  questions: [
    {
      id: "a2-vocabulary-1",
      type: "multiple-choice",
      prompt: "Choose the closest meaning.",
      description: "'Crowded' means...",
      choices: [
        { id: "a", text: "full of people" },
        { id: "b", text: "very clean" },
        { id: "c", text: "easy to reach" },
        { id: "d", text: "quiet and empty" },
      ],
      correctChoiceId: "a",
      explanation: "A crowded place has many people in it.",
      points: 25,
    },
    {
      id: "a2-vocabulary-2",
      type: "cloze",
      prompt: "Complete the sentence.",
      sentence: "I forgot my umbrella, so I got very ___.",
      answers: ["wet"],
      explanation: "Without an umbrella in the rain, you get wet.",
      points: 25,
    },
    {
      id: "a2-vocabulary-3",
      type: "reorder",
      prompt: "Build the natural expression.",
      tokens: ["do", "homework", "your"],
      answer: ["do", "your", "homework"],
      explanation: "The correct collocation is 'do your homework'.",
      points: 25,
    },
    {
      id: "a2-vocabulary-4",
      type: "multiple-choice",
      prompt: "Choose the best word.",
      description: "A person who designs buildings is an...",
      choices: [
        { id: "a", text: "architect" },
        { id: "b", text: "actor" },
        { id: "c", text: "assistant" },
        { id: "d", text: "artist" },
      ],
      correctChoiceId: "a",
      explanation: "An architect designs buildings.",
      points: 25,
    },
  ],
});
