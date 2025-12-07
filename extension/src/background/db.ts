/**
 * Base de datos SQLite para la extensión
 * Adaptado de app/services/db.ts para funcionar en Service Worker
 *
 * NOTA: En extensiones MV3, el Service Worker puede ser terminado.
 * Usamos chrome.storage.local como fallback y OPFS cuando esté disponible.
 */

import type { WordEntry, PhraseEntry, Settings } from "@/types";

// Para extensiones, usamos chrome.storage.local como almacenamiento principal
// SQLite WASM en Service Workers tiene limitaciones

const STORAGE_KEYS = {
  WORDS: "lingtext_words",
  PHRASES: "lingtext_phrases",
  SETTINGS: "lingtext_settings",
  API_KEY: "lingtext_openrouter_key",
};

// ============================================================================
// WORDS CRUD
// ============================================================================

export async function getAllWords(): Promise<WordEntry[]> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.WORDS);
  return result[STORAGE_KEYS.WORDS] || [];
}

export async function getWord(
  wordLower: string
): Promise<WordEntry | undefined> {
  const words = await getAllWords();
  return words.find((w) => w.wordLower === wordLower);
}

export async function putWord(entry: WordEntry): Promise<void> {
  const words = await getAllWords();
  const index = words.findIndex((w) => w.wordLower === entry.wordLower);
  if (index >= 0) {
    words[index] = entry;
  } else {
    words.push(entry);
  }
  await chrome.storage.local.set({ [STORAGE_KEYS.WORDS]: words });
}

export async function deleteWord(wordLower: string): Promise<void> {
  const words = await getAllWords();
  const filtered = words.filter((w) => w.wordLower !== wordLower);
  await chrome.storage.local.set({ [STORAGE_KEYS.WORDS]: filtered });
}

// ============================================================================
// PHRASES CRUD
// ============================================================================

export async function getAllPhrases(): Promise<PhraseEntry[]> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.PHRASES);
  return result[STORAGE_KEYS.PHRASES] || [];
}

export async function getPhrase(
  phraseLower: string
): Promise<PhraseEntry | undefined> {
  const phrases = await getAllPhrases();
  return phrases.find((p) => p.phraseLower === phraseLower);
}

export async function putPhrase(entry: PhraseEntry): Promise<void> {
  const phrases = await getAllPhrases();
  const index = phrases.findIndex((p) => p.phraseLower === entry.phraseLower);
  if (index >= 0) {
    phrases[index] = entry;
  } else {
    phrases.push(entry);
  }
  await chrome.storage.local.set({ [STORAGE_KEYS.PHRASES]: phrases });
}

export async function deletePhrase(phraseLower: string): Promise<void> {
  const phrases = await getAllPhrases();
  const filtered = phrases.filter((p) => p.phraseLower !== phraseLower);
  await chrome.storage.local.set({ [STORAGE_KEYS.PHRASES]: filtered });
}

// ============================================================================
// SETTINGS
// ============================================================================

const defaultSettings: Settings = {
  id: "preferences",
  tts: {
    lang: "en-US",
    rate: 1,
    pitch: 1,
    volume: 1,
  },
};

export async function getSettings(): Promise<Settings> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.SETTINGS);
  return result[STORAGE_KEYS.SETTINGS] || defaultSettings;
}

export async function saveSettings(settings: Settings): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: settings });
}

// ============================================================================
// API KEY
// ============================================================================

export async function getApiKey(): Promise<string | null> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.API_KEY);
  return result[STORAGE_KEYS.API_KEY] || null;
}

export async function saveApiKey(key: string): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEYS.API_KEY]: key });
}

// ============================================================================
// SYNC (importar/exportar datos completos)
// ============================================================================

export async function importFromWeb(data: {
  words: WordEntry[];
  phrases: PhraseEntry[];
}): Promise<void> {
  // Merge strategy: newer wins
  const existingWords = await getAllWords();
  const existingPhrases = await getAllPhrases();

  const wordMap = new Map(existingWords.map((w) => [w.wordLower, w]));
  for (const word of data.words) {
    const existing = wordMap.get(word.wordLower);
    if (!existing || word.addedAt > existing.addedAt) {
      wordMap.set(word.wordLower, word);
    }
  }

  const phraseMap = new Map(existingPhrases.map((p) => [p.phraseLower, p]));
  for (const phrase of data.phrases) {
    const existing = phraseMap.get(phrase.phraseLower);
    if (!existing || phrase.addedAt > existing.addedAt) {
      phraseMap.set(phrase.phraseLower, phrase);
    }
  }

  await chrome.storage.local.set({
    [STORAGE_KEYS.WORDS]: Array.from(wordMap.values()),
    [STORAGE_KEYS.PHRASES]: Array.from(phraseMap.values()),
  });
}

export async function exportForWeb(): Promise<{
  words: WordEntry[];
  phrases: PhraseEntry[];
}> {
  return {
    words: await getAllWords(),
    phrases: await getAllPhrases(),
  };
}

/**
 * Reemplaza completamente los datos de la extensión
 * Se usa cuando la web (fuente de verdad) envía el estado final después del merge
 */
export async function replaceAllData(data: {
  words: WordEntry[];
  phrases: PhraseEntry[];
}): Promise<void> {
  await chrome.storage.local.set({
    [STORAGE_KEYS.WORDS]: data.words,
    [STORAGE_KEYS.PHRASES]: data.phrases,
  });
  console.log(
    `[LingText DB] Replaced all data: ${data.words.length} words, ${data.phrases.length} phrases`
  );
}
