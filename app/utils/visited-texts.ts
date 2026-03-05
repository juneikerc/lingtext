const VISITED_TEXT_IDS_STORAGE_KEY = "lingtext_visited_text_ids_v1";

function canUseLocalStorage() {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

export function getVisitedTextIds(): string[] {
  if (!canUseLocalStorage()) {
    return [];
  }

  try {
    const value = window.localStorage.getItem(VISITED_TEXT_IDS_STORAGE_KEY);
    if (!value) {
      return [];
    }

    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return Array.from(
      new Set(parsed.filter((item): item is string => typeof item === "string"))
    );
  } catch {
    return [];
  }
}

export function markTextAsVisited(textId: string): void {
  if (!canUseLocalStorage() || !textId) {
    return;
  }

  try {
    const visitedTextIds = getVisitedTextIds();

    if (visitedTextIds.includes(textId)) {
      return;
    }

    const nextVisitedTextIds = new Set(visitedTextIds);
    nextVisitedTextIds.add(textId);

    window.localStorage.setItem(
      VISITED_TEXT_IDS_STORAGE_KEY,
      JSON.stringify(Array.from(nextVisitedTextIds))
    );
  } catch {
    // Ignore storage failures so reading remains usable.
  }
}
