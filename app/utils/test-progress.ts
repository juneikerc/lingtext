import type { TestSkill } from "~/features/tests/types";

const STORAGE_KEY = "lingtext_test_progress";

export interface TestProgressEntry {
  skill: TestSkill;
  completedAt: number;
  scorePercent: number;
}

export type TestProgressMap = Record<string, Record<string, TestProgressEntry>>;

function loadProgress(): TestProgressMap {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }

    return JSON.parse(raw) as TestProgressMap;
  } catch {
    return {};
  }
}

function saveProgress(progress: TestProgressMap): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    console.warn("Failed to save test progress to localStorage");
  }
}

export function markTestCompleted(
  level: string,
  skill: TestSkill,
  scorePercent: number
): void {
  const progress = loadProgress();

  if (!progress[level]) {
    progress[level] = {};
  }

  progress[level][skill] = {
    skill,
    completedAt: Date.now(),
    scorePercent,
  };

  saveProgress(progress);
}

export function isTestCompleted(level: string, skill: TestSkill): boolean {
  const progress = loadProgress();
  return !!progress[level]?.[skill];
}

export function getTestProgress(
  level: string,
  skill: TestSkill
): TestProgressEntry | undefined {
  const progress = loadProgress();
  return progress[level]?.[skill];
}

export function getAllCompletedTestsForLevel(
  level: string
): Record<string, TestProgressEntry> {
  const progress = loadProgress();
  return progress[level] ?? {};
}
