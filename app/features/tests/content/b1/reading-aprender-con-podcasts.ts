import { defineTest } from "../define-test";

export default defineTest({
  level: "b1",
  skill: "reading",
  title: "Aprender con podcasts y crear una rutina",
  summary:
    "Lee un texto sobre habitos de estudio, frustracion inicial y progreso realista.",
  intro:
    "Esta prueba evalua si puedes seguir una experiencia personal con problema, ajuste y resultado.",
  passage:
    "Julia decided to use podcasts to improve her English listening, but her first week was frustrating. She chose a popular science show because the topics sounded interesting, yet the speakers talked too fast and used many expressions she did not know. Instead of giving up, Julia changed her method. She began with shorter episodes made for learners, listened while reading the transcript, and wrote down only five useful phrases each day. After two weeks, she returned to the science show and understood more than before. She still missed details, especially jokes and informal comments, but she could follow the main ideas. Julia realised that choosing easier material at the beginning was not a failure; it was a way to build confidence and continue studying.",
  questions: [
    {
      id: "b1-reading-podcasts-1",
      type: "multiple-choice",
      prompt: "¿Por qué fue frustrante la primera semana de Julia?",
      choices: [
        { id: "a", text: "The speakers were too fast" },
        { id: "b", text: "The episodes were too short" },
        { id: "c", text: "She lost her headphones" },
        { id: "d", text: "She disliked science topics" },
      ],
      correctChoiceId: "a",
      explanation:
        "Los hablantes iban muy rápido y usaban expresiones desconocidas.",
      points: 25,
    },
    {
      id: "b1-reading-podcasts-2",
      type: "multiple-choice",
      prompt: "¿Cómo cambió Julia su método?",
      choices: [
        { id: "a", text: "She used shorter learner episodes" },
        { id: "b", text: "She stopped listening completely" },
        { id: "c", text: "She translated every word" },
        { id: "d", text: "She only watched videos" },
      ],
      correctChoiceId: "a",
      explanation:
        "Empezó con episodios más cortos para estudiantes y leyó el transcript.",
      points: 25,
    },
    {
      id: "b1-reading-podcasts-3",
      type: "cloze",
      prompt: "Completa la oración con una palabra del texto.",
      sentence: "Julia wrote down only five useful ___ each day.",
      answers: ["phrases"],
      explanation: "El texto dice que anotaba cinco frases útiles cada día.",
      points: 25,
    },
    {
      id: "b1-reading-podcasts-4",
      type: "reorder",
      prompt: "Ordena las palabras.",
      tokens: ["follow", "could", "the", "ideas", "main", "she"],
      answer: ["she", "could", "follow", "the", "main", "ideas"],
      explanation: "La oración expresa que podía seguir las ideas principales.",
      points: 25,
    },
  ],
});
