import { defineTest } from "../define-test";

export default defineTest({
  level: "b1",
  skill: "vocabulary",
  title: "Trabajo, decisiones y expresiones frecuentes",
  summary:
    "Entrena palabras utiles para estudio, trabajo y situaciones practicas del dia a dia.",
  intro:
    "Esta sesion combina significado en contexto con collocations que empiezan a sonar realmente naturales en B1.",
  questions: [
    {
      id: "b1-vocabulary-1",
      type: "multiple-choice",
      prompt: "Choose the closest meaning.",
      description: "'Reliable' means...",
      choices: [
        { id: "a", text: "easy to forget" },
        { id: "b", text: "can be trusted" },
        { id: "c", text: "hard to explain" },
        { id: "d", text: "full of surprises" },
      ],
      correctChoiceId: "b",
      explanation: "A reliable person or thing can be trusted.",
      points: 25,
    },
    {
      id: "b1-vocabulary-2",
      type: "cloze",
      prompt: "Complete the sentence.",
      sentence: "We need to ___ a decision before Friday.",
      answers: ["make"],
      explanation: "The correct collocation is 'make a decision'.",
      points: 25,
    },
    {
      id: "b1-vocabulary-3",
      type: "reorder",
      prompt: "Build the expression.",
      tokens: ["take", "responsibility", "for", "it"],
      answer: ["take", "responsibility", "for", "it"],
      explanation: "'Take responsibility for it' is the natural phrase.",
      points: 25,
    },
    {
      id: "b1-vocabulary-4",
      type: "multiple-choice",
      prompt: "Choose the best word.",
      description: "A 'deadline' is...",
      choices: [
        { id: "a", text: "the time limit for a task" },
        { id: "b", text: "a new employee" },
        { id: "c", text: "a type of contract" },
        { id: "d", text: "an annual bonus" },
      ],
      correctChoiceId: "a",
      explanation: "A deadline is the latest time to finish something.",
      points: 25,
    },
  ],
});
