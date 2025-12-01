/**
 * CPU Worker for local translation
 * TIER 1: CPU (Low-end / Compatibility)
 *
 * STATUS: DISABLED - Transformers.js has compatibility issues with Vite ES modules workers
 * The ONNX Runtime bundling conflicts with Vite's worker handling.
 *
 * For now, users should use:
 * - Tier 0: Chrome AI (if available)
 * - Tiers 2-4: GPU models via WebLLM (if WebGPU available)
 *
 * TODO: Investigate solutions:
 * 1. Use a separate classic worker script loaded via URL
 * 2. Wait for transformers.js v3 with better ESM support
 * 3. Use a different lightweight translation library
 */

// Message handler - returns error explaining the limitation
self.onmessage = async (event: MessageEvent) => {
  const { type, id } = event.data;

  switch (type) {
    case "INIT":
      self.postMessage({
        type: "ERROR",
        error:
          "El modelo CPU no está disponible temporalmente. Usa Chrome AI o un modelo GPU si tienes WebGPU.",
        id,
      });
      break;

    case "TRANSLATE":
      self.postMessage({
        type: "ERROR",
        error:
          "El modelo CPU no está disponible. Por favor selecciona otro modelo.",
        id,
      });
      break;

    case "TERMINATE":
      self.postMessage({ type: "TERMINATED", id });
      break;

    default:
      self.postMessage({
        type: "ERROR",
        error: `Unknown message type: ${type}`,
        id,
      });
  }
};

// Signal that worker is ready (but limited)
self.postMessage({ type: "WORKER_READY" });
