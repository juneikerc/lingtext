import type { Settings } from "../../types";
import { getDB, scheduleSave } from "./core";

/**
 * SETTINGS CRUD
 */

const OPENROUTER_KEY_SETTING = "openrouter_api_key";

const defaultSettings: Settings = {
  id: "preferences",
  tts: {
    lang: "en-US",
    rate: 1,
    pitch: 1,
    volume: 1,
    voiceName: undefined,
  },
};

export async function getSettings(): Promise<Settings> {
  const database = await getDB();
  const rows: Array<{ key: string; value: string }> = database.selectObjects(
    "SELECT * FROM settings WHERE key = ?",
    ["preferences"]
  );

  if (rows.length === 0) return defaultSettings;

  try {
    return JSON.parse(rows[0].value) as Settings;
  } catch {
    return defaultSettings;
  }
}

export async function saveSettings(prefs: Settings): Promise<void> {
  const database = await getDB();
  database.exec("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", {
    bind: ["preferences", JSON.stringify(prefs)],
  });
  scheduleSave();
}

/**
 * Get the stored OpenRouter API key
 */
export async function getOpenRouterApiKey(): Promise<string | null> {
  const database = await getDB();
  const rows: Array<{ key: string; value: string }> = database.selectObjects(
    "SELECT * FROM settings WHERE key = ?",
    [OPENROUTER_KEY_SETTING]
  );

  if (rows.length === 0) return null;
  return rows[0].value || null;
}

/**
 * Save the OpenRouter API key
 */
export async function saveOpenRouterApiKey(apiKey: string): Promise<void> {
  const database = await getDB();
  database.exec("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", {
    bind: [OPENROUTER_KEY_SETTING, apiKey],
  });
  scheduleSave();
}

/**
 * Delete the OpenRouter API key
 */
export async function deleteOpenRouterApiKey(): Promise<void> {
  const database = await getDB();
  database.exec("DELETE FROM settings WHERE key = ?", {
    bind: [OPENROUTER_KEY_SETTING],
  });
  scheduleSave();
}
