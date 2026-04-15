import { defineTest } from "../define-test";

export default defineTest({
  level: "a2",
  skill: "reading",
  title: "Planes, mensajes y un fin de semana ocupado",
  summary:
    "Lee un mensaje simple y sigue planes, horarios y acciones futuras con mas autonomia.",
  intro:
    "Esta prueba gira alrededor de mensajes cotidianos, planes cercanos y detalles faciles pero ya mas variados.",
  questions: [
    {
      id: "a2-reading-1",
      type: "multiple-choice",
      prompt: "What is Mia doing this weekend?",
      passage:
        "Mia sent a message to her friend Leo. She said that on Saturday she is visiting her aunt in Brighton and on Sunday she plans to clean her room and finish a short history project. She hopes to watch a film at night if she has time.",
      choices: [
        { id: "a", text: "Traveling to three cities" },
        { id: "b", text: "Studying and visiting family" },
        { id: "c", text: "Starting a new job" },
        { id: "d", text: "Going camping" },
      ],
      correctChoiceId: "b",
      explanation: "She is visiting her aunt and finishing a project.",
      points: 25,
    },
    {
      id: "a2-reading-2",
      type: "multiple-choice",
      prompt: "When does Mia want to watch a film?",
      passage:
        "Mia sent a message to her friend Leo. She said that on Saturday she is visiting her aunt in Brighton and on Sunday she plans to clean her room and finish a short history project. She hopes to watch a film at night if she has time.",
      choices: [
        { id: "a", text: "On Friday morning" },
        { id: "b", text: "On Saturday afternoon" },
        { id: "c", text: "At night" },
        { id: "d", text: "Before breakfast" },
      ],
      correctChoiceId: "c",
      explanation: "The text says she hopes to watch a film at night.",
      points: 25,
    },
    {
      id: "a2-reading-3",
      type: "cloze",
      prompt: "Complete the sentence from the message.",
      sentence:
        "On Sunday, Mia plans to clean her room and finish a short history ___.",
      answers: ["project"],
      explanation: "The missing word is 'project'.",
      points: 25,
    },
    {
      id: "a2-reading-4",
      type: "reorder",
      prompt: "Order the words to make a sentence.",
      clue: "Think about Mia's plan for Saturday.",
      tokens: ["is", "she", "her", "aunt", "visiting"],
      answer: ["she", "is", "visiting", "her", "aunt"],
      explanation: "This matches the weekend plan in the passage.",
      points: 25,
    },
  ],
});
