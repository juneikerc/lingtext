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
          content: `translate this word to spanish (if the word "${sanitizedText}" has multiple translations, return the most the 3 most common separated by a comma)(if the word has only one translation, return only 1 translation): ${sanitizedText} (respond only with the translation no additional text)`,
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
        translation: translation,
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
