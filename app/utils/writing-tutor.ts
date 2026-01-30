import { getOpenRouterApiKey } from "~/services/db";
import { TRANSLATORS } from "~/types";

export interface TutorConversationMessage {
  role: "assistant" | "user";
  content: string;
}

export interface TutorResponse {
  status: "accept" | "retry";
  assistantReply: string | null;
  socraticHint: string | null;
  focusAreas: string[];
  suggestedRewrite: string | null;
}

interface TutorRequest {
  mode: "start" | "reply";
  topic: string;
  conversation: TutorConversationMessage[];
  userMessage?: string;
  level?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  model?: string;
}

const SYSTEM_PROMPT = `You are an English writing tutor for Spanish-speaking learners.
You lead a friendly chat based on a topic. Keep responses in English, 1-3 sentences, natural and concise.
When the user replies, evaluate their English writing.

Output ONLY strict JSON (no markdown). Schema:
{
  "status": "accept" | "retry",
  "assistantReply": string | null,
  "socraticHint": string | null,
  "focusAreas": string[],
  "suggestedRewrite": string | null
}

Rules:
- If mode is "start": ignore evaluation and return status "accept" with assistantReply that starts the conversation.
- If status is "accept": provide assistantReply (English). Set socraticHint and suggestedRewrite to null.
- If status is "retry": do NOT continue the conversation. assistantReply must be null.
  Provide a Socratic hint in Spanish that helps the user discover the issue themselves.
  focusAreas should be 1-3 short labels (e.g., "article usage", "verb tense", "word order").
  suggestedRewrite can be a more natural option but must be phrased as a suggestion, not a correction.
- Never say "wrong", "incorrect", "mal", "incorrecto" or similar.
- Be supportive and concise.`;

function sanitizeText(input: string): string {
  return input.trim().replace(/[<>"'&]/g, "");
}

function parseTutorResponse(raw: string): TutorResponse | null {
  const cleaned = raw.replace(/```/g, "").replace(/json/gi, "").trim();
  try {
    const parsed = JSON.parse(cleaned) as TutorResponse;
    if (!parsed || typeof parsed !== "object") return null;
    if (parsed.status !== "accept" && parsed.status !== "retry") return null;
    return {
      status: parsed.status,
      assistantReply: parsed.assistantReply ?? null,
      socraticHint: parsed.socraticHint ?? null,
      focusAreas: Array.isArray(parsed.focusAreas) ? parsed.focusAreas : [],
      suggestedRewrite: parsed.suggestedRewrite ?? null,
    };
  } catch {
    return null;
  }
}

export async function requestWritingTutor({
  mode,
  topic,
  conversation,
  userMessage,
  level = "B1",
  model = TRANSLATORS.SMART,
}: TutorRequest): Promise<{ data?: TutorResponse; error?: string }> {
  const apiKey = await getOpenRouterApiKey();

  if (!apiKey) {
    return { error: "NO_API_KEY" };
  }

  const sanitizedTopic = sanitizeText(topic);
  const sanitizedUserMessage = userMessage ? sanitizeText(userMessage) : "";

  if (!sanitizedTopic) {
    return { error: "INVALID_TOPIC" };
  }

  try {
    const payload = {
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: JSON.stringify({
            mode,
            topic: sanitizedTopic,
            level,
            conversation: conversation.slice(-10),
            userMessage: sanitizedUserMessage || null,
            instruction:
              "Start with a random angle related to the topic. Keep it conversational.",
          }),
        },
      ],
      max_tokens: 320,
      temperature: 0.7,
    };

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
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter tutor error:", response.status, errorData);

      if (response.status === 401) {
        return { error: "INVALID_API_KEY" };
      }
      if (response.status === 429) {
        return { error: "RATE_LIMITED" };
      }
      return { error: "API_ERROR" };
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return { error: "INVALID_RESPONSE" };
    }

    const parsed = parseTutorResponse(content);
    if (!parsed) {
      return { error: "INVALID_RESPONSE" };
    }

    if (parsed.status === "accept" && !parsed.assistantReply) {
      return { error: "INVALID_RESPONSE" };
    }

    if (parsed.status === "retry" && !parsed.socraticHint) {
      return { error: "INVALID_RESPONSE" };
    }

    return { data: parsed };
  } catch (error) {
    console.error("OpenRouter tutor error:", error);
    return { error: "NETWORK_ERROR" };
  }
}
