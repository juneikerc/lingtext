import { TEST_CATALOG } from "./content";
import type {
  LevelTestSummary,
  TestDefinition,
  TestLevel,
  TestLevelMeta,
  TestSkill,
  TestSkillMeta,
} from "./types";

export const TEST_LEVELS: TestLevelMeta[] = [
  {
    id: "a1",
    name: "A1",
    title: "Pruebas de ingles A1",
    description:
      "Tests cortos para validar bases de lectura, vocabulario, gramatica y dictado inicial.",
    focus: "frases simples, rutinas y vocabulario cotidiano",
  },
  {
    id: "a2",
    name: "A2",
    title: "Pruebas de ingles A2",
    description:
      "Ejercicios interactivos para consolidar situaciones comunes, pasado simple y comprension basica.",
    focus: "situaciones diarias, descripciones y narracion simple",
  },
  {
    id: "b1",
    name: "B1",
    title: "Pruebas de ingles B1",
    description:
      "Tests para medir autonomia en lectura, precision gramatical y escucha de frases mas naturales.",
    focus: "opiniones, experiencias y textos funcionales",
  },
  {
    id: "b2",
    name: "B2",
    title: "Pruebas de ingles B2",
    description:
      "Pruebas para usuarios que ya manejan ingles con soltura y quieren detectar puntos finos.",
    focus: "argumentos, matices y estructuras mas flexibles",
  },
  {
    id: "c1",
    name: "C1",
    title: "Pruebas de ingles C1",
    description:
      "Practica avanzada para trabajar interpretacion, colocationes y control formal del idioma.",
    focus: "analisis, registro y precision academica o profesional",
  },
  {
    id: "c2",
    name: "C2",
    title: "Pruebas de ingles C2",
    description:
      "Retos exigentes para usuarios con dominio alto que quieren medir fineza y comprension profunda.",
    focus: "matiz, inferencia y dominio experto del ingles",
  },
];

export const TEST_SKILLS: TestSkillMeta[] = [
  {
    id: "reading",
    name: "Reading",
    shortDescription: "Comprension lectora por nivel",
    longDescription:
      "Lee un texto breve y responde preguntas sobre idea principal, detalles e inferencias.",
    icon: "book",
  },
  {
    id: "grammar",
    name: "Grammar",
    shortDescription: "Gramatica en contexto",
    longDescription:
      "Resuelve huecos, orden de palabras y elecciones gramaticales comunes para tu nivel.",
    icon: "grammar",
  },
  {
    id: "vocabulary",
    name: "Vocabulary",
    shortDescription: "Vocabulario util y colocaciones",
    longDescription:
      "Practica significado en contexto, expresiones frecuentes y combinaciones naturales.",
    icon: "spark",
  },
  {
    id: "dictation",
    name: "Dictation",
    shortDescription: "Escucha y escribe lo que oyes",
    longDescription:
      "Escucha una frase, escríbela y desbloquea letras extra si necesitas mas intentos.",
    icon: "sound",
  },
];

export function getTestLevelMeta(level: TestLevel): TestLevelMeta {
  return TEST_LEVELS.find((item) => item.id === level) ?? TEST_LEVELS[0];
}

export function getTestSkillMeta(skill: TestSkill): TestSkillMeta {
  return TEST_SKILLS.find((item) => item.id === skill) ?? TEST_SKILLS[0];
}

export function isTestLevel(value: string): value is TestLevel {
  return TEST_LEVELS.some((level) => level.id === value);
}

export function isTestSkill(value: string): value is TestSkill {
  return TEST_SKILLS.some((skill) => skill.id === value);
}

export function getTestId(test: TestDefinition): string {
  return (
    test.questions[0]?.id.replace(/-\d+$/, "") ?? `${test.level}-${test.skill}`
  );
}

export function getLevelTestSummaries(level: TestLevel): LevelTestSummary[] {
  return TEST_CATALOG.filter((test) => test.level === level).map((test) => ({
    id: getTestId(test),
    level: test.level,
    skill: test.skill,
    title: test.title,
    shortDescription: test.summary,
    summary: test.intro,
    durationMinutes: test.durationMinutes,
    questionCount: test.questions.length,
  }));
}

export function getAllTestLevels() {
  return TEST_LEVELS;
}

export function getAllTestSkills() {
  return TEST_SKILLS;
}

export function getTestDefinition(
  level: TestLevel,
  skill: TestSkill,
  testId?: string
): TestDefinition | undefined {
  return TEST_CATALOG.find(
    (test) =>
      test.level === level &&
      test.skill === skill &&
      (!testId || getTestId(test) === testId)
  );
}
