import { defineTest } from "../define-test";

export default defineTest({
  level: "b1",
  skill: "reading",
  title: "Habitos, trabajo remoto y decisiones personales",
  summary:
    "Lee un texto funcional y detecta cambios de rutina, causas y soluciones.",
  intro:
    "La prueba apunta a esa zona B1 en la que ya puedes seguir una idea completa y relacionar problema con respuesta.",
  passage:
    "Last year, Nora started working from home three days a week after her company changed its office policy. At first, she enjoyed the flexibility because she could start earlier, cook lunch at home, and avoid the crowded bus. However, after a few months she noticed that her new routine was creating different problems. She was moving less, answering messages during lunch, and finishing work later than before because her laptop was always nearby. Nora did not want to return to the office every day, but she needed clearer limits. To solve the problem, she now goes for a short walk before breakfast, keeps a bottle of water on her desk, and sets a clear time to shut down her laptop every evening. She says remote work is useful when it has structure.",
  questions: [
    {
      id: "b1-reading-1",
      type: "multiple-choice",
      prompt: "¿Por qué cambió Nora su rutina?",
      choices: [
        { id: "a", text: "She wanted to save money on food" },
        { id: "b", text: "She was missing her morning bus" },
        { id: "c", text: "Her new routine was affecting her habits" },
        { id: "d", text: "She had to train for a race" },
      ],
      correctChoiceId: "c",
      explanation:
        "Cambió su rutina porque trabajar desde casa afectó su movimiento y horario.",
      points: 25,
    },
    {
      id: "b1-reading-2",
      type: "multiple-choice",
      prompt: "¿Qué hace Nora antes del desayuno?",
      choices: [
        { id: "a", text: "Checks email" },
        { id: "b", text: "Goes for a walk" },
        { id: "c", text: "Calls her team" },
        { id: "d", text: "Washes the dishes" },
      ],
      correctChoiceId: "b",
      explanation:
        "El texto dice explícitamente que da un paseo corto antes del desayuno.",
      points: 25,
    },
    {
      id: "b1-reading-3",
      type: "cloze",
      prompt: "Completa la idea del texto.",
      sentence: "Nora sets a clear time to shut down her ___ every evening.",
      answers: ["laptop"],
      explanation: "El texto usa la palabra 'laptop'.",
      points: 25,
    },
    {
      id: "b1-reading-4",
      type: "reorder",
      prompt: "Ordena las palabras.",
      clue: "Use the problem Nora noticed.",
      tokens: ["always", "her", "nearby", "was", "laptop"],
      answer: ["her", "laptop", "was", "always", "nearby"],
      explanation: "Esto refleja el problema descrito en el texto.",
      points: 25,
    },
  ],
});
