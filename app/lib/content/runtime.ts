import { allBlogs, allLevelsTexts, allTexts } from "virtual:content";
import type { BlogEntry, LevelTextEntry, TextEntry } from "./types";

export { allBlogs, allLevelsTexts, allTexts };

export const getBlogBySlug = (slug: string): BlogEntry | undefined =>
  allBlogs.find((blog) => blog.slug === slug);

export const getLevelTextByLevel = (
  level: string
): LevelTextEntry | undefined =>
  allLevelsTexts.find((text) => text.level === level);

export const getTextsByLevel = (level: string): TextEntry[] =>
  allTexts.filter((text) => text.level === level);
