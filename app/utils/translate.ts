import { TRANSLATORS } from "../types";
import { getOpenRouterApiKey } from "../services/db";

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
    const translateWithChromeAPI = async () => {
      try {
        // @ts-expect-error Translator is a new Chrome API not in TS types yet
        const translator = await Translator.create({
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
          "X-Title": "LingText",
        },
        body: JSON.stringify({
          model: model,
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

User: "beautiful"
Assistant:
{
  "word": "beautiful",
  "info": {
    "Adjective": ["hermoso", "bello", "bonito"]
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
    console.log(data);
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

// Unificado: según "selected" usa Chrome si está disponible; si no, usa OpenRouter con la API key del usuario.
export async function translateTerm(
  term: string,
  selected: TRANSLATORS
): Promise<{ translation: string; error?: string }> {
  if (selected === TRANSLATORS.CHROME) {
    const local = await translateFromChrome(term);
    const value = (local.translation || "").trim();
    if (value && value !== "Translation failed.") return { translation: value };
    // Fallback automático al modelo por defecto si Chrome no existe o falla
    return translateWithOpenRouter(term, TRANSLATORS.MEDIUM);
  }
  // Selección explícita de modelo remoto usando OpenRouter directamente
  return translateWithOpenRouter(term, selected);
}
