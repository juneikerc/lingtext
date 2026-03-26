import {
  allBlogs,
  allLegalPages,
  allLevelsTexts,
  allTexts,
} from "virtual:content";
import type {
  BlogEntry,
  LegalPageEntry,
  LevelTextEntry,
  TextEntry,
} from "./types";

export { allBlogs, allLegalPages, allLevelsTexts, allTexts };

export const getBlogBySlug = (slug: string): BlogEntry | undefined =>
  allBlogs.find((blog) => blog.slug === slug);

export const getLegalPageBySlug = (slug: string): LegalPageEntry | undefined =>
  allLegalPages.find((page) => page.slug === slug);

export const getLevelTextByLevel = (
  level: string
): LevelTextEntry | undefined =>
  allLevelsTexts.find((text) => text.level === level);

export const getTextsByLevel = (level: string): TextEntry[] =>
  allTexts.filter((text) => text.level === level);
