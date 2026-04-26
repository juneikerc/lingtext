import { defineTest } from "../define-test";

export default defineTest({
  level: "a2",
  skill: "reading",
  title: "Correo de la escuela y tareas semanales",
  summary:
    "Practica comprension de un correo simple con fechas, instrucciones y responsabilidades.",
  intro:
    "Esta lectura trabaja mensajes practicos parecidos a los que puedes recibir en un entorno de estudio.",
  passage:
    "Dear students, next week our class will prepare a small exhibition about healthy habits. On Monday, each group should choose one topic, such as sleep, food, exercise, or screen time. On Wednesday, you will bring two pictures and five short facts about your topic. Please do not write very long texts because visitors will only have a few minutes at each table. On Friday morning, we will arrange the classroom and practise explaining our ideas. The exhibition starts at two o'clock in the afternoon. Parents and other teachers are welcome to visit. If you have questions, please send me a message before Thursday evening.",
  questions: [
    {
      id: "a2-reading-email-1",
      type: "multiple-choice",
      prompt: "¿Sobre qué será la exposición?",
      choices: [
        { id: "a", text: "Healthy habits" },
        { id: "b", text: "Old buildings" },
        { id: "c", text: "Famous actors" },
        { id: "d", text: "Summer jobs" },
      ],
      correctChoiceId: "a",
      explanation:
        "El correo dice que la exposición será sobre hábitos saludables.",
      points: 25,
    },
    {
      id: "a2-reading-email-2",
      type: "multiple-choice",
      prompt: "¿Qué deben llevar los estudiantes el miércoles?",
      choices: [
        { id: "a", text: "Two pictures and five short facts" },
        { id: "b", text: "A long essay and a test" },
        { id: "c", text: "Food for the visitors" },
        { id: "d", text: "Three books and a video" },
      ],
      correctChoiceId: "a",
      explanation:
        "Deben llevar dos imágenes y cinco datos cortos sobre el tema.",
      points: 25,
    },
    {
      id: "a2-reading-email-3",
      type: "cloze",
      prompt: "Completa la oración con una palabra del correo.",
      sentence: "The exhibition starts at two o'clock in the ___.",
      answers: ["afternoon"],
      explanation: "El correo indica que empieza a las dos de la tarde.",
      points: 25,
    },
    {
      id: "a2-reading-email-4",
      type: "reorder",
      prompt: "Ordena las palabras correctamente.",
      tokens: ["are", "parents", "welcome", "to", "visit"],
      answer: ["parents", "are", "welcome", "to", "visit"],
      explanation: "La oración empieza con el sujeto 'parents'.",
      points: 25,
    },
  ],
});
