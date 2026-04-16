import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import type { Plugin } from "vite";

import { collectionDefinitions } from "./collections";
import { compileMarkdown } from "./markdown";
import { compileMdx } from "./mdx";
import type {
  AnyContentEntry,
  AnyContentManifestEntry,
  CollectionName,
} from "./types";

const virtualId = "virtual:content";
const resolvedVirtualId = "\0virtual:content";
const entryVirtualPrefix = "virtual:content-entry/";
const resolvedEntryVirtualPrefix = "\0virtual:content-entry/";

type ContentMap = Record<CollectionName, AnyContentEntry[]>;
type ManifestMap = Record<CollectionName, AnyContentManifestEntry[]>;

interface CachedContentModule {
  entryMap: Record<string, AnyContentEntry>;
  manifestCode: string;
  watchedFiles: string[];
}

const createEmptyContentMap = (): ContentMap => ({
  blogs: [],
  legalPages: [],
  levelsTexts: [],
  testsTexts: [],
  texts: [],
});

const createEmptyManifestMap = (): ManifestMap => ({
  blogs: [],
  legalPages: [],
  levelsTexts: [],
  testsTexts: [],
  texts: [],
});

const isContentFile = (file: string) =>
  file.endsWith(".md") || file.endsWith(".mdx");

const normalizeId = (filePath: string, baseDir: string) => {
  const relative = path.relative(baseDir, filePath);
  return relative.replace(path.extname(relative), "");
};

const isWithinDirs = (file: string, dirs: string[]) =>
  dirs.some((dir) => file.startsWith(dir));

const toEntryKey = (collection: CollectionName, id: string) =>
  `${collection}:${id}`;

const stripContentPayload = (
  entry: AnyContentEntry
): AnyContentManifestEntry => {
  const manifest = { ...entry } as Partial<AnyContentEntry>;
  delete manifest.content;
  delete manifest.html;
  return manifest as AnyContentManifestEntry;
};

const parseEntryRequest = (id: string) => {
  const normalizedId = id.startsWith(resolvedEntryVirtualPrefix)
    ? id.slice(resolvedEntryVirtualPrefix.length)
    : id.slice(entryVirtualPrefix.length);
  const separatorIndex = normalizedId.indexOf("/");

  if (separatorIndex === -1) {
    return null;
  }

  const collection = normalizedId.slice(0, separatorIndex) as CollectionName;
  const entryId = normalizedId.slice(separatorIndex + 1);

  if (!collection || !entryId) {
    return null;
  }

  return { collection, entryId };
};

async function walkDir(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const nested = await walkDir(fullPath);
        files.push(...nested);
        return;
      }
      if (entry.isFile()) {
        files.push(fullPath);
      }
    })
  );

  return files;
}

function buildManifestModule(
  manifestMap: ManifestMap,
  contentMap: ContentMap
): string {
  const buildLoaderRecord = (collection: CollectionName) => {
    const entries = contentMap[collection]
      .map((entry) => {
        const requestId = `${entryVirtualPrefix}${collection}/${entry.id}`;
        return `${JSON.stringify(entry.id)}: () => import(${JSON.stringify(
          requestId
        )})`;
      })
      .join(",\n");

    return `{
${entries}
}`;
  };

  return [
    `export const blogManifests = ${JSON.stringify(manifestMap.blogs)};`,
    `export const legalPageManifests = ${JSON.stringify(
      manifestMap.legalPages
    )};`,
    `export const levelTextManifests = ${JSON.stringify(
      manifestMap.levelsTexts
    )};`,
    `export const testTextManifests = ${JSON.stringify(
      manifestMap.testsTexts
    )};`,
    `export const textManifests = ${JSON.stringify(manifestMap.texts)};`,
    `export const blogLoaders = ${buildLoaderRecord("blogs")};`,
    `export const legalPageLoaders = ${buildLoaderRecord("legalPages")};`,
    `export const levelTextLoaders = ${buildLoaderRecord("levelsTexts")};`,
    `export const testTextLoaders = ${buildLoaderRecord("testsTexts")};`,
    `export const textLoaders = ${buildLoaderRecord("texts")};`,
  ].join("\n");
}

async function buildContent(root: string): Promise<CachedContentModule> {
  const contentMap = createEmptyContentMap();
  const manifestMap = createEmptyManifestMap();
  const watchedFiles: string[] = [];
  const entryMap: Record<string, AnyContentEntry> = {};

  for (const definition of collectionDefinitions) {
    const directory = path.resolve(root, definition.directory);
    const files = await walkDir(directory);
    const contentFiles = files.filter(isContentFile).sort();

    for (const file of contentFiles) {
      const raw = await fs.readFile(file, "utf8");
      const { data, content } = matter(raw);
      const parsed = definition.schema.safeParse(data);

      if (!parsed.success) {
        const errorMessages = parsed.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ");
        throw new Error(
          `[content] Invalid frontmatter for ${file}: ${errorMessages}`
        );
      }

      const html = file.endsWith(".mdx")
        ? await compileMdx(content)
        : await compileMarkdown(content);

      const entry = {
        id: normalizeId(file, directory),
        collection: definition.name,
        ...parsed.data,
        content,
        html,
      } as AnyContentEntry;

      contentMap[definition.name].push(entry);
      manifestMap[definition.name].push(stripContentPayload(entry));
      entryMap[toEntryKey(definition.name, entry.id)] = entry;
      watchedFiles.push(file);
    }
  }

  return {
    entryMap,
    manifestCode: buildManifestModule(manifestMap, contentMap),
    watchedFiles,
  };
}

export default function contentCollections(): Plugin {
  let cachedModule: CachedContentModule | null = null;
  let rootDir = process.cwd();
  let rootDirs = collectionDefinitions.map((definition) =>
    path.resolve(rootDir, definition.directory)
  );

  const rebuild = async () => {
    cachedModule = await buildContent(rootDir);
    return cachedModule;
  };

  return {
    name: "lingtext-content-collections",
    configResolved(config) {
      rootDir = config.root;
      rootDirs = collectionDefinitions.map((definition) =>
        path.resolve(rootDir, definition.directory)
      );
    },
    resolveId(id) {
      if (id === virtualId) {
        return resolvedVirtualId;
      }
      if (id.startsWith(entryVirtualPrefix)) {
        return `${resolvedEntryVirtualPrefix}${id.slice(entryVirtualPrefix.length)}`;
      }
      return undefined;
    },
    async load(id) {
      const cached = cachedModule ?? (await rebuild());

      if (id === resolvedVirtualId) {
        cached.watchedFiles.forEach((file) => this.addWatchFile(file));
        return cached.manifestCode;
      }

      if (!id.startsWith(resolvedEntryVirtualPrefix)) {
        return undefined;
      }

      const request = parseEntryRequest(id);
      if (!request) {
        return undefined;
      }

      const entry =
        cached.entryMap[toEntryKey(request.collection, request.entryId)];
      if (!entry) {
        throw new Error(
          `[content] Missing entry for ${request.collection}/${request.entryId}`
        );
      }

      return `export const entry = ${JSON.stringify(entry)};`;
    },
    configureServer(viteServer) {
      rootDirs.forEach((dir) => viteServer.watcher.add(dir));
    },
    async handleHotUpdate(ctx) {
      if (!isContentFile(ctx.file)) return [];
      if (!isWithinDirs(ctx.file, rootDirs)) return [];

      await rebuild();

      const manifestModule =
        ctx.server.moduleGraph.getModuleById(resolvedVirtualId);
      if (manifestModule) {
        ctx.server.moduleGraph.invalidateModule(manifestModule);
      }

      for (const module of ctx.server.moduleGraph.idToModuleMap.values()) {
        if (module.id?.startsWith(resolvedEntryVirtualPrefix)) {
          ctx.server.moduleGraph.invalidateModule(module);
        }
      }

      ctx.server.ws.send({ type: "full-reload" });
      return [];
    },
  };
}
