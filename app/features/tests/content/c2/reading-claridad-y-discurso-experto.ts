import { defineTest } from "../define-test";

export default defineTest({
  level: "c2",
  skill: "reading",
  title: "Claridad, profundidad y discurso experto",
  summary:
    "Lee una reflexion compleja y detecta contraste conceptual, matiz y subtexto.",
  intro:
    "Esta prueba pone el foco en comprension fina: no solo entender ideas, sino como estan organizadas y matizadas.",
  questions: [
    {
      id: "c2-reading-1",
      type: "multiple-choice",
      prompt: "What tension does the writer highlight?",
      passage:
        "Public discussion often frames expertise and accessibility as if they were mutually exclusive. Yet the most insightful communicators do not simplify by stripping away complexity; they simplify by structuring it. What frustrates audiences is rarely depth itself, but the impression that depth is being used to exclude rather than illuminate.",
      choices: [
        { id: "a", text: "Experts should avoid complex ideas" },
        {
          id: "b",
          text: "Depth and clarity can coexist when ideas are structured well",
        },
        { id: "c", text: "Audiences prefer shallow explanations" },
        { id: "d", text: "Public discussion should be less ambitious" },
      ],
      correctChoiceId: "b",
      explanation:
        "The writer argues that complexity is not the problem; poor framing is.",
      points: 25,
    },
    {
      id: "c2-reading-2",
      type: "multiple-choice",
      prompt: "Why do audiences become frustrated, according to the text?",
      passage:
        "Public discussion often frames expertise and accessibility as if they were mutually exclusive. Yet the most insightful communicators do not simplify by stripping away complexity; they simplify by structuring it. What frustrates audiences is rarely depth itself, but the impression that depth is being used to exclude rather than illuminate.",
      choices: [
        { id: "a", text: "Because they reject experts completely" },
        { id: "b", text: "Because complexity is always boring" },
        { id: "c", text: "Because depth can feel exclusionary" },
        { id: "d", text: "Because structure makes ideas too rigid" },
      ],
      correctChoiceId: "c",
      explanation:
        "The passage says frustration comes from feeling excluded by complexity.",
      points: 25,
    },
    {
      id: "c2-reading-3",
      type: "cloze",
      prompt: "Complete the phrase.",
      sentence: "Insightful communicators simplify by ___ complexity.",
      answers: ["structuring"],
      explanation: "The text says they simplify by structuring complexity.",
      points: 25,
    },
    {
      id: "c2-reading-4",
      type: "reorder",
      prompt: "Order the words.",
      clue: "Use the key contrast from the final sentence.",
      tokens: ["depth", "can", "exclude", "or", "illuminate"],
      answer: ["depth", "can", "exclude", "or", "illuminate"],
      explanation: "This condenses the core contrast in the paragraph.",
      points: 25,
    },
  ],
});
