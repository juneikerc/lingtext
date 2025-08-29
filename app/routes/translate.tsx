import type { Route } from "./+types/translate";
import OpenAI from "openai";

// That is a "endpoint" Resource Route that returns the text to translate as a response without any html

export async function loader({ params, request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const model =
    new URLSearchParams(url.search).get("model") || "openai/gpt-oss-20b:free";
  const text = decodeURIComponent(params.text);

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPEN_ROUTER_API_KEY,
  });
  // model: "openai/gpt-oss-20b:free",
  // model: "google/gemma-3n-e4b-it:free",

  const completion = await openai.chat.completions.create({
    model: model,
    messages: [
      {
        role: "user",
        content: `translate this word to spanish (if the word "${text}" has multiple translations, return the most the 3 most common separated by a comma)(if the word has only one translation, return only 1 translation): ${text} (respond only with the translation no additional text)`,
      },
    ],
  });

  // console.log(completion.choices);

  return new Response(
    JSON.stringify({
      translation: completion.choices[0].message.content,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
