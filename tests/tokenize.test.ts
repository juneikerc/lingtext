import { describe, expect, it } from "vitest";

import { normalizeWord, tokenize } from "../shared/tokenize";

describe("tokenize", () => {
  it("splits words and preserves gaps", () => {
    expect(tokenize("Hello, world!")).toEqual([
      { text: "Hello", isWord: true, start: 0, end: 5, lower: "hello" },
      { text: ", ", isWord: false, start: 5, end: 7 },
      { text: "world", isWord: true, start: 7, end: 12, lower: "world" },
      { text: "!", isWord: false, start: 12, end: 13 },
    ]);
  });

  it("normalizes apostrophes and accents consistently", () => {
    expect(normalizeWord("Café")).toBe("cafe");
    expect(normalizeWord("Don't")).toBe("don't");
  });
});
