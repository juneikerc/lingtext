export interface TextChapter {
  number: number;
  title: string;
  content: string;
}

export interface SelectedTextChapter {
  chapters: TextChapter[];
  currentChapter: TextChapter;
  currentChapterNumber: number;
  totalChapters: number;
}

interface MarkdownHeadingSection {
  title: string;
  content: string;
}

const markdownHeadingPattern = /^#\s+(.+?)\s*$/gm;

function getMarkdownHeadingSections(content: string): MarkdownHeadingSection[] {
  const matches = [...content.matchAll(markdownHeadingPattern)];

  return matches.map((match, index) => {
    const nextMatch = matches[index + 1];
    const start = match.index ?? 0;
    const end = nextMatch?.index ?? content.length;

    return {
      title: match[1].trim(),
      content: content.slice(start, end).trim(),
    };
  });
}

export function getTextChapters(
  content: string,
  chapterTitles: string[] | undefined
): TextChapter[] {
  if (!chapterTitles?.length) {
    return [];
  }

  const sectionsByTitle = new Map(
    getMarkdownHeadingSections(content).map((section) => [
      section.title,
      section.content,
    ])
  );

  return chapterTitles.map((title, index) => {
    const chapterContent = sectionsByTitle.get(title);

    if (!chapterContent) {
      throw new Error(`[content] Missing chapter heading: ${title}`);
    }

    return {
      number: index + 1,
      title,
      content: chapterContent,
    };
  });
}

export function parseChapterNumber(value: string | null): number {
  if (!value) {
    return 1;
  }

  const chapterNumber = Number(value);

  if (!Number.isInteger(chapterNumber)) {
    return 1;
  }

  return chapterNumber;
}

export function selectTextChapter(
  content: string,
  chapterTitles: string[] | undefined,
  requestedChapterNumber: number
): SelectedTextChapter | null {
  const chapters = getTextChapters(content, chapterTitles);

  if (!chapters.length) {
    return null;
  }

  const currentChapter = chapters[requestedChapterNumber - 1];

  if (!currentChapter) {
    throw new RangeError(
      `[content] Chapter out of range: ${requestedChapterNumber}`
    );
  }

  return {
    chapters,
    currentChapter,
    currentChapterNumber: currentChapter.number,
    totalChapters: chapters.length,
  };
}
