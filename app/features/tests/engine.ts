import type {
  ClozeQuestion,
  DictationQuestion,
  ReorderQuestion,
  TestDefinition,
  TestQuestion,
  TestResultBand,
} from "./types";

export interface QuestionResolution {
  isCorrect: boolean;
  pointsAwarded: number;
}

export function normalizeTestText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function isAcceptedAnswer(value: string, answers: string[]): boolean {
  const normalizedValue = normalizeTestText(value);
  return answers.some(
    (answer) => normalizeTestText(answer) === normalizedValue
  );
}

export function resolveClozeQuestion(
  question: ClozeQuestion,
  value: string
): QuestionResolution {
  const isCorrect = isAcceptedAnswer(value, question.answers);
  return {
    isCorrect,
    pointsAwarded: isCorrect ? question.points : 0,
  };
}

export function resolveReorderQuestion(
  question: ReorderQuestion,
  value: string[]
): QuestionResolution {
  const isCorrect =
    normalizeTestText(value.join(" ")) ===
    normalizeTestText(question.answer.join(" "));

  return {
    isCorrect,
    pointsAwarded: isCorrect ? question.points : 0,
  };
}

export function resolveDictationQuestion(
  question: DictationQuestion,
  value: string,
  attemptNumber: number
): QuestionResolution {
  const acceptedAnswers = question.answers ?? [question.transcript];
  const isCorrect = isAcceptedAnswer(value, acceptedAnswers);
  const maxAttempts = Math.max(question.maxAttempts, 1);
  const penaltySteps = Math.max(attemptNumber - 1, 0);
  const penalty = Math.floor(question.points / maxAttempts);
  const pointsAwarded = isCorrect
    ? Math.max(
        question.points - penaltySteps * penalty,
        Math.ceil(question.points / 5)
      )
    : 0;

  return {
    isCorrect,
    pointsAwarded,
  };
}

export function getResultBand(
  resultBands: TestResultBand[],
  scorePercent: number
): TestResultBand {
  return (
    resultBands.find((band) => scorePercent >= band.minScore) ??
    resultBands[resultBands.length - 1]
  );
}

export function hashString(value: string): number {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

function seededRandom(seed: number) {
  let nextSeed = seed || 1;

  return () => {
    nextSeed = (nextSeed * 1664525 + 1013904223) % 4294967296;
    return nextSeed / 4294967296;
  };
}

export function shuffleQuestions<T>(items: T[], seedValue: string): T[] {
  const random = seededRandom(hashString(seedValue));
  const nextItems = [...items];

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const current = nextItems[index];
    nextItems[index] = nextItems[swapIndex];
    nextItems[swapIndex] = current;
  }

  return nextItems;
}

export function getDictationHint(
  question: DictationQuestion,
  attemptNumber: number
): string {
  const words = question.transcript.split(" ");
  const revealRatio = Math.min(
    Math.max((attemptNumber - 1) / question.maxAttempts, 0),
    1
  );

  return words
    .map((word, index) => {
      const normalizedWord = word.trim();
      if (!normalizedWord) {
        return word;
      }

      if (attemptNumber <= 1) {
        return "_".repeat(Math.max(normalizedWord.length, 1));
      }

      const firstLetterVisible = attemptNumber >= 2;
      const extraVisible = Math.floor(
        Math.max(normalizedWord.length - 1, 0) * revealRatio
      );
      const visibleCount = Math.min(
        normalizedWord.length,
        (firstLetterVisible ? 1 : 0) +
          extraVisible +
          (index % 2 === 0 && attemptNumber >= 4 ? 1 : 0)
      );

      return normalizedWord
        .split("")
        .map((character, characterIndex) =>
          characterIndex < visibleCount ? character : "_"
        )
        .join("");
    })
    .join(" ");
}

export function getMaxScore(test: TestDefinition): number {
  return test.questions.reduce((total, question) => total + question.points, 0);
}

export function isDictationQuestion(
  question: TestQuestion
): question is DictationQuestion {
  return question.type === "dictation";
}
