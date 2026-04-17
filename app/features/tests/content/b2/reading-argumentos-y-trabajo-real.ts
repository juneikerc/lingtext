import { defineTest } from "../define-test";

export default defineTest({
  level: "b2",
  skill: "reading",
  title: "Argumentos claros en contextos de trabajo real",
  summary:
    "Lee una opinion breve y distingue tesis, contraste y detalle de apoyo.",
  intro:
    "La prueba se apoya en un texto mas abstracto para validar si ya puedes seguir una linea argumental con claridad.",
  passage:
    "Many companies now offer remote work as a standard option, but the results are mixed. Employees often report fewer interruptions and better concentration at home, yet some teams struggle when communication becomes too informal or delayed. The most effective organizations seem to be the ones that define clear expectations instead of assuming flexibility alone will solve everything.",
  questions: [
    {
      id: "b2-reading-1",
      type: "multiple-choice",
      prompt: "What is the writer's main point?",
      choices: [
        { id: "a", text: "Remote work always improves communication" },
        {
          id: "b",
          text: "Flexibility only works when teams set clear rules",
        },
        { id: "c", text: "Offices are no longer necessary" },
        { id: "d", text: "People should work alone more often" },
      ],
      correctChoiceId: "b",
      explanation:
        "The text argues that clarity matters more than flexibility by itself.",
      points: 25,
    },
    {
      id: "b2-reading-2",
      type: "multiple-choice",
      prompt: "What problem can teams have?",
      choices: [
        { id: "a", text: "Communication may become delayed" },
        { id: "b", text: "People forget how to type" },
        { id: "c", text: "Meetings disappear completely" },
        { id: "d", text: "Employees stop concentrating" },
      ],
      correctChoiceId: "a",
      explanation:
        "The passage explicitly mentions communication becoming informal or delayed.",
      points: 25,
    },
    {
      id: "b2-reading-3",
      type: "cloze",
      prompt: "Complete the idea.",
      sentence: "The most effective organizations define clear ___.",
      answers: ["expectations"],
      explanation: "That is the key word in the final sentence.",
      points: 25,
    },
    {
      id: "b2-reading-4",
      type: "reorder",
      prompt: "Order the words.",
      clue: "Use the key contrast from the text.",
      tokens: ["results", "mixed", "the", "are"],
      answer: ["the", "results", "are", "mixed"],
      explanation: "This phrase summarizes the author's position.",
      points: 25,
    },
  ],
});
