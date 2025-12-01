/**
 * useTranslationEngine - The Brain of the Local Translation System
 * Manages workers, hardware detection, model loading, and translation
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { TRANSLATORS, MODEL_INFO } from "~/types";
import type { TranslationStatus, TranslationResult } from "~/types";

// Storage key for user preference
const STORAGE_KEY = "lingtext_preferred_model";

// Worker message types
interface WorkerMessage {
  type: string;
  id?: string;
  result?: string;
  error?: string;
  value?: number;
  status?: string;
  message?: string;
  modelId?: string;
  cached?: boolean;
  text?: string;
  file?: string;
}

// Pending request tracking
interface PendingRequest {
  resolve: (value: string) => void;
  reject: (error: Error) => void;
}

export interface TranslationEngineState {
  // Current status
  status: TranslationStatus;
  downloadProgress: number;
  progressText: string;

  // Hardware capabilities
  hasGPU: boolean;
  gpuChecked: boolean;

  // Current model
  currentModel: TRANSLATORS;
  modelReady: boolean;

  // Available models (filtered by hardware)
  availableModels: TRANSLATORS[];

  // Chrome AI availability
  hasChromeAI: boolean;

  // Error state
  error: string | null;
}

export interface TranslationEngine {
  state: TranslationEngineState;
  translate: (text: string) => Promise<TranslationResult>;
  selectModel: (model: TRANSLATORS) => Promise<void>;
  initializeModel: () => Promise<void>;
  unloadModel: () => Promise<void>;
}

/**
 * Check if Chrome's native translation API is available
 */
function checkChromeAI(): boolean {
  return typeof window !== "undefined" && "Translator" in window;
}

/**
 * Check if WebGPU is available
 */
async function checkWebGPU(): Promise<boolean> {
  if (typeof navigator === "undefined" || !("gpu" in navigator)) {
    return false;
  }

  try {
    // @ts-expect-error WebGPU types may not be available
    const adapter = await navigator.gpu.requestAdapter();
    return adapter !== null;
  } catch {
    return false;
  }
}

/**
 * Get available models based on hardware capabilities
 */
function getAvailableModels(
  hasGPU: boolean,
  hasChromeAI: boolean
): TRANSLATORS[] {
  const models: TRANSLATORS[] = [];

  // Tier 0: Chrome AI (always available if supported)
  if (hasChromeAI) {
    models.push(TRANSLATORS.CHROME_AI);
  }

  // Tier 1: CPU (always available)
  models.push(TRANSLATORS.CPU_QWEN_05);

  // Tiers 2-4: GPU models (only if GPU available)
  if (hasGPU) {
    models.push(TRANSLATORS.GPU_QWEN_15);
    models.push(TRANSLATORS.GPU_LLAMA_3);
    models.push(TRANSLATORS.GPU_GEMMA_2);
  }

  return models;
}

/**
 * Get default model based on hardware
 */
function getDefaultModel(hasGPU: boolean, hasChromeAI: boolean): TRANSLATORS {
  // Check localStorage for saved preference
  if (typeof localStorage !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && Object.values(TRANSLATORS).includes(saved as TRANSLATORS)) {
      const savedModel = saved as TRANSLATORS;
      const info = MODEL_INFO[savedModel];

      // Validate saved model is compatible with current hardware
      if (!info.requiresGPU || hasGPU) {
        return savedModel;
      }
    }
  }

  // Default selection based on hardware
  if (hasChromeAI) {
    return TRANSLATORS.CHROME_AI;
  }
  if (hasGPU) {
    return TRANSLATORS.GPU_QWEN_15; // Recommended
  }
  return TRANSLATORS.CPU_QWEN_05;
}

/**
 * Translate using Chrome's native API
 */
async function translateWithChromeAI(text: string): Promise<string> {
  if (!("Translator" in window)) {
    throw new Error("Chrome AI not available");
  }

  try {
    // @ts-expect-error Translator is experimental Chrome API
    const translator = await window.Translator.create({
      sourceLanguage: "en",
      targetLanguage: "es",
    });
    const result = await translator.translate(text);

    // Format as JSON for consistency
    return JSON.stringify({
      word: text,
      info: { Translation: [result] },
    });
  } catch (error) {
    throw new Error(
      `Chrome AI translation failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Parse translation result from model output
 */
function parseTranslationResult(
  text: string,
  originalWord: string
): TranslationResult {
  try {
    // Try to parse as JSON
    const parsed = JSON.parse(text);
    if (parsed.word && parsed.info) {
      return {
        word: parsed.word,
        info: parsed.info,
        raw: text,
      };
    }
  } catch {
    // Not valid JSON, treat as plain translation
  }

  // Fallback: treat entire response as translation
  return {
    word: originalWord,
    info: { Translation: [text.trim()] },
    raw: text,
  };
}

/**
 * Main translation engine hook
 */
export function useTranslationEngine(): TranslationEngine {
  // State
  const [state, setState] = useState<TranslationEngineState>({
    status: "idle",
    downloadProgress: 0,
    progressText: "",
    hasGPU: false,
    gpuChecked: false,
    currentModel: TRANSLATORS.CHROME_AI,
    modelReady: false,
    availableModels: [],
    hasChromeAI: false,
    error: null,
  });

  // Worker refs
  const cpuWorkerRef = useRef<Worker | null>(null);
  const gpuWorkerRef = useRef<Worker | null>(null);
  const pendingRequestsRef = useRef<Map<string, PendingRequest>>(new Map());
  const requestIdRef = useRef(0);

  // Generate unique request ID
  const generateRequestId = useCallback(() => {
    requestIdRef.current += 1;
    return `req_${requestIdRef.current}_${Date.now()}`;
  }, []);

  // Handle worker messages
  const handleWorkerMessage = useCallback(
    (event: MessageEvent<WorkerMessage>) => {
      const { type, id, result, error, value, status, message, text } =
        event.data;

      switch (type) {
        case "WORKER_READY":
          // Worker initialized
          break;

        case "STATUS":
          setState((prev) => ({
            ...prev,
            status: (status as TranslationStatus) || prev.status,
            progressText: message || "",
            modelReady: status === "ready",
          }));
          break;

        case "PROGRESS":
          setState((prev) => ({
            ...prev,
            downloadProgress: (value || 0) * 100,
            progressText:
              text ||
              message ||
              `Downloading... ${Math.round((value || 0) * 100)}%`,
          }));
          break;

        case "INIT_COMPLETE":
          setState((prev) => ({
            ...prev,
            status: "ready",
            modelReady: true,
            downloadProgress: 100,
            progressText: "Model ready",
          }));
          break;

        case "TRANSLATION_RESULT":
          if (id && pendingRequestsRef.current.has(id)) {
            const pending = pendingRequestsRef.current.get(id)!;
            pendingRequestsRef.current.delete(id);
            pending.resolve(result || "");
          }
          break;

        case "ERROR":
          setState((prev) => ({
            ...prev,
            status: "error",
            error: error || "Unknown error",
          }));
          if (id && pendingRequestsRef.current.has(id)) {
            const pending = pendingRequestsRef.current.get(id)!;
            pendingRequestsRef.current.delete(id);
            pending.reject(new Error(error || "Unknown error"));
          }
          break;

        case "TERMINATED":
        case "UNLOADED":
          setState((prev) => ({
            ...prev,
            modelReady: false,
            status: "idle",
          }));
          break;
      }
    },
    []
  );

  // Initialize hardware detection
  useEffect(() => {
    let mounted = true;

    async function detectHardware() {
      const hasChromeAI = checkChromeAI();
      const hasGPU = await checkWebGPU();

      if (!mounted) return;

      const availableModels = getAvailableModels(hasGPU, hasChromeAI);
      const defaultModel = getDefaultModel(hasGPU, hasChromeAI);

      setState((prev) => ({
        ...prev,
        hasGPU,
        gpuChecked: true,
        hasChromeAI,
        availableModels,
        currentModel: defaultModel,
        // Chrome AI is always ready (no download needed)
        modelReady: defaultModel === TRANSLATORS.CHROME_AI,
        status: defaultModel === TRANSLATORS.CHROME_AI ? "ready" : "idle",
      }));
    }

    detectHardware();

    return () => {
      mounted = false;
    };
  }, []);

  // Cleanup workers on unmount
  useEffect(() => {
    return () => {
      if (cpuWorkerRef.current) {
        cpuWorkerRef.current.terminate();
        cpuWorkerRef.current = null;
      }
      if (gpuWorkerRef.current) {
        gpuWorkerRef.current.terminate();
        gpuWorkerRef.current = null;
      }
    };
  }, []);

  // Get or create CPU worker
  const getCPUWorker = useCallback(() => {
    if (!cpuWorkerRef.current) {
      cpuWorkerRef.current = new Worker(
        new URL("../workers/cpu.worker.ts", import.meta.url),
        { type: "module" }
      );
      cpuWorkerRef.current.onmessage = handleWorkerMessage;
    }
    return cpuWorkerRef.current;
  }, [handleWorkerMessage]);

  // Get or create GPU worker
  const getGPUWorker = useCallback(() => {
    if (!gpuWorkerRef.current) {
      gpuWorkerRef.current = new Worker(
        new URL("../workers/gpu.worker.ts", import.meta.url),
        { type: "module" }
      );
      gpuWorkerRef.current.onmessage = handleWorkerMessage;
    }
    return gpuWorkerRef.current;
  }, [handleWorkerMessage]);

  // Initialize model
  const initializeModel = useCallback(async () => {
    const { currentModel, modelReady } = state;

    // Chrome AI doesn't need initialization
    if (currentModel === TRANSLATORS.CHROME_AI) {
      setState((prev) => ({ ...prev, modelReady: true, status: "ready" }));
      return;
    }

    // Already ready
    if (modelReady) return;

    setState((prev) => ({
      ...prev,
      status: "downloading",
      downloadProgress: 0,
      error: null,
    }));

    const modelInfo = MODEL_INFO[currentModel];

    try {
      if (currentModel === TRANSLATORS.CPU_QWEN_05) {
        // CPU model
        const worker = getCPUWorker();
        const id = generateRequestId();

        await new Promise<void>((resolve, reject) => {
          pendingRequestsRef.current.set(id, {
            resolve: () => resolve(),
            reject,
          });
          worker.postMessage({ type: "INIT", id });

          // Timeout after 5 minutes
          setTimeout(
            () => {
              if (pendingRequestsRef.current.has(id)) {
                pendingRequestsRef.current.delete(id);
                reject(new Error("Model initialization timed out"));
              }
            },
            5 * 60 * 1000
          );
        });
      } else {
        // GPU model
        const worker = getGPUWorker();
        const id = generateRequestId();

        await new Promise<void>((resolve, reject) => {
          pendingRequestsRef.current.set(id, {
            resolve: () => resolve(),
            reject,
          });
          worker.postMessage({
            type: "INIT",
            modelId: modelInfo.modelHfId,
            id,
          });

          // Timeout after 10 minutes for larger models
          setTimeout(
            () => {
              if (pendingRequestsRef.current.has(id)) {
                pendingRequestsRef.current.delete(id);
                reject(new Error("Model initialization timed out"));
              }
            },
            10 * 60 * 1000
          );
        });
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: error instanceof Error ? error.message : "Initialization failed",
      }));
      throw error;
    }
  }, [state, getCPUWorker, getGPUWorker, generateRequestId]);

  // Select model
  const selectModel = useCallback(
    async (model: TRANSLATORS) => {
      // Validate model is available
      if (!state.availableModels.includes(model)) {
        throw new Error(`Model ${model} is not available on this device`);
      }

      // Save preference
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_KEY, model);
      }

      // Update state
      setState((prev) => ({
        ...prev,
        currentModel: model,
        modelReady: model === TRANSLATORS.CHROME_AI,
        status: model === TRANSLATORS.CHROME_AI ? "ready" : "idle",
        downloadProgress: 0,
        error: null,
      }));
    },
    [state.availableModels]
  );

  // Unload model
  const unloadModel = useCallback(async () => {
    const { currentModel } = state;

    if (currentModel === TRANSLATORS.CHROME_AI) {
      return; // Nothing to unload
    }

    if (currentModel === TRANSLATORS.CPU_QWEN_05 && cpuWorkerRef.current) {
      cpuWorkerRef.current.postMessage({ type: "TERMINATE" });
      cpuWorkerRef.current = null;
    } else if (gpuWorkerRef.current) {
      gpuWorkerRef.current.postMessage({ type: "UNLOAD" });
    }

    setState((prev) => ({
      ...prev,
      modelReady: false,
      status: "idle",
    }));
  }, [state]);

  // Translate text
  const translate = useCallback(
    async (text: string): Promise<TranslationResult> => {
      const { currentModel, modelReady } = state;

      // Chrome AI
      if (currentModel === TRANSLATORS.CHROME_AI) {
        setState((prev) => ({ ...prev, status: "computing" }));
        try {
          const result = await translateWithChromeAI(text);
          setState((prev) => ({ ...prev, status: "ready" }));
          return parseTranslationResult(result, text);
        } catch (error) {
          setState((prev) => ({ ...prev, status: "ready" }));
          throw error;
        }
      }

      // Ensure model is ready
      if (!modelReady) {
        await initializeModel();
      }

      setState((prev) => ({ ...prev, status: "computing" }));

      const id = generateRequestId();

      try {
        const result = await new Promise<string>((resolve, reject) => {
          pendingRequestsRef.current.set(id, { resolve, reject });

          if (currentModel === TRANSLATORS.CPU_QWEN_05) {
            const worker = getCPUWorker();
            worker.postMessage({ type: "TRANSLATE", text, id });
          } else {
            const worker = getGPUWorker();
            worker.postMessage({ type: "TRANSLATE", text, id });
          }

          // Timeout after 60 seconds
          setTimeout(() => {
            if (pendingRequestsRef.current.has(id)) {
              pendingRequestsRef.current.delete(id);
              reject(new Error("Translation timed out"));
            }
          }, 60 * 1000);
        });

        setState((prev) => ({ ...prev, status: "ready" }));
        return parseTranslationResult(result, text);
      } catch (error) {
        setState((prev) => ({ ...prev, status: "ready" }));
        throw error;
      }
    },
    [state, initializeModel, getCPUWorker, getGPUWorker, generateRequestId]
  );

  return {
    state,
    translate,
    selectModel,
    initializeModel,
    unloadModel,
  };
}
