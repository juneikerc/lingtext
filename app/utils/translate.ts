import {
  buildOpenRouterWordPrompt,
  cleanTranslationResponse,
  isChromeAIAvailable,
  sanitizeTranslationInput,
  TRANSLATORS,
} from "@shared/translation";
import { getOpenRouterApiKey } from "../services/db";
import type { Translator } from "../types";

export { isChromeAIAvailable };

const MYMEMORY_DISCLAIMER =
  "Este traductor gratuito a veces puede fallar.";

export async function translateWithMyMemory(
  term: string
): Promise<{ translation: string; error?: string; disclaimer?: string }> {
  const sanitizedText = term.trim();
  if (!sanitizedText) {
    return { translation: "", error: "Invalid text content" };
  }

  try {
    const url = new URL("https://api.mymemory.translated.net/get");
    url.searchParams.set("q", sanitizedText);
    url.searchParams.set("langpair", "en|es");

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error("MyMemory API error:", response.status);
      return { translation: "", error: "API_ERROR" };
    }

    const data = (await response.json()) as {
      responseData?: { translatedText?: string };
      responseStatus?: number | string;
      responseDetails?: string;
      quotaFinished?: boolean;
    };

    const responseStatus =
      data.responseStatus === undefined
        ? 200
        : Number.parseInt(String(data.responseStatus), 10);

    const responseDetails = String(data.responseDetails || "").toLowerCase();
    const looksLikeQuotaExceeded =
      data.quotaFinished === true ||
      responseDetails.includes("quota") ||
      (responseDetails.includes("limit") && responseDetails.includes("day"));

    if (looksLikeQuotaExceeded) {
      return { translation: "", error: "MYMEMORY_QUOTA_EXCEEDED" };
    }

    if (responseStatus !== 200) {
      console.error(
        "MyMemory API error:",
        responseStatus,
        data.responseDetails
      );
      return { translation: "", error: "API_ERROR" };
    }

    const translation = (data.responseData?.translatedText || "").trim();
    if (!translation) {
      return { translation: "", error: "INVALID_RESPONSE" };
    }

    return {
      translation,
      disclaimer: MYMEMORY_DISCLAIMER,
    };
  } catch (error) {
    console.error("MyMemory translation error:", error);
    return { translation: "", error: "NETWORK_ERROR" };
  }
}

export async function translateFromChrome(
  term: string
): Promise<{ translation: string }> {
  const runtime = globalThis as typeof globalThis & {
    Translator?: {
      create: (options: {
        sourceLanguage: string;
        targetLanguage: string;
      }) => Promise<{
        translate: (input: string) => Promise<string>;
      }>;
    };
  };

  if ("Translator" in runtime) {
    const translateWithChromeAPI = async () => {
      try {
        // @ts-expect-error Translator is a new Chrome API not in TS types yet
        const translator = await runtime.Translator.create({
          sourceLanguage: "en",
          targetLanguage: "es",
        });
        const result = await translator.translate(term);
        return result;
      } catch (error) {
        console.error("Chrome Translation API error:", error);
        return "Translation failed.";
      }
    };

    return { translation: await translateWithChromeAPI() };
  } else {
    return { translation: "" };
  }
}

/**
 * Translate using OpenRouter API directly from the client
 * Requires user's own API key stored in the database
 */
export async function translateWithOpenRouter(
  term: string,
  model: string = TRANSLATORS.MEDIUM
): Promise<{ translation: string; error?: string }> {
  const apiKey = await getOpenRouterApiKey();

  if (!apiKey) {
    return {
      translation: "",
      error: "NO_API_KEY",
    };
  }

  const sanitizedText = sanitizeTranslationInput(term);
  if (!sanitizedText) {
    return { translation: "", error: "Invalid text content" };
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://lingtext.org",
          "X-Title": "LingText",
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "user",
              content: buildOpenRouterWordPrompt(sanitizedText),
            },
          ],
          max_tokens: 100,
          temperature: 0.3,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter API error:", response.status, errorData);

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
      return { translation: "", error: "No translation received" };
    }

    return {
      translation: cleanTranslationResponse(translation),
    };
  } catch (error) {
    console.error("OpenRouter translation error:", error);
    return { translation: "", error: "NETWORK_ERROR" };
  }
}

// Unificado: según "selected" usa Chrome si está disponible; si no, usa OpenRouter con la API key del usuario.
export async function translateTerm(
  term: string,
  selected: Translator
): Promise<{ translation: string; error?: string; disclaimer?: string }> {
  if (selected === TRANSLATORS.CHROME) {
    const local = await translateFromChrome(term);
    const value = (local.translation || "").trim();
    if (value && value !== "Translation failed.") return { translation: value };

    const free = await translateWithMyMemory(term);
    const freeValue = (free.translation || "").trim();
    if (freeValue) {
      return {
        translation: freeValue,
        disclaimer: free.disclaimer,
      };
    }

    // Fallback automático al modelo por defecto si Chrome no existe o falla
    return translateWithOpenRouter(term, TRANSLATORS.MEDIUM);
  }

  if (selected === TRANSLATORS.MYMEMORY) {
    return translateWithMyMemory(term);
  }

  // Selección explícita de modelo remoto usando OpenRouter directamente
  return translateWithOpenRouter(term, selected);
}
