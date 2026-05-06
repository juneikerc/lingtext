import { describe, expect, it } from "vitest";

import {
  getTextChapters,
  parseChapterNumber,
  selectTextChapter,
} from "../app/lib/content/text-chapters";

const content = `# Chapter 1 - The Letter

First chapter text.

# Chapter 2 - The Test

Second chapter text.

# Chapter 3 - The Choice

Third chapter text.`;

const chapterTitles = [
  "Chapter 1 - The Letter",
  "Chapter 2 - The Test",
  "Chapter 3 - The Choice",
];

describe("text chapters", () => {
  it("splits markdown into chapters using declared titles", () => {
    expect(getTextChapters(content, chapterTitles)).toEqual([
      {
        number: 1,
        title: "Chapter 1 - The Letter",
        content: "# Chapter 1 - The Letter\n\nFirst chapter text.",
      },
      {
        number: 2,
        title: "Chapter 2 - The Test",
        content: "# Chapter 2 - The Test\n\nSecond chapter text.",
      },
      {
        number: 3,
        title: "Chapter 3 - The Choice",
        content: "# Chapter 3 - The Choice\n\nThird chapter text.",
      },
    ]);
  });

  it("uses chapter 1 when the query value is missing or invalid", () => {
    expect(parseChapterNumber(null)).toBe(1);
    expect(parseChapterNumber("abc")).toBe(1);

    const selected = selectTextChapter(
      content,
      chapterTitles,
      parseChapterNumber(null)
    );

    expect(selected?.currentChapterNumber).toBe(1);
    expect(selected?.currentChapter.title).toBe("Chapter 1 - The Letter");
  });

  it("selects the requested chapter", () => {
    const selected = selectTextChapter(content, chapterTitles, 2);

    expect(selected?.currentChapterNumber).toBe(2);
    expect(selected?.totalChapters).toBe(3);
    expect(selected?.currentChapter.content).toContain("Second chapter text.");
  });

  it("rejects chapters outside the declared range", () => {
    expect(() => selectTextChapter(content, chapterTitles, 0)).toThrow(
      RangeError
    );
    expect(() => selectTextChapter(content, chapterTitles, 4)).toThrow(
      RangeError
    );
  });

  it("returns null when a text does not declare chapters", () => {
    expect(selectTextChapter(content, undefined, 1)).toBeNull();
  });
});
