export type TestLevel = "a1" | "a2" | "b1" | "b2" | "c1" | "c2";

export type TestSkill = "grammar" | "vocabulary" | "reading" | "dictation";

export interface TestLevelMeta {
  id: TestLevel;
  name: string;
  title: string;
  description: string;
  focus: string;
}

export interface TestSkillMeta {
  id: TestSkill;
  name: string;
  shortDescription: string;
  longDescription: string;
  icon: "spark" | "book" | "sound" | "grammar";
}

export interface TestResultBand {
  minScore: number;
  label: string;
  summary: string;
}

interface BaseQuestion {
  id: string;
  prompt: string;
  description?: string;
  points: number;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple-choice";
  passage?: string;
  choices: Array<{
    id: string;
    text: string;
  }>;
  correctChoiceId: string;
  explanation: string;
}

export interface ClozeQuestion extends BaseQuestion {
  type: "cloze";
  sentence: string;
  answers: string[];
  hint?: string;
  explanation: string;
}

export interface ReorderQuestion extends BaseQuestion {
  type: "reorder";
  tokens: string[];
  answer: string[];
  clue?: string;
  explanation: string;
}

export interface DictationQuestion extends BaseQuestion {
  type: "dictation";
  audioUrl: string;
  transcript: string;
  answers?: string[];
  maxAttempts: number;
  hintLabel: string;
}

export type TestQuestion =
  | MultipleChoiceQuestion
  | ClozeQuestion
  | ReorderQuestion
  | DictationQuestion;

export interface TestDefinition {
  level: TestLevel;
  skill: TestSkill;
  title: string;
  summary: string;
  intro: string;
  instructions: string;
  durationMinutes: number;
  questions: TestQuestion[];
  resultBands: TestResultBand[];
}

export interface LevelTestSummary {
  level: TestLevel;
  skill: TestSkill;
  title: string;
  shortDescription: string;
  summary: string;
  durationMinutes: number;
  questionCount: number;
}
