// workers/app.ts
import { createRequestHandler } from "react-router";
import type { ExportedHandler } from "cloudflare:workers";

// Tipar el env si quieres autocompletado
interface Env {
  OPEN_ROUTER_API_KEY: string;
}

const handler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

const worker: ExportedHandler<Env> = {
  async fetch(request, env, ctx) {
    return handler(request, {
      cloudflare: { env, ctx },
    });
  },
};

export default worker;
