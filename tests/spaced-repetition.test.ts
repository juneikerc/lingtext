import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { calculateNextReview } from "../app/utils/spaced-repetition";

describe("calculateNextReview", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("creates a short relearning interval after a failed first review", () => {
    const result = calculateNextReview(undefined, 1);

    expect(result.repetitions).toBe(0);
    expect(result.interval).toBeCloseTo(10 / (24 * 60));
    expect(result.reviewHistory).toHaveLength(1);
  });

  it("grows the interval for a successful mature review", () => {
    const current = {
      easeFactor: 2.5,
      interval: 6,
      repetitions: 2,
      nextReview: Date.now(),
      reviewHistory: [],
    };

    const result = calculateNextReview(current, 4);

    expect(result.repetitions).toBe(3);
    expect(result.interval).toBe(15);
    expect(result.easeFactor).toBe(2.5);
  });
});
