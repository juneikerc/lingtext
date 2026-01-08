import configuration from "../../content-collections.ts";
import { GetTypeByName } from "@content-collections/core";

export type Text = GetTypeByName<typeof configuration, "texts">;
export declare const allTexts: Array<Text>;

export type LevelsText = GetTypeByName<typeof configuration, "levelsTexts">;
export declare const allLevelsTexts: Array<LevelsText>;

export type Blog = GetTypeByName<typeof configuration, "blogs">;
export declare const allBlogs: Array<Blog>;

export {};
