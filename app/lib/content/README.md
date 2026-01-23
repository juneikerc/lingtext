# Content Collections (SSR-safe)

This folder contains the custom content collections system used by LingText.
It replaces `@content-collections` and works in SSR and production without
filesystem access at runtime. Content is compiled at build time into a Vite
virtual module.

## Overview

- Source files live in `app/content/**` as `.md` or `.mdx`.
- Frontmatter is validated with Zod per collection.
- Markdown/MDX is compiled to HTML at build time.
- Runtime uses `virtual:content` (no fs access) via `app/lib/content/runtime.ts`.

## Current collections

- `blogs` -> `app/content/blogs/**/*.{md,mdx}`
- `levelsTexts` -> `app/content/levelsTexts/**/*.{md,mdx}`
- `texts` -> `app/content/texts/**/*.{md,mdx}`

Schemas are defined in `app/lib/content/collections.ts`.

## Runtime API

Use the helpers in `app/lib/content/runtime.ts` instead of importing the
virtual module directly.

Example:

```ts
import { getBlogBySlug } from "~/lib/content/runtime";

export function loader({ params }) {
  const blog = getBlogBySlug(params.slug ?? "");
  if (!blog) throw new Response("Not Found", { status: 404 });
  return { blog };
}
```

Available exports:

- `allBlogs`, `allLevelsTexts`, `allTexts`
- `getBlogBySlug(slug)`
- `getLevelTextByLevel(level)`
- `getTextsByLevel(level)`

Each entry contains:

- `content`: raw markdown/MDX content (string)
- `html`: precompiled HTML (string)
- plus frontmatter fields for the collection

## Rendering

- For static pages (blog/levels), render the HTML directly:

```tsx
<ProseContent html={entry.html} />
```

- For the Reader (interactive tokenization), use the raw `content` and
  set `format: "markdown"` as before.

## MDX rules

- MDX is supported, but JSX components and expressions are **not** allowed.
- Treat MDX as Markdown-only syntax; JSX tags will error at build time.

## Adding a new collection

1. Create the content folder

```
app/content/<collectionName>/
```

2. Add a schema and directory in `app/lib/content/collections.ts`

```ts
{
  name: "guides",
  directory: "app/content/guides",
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
  }),
}
```

3. Update types in `app/lib/content/types.ts`

- Extend `CollectionName` with the new name.
- Add a new entry interface (e.g., `GuideEntry`).
- Add the new entry type to `AnyContentEntry`.

4. Update the virtual module typing

Add the new export in `app/lib/content/virtual.d.ts`:

```ts
export const allGuides: GuideEntry[];
```

5. Update the virtual module build output

Add the export in `app/lib/content/vite-content-plugin.ts`:

```ts
const moduleCode = [
  "export const allBlogs = ...",
  "export const allGuides = ...",
].join("\n");
```

6. Update runtime helpers

Add a helper in `app/lib/content/runtime.ts` (and export the new `allGuides`).

7. Add route usage

Use the new helper in loaders or route components and render either `html`
or `content` depending on the UI.

## Frontmatter rules

- Blog entries must include `slug` in frontmatter.
- Missing or invalid frontmatter fails the build with a clear error.

## Hot reload (dev)

- In dev (`npm run dev`), content changes trigger a full reload.
- If you add/remove files, Vite picks up the change automatically.

## Troubleshooting

- Build error about MDX JSX: remove JSX tags and keep Markdown-only syntax.
- Missing frontmatter: verify required fields in `collections.ts`.
- Changes not reflected: restart dev server to flush caches.
