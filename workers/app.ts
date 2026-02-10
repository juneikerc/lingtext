import { createRequestHandler } from "react-router";

// Extend Env type to include ASSETS binding
interface ExtendedEnv extends Env {
  ASSETS?: {
    fetch: (request: Request) => Promise<Response>;
  };
}

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: ExtendedEnv;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

function isSongsRoute(pathname: string): boolean {
  return (
    pathname === "/aprender-ingles-con-canciones" ||
    pathname.startsWith("/aprender-ingles-con-canciones/")
  );
}

function shouldUseCrossOriginIsolation(pathname: string): boolean {
  return !isSongsRoute(pathname);
}

/**
 * Add COOP/COEP headers required for SQLite WASM with SharedArrayBuffer/OPFS
 * Using 'credentialless' instead of 'require-corp' to allow third-party scripts
 * like Microsoft Clarity while maintaining SharedArrayBuffer support.
 * Supported in Chrome 96+, Firefox 103+, Safari 15.2+
 */
function addSecurityHeaders(
  response: Response,
  pathname: string,
  isDocumentRequest: boolean
): Response {
  const newHeaders = new Headers(response.headers);

  if (!isDocumentRequest || shouldUseCrossOriginIsolation(pathname)) {
    newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
    newHeaders.set("Cross-Origin-Embedder-Policy", "credentialless");
    // Allow WASM files to be loaded
    newHeaders.set("Cross-Origin-Resource-Policy", "same-origin");
  } else {
    // Embeds de YouTube/Spotify suelen fallar bajo COEP en algunos navegadores.
    newHeaders.delete("Cross-Origin-Opener-Policy");
    newHeaders.delete("Cross-Origin-Embedder-Policy");
    newHeaders.delete("Cross-Origin-Resource-Policy");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

/**
 * Check if the request is for a static asset
 */
function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/assets/") ||
    pathname.endsWith(".wasm") ||
    pathname.endsWith(".js") ||
    pathname.endsWith(".css") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".mp3") ||
    pathname.endsWith(".txt") ||
    pathname.endsWith(".xml") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/ads.txt" ||
    pathname === "/favicon.ico"
  );
}

export default {
  async fetch(request: Request, env: ExtendedEnv, ctx: ExecutionContext) {
    const url = new URL(request.url);
    const accept = request.headers.get("accept") || "";
    const isDocumentRequest = accept.includes("text/html");

    // Try to serve static assets first if ASSETS binding is available
    if (env.ASSETS && isStaticAsset(url.pathname)) {
      try {
        const assetResponse = await env.ASSETS.fetch(request);
        if (assetResponse.status !== 404) {
          return addSecurityHeaders(assetResponse, url.pathname, false);
        }
      } catch {
        // Fall through to request handler
      }
    }

    const response = await requestHandler(request, {
      cloudflare: { env, ctx },
    });

    // Add COOP/COEP headers for SQLite WASM support
    return addSecurityHeaders(response, url.pathname, isDocumentRequest);
  },
} satisfies ExportedHandler<ExtendedEnv>;
