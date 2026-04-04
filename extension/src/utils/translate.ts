/**
 * Translation helpers for the extension.
 */

import {
  buildOpenRouterWordPrompt,
  cleanTranslationResponse,
  isChromeAIAvailable,
  sanitizeTranslationInput,
  TRANSLATOR_LABELS as BASE_TRANSLATOR_LABELS,
  TRANSLATORS,
} from "@shared/translation";
import type { Translator } from "@/types";

export const TRANSLATOR_LABELS: Record<
  TRANSLATORS.CHROME | TRANSLATORS.MEDIUM | TRANSLATORS.SMART,
  string
> = {
  [TRANSLATORS.CHROME]: BASE_TRANSLATOR_LABELS[TRANSLATORS.CHROME],
  [TRANSLATORS.MEDIUM]: BASE_TRANSLATOR_LABELS[TRANSLATORS.MEDIUM],
  [TRANSLATORS.SMART]: BASE_TRANSLATOR_LABELS[TRANSLATORS.SMART],
};

export { isChromeAIAvailable, TRANSLATORS };

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
  model: Translator = TRANSLATORS.MEDIUM
): Promise<{ translation: string; error?: string }> {
  if (!apiKey) {
    return { translation: "", error: "NO_API_KEY" };
  }

  const sanitizedText = sanitizeTranslationInput(term);
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
            content: buildOpenRouterWordPrompt(sanitizedText),
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
      translation: cleanTranslationResponse(translation),
    };
  } catch (error) {
    console.error("[LingText] OpenRouter translation error:", error);
    return { translation: "", error: "NETWORK_ERROR" };
  }
}

export async function translateTerm(
  term: string,
  translator: Translator,
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
