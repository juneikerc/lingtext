import type { ExtensionSettings } from "@/types";
import { TRANSLATORS } from "@/types";

export function isChromeBrowser(): boolean {
  const userAgent = globalThis.navigator?.userAgent ?? "";
  return (
    userAgent.includes("Chrome") &&
    !userAgent.includes("Edg") &&
    !userAgent.includes("OPR") &&
    !userAgent.includes("Firefox")
  );
}

export function getDefaultExtensionSettings(): ExtensionSettings {
  return {
    translator: isChromeBrowser() ? TRANSLATORS.CHROME : TRANSLATORS.MYMEMORY,
    apiKey: "",
    captionLanguage: "en",
    hideNativeCc: true,
  };
}

export function normalizeExtensionSettings(
  settings?: Partial<ExtensionSettings>
): ExtensionSettings {
  const defaults = getDefaultExtensionSettings();
  const next: ExtensionSettings = {
    ...defaults,
    ...settings,
    captionLanguage: "en",
  };

  if (!isChromeBrowser() && next.translator === TRANSLATORS.CHROME) {
    next.translator = TRANSLATORS.MYMEMORY;
  }

  return next;
}
