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
      prompt: "Elige el significado más cercano.",
      description: "'Crowded' means...",
      choices: [
        { id: "a", text: "full of people" },
        { id: "b", text: "very clean" },
        { id: "c", text: "easy to reach" },
        { id: "d", text: "quiet and empty" },
      ],
      correctChoiceId: "a",
      explanation: "Un lugar crowded tiene mucha gente.",
      points: 25,
    },
    {
      id: "a2-vocabulary-2",
      type: "cloze",
      prompt: "Completa la oración.",
      sentence: "I forgot my umbrella, so I got very ___.",
      answers: ["wet"],
      explanation: "Sin paraguas bajo la lluvia, te mojas.",
      points: 25,
    },
    {
      id: "a2-vocabulary-3",
      type: "reorder",
      prompt: "Construye la expresión natural.",
      tokens: ["do", "homework", "your"],
      answer: ["do", "your", "homework"],
      explanation: "La colocación correcta es 'do your homework'.",
      points: 25,
    },
    {
      id: "a2-vocabulary-4",
      type: "multiple-choice",
      prompt: "Elige la mejor palabra.",
      description: "A person who designs buildings is an...",
      choices: [
        { id: "a", text: "architect" },
        { id: "b", text: "actor" },
        { id: "c", text: "assistant" },
        { id: "d", text: "artist" },
      ],
      correctChoiceId: "a",
      explanation: "Un architect diseña edificios.",
      points: 25,
    },
  ],
});
