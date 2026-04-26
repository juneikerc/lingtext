import { defineTest } from "../define-test";

export default defineTest({
  level: "a2",
  skill: "reading",
  title: "Planes, mensajes y un fin de semana ocupado",
  summary:
    "Lee un mensaje simple y sigue planes, horarios y acciones futuras con mas autonomia.",
  intro:
    "Esta prueba gira alrededor de mensajes cotidianos, planes cercanos y detalles faciles pero ya mas variados.",
  passage:
    "Mia sent a long message to her friend Leo on Thursday evening. She explained that her weekend is going to be busy but not stressful. On Saturday morning, she is taking the train to Brighton to visit her aunt, who recently moved into a flat near the sea. They are planning to have lunch at a small cafe and walk along the beach if the weather is good. Mia will return home before dinner because she still has school work to finish. On Sunday, she plans to clean her room, organize her desk, and finish a short history project about old city markets. If she has enough time at night, she hopes to watch a film with her brother, but she says homework comes first.",
  questions: [
    {
      id: "a2-reading-1",
      type: "multiple-choice",
      prompt: "¿Qué hará Mia este fin de semana?",
      choices: [
        { id: "a", text: "Traveling to three cities" },
        { id: "b", text: "Studying and visiting family" },
        { id: "c", text: "Starting a new job" },
        { id: "d", text: "Going camping" },
      ],
      correctChoiceId: "b",
      explanation: "Visita a su tía y termina un proyecto.",
      points: 25,
    },
    {
      id: "a2-reading-2",
      type: "multiple-choice",
      prompt: "¿Cuándo quiere Mia ver una película?",
      choices: [
        { id: "a", text: "On Friday morning" },
        { id: "b", text: "On Saturday afternoon" },
        { id: "c", text: "At night" },
        { id: "d", text: "Before breakfast" },
      ],
      correctChoiceId: "c",
      explanation: "El texto dice que espera ver una película por la noche.",
      points: 25,
    },
    {
      id: "a2-reading-3",
      type: "cloze",
      prompt: "Completa la oración del mensaje.",
      sentence:
        "On Sunday, Mia plans to clean her room and finish a short history ___.",
      answers: ["project"],
      explanation: "La palabra que falta es 'project'.",
      points: 25,
    },
    {
      id: "a2-reading-4",
      type: "reorder",
      prompt: "Ordena las palabras para formar una oración.",
      clue: "Think about Mia's plan for Saturday.",
      tokens: ["taking", "train", "she", "the", "is"],
      answer: ["she", "is", "taking", "the", "train"],
      explanation: "Esto coincide con el plan del fin de semana en el texto.",
      points: 25,
    },
  ],
});
