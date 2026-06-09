import type {
  DeletedEntry,
  ExtensionSettings,
  PhraseEntry,
  SyncPayload,
  VersionedSyncPayload,
  WordEntry,
} from "@/types";
import {
  getDefaultExtensionSettings,
  normalizeExtensionSettings,
} from "@/utils/settings";
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
  DELETED_WORDS: "lt2_deleted_words",
} as const;

let storageMutationQueue: Promise<unknown> = Promise.resolve();

function enqueueStorageMutation<T>(operation: () => Promise<T>): Promise<T> {
  const next = storageMutationQueue.then(operation, operation);
  storageMutationQueue = next.catch(() => undefined);
  return next;
}

function normalizeDeletedWords(entries: DeletedEntry[] = []): DeletedEntry[] {
  const byKey = new Map<string, DeletedEntry>();

  for (const entry of entries) {
    const key = entry.key.trim();
    if (!key) continue;

    const existing = byKey.get(key);
    if (!existing || entry.deletedAt > existing.deletedAt) {
      byKey.set(key, { ...entry, key });
    }
  }

  return Array.from(byKey.values());
}

function filterDeletedWords(
  words: WordEntry[],
  deletedWords: DeletedEntry[]
): WordEntry[] {
  const deletedAtByKey = new Map(
    deletedWords.map((entry) => [entry.key, entry.deletedAt])
  );

  return words.filter((word) => {
    const deletedAt = deletedAtByKey.get(word.wordLower);
    if (deletedAt === undefined) {
      return true;
    }

    return deletedAt < (word.updatedAt ?? word.addedAt);
  });
}

export async function initializeStore(): Promise<void> {
  const result = await chrome.storage.local.get([
    STORAGE_KEYS.VERSION,
    STORAGE_KEYS.WORDS,
    STORAGE_KEYS.PHRASES,
    STORAGE_KEYS.SETTINGS,
    STORAGE_KEYS.LAST_SYNC,
    STORAGE_KEYS.DELETED_WORDS,
  ]);
  const version = result[STORAGE_KEYS.VERSION] as number | undefined;

  if (version === SCHEMA_VERSION && result[STORAGE_KEYS.WORDS]) {
    return;
  }

  const legacyWords = (
    (result[STORAGE_KEYS.WORDS] as WordEntry[] | undefined) || []
  ).map((word) => ensureWordEntrySync(word, "extension"));
  const legacyPhrases = (
    (result[STORAGE_KEYS.PHRASES] as PhraseEntry[] | undefined) || []
  ).map((phrase) => ensurePhraseEntrySync(phrase, "extension"));
  const currentSettings =
    (result[STORAGE_KEYS.SETTINGS] as ExtensionSettings | undefined) ||
    getDefaultExtensionSettings();
  const lastSync = (result[STORAGE_KEYS.LAST_SYNC] as number | undefined) || 0;

  await chrome.storage.local.set({
    [STORAGE_KEYS.VERSION]: SCHEMA_VERSION,
    [STORAGE_KEYS.WORDS]: legacyWords,
    [STORAGE_KEYS.PHRASES]: legacyPhrases,
    [STORAGE_KEYS.SETTINGS]: normalizeExtensionSettings(currentSettings),
    [STORAGE_KEYS.LAST_SYNC]: lastSync,
    [STORAGE_KEYS.DELETED_WORDS]: normalizeDeletedWords(
      result[STORAGE_KEYS.DELETED_WORDS] as DeletedEntry[] | undefined
    ),
  });
}

export async function getWords(): Promise<WordEntry[]> {
  const result = await chrome.storage.local.get([
    STORAGE_KEYS.WORDS,
    STORAGE_KEYS.DELETED_WORDS,
  ]);
  const words = (result[STORAGE_KEYS.WORDS] as WordEntry[] | undefined) || [];
  const deletedWords = normalizeDeletedWords(
    result[STORAGE_KEYS.DELETED_WORDS] as DeletedEntry[] | undefined
  );
  return filterDeletedWords(
    words.map((word) => ensureWordEntrySync(word, "extension")),
    deletedWords
  );
}

export async function getWord(wordLower: string): Promise<WordEntry | null> {
  const words = await getWords();
  return words.find((entry) => entry.wordLower === wordLower) || null;
}

export async function putWord(entry: WordEntry): Promise<void> {
  await enqueueStorageMutation(async () => {
    const result = await chrome.storage.local.get([
      STORAGE_KEYS.WORDS,
      STORAGE_KEYS.DELETED_WORDS,
    ]);
    const words = (
      (result[STORAGE_KEYS.WORDS] as WordEntry[] | undefined) || []
    ).map((word) => ensureWordEntrySync(word, "extension"));
    const index = words.findIndex((item) => item.wordLower === entry.wordLower);
    const normalizedEntry = ensureWordEntrySync(entry, "extension");

    if (index >= 0) {
      words[index] = mergeWordEntries(
        words[index],
        normalizedEntry,
        "extension"
      );
    } else {
      words.push(normalizedEntry);
    }

    const deletedWords = normalizeDeletedWords(
      result[STORAGE_KEYS.DELETED_WORDS] as DeletedEntry[] | undefined
    ).filter((deleted) => deleted.key !== normalizedEntry.wordLower);

    await chrome.storage.local.set({
      [STORAGE_KEYS.WORDS]: words,
      [STORAGE_KEYS.DELETED_WORDS]: deletedWords,
    });
  });
}

export async function deleteWord(wordLower: string): Promise<void> {
  await enqueueStorageMutation(async () => {
    const result = await chrome.storage.local.get([
      STORAGE_KEYS.WORDS,
      STORAGE_KEYS.DELETED_WORDS,
    ]);
    const words = (result[STORAGE_KEYS.WORDS] as WordEntry[] | undefined) || [];
    const nextWords = words.filter((item) => item.wordLower !== wordLower);
    const deletedWords = normalizeDeletedWords([
      ...(((result[STORAGE_KEYS.DELETED_WORDS] as DeletedEntry[] | undefined) ||
        []) as DeletedEntry[]),
      { key: wordLower, deletedAt: Date.now(), deletedBy: "extension" },
    ]);

    await chrome.storage.local.set({
      [STORAGE_KEYS.WORDS]: nextWords,
      [STORAGE_KEYS.DELETED_WORDS]: deletedWords,
    });
  });
}

export async function getPhrases(): Promise<PhraseEntry[]> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.PHRASES);
  const phrases =
    (result[STORAGE_KEYS.PHRASES] as PhraseEntry[] | undefined) || [];
  return phrases.map((phrase) => ensurePhraseEntrySync(phrase, "extension"));
}

export async function putPhrase(entry: PhraseEntry): Promise<void> {
  await enqueueStorageMutation(async () => {
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
  });
}

export async function exportSyncPayload(): Promise<SyncPayload> {
  const [words, phrases, deletedWords] = await Promise.all([
    getWords(),
    getPhrases(),
    getDeletedWords(),
  ]);
  return createSyncEnvelope(
    "extension",
    words,
    phrases,
    Date.now(),
    deletedWords
  );
}

export async function importSyncPayload(
  payload: VersionedSyncPayload
): Promise<void> {
  await enqueueStorageMutation(async () => {
    const result = await chrome.storage.local.get([
      STORAGE_KEYS.WORDS,
      STORAGE_KEYS.PHRASES,
      STORAGE_KEYS.DELETED_WORDS,
    ]);
    const deletedWords = normalizeDeletedWords(
      result[STORAGE_KEYS.DELETED_WORDS] as DeletedEntry[] | undefined
    );
    const current = createSyncEnvelope(
      "extension",
      ((result[STORAGE_KEYS.WORDS] as WordEntry[] | undefined) || []).map(
        (word) => ensureWordEntrySync(word, "extension")
      ),
      ((result[STORAGE_KEYS.PHRASES] as PhraseEntry[] | undefined) || []).map(
        (phrase) => ensurePhraseEntrySync(phrase, "extension")
      ),
      Date.now(),
      deletedWords
    );
    const incoming =
      "source" in payload && payload.schemaVersion === SYNC_SCHEMA_VERSION
        ? payload
        : createSyncEnvelope("web", payload.words || [], payload.phrases || []);
    const merged = mergeSyncEnvelopes(current, incoming);

    await chrome.storage.local.set({
      [STORAGE_KEYS.WORDS]: merged.words,
      [STORAGE_KEYS.PHRASES]: merged.phrases,
      [STORAGE_KEYS.DELETED_WORDS]: normalizeDeletedWords(merged.deletedWords),
    });
  });
}

export async function getSettings(): Promise<ExtensionSettings> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.SETTINGS);
  const stored = result[STORAGE_KEYS.SETTINGS] as ExtensionSettings | undefined;

  if (!stored) {
    return getDefaultExtensionSettings();
  }

  return normalizeExtensionSettings(stored);
}

export async function setSettings(
  patch: Partial<ExtensionSettings>
): Promise<ExtensionSettings> {
  return enqueueStorageMutation(async () => {
    const current = await getSettings();
    const next = normalizeExtensionSettings({ ...current, ...patch });

    await chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: next });
    return next;
  });
}

export async function getDeletedWords(): Promise<DeletedEntry[]> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.DELETED_WORDS);
  return normalizeDeletedWords(
    result[STORAGE_KEYS.DELETED_WORDS] as DeletedEntry[] | undefined
  );
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
