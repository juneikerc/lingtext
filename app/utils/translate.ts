import { TRANSLATORS } from "../types";

export async function translateFromChrome(
  term: string
): Promise<{ translation: string }> {
  if ("Translator" in self) {
    const translateWithChromeAPI = async () => {
      try {
        // @ts-expect-error Translator is a new Chrome API not in TS types yet
        const translator = await Translator.create({
          sourceLanguage: "en",
          targetLanguage: "es",
        });
        const result = await translator.translate(term);
        return result;
      } catch (error) {
        console.error("Chrome Translation API error:", error);
        return "Translation failed.";
      }
    };

    return { translation: await translateWithChromeAPI() };
  } else {
    return { translation: "" };
  }
}

export async function translateRemote(
  term: string,
  model: string = TRANSLATORS.GPT_OSS_20B_FREE
): Promise<{ translation: string }> {
  try {
    const res = await fetch(
      `/translate/${encodeURIComponent(term)}?model=${encodeURIComponent(model)}`
    );
    if (!res.ok) {
      console.warn("Remote translate returned non-OK status", res.status);
      return { translation: "" };
    }
    return await res.json();
  } catch (err) {
    console.warn("Remote translate failed:", err);
    return { translation: "" };
  }
}

// Unificado: según "selected" usa Chrome si está disponible; si no, hace fallback automático al endpoint remoto.
export async function translateTerm(
  term: string,
  selected: TRANSLATORS
): Promise<{ translation: string }> {
  if (selected === TRANSLATORS.CHROME) {
    const local = await translateFromChrome(term);
    const value = (local.translation || "").trim();
    if (value && value !== "Translation failed.") return { translation: value };
    // Fallback automático al modelo por defecto si Chrome no existe o falla
    return translateRemote(term, TRANSLATORS.GPT_OSS_20B_FREE);
  }
  // Selección explícita de modelo remoto
  return translateRemote(term, selected);
}
