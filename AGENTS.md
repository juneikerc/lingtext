# LingText Agent Guidelines

This document provides essential information for AI agents working on the LingText codebase. LingText is a language learning platform that allows users to read texts and watch YouTube videos with interactive subtitles, using SQLite WASM for local data persistence and AI for translations.

---

## 🛠 Build, Lint, and Test Commands

### Web Application (React Router v7)

- **Development**: `npm run dev` (Starts React Router dev server)
- **Build**: `npm run build` (Builds for production/Cloudflare)
- **Typecheck**: `npm run typecheck` (Runs `tsc -b`)
- **Lint**: `npm run lint` (ESLint)
- **Format**: `npm run format` (Prettier)

### Browser Extension

- **Development**: `cd extension && npm run dev`
- **Build**: `cd extension && npm run build` (Uses Vite + CRXJS)

### Testing

- **Current Status**: There are NO automated tests in this project yet.
- **Verification**: Perform manual verification in the browser.
- **Future**: If adding tests, prefer **Vitest** for unit logic and **Playwright** for E2E.

---

## 🎨 Code Style & Conventions

### Imports & Path Aliases

- **Web App**: Use `~/*` for absolute imports from the `app/` directory.
  - ✅ `import { getDB } from "~/services/db";`
  - ❌ `import { getDB } from "../../services/db";`
- **Extension**: Uses standard relative imports.
- **Order**: React/Standard -> External -> Internal Aliases (`~`) -> Relatives -> Styles.

### Types & Naming

- **TypeScript**: Use strict typing.
- **SQLite Types**: `any` is allowed for SQLite instances due to complex WASM type definitions (see `app/services/db/core.ts`).
- **Naming Conventions**:
  - **Components**: `PascalCase` (e.g., `ReaderHeader.tsx`)
  - **Hooks**: `useCamelCase` (e.g., `useExtensionSync.ts`)
  - **Logic/Variables**: `camelCase` (e.g., `translateTerm`)
  - **DB Tables/Columns**: `snake_case` (e.g., `word_lower`, `added_at`)

### Formatting

- **Standard**: Follow Prettier strictly. Run `npm run format` before finalizing changes.
- **Style**: 2-space indentation, semi-colons, single quotes.

### Error Handling

- **UI**: Use `ErrorBoundary` in routes and critical components.
- **Logic**: Wrap async operations (DB, Network) in `try/catch`.
- **Logging**: Prefix DB errors with `[DB] Error:`.

---

## 🏛 Architecture & Tech Stack

### Core Stack

- **Framework**: React Router v7 (SPA mode) on Cloudflare Workers.
- **State**: **Zustand** for lightweight reactive state.
- **Database**: **SQLite WASM** with **OPFS** (Origin Private File System).
- **Styling**: **Tailwind CSS v4**.

### SQLite Implementation (CRITICAL)

- **Singleton**: Access the DB via `getDB()` which ensures `initDB()` has completed.
- **Persistence**: Data is saved to OPFS via `saveToOPFS()`.
- **Debouncing**: Writes are debounced using `scheduleSave()` (500ms delay) to prevent excessive OPFS writes.
- **Worker**: The extension runs SQLite in a Background Service Worker.

### Translation System

- **Translators**: Supports **Chrome AI** (local) and **OpenRouter** (remote).
- **JSON Format**: AI translations are requested as structured JSON containing grammatical categories (Verb, Noun, etc.).
- **Fallback**: Automatic fallback from Chrome AI to OpenRouter if the local API is unavailable.

### Browser Extension Sync

- **Bridge Sync**: Data is synchronized between the web app and extension via `window.postMessage` when the user visits the web app.
- **Logic**: See `extension/src/content/bridge.ts` and `app/hooks/useExtensionSync.ts`.

---

## 📂 Project Structure

- `app/`: React Router application source.
  - `components/`: UI components organized by feature.
  - `services/db/`: SQLite database logic and table definitions.
  - `utils/`: Shared utilities (tokenization, translation, etc.).
- `extension/`: Chrome extension source.
  - `src/background/`: Background service worker (DB management).
  - `src/content/`: Content scripts for YouTube and synchronization.
- `workers/`: Cloudflare Worker entry points.
- `public/`: Static assets (WASM files, manifest).

---

## 🧠 Core Logic & Algorithms

### Tokenization (`app/utils/tokenize.ts`)

The `tokenize` function splits text into words and non-word tokens.

- **Normalization**: Words are lowercased and normalized to NFKD to remove accents for matching.
- **Consistency**: This logic MUST remain identical between the app and the extension.

### Spaced Repetition (`app/utils/spaced-repetition.ts`)

Uses a simplified SM-2 (Anki-style) algorithm.

- **Quality**: 0-5 scale (0=total fail, 5=perfect).
- **Intervals**: Calculated based on the Ease Factor and previous repetitions.
- **Ease Factor**: Adjusted based on response quality (minimum 1.3).

---

## 💄 UI/UX Principles (from styles-guide.md)

- **The Indigo Rule**: Use `indigo-600` as the primary accent for actions, links, and focus states.
- **Neutrality**: Surfaces should be neutral (Gray/White). Avoid gradients and heavy shadows.
- **Dark Mode**: Every component MUST support dark mode (`dark:bg-gray-950`, `dark:text-gray-100`).
- **Transitions**: Use `transition-colors duration-200` for interactive elements.

---

## 📝 Best Practices for Agents

1. **Analyze DB Schema**: Check `createTables` in `app/services/db/core.ts` before modifying data flows.
2. **Synchronized Tokenization**: Ensure word matching works by using the `normalizeWord` utility.
3. **WASM Headers**: Be aware of COEP/COOP headers required for SQLite WASM.
4. **No Hidden Logic**: Always update the `AGENTS.md` if you introduce major architectural changes.
5. **State Updates**: Prefer updating state via Zustand stores or DB helpers rather than prop-drilling.
