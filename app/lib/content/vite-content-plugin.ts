import path from "node:path";
import fs from "node:fs/promises";
import matter from "gray-matter";
import type { Plugin } from "vite";
import { compileMarkdown } from "./markdown";
import { compileMdx } from "./mdx";
import { collectionDefinitions } from "./collections";
import type { CollectionName } from "./types";

const virtualId = "virtual:content";
const resolvedVirtualId = "\0virtual:content";

type ContentMap = Record<CollectionName, unknown[]>;

const createEmptyContentMap = (): ContentMap => ({
  blogs: [],
  levelsTexts: [],
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

async function buildContent(root: string) {
  const contentMap = createEmptyContentMap();
  const watchedFiles: string[] = [];

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
      };

      contentMap[definition.name].push(entry);
      watchedFiles.push(file);
    }
  }

  const moduleCode = [
    `export const allBlogs = ${JSON.stringify(contentMap.blogs)};`,
    `export const allLevelsTexts = ${JSON.stringify(contentMap.levelsTexts)};`,
    `export const allTexts = ${JSON.stringify(contentMap.texts)};`,
  ].join("\n");

  return { moduleCode, watchedFiles };
}

export default function contentCollections(): Plugin {
  let cachedModule: { moduleCode: string; watchedFiles: string[] } | null =
    null;
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
      return undefined;
    },
    async load(id) {
      if (id !== resolvedVirtualId) return undefined;
      const { moduleCode, watchedFiles } = cachedModule ?? (await rebuild());
      watchedFiles.forEach((file) => this.addWatchFile(file));
      return moduleCode;
    },
    configureServer(viteServer) {
      rootDirs.forEach((dir) => viteServer.watcher.add(dir));
    },
    async handleHotUpdate(ctx) {
      if (!isContentFile(ctx.file)) return [];
      if (!isWithinDirs(ctx.file, rootDirs)) return [];

      await rebuild();
      const module = ctx.server.moduleGraph.getModuleById(resolvedVirtualId);
      if (module) {
        ctx.server.moduleGraph.invalidateModule(module);
      }
      ctx.server.ws.send({ type: "full-reload" });
      return [];
    },
  };
}
