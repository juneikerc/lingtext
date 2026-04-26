import { defineTest } from "../define-test";

export default defineTest({
  level: "b1",
  skill: "grammar",
  title: "Condicionales, conectores y tiempo verbal util",
  summary:
    "Practica estructuras que te permiten opinar, matizar y conectar mejor las ideas.",
  intro:
    "Aqui medimos si ya puedes pasar de frases sueltas a estructuras que dan mas control y autonomia al discurso.",
  questions: [
    {
      id: "b1-grammar-1",
      type: "multiple-choice",
      prompt: "Elige la mejor opción.",
      description: "If I ___ more time, I'd join the course.",
      choices: [
        { id: "a", text: "have" },
        { id: "b", text: "had" },
        { id: "c", text: "will have" },
        { id: "d", text: "am having" },
      ],
      correctChoiceId: "b",
      explanation: "El segundo condicional usa pasado simple en la cláusula if.",
      points: 25,
    },
    {
      id: "b1-grammar-2",
      type: "cloze",
      prompt: "Escribe la palabra que falta.",
      sentence: "She has lived here ___ 2019.",
      answers: ["since"],
      explanation: "Usa 'since' con un punto de inicio en el tiempo.",
      points: 25,
    },
    {
      id: "b1-grammar-3",
      type: "reorder",
      prompt: "Ordena las palabras.",
      tokens: ["been", "have", "already", "they", "told"],
      answer: ["they", "have", "already", "been", "told"],
      explanation: "Estructura de present perfect en pasiva.",
      points: 25,
    },
    {
      id: "b1-grammar-4",
      type: "multiple-choice",
      prompt: "Elige la opción correcta.",
      description: "I was tired, ___ I finished the report.",
      choices: [
        { id: "a", text: "because" },
        { id: "b", text: "so" },
        { id: "c", text: "but" },
        { id: "d", text: "although" },
      ],
      correctChoiceId: "c",
      explanation:
        "'But' muestra contraste entre estar cansado y terminar el informe.",
      points: 25,
    },
  ],
});
