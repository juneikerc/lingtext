import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { cloudflare } from "@cloudflare/vite-plugin";
import path from "path";
import fs from "fs";
import contentCollections from "./app/lib/content/vite-content-plugin";

// Plugin to copy SQLite WASM files to public directory
function copySqliteWasm() {
  return {
    name: "copy-sqlite-wasm",
    buildStart() {
      const wasmSrc = path.resolve(
        __dirname,
        "node_modules/@sqlite.org/sqlite-wasm/sqlite-wasm/jswasm/sqlite3.wasm"
      );
      const wasmDest = path.resolve(__dirname, "public/assets/sqlite3.wasm");

      // Create assets directory if it doesn't exist
      const assetsDir = path.resolve(__dirname, "public/assets");
      if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
      }

      // Copy WASM file
      if (fs.existsSync(wasmSrc)) {
        fs.copyFileSync(wasmSrc, wasmDest);
        console.log("[SQLite WASM] Copied sqlite3.wasm to public/assets/");
      } else {
        console.warn("[SQLite WASM] Source file not found:", wasmSrc);
      }
    },
  };
}

export default defineConfig({
  plugins: [
    copySqliteWasm(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    reactRouter(),
    contentCollections(),
    tsconfigPaths({ projects: ["./tsconfig.vite.json"] }),
  ],
  // Required headers for SQLite WASM with SharedArrayBuffer/OPFS
  // Using 'credentialless' to allow third-party scripts (Clarity, etc.)
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "credentialless",
    },
  },
  preview: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "credentialless",
    },
  },
  // Optimize SQLite WASM dependencies - exclude from pre-bundling
  optimizeDeps: {
    exclude: ["@sqlite.org/sqlite-wasm"],
  },
  // Force browser entry point for SQLite WASM in all environments
  resolve: {
    alias: {
      "@sqlite.org/sqlite-wasm": path.resolve(
        __dirname,
        "node_modules/@sqlite.org/sqlite-wasm/index.mjs"
      ),
    },
  },
});
