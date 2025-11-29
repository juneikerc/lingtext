// Remove static import
// import sqlite3InitModule from "@sqlite.org/sqlite-wasm";
import type { Database } from "@sqlite.org/sqlite-wasm";
import type {
  TextItem,
  WordEntry,
  PhraseEntry,
  Settings,
  AudioRef,
} from "../types";

let dbInstance: Database | null = null;

const DB_NAME = "lingtext.sqlite3";

async function getDB(): Promise<Database> {
  if (typeof window === "undefined") {
    throw new Error("Cannot use SQLite in server environment");
  }

  if (dbInstance) return dbInstance;

  // Dynamic import to avoid SSR build issues
  const sqlite3InitModule = (await import("@sqlite.org/sqlite-wasm")).default;

  const sqlite3 = await sqlite3InitModule({
    print: console.log,
    printErr: console.error,
  });

  if ("opfs" in sqlite3) {
    dbInstance = new sqlite3.oo1.OpfsDb(DB_NAME);
    console.log("Running SQLite3 in OPFS");
  } else {
    dbInstance = new sqlite3.oo1.DB(DB_NAME, "ct");
    console.warn(
      "OPFS is not available. Running SQLite3 in transient memory-only mode."
    );
  }

  await initSchema(dbInstance);
  return dbInstance;
}

async function initSchema(db: Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
    CREATE TABLE IF NOT EXISTS texts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      created_at INTEGER,
      audio_ref TEXT,
      format TEXT
    );
    CREATE TABLE IF NOT EXISTS words (
      word TEXT PRIMARY KEY,
      translation TEXT,
      context TEXT,
      status TEXT,
      added_at INTEGER,
      sr_data TEXT,
      voice TEXT
    );
    CREATE TABLE IF NOT EXISTS phrases (
      phrase_lower TEXT PRIMARY KEY,
      phrase TEXT,
      translation TEXT,
      parts TEXT,
      added_at INTEGER,
      sr_data TEXT
    );
  `);
}

// --- Text Operations ---

export async function addText(item: TextItem): Promise<void> {
  if (typeof window === "undefined") return;
  const db = await getDB();
  db.exec({
    sql: `INSERT INTO texts (id, title, content, created_at, audio_ref, format) VALUES (?, ?, ?, ?, ?, ?)`,
    bind: [
      null, // Force auto-increment for INTEGER PK
      item.title,
      item.content,
      item.createdAt,
      item.audioRef ? JSON.stringify(item.audioRef) : null,
      item.format || "txt",
    ],
  });
}

export async function getAllTexts(): Promise<TextItem[]> {
  if (typeof window === "undefined") return [];
  const db = await getDB();
  const rows = db.selectObjects(`SELECT * FROM texts ORDER BY created_at DESC`);
  return rows.map((row: any) => ({
    id: String(row.id),
    title: row.title,
    content: row.content,
    createdAt: row.created_at,
    audioRef: row.audio_ref ? JSON.parse(row.audio_ref) : undefined,
    format: row.format,
  }));
}

export async function getText(id: string): Promise<TextItem | undefined> {
  if (typeof window === "undefined") return undefined;
  const db = await getDB();
  const rows = db.selectObjects(`SELECT * FROM texts WHERE id = ?`, [id]);
  if (rows.length === 0) return undefined;
  const r = rows[0] as any;
  return {
    id: String(r.id),
    title: r.title,
    content: r.content,
    createdAt: r.created_at,
    audioRef: r.audio_ref ? JSON.parse(r.audio_ref) : undefined,
    format: r.format,
  };
}

export async function deleteText(id: string): Promise<void> {
  if (typeof window === "undefined") return;
  const db = await getDB();
  db.exec({ sql: `DELETE FROM texts WHERE id = ?`, bind: [id] });
}

export async function updateTextAudioRef(
  id: string,
  audioRef: AudioRef | null
): Promise<void> {
  if (typeof window === "undefined") return;
  const db = await getDB();
  db.exec({
    sql: `UPDATE texts SET audio_ref = ? WHERE id = ?`,
    bind: [audioRef ? JSON.stringify(audioRef) : null, id],
  });
}

// --- Word Operations ---

export async function putUnknownWord(entry: WordEntry): Promise<void> {
  if (typeof window === "undefined") return;
  const db = await getDB();
  const wordLower = entry.word.toLowerCase();
  db.exec({
    sql: `INSERT INTO words (word, translation, context, status, added_at, sr_data, voice) VALUES (?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(word) DO UPDATE SET translation=excluded.translation, context=excluded.context, status=excluded.status, sr_data=excluded.sr_data, voice=excluded.voice`,
    bind: [
      wordLower,
      entry.translation,
      entry.context || "",
      "unknown",
      entry.addedAt,
      entry.srData ? JSON.stringify(entry.srData) : null,
      entry.voice ? JSON.stringify(entry.voice) : null,
    ],
  });
}

export async function deleteWord(wordOrLower: string): Promise<void> {
  if (typeof window === "undefined") return;
  const db = await getDB();
  db.exec({
    sql: `DELETE FROM words WHERE word = ?`,
    bind: [wordOrLower.toLowerCase()],
  });
}

export async function getWord(
  wordOrLower: string
): Promise<WordEntry | undefined> {
  if (typeof window === "undefined") return undefined;
  const db = await getDB();
  const rows = db.selectObjects(`SELECT * FROM words WHERE word = ?`, [
    wordOrLower.toLowerCase(),
  ]);
  if (rows.length === 0) return undefined;
  const r = rows[0] as any;
  return {
    word: r.word, // stored as lowercase
    wordLower: r.word,
    translation: r.translation,
    status: "unknown",
    addedAt: r.added_at,
    srData: r.sr_data ? JSON.parse(r.sr_data) : undefined,
    voice: r.voice ? JSON.parse(r.voice) : undefined,
  };
}

export async function getAllUnknownWords(): Promise<WordEntry[]> {
  if (typeof window === "undefined") return [];
  const db = await getDB();
  const rows = db.selectObjects(`SELECT * FROM words ORDER BY added_at DESC`);
  return rows.map((r: any) => ({
    word: r.word,
    wordLower: r.word,
    translation: r.translation,
    status: "unknown",
    addedAt: r.added_at,
    srData: r.sr_data ? JSON.parse(r.sr_data) : undefined,
    voice: r.voice ? JSON.parse(r.voice) : undefined,
  }));
}

// --- Phrase Operations ---

export async function putPhrase(entry: PhraseEntry): Promise<void> {
  if (typeof window === "undefined") return;
  const db = await getDB();
  db.exec({
    sql: `INSERT INTO phrases (phrase_lower, phrase, translation, parts, added_at, sr_data) VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(phrase_lower) DO UPDATE SET phrase=excluded.phrase, translation=excluded.translation, parts=excluded.parts, added_at=excluded.added_at, sr_data=excluded.sr_data`,
    bind: [
      entry.phraseLower,
      entry.phrase,
      entry.translation,
      JSON.stringify(entry.parts),
      entry.addedAt,
      entry.srData ? JSON.stringify(entry.srData) : null,
    ],
  });
}

export async function getAllPhrases(): Promise<PhraseEntry[]> {
  if (typeof window === "undefined") return [];
  const db = await getDB();
  const rows = db.selectObjects(`SELECT * FROM phrases ORDER BY added_at DESC`);
  return rows.map((r: any) => ({
    phrase: r.phrase,
    phraseLower: r.phrase_lower,
    translation: r.translation,
    parts: JSON.parse(r.parts),
    addedAt: r.added_at,
    srData: r.sr_data ? JSON.parse(r.sr_data) : undefined,
  }));
}

export async function getPhrase(
  phraseOrLower: string
): Promise<PhraseEntry | undefined> {
  if (typeof window === "undefined") return undefined;
  const db = await getDB();
  const rows = db.selectObjects(`SELECT * FROM phrases WHERE phrase_lower = ?`, [
    phraseOrLower.toLowerCase(),
  ]);
  if (rows.length === 0) return undefined;
  const r = rows[0] as any;
  return {
    phrase: r.phrase,
    phraseLower: r.phrase_lower,
    translation: r.translation,
    parts: JSON.parse(r.parts),
    addedAt: r.added_at,
    srData: r.sr_data ? JSON.parse(r.sr_data) : undefined,
  };
}

export async function deletePhrase(phraseOrLower: string): Promise<void> {
  if (typeof window === "undefined") return;
  const db = await getDB();
  db.exec({
    sql: `DELETE FROM phrases WHERE phrase_lower = ?`,
    bind: [phraseOrLower.toLowerCase()],
  });
}

// --- Settings Operations ---

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
  if (typeof window === "undefined") return defaultSettings;
  const db = await getDB();
  const rows = db.selectObjects(`SELECT value FROM settings WHERE key = ?`, [
    "preferences",
  ]);
  if (rows.length === 0) return defaultSettings;
  try {
    const val = JSON.parse((rows[0] as any).value);
    return { ...defaultSettings, ...val, id: "preferences" };
  } catch (e) {
    return defaultSettings;
  }
}

export async function saveSettings(prefs: Settings): Promise<void> {
  if (typeof window === "undefined") return;
  const db = await getDB();
  db.exec({
    sql: `INSERT INTO settings (key, value) VALUES (?, ?)
          ON CONFLICT(key) DO UPDATE SET value=excluded.value`,
    bind: ["preferences", JSON.stringify(prefs)],
  });
}

// --- Backup & Restore ---

export async function exportDatabase() {
  if (typeof window === "undefined") return;
  const sqlite3InitModule = (await import("@sqlite.org/sqlite-wasm")).default;
  const sqlite3 = await sqlite3InitModule();
  if (!("opfs" in sqlite3)) {
    throw new Error("OPFS not available for export");
  }

  const db = await getDB();
  // @ts-ignore
  const byteArray = db.export(); // This returns a Uint8Array of the DB content.

  const blob = new Blob([byteArray], { type: "application/x-sqlite3" });

  // Save File Picker
  // @ts-ignore
  const handle = await window.showSaveFilePicker({
    suggestedName: "lingtext_backup.sqlite",
    types: [{
      description: "SQLite Database",
      accept: { "application/x-sqlite3": [".sqlite", ".db"] },
    }],
  });

  const writable = await handle.createWritable();
  await writable.write(blob);
  await writable.close();
}

export async function importDatabase() {
  if (typeof window === "undefined") return;
  // @ts-ignore
  const [handle] = await window.showOpenFilePicker({
    types: [{
      description: "SQLite Database",
      accept: { "application/x-sqlite3": [".sqlite", ".db"] },
    }],
    multiple: false,
  });

  const file = await handle.getFile();
  const arrayBuffer = await file.arrayBuffer();
  const byteArray = new Uint8Array(arrayBuffer);

  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }

  const root = await navigator.storage.getDirectory();
  const dbFileHandle = await root.getFileHandle(DB_NAME, { create: true });
  const writable = await dbFileHandle.createWritable();
  await writable.write(byteArray);
  await writable.close();

  window.location.reload();
}
