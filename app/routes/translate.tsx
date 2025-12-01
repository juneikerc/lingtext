import type { Route } from "./+types/translate";
import OpenAI from "openai";
import {
  translateRateLimiter,
  getClientIdentifier,
  createRateLimitResponse,
} from "~/utils/rate-limiter";

// That is a "endpoint" Resource Route that returns the text to translate as a response without any html

export async function loader({ params, request, context }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const model =
    new URLSearchParams(url.search).get("model") || "openai/gpt-oss-20b:free";
  const text = decodeURIComponent(params.text);

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: context.cloudflare.env.OPEN_ROUTER_API_KEY,
    defaultHeaders: {
      "HTTP-Referer": "https://lingtext.org",
      "X-Title": "LingText",
    },
  });

  const clientId = getClientIdentifier(request);
  const rateLimitResult = translateRateLimiter.checkLimit(clientId);

  if (!rateLimitResult.allowed) {
    return createRateLimitResponse(rateLimitResult.resetTime);
  }

  const sanitizedText = text.trim().replace(/[<>"'&]/g, "");

  if (!sanitizedText) {
    return new Response(JSON.stringify({ error: "Invalid text content" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const completion = await openai.chat.completions.create({
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
    });

    const translation = completion.choices[0]?.message?.content?.trim();
    if (!translation) {
      throw new Error("No translation received");
    }

    return new Response(
      JSON.stringify({
        translation: translation
          .replaceAll("```", "")
          .replaceAll("```", "")
          .replace("json", "")
          .trim(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": "15",
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": Math.floor(
            rateLimitResult.resetTime / 1000
          ).toString(),
        },
      }
    );
  } catch (error) {
    console.error("Translation API error:", error);

    // Return appropriate error response
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Translation service unavailable";
    const statusCode = errorMessage.includes("rate limit") ? 429 : 500;

    return new Response(
      JSON.stringify({
        error: "Translation failed",
        message:
          statusCode === 500
            ? "Translation service is temporarily unavailable. Please try again later."
            : errorMessage,
      }),
      {
        status: statusCode,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": "20",
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": Math.floor(
            rateLimitResult.resetTime / 1000
          ).toString(),
        },
      }
    );
  }
}
