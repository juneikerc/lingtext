import type { StoryConfig, GeneratedStoryResult, WordEntry } from "../types";
import { getWord } from "../services/db";
import { getOpenRouterApiKey } from "../services/db";

const TEXT_TYPE_LABELS: Record<StoryConfig["textType"], string> = {
  "short-story": "short story",
  article: "article",
  conversation: "conversation",
  "blog-post": "blog post",
  email: "email",
};

const LEVEL_DESCRIPTIONS: Record<StoryConfig["level"], string> = {
  A2: "basic vocabulary and simple sentence structures",
  B1: "intermediate vocabulary and moderate complexity",
  B2: "upper-intermediate vocabulary and varied sentence structures",
  C1: "advanced vocabulary and complex sentence structures",
  C2: "proficient vocabulary with nuanced expressions",
};

function buildPrompt(config: StoryConfig, words: WordEntry[]): string {
  const wordList = words.map((w) => w.word).join(", ");

  const typePrompts: Record<StoryConfig["textType"], string> = {
    "short-story": "Write a short story",
    article: "Write an informative article",
    conversation: "Write a dialogue between two people",
    "blog-post": "Write a blog post",
    email: "Write an email",
  };

  const themePart = config.customTheme ? ` about "${config.customTheme}"` : "";

  const prompt = `You are a creative writing assistant. ${typePrompts[config.textType]}${themePart} in English at ${config.level} level (${LEVEL_DESCRIPTIONS[config.level]}).

REQUIREMENTS:
- Minimum length: ${config.minLength} words
- MUST include these words naturally: ${wordList}
- Highlight the target words in **bold** when they appear
- Use Markdown formatting (headings, paragraphs, lists if needed)
- Generate an engaging, coherent ${TEXT_TYPE_LABELS[config.textType]}
- The highlighted words should feel natural, not forced

OUTPUT FORMAT (strict JSON):
{
  "title": "Catchy title here",
  "content": "The full content in Markdown with **bold** target words",
  "word_count": 450
}

Generate ONLY the JSON, no additional text.`;

  return prompt;
}

export async function generateStory(
  config: StoryConfig
): Promise<GeneratedStoryResult> {
  const apiKey = await getOpenRouterApiKey();

  if (!apiKey) {
    throw new Error("NO_API_KEY");
  }

  const words = await Promise.all(config.wordLowerList.map((w) => getWord(w)));
  const validWords = words.filter((w): w is WordEntry => w !== undefined);

  if (validWords.length === 0) {
    throw new Error("NO_VALID_WORDS");
  }

  const prompt = buildPrompt(config, validWords);

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://lingtext.org",
          "X-Title": "LingText Story Generator",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-exp",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          max_tokens: 2000,
          temperature: 0.8,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter API error:", response.status, errorData);

      if (response.status === 401) {
        throw new Error("INVALID_API_KEY");
      }
      if (response.status === 429) {
        throw new Error("RATE_LIMITED");
      }
      throw new Error("API_ERROR");
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("No content received");
    }

    const parsed = JSON.parse(
      content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()
    ) as GeneratedStoryResult;

    return {
      title: parsed.title,
      content: parsed.content,
      wordCount: parsed.wordCount || 0,
    };
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("NO_")) {
      throw error;
    }
    console.error("Story generation error:", error);
    throw new Error("NETWORK_ERROR");
  }
}

export async function generateMultipleStories(
  config: StoryConfig,
  onProgress?: (current: number, total: number) => void
): Promise<GeneratedStoryResult[]> {
  const results: GeneratedStoryResult[] = [];

  for (let i = 0; i < config.count; i++) {
    onProgress?.(i + 1, config.count);
    const result = await generateStory(config);
    results.push(result);
  }

  return results;
}
