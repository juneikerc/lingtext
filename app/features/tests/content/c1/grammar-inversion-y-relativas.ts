import { defineTest } from "../define-test";

export default defineTest({
  level: "c1",
  skill: "grammar",
  title: "Inversion, relativas y control formal del ingles",
  summary:
    "Refuerza estructuras avanzadas que suelen separar un C1 claro de uno todavia inestable.",
  intro:
    "Aqui aparecen formas menos frecuentes, pero muy utiles cuando buscas precision formal y flexibilidad real.",
  questions: [
    {
      id: "c1-grammar-1",
      type: "multiple-choice",
      prompt: "Choose the best option.",
      description: "Had the team reacted sooner, the issue ___ less serious.",
      choices: [
        { id: "a", text: "would be" },
        { id: "b", text: "had been" },
        { id: "c", text: "would have been" },
        { id: "d", text: "has been" },
      ],
      correctChoiceId: "c",
      explanation: "This is an inverted third conditional.",
      points: 25,
    },
    {
      id: "c1-grammar-2",
      type: "cloze",
      prompt: "Write the missing word.",
      sentence:
        "Not only ___ she meet the deadline, but she also improved the draft.",
      answers: ["did"],
      explanation:
        "Negative adverbial fronting takes inversion: 'did she meet'.",
      points: 25,
    },
    {
      id: "c1-grammar-3",
      type: "reorder",
      prompt: "Order the sentence.",
      tokens: ["no", "account", "take", "we", "of", "did"],
      answer: ["we", "did", "take", "no", "account", "of"],
      explanation: "This builds the fixed expression 'take no account of'.",
      points: 25,
    },
    {
      id: "c1-grammar-4",
      type: "multiple-choice",
      prompt: "Choose the best option.",
      description: "The proposal, ___ was revised twice, was finally approved.",
      choices: [
        { id: "a", text: "that" },
        { id: "b", text: "which" },
        { id: "c", text: "what" },
        { id: "d", text: "where" },
      ],
      correctChoiceId: "b",
      explanation: "Non-defining relative clauses use 'which'.",
      points: 25,
    },
  ],
});
