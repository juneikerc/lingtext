import type { AudioRef, Settings, TextItem, WordEntry, PhraseEntry } from "./types";

const DB_NAME = "ling_text_db";
const DB_VERSION = 2; // bumped to add phrases store

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      // texts store
      if (!db.objectStoreNames.contains("texts")) {
        db.createObjectStore("texts", { keyPath: "id" });
      }
      // words store, keyed by lowercase form for easy lookup
      if (!db.objectStoreNames.contains("words")) {
        db.createObjectStore("words", { keyPath: "wordLower" });
      }
      // settings store
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "id" });
      }
      // phrases store, keyed by normalized phraseLower
      if (!db.objectStoreNames.contains("phrases")) {
        db.createObjectStore("phrases", { keyPath: "phraseLower" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function tx(
  stores: string[],
  mode: IDBTransactionMode,
  run: (tx: IDBTransaction) => void
): Promise<void> {
  return openDB().then(
    (db) =>
      new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(stores, mode);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
        run(transaction);
      })
  );
}

// Texts
export async function addText(item: TextItem): Promise<void> {
  await tx(["texts"], "readwrite", (t) => {
    t.objectStore("texts").add(item);
  });
}

export async function getAllTexts(): Promise<TextItem[]> {
  const db = await openDB();
  return new Promise<TextItem[]>((resolve, reject) => {
    const transaction = db.transaction(["texts"], "readonly");
    const req = transaction.objectStore("texts").getAll();
    req.onsuccess = () => resolve((req.result || []) as TextItem[]);
    req.onerror = () => reject(req.error);
  });
}

export async function getText(id: string): Promise<TextItem | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db
      .transaction(["texts"], "readonly")
      .objectStore("texts")
      .get(id);
    req.onsuccess = () => resolve(req.result as TextItem | undefined);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteText(id: string): Promise<void> {
  await tx(["texts"], "readwrite", (t) => {
    t.objectStore("texts").delete(id);
  });
}

export async function updateTextAudioRef(
  id: string,
  audioRef: AudioRef | null
): Promise<void> {
  const text = await getText(id);
  if (!text) return;
  const updated: TextItem = { ...text, audioRef };
  await tx(["texts"], "readwrite", (t) => {
    t.objectStore("texts").put(updated);
  });
}

// Words (unknown words repository)
export async function putUnknownWord(entry: WordEntry): Promise<void> {
  const normalized: WordEntry = {
    ...entry,
    wordLower: entry.word.toLowerCase(),
    translation: entry.translation,
    status: "unknown",
  };
  await tx(["words"], "readwrite", (t) => {
    t.objectStore("words").put(normalized);
  });
}

export async function deleteWord(wordOrLower: string): Promise<void> {
  const key = wordOrLower.toLowerCase();
  await tx(["words"], "readwrite", (t) => {
    t.objectStore("words").delete(key);
  });
}

export async function getWord(
  wordOrLower: string
): Promise<WordEntry | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db
      .transaction(["words"], "readonly")
      .objectStore("words")
      .get(wordOrLower.toLowerCase());
    req.onsuccess = () => resolve(req.result as WordEntry | undefined);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllUnknownWords(): Promise<WordEntry[]> {
  const db = await openDB();
  return new Promise<WordEntry[]>((resolve, reject) => {
    const req = db
      .transaction(["words"], "readonly")
      .objectStore("words")
      .getAll();
    req.onsuccess = () => resolve((req.result || []) as WordEntry[]);
    req.onerror = () => reject(req.error);
  });
}

// Phrases (multi-word expressions)
export async function putPhrase(entry: PhraseEntry): Promise<void> {
  const normalized: PhraseEntry = {
    ...entry,
    phraseLower: entry.parts.join(" "),
    parts: entry.parts.map((p) => p.toLowerCase()),
  };
  await tx(["phrases"], "readwrite", (t) => {
    t.objectStore("phrases").put(normalized);
  });
}

export async function getAllPhrases(): Promise<PhraseEntry[]> {
  const db = await openDB();
  return new Promise<PhraseEntry[]>((resolve, reject) => {
    const req = db
      .transaction(["phrases"], "readonly")
      .objectStore("phrases")
      .getAll();
    req.onsuccess = () => resolve((req.result || []) as PhraseEntry[]);
    req.onerror = () => reject(req.error);
  });
}

export async function getPhrase(
  phraseOrLower: string
): Promise<PhraseEntry | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db
      .transaction(["phrases"], "readonly")
      .objectStore("phrases")
      .get(phraseOrLower.toLowerCase());
    req.onsuccess = () => resolve(req.result as PhraseEntry | undefined);
    req.onerror = () => reject(req.error);
  });
}

export async function deletePhrase(phraseOrLower: string): Promise<void> {
  const key = phraseOrLower.toLowerCase();
  await tx(["phrases"], "readwrite", (t) => {
    t.objectStore("phrases").delete(key);
  });
}

// Settings
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
  const db = await openDB();
  return new Promise<Settings>((resolve) => {
    const req = db
      .transaction(["settings"], "readonly")
      .objectStore("settings")
      .get("preferences");
    req.onsuccess = () => {
      resolve((req.result as Settings) || defaultSettings);
    };
    req.onerror = () => resolve(defaultSettings);
  });
}

export async function saveSettings(prefs: Settings): Promise<void> {
  await tx(["settings"], "readwrite", (t) => {
    t.objectStore("settings").put(prefs);
  });
}
