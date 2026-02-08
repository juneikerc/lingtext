/**
 * Translation helpers for the extension.
 */

import { TRANSLATORS } from "@/types";

export { TRANSLATORS };

export const TRANSLATOR_LABELS: Record<TRANSLATORS, string> = {
  [TRANSLATORS.CHROME]: "⚡ Rápido | Básico",
  [TRANSLATORS.MEDIUM]: "🧠 Inteligente | Medio",
  [TRANSLATORS.SMART]: "🚀 Muy Inteligente",
};

export function isChromeAIAvailable(): boolean {
  const isChrome =
    navigator.userAgent.includes("Chrome") &&
    !navigator.userAgent.includes("Edg") &&
    !navigator.userAgent.includes("OPR");

  return isChrome && "Translator" in self;
}

export async function translateFromChrome(
  term: string
): Promise<{ translation: string }> {
  if (!("Translator" in self)) {
    return { translation: "" };
  }

  try {
    // @ts-expect-error Translator is an emerging Chrome API.
    const translator = await Translator.create({
      sourceLanguage: "en",
      targetLanguage: "es",
    });
    const result = await translator.translate(term);
    return { translation: String(result || "").trim() };
  } catch (error) {
    console.error("[LingText] Chrome Translation API error:", error);
    return { translation: "" };
  }
}

export async function translateWithOpenRouter(
  term: string,
  apiKey: string,
  model: TRANSLATORS = TRANSLATORS.MEDIUM
): Promise<{ translation: string; error?: string }> {
  if (!apiKey) {
    return { translation: "", error: "NO_API_KEY" };
  }

  const sanitizedText = term.trim().replace(/[<>"'&]/g, "");
  if (!sanitizedText) {
    return { translation: "", error: "INVALID_TEXT" };
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://lingtext.org",
        "X-Title": "LingText Extension",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: `You are a machine that outputs strict JSON. You receive an English word and output its Spanish translations grouped by grammatical category as a list of strings.\nRules:\n1. Use only valid JSON.\n2. Values must be arrays of strings.\n3. Only include relevant categories.\n\ntranslate this word to spanish: ${sanitizedText} (respond only with the translation no additional text)`,
          },
        ],
        max_tokens: 100,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { translation: "", error: "INVALID_API_KEY" };
      }
      if (response.status === 429) {
        return { translation: "", error: "RATE_LIMITED" };
      }
      return { translation: "", error: "API_ERROR" };
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const translation = data.choices?.[0]?.message?.content?.trim();

    if (!translation) {
      return { translation: "", error: "INVALID_RESPONSE" };
    }

    return {
      translation: translation.replaceAll("```", "").replace("json", "").trim(),
    };
  } catch (error) {
    console.error("[LingText] OpenRouter translation error:", error);
    return { translation: "", error: "NETWORK_ERROR" };
  }
}

export async function translateTerm(
  term: string,
  translator: TRANSLATORS,
  apiKey?: string
): Promise<{ translation: string; error?: string }> {
  if (translator === TRANSLATORS.CHROME) {
    const local = await translateFromChrome(term);
    if (local.translation) {
      return local;
    }

    if (apiKey) {
      return translateWithOpenRouter(term, apiKey, TRANSLATORS.MEDIUM);
    }

    return { translation: "", error: "CHROME_AI_NOT_AVAILABLE" };
  }

  if (!apiKey) {
    const local = await translateFromChrome(term);
    if (local.translation) {
      return local;
    }
    return { translation: "", error: "NO_API_KEY" };
  }

  return translateWithOpenRouter(term, apiKey, translator);
}
