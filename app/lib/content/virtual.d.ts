declare module "virtual:content" {
  import type {
    BlogEntry,
    LegalPageEntry,
    LevelTextEntry,
    TextEntry,
  } from "./types";

  export const allBlogs: BlogEntry[];
  export const allLegalPages: LegalPageEntry[];
  export const allLevelsTexts: LevelTextEntry[];
  export const allTexts: TextEntry[];
}
