import { createRequestHandler } from "react-router";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

/**
 * Add COOP/COEP headers required for SQLite WASM with SharedArrayBuffer/OPFS
 */
function addSecurityHeaders(response: Response): Response {
  const newHeaders = new Headers(response.headers);
  newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
  newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

export default {
  async fetch(request, env, ctx) {
    const response = await requestHandler(request, {
      cloudflare: { env, ctx },
    });

    // Add COOP/COEP headers for SQLite WASM support
    return addSecurityHeaders(response);
  },
} satisfies ExportedHandler<Env>;
