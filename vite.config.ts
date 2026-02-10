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

function shouldUseCrossOriginIsolation(pathname: string): boolean {
  return !(
    pathname === "/aprender-ingles-con-canciones" ||
    pathname.startsWith("/aprender-ingles-con-canciones/")
  );
}

function conditionalIsolationHeaders() {
  const applyHeaders = (
    urlPath: string,
    res: import("http").ServerResponse
  ) => {
    if (shouldUseCrossOriginIsolation(urlPath)) {
      res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
      res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
      return;
    }

    res.removeHeader("Cross-Origin-Opener-Policy");
    res.removeHeader("Cross-Origin-Embedder-Policy");
  };

  return {
    name: "conditional-isolation-headers",
    configureServer(server: import("vite").ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || "/";
        const pathname = url.split("?")[0];
        applyHeaders(pathname, res);
        next();
      });
    },
    configurePreviewServer(server: import("vite").PreviewServer) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || "/";
        const pathname = url.split("?")[0];
        applyHeaders(pathname, res);
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [
    copySqliteWasm(),
    conditionalIsolationHeaders(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    reactRouter(),
    contentCollections(),
    tsconfigPaths({ projects: ["./tsconfig.vite.json"] }),
  ],
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
