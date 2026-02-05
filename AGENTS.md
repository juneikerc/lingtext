# LingText Agent Guidelines

This document guides agentic changes in LingText, a language learning app with
interactive reading and YouTube subtitles, backed by SQLite WASM + OPFS.

---

## Build, Lint, Typecheck, Test

### Web application (React Router v7)

- Development: `npm run dev`
- Build: `npm run build`
- Typecheck: `npm run typecheck` (runs `wrangler types`, `react-router typegen`, `tsc -b`); Cloudflare types: `npm run cf-typegen`
- Lint: `npm run lint`
- Lint autofix: `npm run lint:fix`
- Format: `npm run format`
- Format check: `npm run format:check`
- Deploy: `npm run deploy` (build + `wrangler deploy`)

### Browser extension

- Development: `cd extension && npm run dev`
- Build: `cd extension && npm run build` (tsc + Vite)

### Tests (single test guidance)

- There are no automated tests configured yet.
- Manual verification is required in the browser.
- If you add tests, prefer Vitest for unit logic and Playwright for E2E.
- Example single-test runs (only after adding these tools): `npx vitest path/to.test.ts -t "test name"`; `npx playwright test path/to.spec.ts -g "test name"`

---

## Code Style and Conventions

### Imports

- Web app: use `~/*` for absolute imports from `app/`.
- Extension: use relative imports; order: React/standard -> external -> `~` aliases -> relatives -> styles.
- Keep import groups separated by blank lines.

### Formatting (Prettier)

- Source of truth: `npm run format`.
- 2-space indentation, 80 column width, LF line endings.
- Semicolons required; double quotes in JS/TS and JSX.
- Trailing commas: ES5.

### TypeScript and linting

- Strict typing expected; avoid implicit `any`.
- `any` is allowed for SQLite WASM instances (see `app/services/db/core.ts`).
- Unused parameters should be prefixed with `_` (lint allows this).
- Avoid `console.log`; only `console.warn` and `console.error` are permitted; prefer `const` (no `var`).
- Accessibility linting is enabled via `jsx-a11y`.

### Naming

- Components: `PascalCase` (file and export).
- Hooks: `useCamelCase`.
- Functions/variables: `camelCase`.
- DB tables/columns: `snake_case`.
- Keep filenames aligned with exported symbols.

### Error handling

- UI routes and critical components should use `ErrorBoundary`.
- Wrap async DB/network operations in `try/catch`.
- Prefix DB errors with `[DB] Error:`.

---

## Architecture and Data Flow Notes

### Core stack

- React Router v7 (SPA) on Cloudflare Workers; Zustand for state.
- SQLite WASM with OPFS for persistence; Tailwind CSS v4 (web app) and v3 (extension).

### SQLite (critical)

- Access DB through `getDB()` to ensure `initDB()` has completed.
- Persist via `saveToOPFS()`; use `scheduleSave()` for debounced writes (500ms).
- Extension runs SQLite in a background service worker.

### Translation system

- Supports Chrome AI (local) and OpenRouter (remote); requests structured JSON with grammatical categories.
- Falls back from Chrome AI to OpenRouter on local API failure.

### Tokenization

- `app/utils/tokenize.ts` defines the authoritative tokenization; normalization lowercases and applies NFKD.
- Use `normalizeWord` for matching; keep logic in sync with extension.

### Spaced repetition

- `app/utils/spaced-repetition.ts` implements a simplified SM-2 algorithm; quality is 0-5, ease factor minimum is 1.3.

### Extension bridge sync

- Web app and extension sync via `window.postMessage`; see `extension/src/content/bridge.ts` and `app/hooks/useExtensionSync.ts`.

---

## UI/UX Guidelines (see `styles-guide.md`)

- Neutral surfaces (gray/white) and indigo as the primary accent.
- Avoid gradients; if needed use subtle, low-opacity blobs.
- Prefer color/border/shadow changes over scale transforms.
- Dark mode required: always pair `bg-*`, `text-*`, `border-*` with `dark:*`.
- Use `transition-colors duration-200` for interactive elements.
- Provide `focus-visible` styles and accessible targets.

### Accessibility checklist

- Provide `aria-label` for icon-only buttons.
- Ensure focus-visible styles on links/buttons/inputs.
- Keep tap targets comfortable (prefer `py-3` or larger for primary actions).
- Do not rely on color alone to convey state; consider `motion-reduce:*` when adding animations.

---

## Project Structure

- `app/`: React Router app; `app/components/`: UI components; `app/services/db/`: SQLite tables; `app/utils/`: shared utilities.
- `extension/`: Chrome extension source (`extension/src/background`, `extension/src/content`).
- `workers/`: Cloudflare worker entry points; `public/`: static assets (WASM, manifest).

---

## Cursor and Copilot Rules

- No `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md` found.

---

## Agent Best Practices

- Check `createTables` in `app/services/db/core.ts` before modifying DB flows.
- Keep tokenization logic identical between app and extension.
- COEP/COOP headers are required for SQLite WASM.
- Prefer Zustand stores or DB helpers over prop drilling.
- Update this file when introducing major architectural changes.
- If you add new test tooling, update the commands above.
