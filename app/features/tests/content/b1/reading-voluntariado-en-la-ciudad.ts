import { defineTest } from "../define-test";

export default defineTest({
  level: "b1",
  skill: "reading",
  title: "Voluntariado y cambios en la ciudad",
  summary:
    "Lee un texto funcional sobre participacion comunitaria, motivos y resultados.",
  intro:
    "Una lectura B1 para relacionar decisiones personales con efectos concretos en una comunidad.",
  passage:
    "When the city council announced a weekend clean-up project, Amir was not sure whether to join. He cared about the park near his flat, but he also wanted to rest after a busy week at work. In the end, he volunteered for two hours on Saturday morning. At first, the group only collected bottles and paper from the grass. Later, a local gardener showed them how to plant flowers along the path and protect young trees from damage. Amir was surprised by how quickly the place looked different. He also met neighbours he had seen many times but never spoken to. By the end of the morning, he felt tired, but he decided to join the next monthly activity because the project made the park feel more like a shared space.",
  questions: [
    {
      id: "b1-reading-volunteering-1",
      type: "multiple-choice",
      prompt: "¿Por qué Amir dudaba si participar?",
      choices: [
        { id: "a", text: "He wanted to rest after a busy week" },
        { id: "b", text: "He disliked the park" },
        { id: "c", text: "He had moved to another city" },
        { id: "d", text: "He did not know the date" },
      ],
      correctChoiceId: "a",
      explanation:
        "Amir quería descansar después de una semana ocupada de trabajo.",
      points: 25,
    },
    {
      id: "b1-reading-volunteering-2",
      type: "multiple-choice",
      prompt: "¿Qué aprendió el grupo del jardinero?",
      choices: [
        { id: "a", text: "How to plant flowers and protect trees" },
        { id: "b", text: "How to repair bicycles" },
        { id: "c", text: "How to paint a school wall" },
        { id: "d", text: "How to organize a concert" },
      ],
      correctChoiceId: "a",
      explanation:
        "El jardinero les mostró cómo plantar flores y proteger árboles jóvenes.",
      points: 25,
    },
    {
      id: "b1-reading-volunteering-3",
      type: "cloze",
      prompt: "Completa la idea del texto.",
      sentence: "The project made the park feel more like a shared ___.",
      answers: ["space"],
      explanation: "La palabra clave en la última oración es 'space'.",
      points: 25,
    },
    {
      id: "b1-reading-volunteering-4",
      type: "reorder",
      prompt: "Ordena las palabras.",
      tokens: ["met", "he", "neighbours", "new"],
      answer: ["he", "met", "new", "neighbours"],
      explanation: "La oración usa el orden sujeto + verbo + objeto.",
      points: 25,
    },
  ],
});
