declare module "virtual:content" {
  import type { BlogEntry, LevelTextEntry, TextEntry } from "./types";

  export const allBlogs: BlogEntry[];
  export const allLevelsTexts: LevelTextEntry[];
  export const allTexts: TextEntry[];
}
