/**
 * GPU Worker for local translation using WebLLM
 * Supports multiple models: Qwen2.5-1.5B, Llama-3.1-8B, Gemma-2-9B
 * TIER 2-4: GPU (Medium to High-end)
 */

import {
  MLCEngine,
  CreateMLCEngine,
  InitProgressReport,
} from "@mlc-ai/web-llm";

// Model configurations
export const GPU_MODELS = {
  GPU_QWEN_15: "Qwen2.5-1.5B-Instruct-q4f16_1-MLC",
  GPU_LLAMA_3: "Llama-3.1-8B-Instruct-q4f16_1-MLC",
  GPU_GEMMA_2: "gemma-2-9b-it-q4f16_1-MLC",
} as const;

export type GPUModelId = keyof typeof GPU_MODELS;

// Singleton engine instance
let engine: MLCEngine | null = null;
let currentModelId: string | null = null;
let isLoading = false;

// System prompt for JSON-enforced translation
const SYSTEM_PROMPT = `You are a dictionary engine. You receive a word. You output specific JSON.
Schema:
{
  "word": "input_word",
  "info": {
    "Part_Of_Speech": ["translation1", "translation2"]
  }
}
Example User: "run"
Example Output: {"word": "run", "info": {"Verb": ["correr"], "Noun": ["carrera"]}}
NO EXPLANATIONS. ONLY JSON.`;

/**
 * Initialize the WebLLM engine with a specific model
 */
async function initializeEngine(modelId: string): Promise<void> {
  // If same model is already loaded, skip
  if (engine && currentModelId === modelId) {
    self.postMessage({
      type: "STATUS",
      status: "ready",
      message: "Model already loaded",
    });
    return;
  }

  // If different model, unload current
  if (engine && currentModelId !== modelId) {
    await engine.unload();
    engine = null;
    currentModelId = null;
  }

  if (isLoading) return;
  isLoading = true;

  try {
    self.postMessage({
      type: "STATUS",
      status: "downloading",
      message: `Initializing ${modelId}...`,
    });

    const progressCallback = (report: InitProgressReport) => {
      self.postMessage({
        type: "PROGRESS",
        value: report.progress,
        text: report.text,
      });
    };

    engine = await CreateMLCEngine(modelId, {
      initProgressCallback: progressCallback,
    });

    currentModelId = modelId;

    self.postMessage({
      type: "STATUS",
      status: "ready",
      message: `${modelId} ready`,
      modelId,
    });
  } catch (error) {
    self.postMessage({
      type: "ERROR",
      error:
        error instanceof Error ? error.message : "Failed to load GPU model",
    });
    throw error;
  } finally {
    isLoading = false;
  }
}

/**
 * Translate a word using the loaded model
 */
async function translate(text: string): Promise<string> {
  if (!engine) {
    throw new Error("Model not initialized. Call INIT first.");
  }

  self.postMessage({
    type: "STATUS",
    status: "computing",
    message: "Translating...",
  });

  try {
    const response = await engine.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text },
      ],
      max_tokens: 150,
      temperature: 0.1,
    });

    const generatedText = response.choices[0]?.message?.content || "";

    // Clean up the response - extract JSON
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? jsonMatch[0] : generatedText;

    self.postMessage({
      type: "STATUS",
      status: "ready",
      message: "Translation complete",
    });

    return result;
  } catch (error) {
    self.postMessage({
      type: "STATUS",
      status: "ready",
      message: "Ready",
    });
    throw error;
  }
}

/**
 * Check if a model is cached in the browser
 */
async function checkModelCached(modelId: string): Promise<boolean> {
  try {
    // WebLLM uses Cache API internally
    const cache = await caches.open("webllm/model");
    const keys = await cache.keys();
    return keys.some((key) => key.url.includes(modelId));
  } catch {
    return false;
  }
}

/**
 * Get cache info for a model
 */
async function getCacheInfo(): Promise<{
  cached: boolean;
  modelId: string | null;
}> {
  return {
    cached: currentModelId !== null,
    modelId: currentModelId,
  };
}

// Message handler
self.onmessage = async (event: MessageEvent) => {
  const { type, modelId, text, id } = event.data;

  switch (type) {
    case "INIT":
      if (!modelId) {
        self.postMessage({
          type: "ERROR",
          error: "modelId is required for GPU worker initialization",
          id,
        });
        return;
      }
      try {
        await initializeEngine(modelId);
        self.postMessage({ type: "INIT_COMPLETE", id, modelId });
      } catch (error) {
        self.postMessage({
          type: "ERROR",
          error:
            error instanceof Error ? error.message : "Initialization failed",
          id,
        });
      }
      break;

    case "TRANSLATE":
      try {
        const result = await translate(text);
        self.postMessage({
          type: "TRANSLATION_RESULT",
          result,
          id,
        });
      } catch (error) {
        self.postMessage({
          type: "ERROR",
          error: error instanceof Error ? error.message : "Translation failed",
          id,
        });
      }
      break;

    case "CHECK_CACHED":
      try {
        const cached = await checkModelCached(modelId);
        self.postMessage({
          type: "CACHE_STATUS",
          cached,
          modelId,
          id,
        });
      } catch (error) {
        self.postMessage({
          type: "ERROR",
          error: error instanceof Error ? error.message : "Cache check failed",
          id,
        });
      }
      break;

    case "GET_CACHE_INFO":
      try {
        const info = await getCacheInfo();
        self.postMessage({
          type: "CACHE_INFO",
          ...info,
          id,
        });
      } catch (error) {
        self.postMessage({
          type: "ERROR",
          error:
            error instanceof Error ? error.message : "Failed to get cache info",
          id,
        });
      }
      break;

    case "UNLOAD":
      try {
        if (engine) {
          await engine.unload();
          engine = null;
          currentModelId = null;
        }
        self.postMessage({ type: "UNLOADED", id });
      } catch (error) {
        self.postMessage({
          type: "ERROR",
          error: error instanceof Error ? error.message : "Unload failed",
          id,
        });
      }
      break;

    case "TERMINATE":
      if (engine) {
        await engine.unload();
        engine = null;
        currentModelId = null;
      }
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

// Signal that worker is ready
self.postMessage({ type: "WORKER_READY" });
