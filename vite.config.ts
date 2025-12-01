import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { cloudflare } from "@cloudflare/vite-plugin";
import path from "path";

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
  // Required headers for SQLite WASM with SharedArrayBuffer/OPFS
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  preview: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
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
