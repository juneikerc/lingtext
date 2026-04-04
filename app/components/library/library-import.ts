import { validateTitle } from "~/utils/validation";

export function normalizeImportedTitle(rawTitle: string, sourceUrl: string): string {
  const cleanedTitle = rawTitle
    .replace(/[<>"'&]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);

  if (cleanedTitle && validateTitle(cleanedTitle).isValid) {
    return cleanedTitle;
  }

  try {
    const hostnameTitle = new URL(sourceUrl).hostname
      .replace(/^www\./, "")
      .replace(/[<>"'&]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 200);

    if (hostnameTitle && validateTitle(hostnameTitle).isValid) {
      return hostnameTitle;
    }
  } catch {
    // Ignore URL parsing errors and use fallback title.
  }

  return "Texto importado desde URL";
}
