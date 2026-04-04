# Content Collections

This folder contains LingText's custom content collections system. Content is
compiled at build time into Vite virtual modules so the app does not depend on
filesystem access at runtime.

## Overview

- Source files live in `app/content/**` as `.md` or `.mdx`.
- Frontmatter is validated with Zod per collection.
- Markdown/MDX is compiled to HTML at build time.
- The runtime exposes two layers:
  - lightweight manifests for indexes and lookups
  - per-entry lazy modules for full `content` + `html`

That split matters because route indexes should not ship the raw body of every
article or text to the client.

## Current collections

- `blogs` -> `app/content/blogs/**/*.{md,mdx}`
- `legalPages` -> `app/content/legal/**/*.{md,mdx}`
- `levelsTexts` -> `app/content/levelsTexts/**/*.{md,mdx}`
- `texts` -> `app/content/texts/**/*.{md,mdx}`

Schemas are defined in `app/lib/content/collections.ts`.

## Runtime API

Use the helpers in `app/lib/content/runtime.ts` instead of importing the
virtual module directly.

### Manifest helpers

- `allBlogManifests`
- `allLegalPageManifests`
- `allLevelTextManifests`
- `allTextManifests`
- `getTextsByLevel(level)`
- `getBlogManifestBySlug(slug)`
- `getLegalPageManifestBySlug(slug)`
- `getLevelTextManifestByLevel(level)`

Manifest entries contain only collection metadata, never raw markdown or HTML.

### Detail helpers

- `getBlogBySlug(slug)`
- `getLegalPageBySlug(slug)`
- `getLevelTextByLevel(level)`
- `getTextBySlug(slug)`

These helpers are async because they lazy-load a single content entry.

## Rendering

- For blog/legal/level detail pages, load one entry and render `html` with
  `ProseContent`.
- For the interactive reader, load one text entry and pass `content` to
  `Reader` with `format: "markdown"`.
- For listings and level selectors, use manifests only.

## Virtual module shape

`virtual:content` now exports manifest arrays plus loader records. The loader
records point to `virtual:content-entry/<collection>/<id>` modules, which are
split by entry.

This keeps route bundles smaller:

- index pages consume manifests only
- detail pages fetch one entry on demand
- the text reader no longer imports the entire `texts` collection

## MDX rules

- MDX is supported, but JSX components and expressions are not allowed.
- Treat MDX as Markdown-only syntax; JSX tags will fail the build.

## Adding a new collection

1. Create `app/content/<collectionName>/`.
2. Add the schema and directory to `app/lib/content/collections.ts`.
3. Extend `CollectionName` and add both manifest/detail types in
   `app/lib/content/types.ts`.
4. Update `app/lib/content/virtual.d.ts` with manifest arrays and loader
   records for the new collection.
5. Update `app/lib/content/vite-content-plugin.ts` so the manifest module and
   per-entry virtual modules include the new collection.
6. Add runtime helpers in `app/lib/content/runtime.ts`.

## Hot reload

- In dev, content changes trigger a full reload.
- Adding or removing files is handled by the Vite plugin rebuild.

## Troubleshooting

- MDX JSX error: remove JSX tags and keep Markdown-only syntax.
- Frontmatter error: verify required fields in `collections.ts`.
- Unexpected bundle growth: check that the route consumes manifests instead of
  full entry helpers where possible.
