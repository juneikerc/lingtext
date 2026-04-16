import { describe, expect, it } from "vitest";

import { TEST_CATALOG } from "../app/features/tests/content";
import { defineTest } from "../app/features/tests/content/define-test";

describe("dictation content", () => {
  it("requires a non-empty audioUrl for dictation questions", () => {
    expect(() =>
      defineTest({
        level: "a1",
        skill: "dictation",
        title: "Invalid dictation",
        summary: "Invalid dictation",
        intro: "Invalid dictation",
        questions: [
          {
            id: "invalid-dictation-1",
            type: "dictation",
            prompt: "Listen and write the sentence.",
            transcript: "This should fail",
            maxAttempts: 5,
            hintLabel: "Validation",
            points: 25,
          } as never,
        ],
      })
    ).toThrowError(/audioUrl/i);
  });

  it("ships every built-in dictation question with an audioUrl", () => {
    const dictationQuestions = TEST_CATALOG.flatMap((test) =>
      test.skill === "dictation" ? test.questions : []
    );

    expect(dictationQuestions.length).toBeGreaterThan(0);

    dictationQuestions.forEach((question) => {
      if (question.type !== "dictation") {
        return;
      }

      expect(question.audioUrl).toMatch(/^\/audio\/tests\/[a-z0-9]+\/.+\.mp3$/);
    });
  });
});
