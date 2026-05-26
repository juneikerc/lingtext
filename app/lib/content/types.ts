export type CollectionName =
  | "blogs"
  | "legalPages"
  | "levelsTexts"
  | "testsTexts"
  | "texts"
  | "vocabulary";

export interface ContentPayload {
  content: string;
  html: string;
}

export interface BaseEntryManifest {
  id: string;
  collection: CollectionName;
}

export interface BlogManifestEntry extends BaseEntryManifest {
  collection: "blogs";
  slug: string;
  title: string;
  mainHeading: string;
  metaDescription: string;
  image: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LevelTextManifestEntry extends BaseEntryManifest {
  collection: "levelsTexts";
  title: string;
  mainHeading: string;
  metaDescription: string;
  intro: string;
  level: string;
}

export interface TestTextManifestEntry extends BaseEntryManifest {
  collection: "testsTexts";
  title: string;
  mainHeading: string;
  metaDescription: string;
  intro: string;
  level: string;
}

export interface LegalPageManifestEntry extends BaseEntryManifest {
  collection: "legalPages";
  slug: string;
  title: string;
  mainHeading: string;
  metaDescription: string;
}

export interface TextManifestEntry extends BaseEntryManifest {
  collection: "texts";
  title: string;
  level: string;
  date: string;
  sound?: string;
  chapters?: string[];
}

export interface VocabularyManifestEntry extends BaseEntryManifest {
  collection: "vocabulary";
  title: string;
  mainHeading: string;
  metaDescription: string;
  intro: string;
  level: string;
}

export type BlogEntry = BlogManifestEntry & ContentPayload;

export type LevelTextEntry = LevelTextManifestEntry & ContentPayload;

export type TestTextEntry = TestTextManifestEntry & ContentPayload;

export type LegalPageEntry = LegalPageManifestEntry & ContentPayload;

export type TextEntry = TextManifestEntry & ContentPayload;

export type VocabularyEntry = VocabularyManifestEntry & ContentPayload;

export type AnyContentManifestEntry =
  | BlogManifestEntry
  | LegalPageManifestEntry
  | LevelTextManifestEntry
  | TestTextManifestEntry
  | TextManifestEntry
  | VocabularyManifestEntry;

export type AnyContentEntry =
  | BlogEntry
  | LegalPageEntry
  | LevelTextEntry
  | TestTextEntry
  | TextEntry
  | VocabularyEntry;
