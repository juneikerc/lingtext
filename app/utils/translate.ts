/**
 * Local Translation Utilities
 * All translation now runs 100% locally in the browser
 */

import { TRANSLATORS } from "../types";
import type { TranslationResult } from "../types";

/**
 * Translate using Chrome's native Translator API (Tier 0)
 * This is the fastest option when available
 */
export async function translateFromChromeAI(
  term: string
): Promise<{ translation: string }> {
  if (!("Translator" in self)) {
    return { translation: "" };
  }

  try {
    // @ts-expect-error Translator is experimental Chrome API
    const translator = await self.Translator.create({
      sourceLanguage: "en",
      targetLanguage: "es",
    });
    const result = await translator.translate(term);
    return { translation: result };
  } catch (error) {
    console.error("Chrome AI translation error:", error);
    return { translation: "" };
  }
}

/**
 * Check if Chrome AI is available
 */
export function isChromeAIAvailable(): boolean {
  return typeof self !== "undefined" && "Translator" in self;
}

/**
 * Check if WebGPU is available for GPU-accelerated models
 */
export async function isWebGPUAvailable(): Promise<boolean> {
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
 * Parse structured translation result from model JSON output
 */
export function parseTranslationJSON(
  jsonString: string,
  originalWord: string
): TranslationResult {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.word && parsed.info) {
      return {
        word: parsed.word,
        info: parsed.info,
        raw: jsonString,
      };
    }
  } catch {
    // Not valid JSON
  }

  // Fallback: treat as plain translation
  return {
    word: originalWord,
    info: { Translation: [jsonString.trim()] },
    raw: jsonString,
  };
}

/**
 * Extract simple translation string from TranslationResult
 * Used for backward compatibility with components expecting { translation: string }
 */
export function extractSimpleTranslation(result: TranslationResult): string {
  // Get first translation from info
  const values = Object.values(result.info);
  if (values.length > 0 && values[0].length > 0) {
    return values[0][0];
  }
  return result.raw || "";
}

/**
 * Format TranslationResult for display
 * Returns formatted string with part of speech labels
 */
export function formatTranslationResult(result: TranslationResult): string {
  const parts: string[] = [];

  for (const [pos, translations] of Object.entries(result.info)) {
    if (translations.length > 0) {
      parts.push(`${pos}: ${translations.join(", ")}`);
    }
  }

  return parts.join(" | ") || result.raw || "";
}

/**
 * Get model tier from TRANSLATORS enum
 */
export function getModelTier(model: TRANSLATORS): 0 | 1 | 2 | 3 | 4 {
  switch (model) {
    case TRANSLATORS.CHROME_AI:
      return 0;
    case TRANSLATORS.CPU_QWEN_05:
      return 1;
    case TRANSLATORS.GPU_QWEN_15:
      return 2;
    case TRANSLATORS.GPU_LLAMA_3:
      return 3;
    case TRANSLATORS.GPU_GEMMA_2:
      return 4;
    default:
      return 0;
  }
}

/**
 * Check if model requires GPU
 */
export function modelRequiresGPU(model: TRANSLATORS): boolean {
  return [
    TRANSLATORS.GPU_QWEN_15,
    TRANSLATORS.GPU_LLAMA_3,
    TRANSLATORS.GPU_GEMMA_2,
  ].includes(model);
}

/**
 * Simple translation function for backward compatibility
 * Uses Chrome AI for Tier 0, otherwise returns empty (engine handles other tiers)
 *
 * NOTE: For full tiered translation support, use the useTranslationEngine hook
 * This function is a simple fallback for components that haven't migrated yet
 */
export async function translateTerm(
  term: string,
  selected: TRANSLATORS
): Promise<{ translation: string }> {
  // For Chrome AI, use the native API directly
  if (selected === TRANSLATORS.CHROME_AI) {
    return translateFromChromeAI(term);
  }

  // For other models, the translation engine hook should be used
  // This is a fallback that tries Chrome AI first
  if (isChromeAIAvailable()) {
    const result = await translateFromChromeAI(term);
    if (result.translation) {
      return result;
    }
  }

  // Return empty if no translation available
  // Components should migrate to useTranslationEngine for full support
  console.warn(
    `translateTerm called with model ${selected} but engine not initialized. ` +
      `Use useTranslationEngine hook for full tiered translation support.`
  );
  return { translation: "" };
}
