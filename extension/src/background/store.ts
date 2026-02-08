import type {
  ExtensionSettings,
  PhraseEntry,
  SyncPayload,
  WordEntry,
} from "@/types";
import { TRANSLATORS } from "@/types";

const SCHEMA_VERSION = 2;
const STORAGE_KEYS = {
  VERSION: "lt2_schema_version",
  WORDS: "lt2_words",
  PHRASES: "lt2_phrases",
  SETTINGS: "lt2_settings",
  LAST_SYNC: "lt2_last_sync",
} as const;

const defaultSettings: ExtensionSettings = {
  translator: TRANSLATORS.CHROME,
  apiKey: "",
  captionLanguage: "en",
  hideNativeCc: true,
};

export async function initializeStore(): Promise<void> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.VERSION);
  const version = result[STORAGE_KEYS.VERSION] as number | undefined;

  if (version === SCHEMA_VERSION) {
    return;
  }

  await chrome.storage.local.clear();
  await chrome.storage.local.set({
    [STORAGE_KEYS.VERSION]: SCHEMA_VERSION,
    [STORAGE_KEYS.WORDS]: [],
    [STORAGE_KEYS.PHRASES]: [],
    [STORAGE_KEYS.SETTINGS]: defaultSettings,
    [STORAGE_KEYS.LAST_SYNC]: 0,
  });
}

export async function getWords(): Promise<WordEntry[]> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.WORDS);
  return (result[STORAGE_KEYS.WORDS] as WordEntry[] | undefined) || [];
}

export async function getWord(wordLower: string): Promise<WordEntry | null> {
  const words = await getWords();
  return words.find((entry) => entry.wordLower === wordLower) || null;
}

export async function putWord(entry: WordEntry): Promise<void> {
  const words = await getWords();
  const index = words.findIndex((item) => item.wordLower === entry.wordLower);

  if (index >= 0) {
    words[index] = entry;
  } else {
    words.push(entry);
  }

  await chrome.storage.local.set({ [STORAGE_KEYS.WORDS]: words });
}

export async function deleteWord(wordLower: string): Promise<void> {
  const words = await getWords();
  const next = words.filter((item) => item.wordLower !== wordLower);
  await chrome.storage.local.set({ [STORAGE_KEYS.WORDS]: next });
}

export async function getPhrases(): Promise<PhraseEntry[]> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.PHRASES);
  return (result[STORAGE_KEYS.PHRASES] as PhraseEntry[] | undefined) || [];
}

export async function putPhrase(entry: PhraseEntry): Promise<void> {
  const phrases = await getPhrases();
  const index = phrases.findIndex(
    (item) => item.phraseLower === entry.phraseLower
  );

  if (index >= 0) {
    phrases[index] = entry;
  } else {
    phrases.push(entry);
  }

  await chrome.storage.local.set({ [STORAGE_KEYS.PHRASES]: phrases });
}

export async function exportSyncPayload(): Promise<SyncPayload> {
  const [words, phrases] = await Promise.all([getWords(), getPhrases()]);
  return { words, phrases };
}

export async function importSyncPayload(payload: SyncPayload): Promise<void> {
  await chrome.storage.local.set({
    [STORAGE_KEYS.WORDS]: payload.words,
    [STORAGE_KEYS.PHRASES]: payload.phrases,
  });
}

export async function getSettings(): Promise<ExtensionSettings> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.SETTINGS);
  const stored = result[STORAGE_KEYS.SETTINGS] as
    | ExtensionSettings
    | undefined;

  if (!stored) {
    return defaultSettings;
  }

  return {
    ...defaultSettings,
    ...stored,
    captionLanguage: "en",
  };
}

export async function setSettings(
  patch: Partial<ExtensionSettings>
): Promise<ExtensionSettings> {
  const current = await getSettings();
  const next: ExtensionSettings = {
    ...current,
    ...patch,
    captionLanguage: "en",
  };

  await chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: next });
  return next;
}

export async function markSyncNow(): Promise<number> {
  const ts = Date.now();
  await chrome.storage.local.set({ [STORAGE_KEYS.LAST_SYNC]: ts });
  return ts;
}

export async function getLastSync(): Promise<number> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.LAST_SYNC);
  return (result[STORAGE_KEYS.LAST_SYNC] as number | undefined) || 0;
}
