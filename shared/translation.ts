import { TRANSLATORS } from "./vocabulary";

export { TRANSLATORS };

export const TRANSLATOR_LABELS: Record<TRANSLATORS, string> = {
  [TRANSLATORS.CHROME]: "⚡ Rápido | Básico",
  [TRANSLATORS.MYMEMORY]: "🆓 Gratis | Básico",
  [TRANSLATORS.MEDIUM]: "🧠 Inteligente | Medio",
  [TRANSLATORS.SMART]: "🚀 Muy Inteligente",
};

export function isChromeAIAvailable(): boolean {
  const runtime = globalThis as typeof globalThis & {
    navigator?: { userAgent?: string };
    Translator?: unknown;
  };
  const userAgent = runtime.navigator?.userAgent ?? "";
  const isChrome =
    userAgent.includes("Chrome") &&
    !userAgent.includes("Edg") &&
    !userAgent.includes("OPR");

  return isChrome && "Translator" in runtime;
}

export function sanitizeTranslationInput(term: string): string {
  return term.trim().replace(/[<>"'&]/g, "");
}

export function buildOpenRouterWordPrompt(term: string): string {
  return `You are a machine that outputs strict JSON. You receive an English word and output its Spanish translations grouped by grammatical category as a list of strings.
Rules:
1. Use only valid JSON.
2. Values must be arrays of strings.
3. Only include relevant categories.

some of the categories are: Noun, Verb, Adjective, Adverb, Pronoun, Preposition, Conjunction, Interjection, Phrase, Sentence.

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

translate this word to spanish: ${term} (respond only with the translation no additional text)`;
}

export function cleanTranslationResponse(content: string): string {
  return content.replaceAll("```", "").replace("json", "").trim();
}
