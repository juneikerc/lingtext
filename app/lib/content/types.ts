export type CollectionName = "blogs" | "levelsTexts" | "texts";

export interface BaseEntry {
  id: string;
  collection: CollectionName;
  content: string;
  html: string;
}

export interface BlogEntry extends BaseEntry {
  collection: "blogs";
  slug: string;
  title: string;
  mainHeading: string;
  metaDescription: string;
  image: string;
  tags: string[];
}

export interface LevelTextEntry extends BaseEntry {
  collection: "levelsTexts";
  title: string;
  mainHeading: string;
  metaDescription: string;
  intro: string;
  level: string;
}

export interface TextEntry extends BaseEntry {
  collection: "texts";
  title: string;
  level: string;
}

export type AnyContentEntry = BlogEntry | LevelTextEntry | TextEntry;
