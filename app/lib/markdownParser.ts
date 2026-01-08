import { Marked } from "marked";

const marked = new Marked();

export function parseMarkdown(markdown: string): string {
  if (!markdown) return "";

  try {
    // Forzamos el parseo síncrono
    return marked.parse(markdown, { async: false }) as string;
  } catch (e) {
    console.error("Error parsing markdown:", e);
    return markdown;
  }
}
