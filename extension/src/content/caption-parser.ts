import type { SubtitleCue } from "@/types";

function decodeHtmlEntities(input: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = input;
  return textarea.value;
}

function normalizeCueText(input: string): string {
  return decodeHtmlEntities(input).replace(/\s+/g, " ").trim();
}

function parseJson3(payload: string): SubtitleCue[] {
  const parsed = JSON.parse(payload) as {
    events?: Array<{
      tStartMs?: number;
      dDurationMs?: number;
      segs?: Array<{ utf8?: string }>;
    }>;
  };

  if (!Array.isArray(parsed.events)) {
    return [];
  }

  const cues: SubtitleCue[] = [];

  for (const event of parsed.events) {
    if (!Array.isArray(event.segs) || typeof event.tStartMs !== "number") {
      continue;
    }

    const text = normalizeCueText(
      event.segs.map((segment) => segment.utf8 || "").join("")
    );

    if (!text) {
      continue;
    }

    const start = event.tStartMs / 1000;
    const durationMs =
      typeof event.dDurationMs === "number" && event.dDurationMs > 0
        ? event.dDurationMs
        : 2000;
    const end = start + durationMs / 1000;

    cues.push({ start, end, text });
  }

  return cues;
}

function parseXml(payload: string): SubtitleCue[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(payload, "text/xml");
  const nodes = doc.querySelectorAll("text");

  const cues: SubtitleCue[] = [];

  nodes.forEach((node) => {
    const start = Number.parseFloat(node.getAttribute("start") || "");
    const duration = Number.parseFloat(node.getAttribute("dur") || "");

    if (!Number.isFinite(start)) {
      return;
    }

    const text = normalizeCueText(node.textContent || "");
    if (!text) {
      return;
    }

    const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 2;
    cues.push({ start, end: start + safeDuration, text });
  });

  return cues;
}

export function parseCaptionPayload(payload: string): SubtitleCue[] {
  const input = payload.trim();
  if (!input) {
    return [];
  }

  let cues: SubtitleCue[] = [];

  if (input.startsWith("{")) {
    try {
      cues = parseJson3(input);
    } catch {
      cues = [];
    }
  }

  if (cues.length === 0) {
    try {
      cues = parseXml(input);
    } catch {
      cues = [];
    }
  }

  cues.sort((a, b) => a.start - b.start || a.end - b.end);
  return cues;
}
