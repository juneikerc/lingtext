declare module "virtual:content" {
  import type {
    BlogEntry,
    BlogManifestEntry,
    LegalPageEntry,
    LegalPageManifestEntry,
    LevelTextEntry,
    LevelTextManifestEntry,
    TextEntry,
    TextManifestEntry,
  } from "./types";

  export type ContentEntryLoader<TEntry> = () => Promise<{ entry: TEntry }>;

  export const blogManifests: BlogManifestEntry[];
  export const legalPageManifests: LegalPageManifestEntry[];
  export const levelTextManifests: LevelTextManifestEntry[];
  export const textManifests: TextManifestEntry[];

  export const blogLoaders: Record<string, ContentEntryLoader<BlogEntry>>;
  export const legalPageLoaders: Record<
    string,
    ContentEntryLoader<LegalPageEntry>
  >;
  export const levelTextLoaders: Record<
    string,
    ContentEntryLoader<LevelTextEntry>
  >;
  export const textLoaders: Record<string, ContentEntryLoader<TextEntry>>;
}
