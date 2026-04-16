import {
  blogLoaders,
  blogManifests,
  legalPageLoaders,
  legalPageManifests,
  levelTextLoaders,
  levelTextManifests,
  testTextLoaders,
  testTextManifests,
  textLoaders,
  textManifests,
} from "virtual:content";
import type {
  BlogEntry,
  BlogManifestEntry,
  LegalPageEntry,
  LegalPageManifestEntry,
  LevelTextEntry,
  LevelTextManifestEntry,
  TestTextEntry,
  TestTextManifestEntry,
  TextEntry,
  TextManifestEntry,
} from "./types";

type ContentEntryLoader<TEntry> = () => Promise<{ entry: TEntry }>;
type ContentEntryLoaderMap<TEntry> = Record<string, ContentEntryLoader<TEntry>>;

const formatTextSlug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");

async function loadEntry<TEntry>(
  loaders: ContentEntryLoaderMap<TEntry>,
  id: string
): Promise<TEntry | undefined> {
  const loader = loaders[id];
  if (!loader) {
    return undefined;
  }

  const module = await loader();
  return module.entry;
}

export const allBlogManifests = blogManifests;
export const allLegalPageManifests = legalPageManifests;
export const allLevelTextManifests = levelTextManifests;
export const allTestTextManifests = testTextManifests;
export const allTextManifests = textManifests;

export async function getBlogBySlug(
  slug: string
): Promise<BlogEntry | undefined> {
  const blog = blogManifests.find((entry) => entry.slug === slug);
  if (!blog) {
    return undefined;
  }

  return loadEntry(blogLoaders, blog.id);
}

export async function getLegalPageBySlug(
  slug: string
): Promise<LegalPageEntry | undefined> {
  const legalPage = legalPageManifests.find((entry) => entry.slug === slug);
  if (!legalPage) {
    return undefined;
  }

  return loadEntry(legalPageLoaders, legalPage.id);
}

export async function getLevelTextByLevel(
  level: string
): Promise<LevelTextEntry | undefined> {
  const levelText = levelTextManifests.find((entry) => entry.level === level);
  if (!levelText) {
    return undefined;
  }

  return loadEntry(levelTextLoaders, levelText.id);
}

export async function getTestTextByLevel(
  level: string
): Promise<TestTextEntry | undefined> {
  const testText = testTextManifests.find((entry) => entry.level === level);
  if (!testText) {
    return undefined;
  }

  return loadEntry(testTextLoaders, testText.id);
}

export function getTextsByLevel(level: string): TextManifestEntry[] {
  return textManifests.filter((entry) => entry.level === level);
}

export async function getTextBySlug(
  slug: string
): Promise<TextEntry | undefined> {
  const text = textManifests.find(
    (entry) => formatTextSlug(entry.title) === slug
  );
  if (!text) {
    return undefined;
  }

  return loadEntry(textLoaders, text.id);
}

export function getBlogManifestBySlug(
  slug: string
): BlogManifestEntry | undefined {
  return blogManifests.find((entry) => entry.slug === slug);
}

export function getLegalPageManifestBySlug(
  slug: string
): LegalPageManifestEntry | undefined {
  return legalPageManifests.find((entry) => entry.slug === slug);
}

export function getLevelTextManifestByLevel(
  level: string
): LevelTextManifestEntry | undefined {
  return levelTextManifests.find((entry) => entry.level === level);
}

export function getTestTextManifestByLevel(
  level: string
): TestTextManifestEntry | undefined {
  return testTextManifests.find((entry) => entry.level === level);
}
