export type CollectionName = "blogs" | "legalPages" | "levelsTexts" | "texts";

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
}

export interface LevelTextManifestEntry extends BaseEntryManifest {
  collection: "levelsTexts";
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
  sound?: string;
}

export type BlogEntry = BlogManifestEntry & ContentPayload;

export type LevelTextEntry = LevelTextManifestEntry & ContentPayload;

export type LegalPageEntry = LegalPageManifestEntry & ContentPayload;

export type TextEntry = TextManifestEntry & ContentPayload;

export type AnyContentManifestEntry =
  | BlogManifestEntry
  | LegalPageManifestEntry
  | LevelTextManifestEntry
  | TextManifestEntry;

export type AnyContentEntry =
  | BlogEntry
  | LegalPageEntry
  | LevelTextEntry
  | TextEntry;
