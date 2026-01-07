/**
 * Traducción - Adaptado de app/utils/translate.ts
 * Usa Chrome AI (Translator API) con fallback a OpenRouter
 */

export enum TRANSLATORS {
  CHROME = "chrome",
  MEDIUM = "medium",
  SMART = "smart",
}

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

  const hasTranslatorAPI = "Translator" in self;

  return isChrome && hasTranslatorAPI;
}

export async function translateFromChrome(
  term: string
): Promise<{ translation: string }> {
  if ("Translator" in self) {
    try {
      // @ts-expect-error Translator is a new Chrome API not in TS types yet
      const translator = await Translator.create({
        sourceLanguage: "en",
        targetLanguage: "es",
      });
      const result = await translator.translate(term);
      return { translation: result };
    } catch (error) {
      console.error("Chrome Translation API error:", error);
      return { translation: "" };
    }
  }
  return { translation: "" };
}

/**
 * Traducción con OpenRouter (requiere API key guardada)
 */
export async function translateWithOpenRouter(
  term: string,
  apiKey: string,
  model: string = TRANSLATORS.MEDIUM
): Promise<{ translation: string; error?: string }> {
  if (!apiKey) {
    return { translation: "", error: "NO_API_KEY" };
  }

  const sanitizedText = term.trim().replace(/[<>"'&]/g, "");
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
          "X-Title": "LingText Extension",
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "user",
              content: `You are a machine that outputs strict JSON. You receive an English word and output its Spanish translations grouped by grammatical category as a list of strings.
Rules:
1. Use only valid JSON.
2. Values must be arrays of strings.
3. Only include relevant categories.

EXAMPLES:

User: "run"
Assistant:
{
  "word": "run",
  "info": {
    "Verb": ["correr", "ejecutar", "administrar"],
    "Noun": ["carrera", "recorrido", "racha"]
  }
}

User: "fast"
Assistant:
{
  "word": "fast",
  "info": {
    "Adjective": ["rápido", "veloz", "adelantado"],
    "Adverb": ["rápidamente"],
    "Noun": ["ayuno"],
    "Verb": ["ayunar"]
  }
}
          
translate this word to spanish: ${sanitizedText} (respond only with the translation no additional text)`,
            },
          ],
          max_tokens: 100,
          temperature: 0.3,
        }),
      }
    );

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
      return { translation: "", error: "No translation received" };
    }

    return {
      translation: translation.replaceAll("```", "").replace("json", "").trim(),
    };
  } catch (error) {
    console.error("OpenRouter translation error:", error);
    return { translation: "", error: "NETWORK_ERROR" };
  }
}

/**
 * Función unificada de traducción
 * Usa el traductor seleccionado
 */
export async function translateTerm(
  term: string,
  translator: TRANSLATORS = TRANSLATORS.CHROME,
  apiKey?: string
): Promise<{ translation: string; error?: string }> {
  // Si es Chrome AI
  if (translator === TRANSLATORS.CHROME) {
    const chromeResult = await translateFromChrome(term);
    if (chromeResult.translation) {
      return { translation: chromeResult.translation };
    }
    // Fallback a OpenRouter si Chrome AI falla
    if (apiKey) {
      return translateWithOpenRouter(term, apiKey, TRANSLATORS.MEDIUM);
    }
    return { translation: "", error: "CHROME_AI_NOT_AVAILABLE" };
  }

  // Si es Medium o Smart, usar OpenRouter con diferentes modelos
  if (!apiKey) {
    // Intentar Chrome AI como fallback
    const chromeResult = await translateFromChrome(term);
    if (chromeResult.translation) {
      return { translation: chromeResult.translation };
    }
    return { translation: "", error: "NO_API_KEY" };
  }

  const model =
    translator === TRANSLATORS.SMART ? TRANSLATORS.SMART : TRANSLATORS.MEDIUM;

  return translateWithOpenRouter(term, apiKey, model);
}
