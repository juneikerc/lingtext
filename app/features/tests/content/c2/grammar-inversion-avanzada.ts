import { defineTest } from "../define-test";

export default defineTest({
  level: "c2",
  skill: "grammar",
  title: "Inversion avanzada y estructuras poco frecuentes",
  summary:
    "Pon a prueba formas raras pero naturales en un ingles de alta precision.",
  intro:
    "El objetivo aqui es medir control sobre recursos sintacticos que ya no pertenecen al uso intermedio ni avanzado comun.",
  questions: [
    {
      id: "c2-grammar-1",
      type: "multiple-choice",
      prompt: "Choose the best option.",
      description:
        "So intricate ___ the negotiation that even the lawyers requested more time.",
      choices: [
        { id: "a", text: "it was" },
        { id: "b", text: "was it" },
        { id: "c", text: "was" },
        { id: "d", text: "it is" },
      ],
      correctChoiceId: "b",
      explanation: "This is inversion after 'so + adjective'.",
      points: 25,
    },
    {
      id: "c2-grammar-2",
      type: "cloze",
      prompt: "Write the missing word.",
      sentence:
        "Were the figures to be confirmed, the board ___ reconsider its position.",
      answers: ["might"],
      explanation:
        "This uses an inverted conditional with a modal in the result clause.",
      points: 25,
    },
    {
      id: "c2-grammar-3",
      type: "reorder",
      prompt: "Order the sentence.",
      tokens: ["little", "did", "how", "realize", "they"],
      answer: ["little", "did", "they", "realize", "how"],
      explanation:
        "Inversion after negative adverbials is typical at this level.",
      points: 25,
    },
    {
      id: "c2-grammar-4",
      type: "multiple-choice",
      prompt: "Choose the best option.",
      description:
        "The report is thorough, ___ one minor inconsistency in the appendix.",
      choices: [
        { id: "a", text: "notwithstanding" },
        { id: "b", text: "albeit" },
        { id: "c", text: "save for" },
        { id: "d", text: "provided" },
      ],
      correctChoiceId: "c",
      explanation: "'Save for' means 'except for', which fits the sentence.",
      points: 25,
    },
  ],
});
