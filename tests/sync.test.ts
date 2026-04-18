import { describe, expect, it } from "vitest";

import { createSyncEnvelope, mergeSyncEnvelopes } from "../shared/sync";
import type { PhraseEntry, WordEntry } from "../shared/vocabulary";

describe("mergeSyncEnvelopes", () => {
  it("preserves srData and voice when a newer source omits them", () => {
    const webWord: WordEntry = {
      word: "Run",
      wordLower: "run",
      translation: '{"info":{"Verb":["correr"]}}',
      status: "unknown",
      addedAt: 10,
      updatedAt: 100,
      voice: { lang: "en-US", rate: 1, pitch: 1, volume: 1 },
      srData: {
        easeFactor: 2.5,
        interval: 6,
        repetitions: 2,
        nextReview: 999,
        reviewHistory: [],
      },
    };

    const extensionWord: WordEntry = {
      word: "Run",
      wordLower: "run",
      translation: "correr",
      status: "unknown",
      addedAt: 10,
      updatedAt: 200,
    };

    const merged = mergeSyncEnvelopes(
      createSyncEnvelope("web", [webWord], []),
      createSyncEnvelope("extension", [extensionWord], [])
    );

    expect(merged.words).toHaveLength(1);
    expect(merged.words[0].translation).toBe("correr");
    expect(merged.words[0].voice).toEqual(webWord.voice);
    expect(merged.words[0].srData).toEqual(webWord.srData);
    expect(merged.words[0].sync?.schemaVersion).toBe(2);
  });

  it("merges phrase collections by key", () => {
    const webPhrase: PhraseEntry = {
      phrase: "take off",
      phraseLower: "take off",
      translation: "despegar",
      parts: ["take", "off"],
      addedAt: 10,
      updatedAt: 100,
    };

    const extensionPhrase: PhraseEntry = {
      phrase: "take off",
      phraseLower: "take off",
      translation: "quitarse",
      parts: ["take", "off"],
      addedAt: 10,
      updatedAt: 200,
    };

    const merged = mergeSyncEnvelopes(
      createSyncEnvelope("web", [], [webPhrase]),
      createSyncEnvelope("extension", [], [extensionPhrase])
    );

    expect(merged.phrases).toHaveLength(1);
    expect(merged.phrases[0].translation).toBe("quitarse");
  });
});
