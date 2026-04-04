import type {
  ExtensionSettings,
  PhraseEntry,
  SyncPayload,
  VersionedSyncPayload,
  WordEntry,
} from "@/types";
import { TRANSLATORS } from "@/types";
import {
  createSyncEnvelope,
  ensurePhraseEntrySync,
  ensureWordEntrySync,
  mergePhraseEntries,
  mergeSyncEnvelopes,
  mergeWordEntries,
  SYNC_SCHEMA_VERSION,
} from "@shared/index";

const SCHEMA_VERSION = 3;
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
  const result = await chrome.storage.local.get([
    STORAGE_KEYS.VERSION,
    STORAGE_KEYS.WORDS,
    STORAGE_KEYS.PHRASES,
    STORAGE_KEYS.SETTINGS,
    STORAGE_KEYS.LAST_SYNC,
  ]);
  const version = result[STORAGE_KEYS.VERSION] as number | undefined;

  if (version === SCHEMA_VERSION && result[STORAGE_KEYS.WORDS]) {
    return;
  }

  const legacyWords = ((result[STORAGE_KEYS.WORDS] as WordEntry[] | undefined) || []).map(
    (word) => ensureWordEntrySync(word, "extension")
  );
  const legacyPhrases = (
    (result[STORAGE_KEYS.PHRASES] as PhraseEntry[] | undefined) || []
  ).map((phrase) => ensurePhraseEntrySync(phrase, "extension"));
  const currentSettings = (result[STORAGE_KEYS.SETTINGS] as
    | ExtensionSettings
    | undefined) || defaultSettings;
  const lastSync = (result[STORAGE_KEYS.LAST_SYNC] as number | undefined) || 0;

  await chrome.storage.local.set({
    [STORAGE_KEYS.VERSION]: SCHEMA_VERSION,
    [STORAGE_KEYS.WORDS]: legacyWords,
    [STORAGE_KEYS.PHRASES]: legacyPhrases,
    [STORAGE_KEYS.SETTINGS]: {
      ...defaultSettings,
      ...currentSettings,
      captionLanguage: "en",
    },
    [STORAGE_KEYS.LAST_SYNC]: lastSync,
  });
}

export async function getWords(): Promise<WordEntry[]> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.WORDS);
  const words = (result[STORAGE_KEYS.WORDS] as WordEntry[] | undefined) || [];
  return words.map((word) => ensureWordEntrySync(word, "extension"));
}

export async function getWord(wordLower: string): Promise<WordEntry | null> {
  const words = await getWords();
  return words.find((entry) => entry.wordLower === wordLower) || null;
}

export async function putWord(entry: WordEntry): Promise<void> {
  const words = await getWords();
  const index = words.findIndex((item) => item.wordLower === entry.wordLower);
  const normalizedEntry = ensureWordEntrySync(entry, "extension");

  if (index >= 0) {
    words[index] = mergeWordEntries(words[index], normalizedEntry, "extension");
  } else {
    words.push(normalizedEntry);
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
  const phrases =
    (result[STORAGE_KEYS.PHRASES] as PhraseEntry[] | undefined) || [];
  return phrases.map((phrase) => ensurePhraseEntrySync(phrase, "extension"));
}

export async function putPhrase(entry: PhraseEntry): Promise<void> {
  const phrases = await getPhrases();
  const index = phrases.findIndex(
    (item) => item.phraseLower === entry.phraseLower
  );
  const normalizedEntry = ensurePhraseEntrySync(entry, "extension");

  if (index >= 0) {
    phrases[index] = mergePhraseEntries(
      phrases[index],
      normalizedEntry,
      "extension"
    );
  } else {
    phrases.push(normalizedEntry);
  }

  await chrome.storage.local.set({ [STORAGE_KEYS.PHRASES]: phrases });
}

export async function exportSyncPayload(): Promise<SyncPayload> {
  const [words, phrases] = await Promise.all([getWords(), getPhrases()]);
  return createSyncEnvelope("extension", words, phrases);
}

export async function importSyncPayload(
  payload: VersionedSyncPayload
): Promise<void> {
  const current = createSyncEnvelope("extension", await getWords(), await getPhrases());
  const incoming =
    "source" in payload && payload.schemaVersion === SYNC_SCHEMA_VERSION
      ? payload
      : createSyncEnvelope(
          "web",
          payload.words || [],
          payload.phrases || []
        );
  const merged = mergeSyncEnvelopes(current, incoming);

  await chrome.storage.local.set({
    [STORAGE_KEYS.WORDS]: merged.words,
    [STORAGE_KEYS.PHRASES]: merged.phrases,
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
