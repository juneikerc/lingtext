/**
 * SQLite Database Service using @sqlite.org/sqlite-wasm
 *
 * This module provides a SQLite-based storage layer using OPFS (Origin Private File System)
 * for persistent storage. It replaces the previous IndexedDB implementation.
 *
 * Features:
 * - OPFS-based persistence (automatic, fast)
 * - Export/Import database files for user data ownership
 * - Full CRUD operations for texts, words, phrases, settings, and stats
 *
 * IMPORTANT: This module is CLIENT-ONLY. All functions check for browser environment
 * and will throw an error if called on the server.
 */

import type {
  AudioRef,
  Settings,
  TextItem,
  WordEntry,
  PhraseEntry,
  SpacedRepetitionData,
  VoiceParams,
} from "../types";

// Database filename in OPFS
const DB_NAME = "lingtext.sqlite3";

// SQLite WASM instance (singleton)
// Using 'any' for SQLite types due to complex WASM type definitions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let initPromise: Promise<any> | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sqlite3Instance: any = null;

// Flag to track if we're using persistent storage
let isPersistent = false;
// Debounce timer for saving to OPFS
let saveTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Check if we're running in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/**
 * Load database from OPFS if it exists
 */
async function loadFromOPFS(): Promise<ArrayBuffer | null> {
  try {
    const opfsRoot = await navigator.storage.getDirectory();
    const fileHandle = await opfsRoot.getFileHandle(DB_NAME, { create: false });
    const file = await fileHandle.getFile();
    const buffer = await file.arrayBuffer();
    console.log(
      "[DB] Loaded existing database from OPFS:",
      buffer.byteLength,
      "bytes"
    );
    return buffer;
  } catch {
    // File doesn't exist yet
    return null;
  }
}

/**
 * Save database to OPFS (debounced)
 */
async function saveToOPFS(): Promise<void> {
  if (!db || !sqlite3Instance) return;

  try {
    const data = sqlite3Instance.capi.sqlite3_js_db_export(db);
    const opfsRoot = await navigator.storage.getDirectory();
    const fileHandle = await opfsRoot.getFileHandle(DB_NAME, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(new Uint8Array(data));
    await writable.close();
    console.log("[DB] Saved to OPFS:", data.byteLength, "bytes");
  } catch (error) {
    console.error("[DB] Failed to save to OPFS:", error);
  }
}

/**
 * Schedule a save to OPFS (debounced to avoid too many writes)
 */
function scheduleSave(): void {
  if (!isPersistent) return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveToOPFS();
    saveTimer = null;
  }, 500); // Save 500ms after last write
}

/**
 * Initialize SQLite WASM and open the database
 * Uses OPFS for persistence - loads existing DB or creates new one
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function initDB(): Promise<any> {
  // Guard: Only run in browser
  if (!isBrowser()) {
    throw new Error("[DB] SQLite can only be initialized in the browser");
  }

  if (db) return db;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // Dynamic import of SQLite WASM - only happens in browser
      const sqliteModule = await import("@sqlite.org/sqlite-wasm");
      const sqlite3InitModule = sqliteModule.default;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sqlite3: any = await sqlite3InitModule({
        print: console.log,
        printErr: console.error,
      });
      sqlite3Instance = sqlite3;

      // Check if OPFS is available
      let opfsAvailable = false;
      try {
        await navigator.storage.getDirectory();
        opfsAvailable = true;
      } catch {
        opfsAvailable = false;
      }

      console.log("[DB] OPFS available:", opfsAvailable);

      if (opfsAvailable) {
        // Try to load existing database from OPFS
        const existingData = await loadFromOPFS();

        if (existingData && existingData.byteLength > 0) {
          // Deserialize existing database
          const p = sqlite3.wasm.allocFromTypedArray(
            new Uint8Array(existingData)
          );
          db = new sqlite3.oo1.DB();
          const rc = sqlite3.capi.sqlite3_deserialize(
            db.pointer,
            "main",
            p,
            existingData.byteLength,
            existingData.byteLength,
            sqlite3.capi.SQLITE_DESERIALIZE_FREEONCLOSE |
              sqlite3.capi.SQLITE_DESERIALIZE_RESIZEABLE
          );
          if (rc !== 0) {
            console.warn("[DB] Failed to deserialize, creating new database");
            db.close();
            db = new sqlite3.oo1.DB(":memory:");
          } else {
            console.log("[DB] Loaded database from OPFS");
          }
        } else {
          // Create new in-memory database (will be saved to OPFS)
          db = new sqlite3.oo1.DB(":memory:");
          console.log("[DB] Created new database (will persist to OPFS)");
        }
        isPersistent = true;
      } else {
        // No OPFS, use in-memory only
        db = new sqlite3.oo1.DB(":memory:");
        isPersistent = false;
        console.warn(
          "[DB] No OPFS available, using in-memory database (data will be lost on reload)"
        );
      }

      // Create tables if they don't exist
      createTables(db);

      // Save initial state if persistent
      if (isPersistent) {
        await saveToOPFS();
      }

      return db;
    } catch (error) {
      console.error("[DB] Failed to initialize SQLite:", error);
      initPromise = null;
      throw error;
    }
  })();

  return initPromise;
}

/**
 * Create database tables if they don't exist
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createTables(database: any): void {
  // Settings table
  database.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);

  // Texts table
  database.exec(`
    CREATE TABLE IF NOT EXISTS texts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      format TEXT DEFAULT 'txt',
      created_at INTEGER NOT NULL,
      audio_ref TEXT
    )
  `);

  // Words table
  database.exec(`
    CREATE TABLE IF NOT EXISTS words (
      word_lower TEXT PRIMARY KEY,
      word TEXT NOT NULL,
      translation TEXT,
      status TEXT DEFAULT 'unknown',
      added_at INTEGER NOT NULL,
      voice TEXT,
      sr_data TEXT
    )
  `);

  // Phrases table
  database.exec(`
    CREATE TABLE IF NOT EXISTS phrases (
      phrase_lower TEXT PRIMARY KEY,
      phrase TEXT NOT NULL,
      translation TEXT,
      parts TEXT NOT NULL,
      added_at INTEGER NOT NULL,
      sr_data TEXT
    )
  `);

  // Stats table (daily statistics)
  database.exec(`
    CREATE TABLE IF NOT EXISTS stats (
      date TEXT PRIMARY KEY,
      new_cards_studied INTEGER DEFAULT 0
    )
  `);

  console.log("[DB] Tables created/verified");
}

/**
 * Get the database instance (initializes if needed)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getDB(): Promise<any> {
  return initDB();
}

// ============================================================================
// TEXTS CRUD
// ============================================================================

export async function addText(item: TextItem): Promise<void> {
  const database = await getDB();
  const audioRefJson = item.audioRef
    ? JSON.stringify(serializeAudioRef(item.audioRef))
    : null;

  database.exec(
    `INSERT OR REPLACE INTO texts (id, title, content, format, created_at, audio_ref)
     VALUES (?, ?, ?, ?, ?, ?)`,
    {
      bind: [
        item.id,
        item.title,
        item.content,
        item.format || "txt",
        item.createdAt,
        audioRefJson,
      ],
    }
  );
  scheduleSave();
}

export async function getAllTexts(): Promise<TextItem[]> {
  const database = await getDB();
  const rows: Array<{
    id: string;
    title: string;
    content: string;
    format: string;
    created_at: number;
    audio_ref: string | null;
  }> = database.selectObjects("SELECT * FROM texts ORDER BY created_at DESC");

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    format: (row.format || "txt") as "txt" | "markdown",
    createdAt: row.created_at,
    audioRef: row.audio_ref
      ? deserializeAudioRef(JSON.parse(row.audio_ref))
      : null,
  }));
}

export async function getText(id: string): Promise<TextItem | undefined> {
  const database = await getDB();
  const rows: Array<{
    id: string;
    title: string;
    content: string;
    format: string;
    created_at: number;
    audio_ref: string | null;
  }> = database.selectObjects("SELECT * FROM texts WHERE id = ?", [id]);

  if (rows.length === 0) return undefined;

  const row = rows[0];
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    format: (row.format || "txt") as "txt" | "markdown",
    createdAt: row.created_at,
    audioRef: row.audio_ref
      ? deserializeAudioRef(JSON.parse(row.audio_ref))
      : null,
  };
}

export async function deleteText(id: string): Promise<void> {
  const database = await getDB();
  database.exec("DELETE FROM texts WHERE id = ?", { bind: [id] });
  scheduleSave();
}

export async function updateTextAudioRef(
  id: string,
  audioRef: AudioRef | null
): Promise<void> {
  const database = await getDB();
  const audioRefJson = audioRef
    ? JSON.stringify(serializeAudioRef(audioRef))
    : null;
  database.exec("UPDATE texts SET audio_ref = ? WHERE id = ?", {
    bind: [audioRefJson, id],
  });
  scheduleSave();
}

// ============================================================================
// WORDS CRUD
// ============================================================================

export async function putUnknownWord(entry: WordEntry): Promise<void> {
  const database = await getDB();
  const wordLower = entry.word.toLowerCase();
  const voiceJson = entry.voice ? JSON.stringify(entry.voice) : null;
  const srDataJson = entry.srData ? JSON.stringify(entry.srData) : null;

  database.exec(
    `INSERT OR REPLACE INTO words (word_lower, word, translation, status, added_at, voice, sr_data)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    {
      bind: [
        wordLower,
        entry.word,
        entry.translation || "",
        entry.status || "unknown",
        entry.addedAt,
        voiceJson,
        srDataJson,
      ],
    }
  );
  scheduleSave();
}

export async function deleteWord(wordOrLower: string): Promise<void> {
  const database = await getDB();
  const key = wordOrLower.toLowerCase();
  database.exec("DELETE FROM words WHERE word_lower = ?", { bind: [key] });
  scheduleSave();
}

export async function getWord(
  wordOrLower: string
): Promise<WordEntry | undefined> {
  const database = await getDB();
  const key = wordOrLower.toLowerCase();
  const rows: Array<{
    word_lower: string;
    word: string;
    translation: string;
    status: string;
    added_at: number;
    voice: string | null;
    sr_data: string | null;
  }> = database.selectObjects("SELECT * FROM words WHERE word_lower = ?", [
    key,
  ]);

  if (rows.length === 0) return undefined;

  const row = rows[0];
  return {
    word: row.word,
    wordLower: row.word_lower,
    translation: row.translation,
    status: row.status as "unknown",
    addedAt: row.added_at,
    voice: row.voice ? (JSON.parse(row.voice) as VoiceParams) : undefined,
    srData: row.sr_data
      ? (JSON.parse(row.sr_data) as SpacedRepetitionData)
      : undefined,
  };
}

export async function getAllUnknownWords(): Promise<WordEntry[]> {
  const database = await getDB();
  const rows: Array<{
    word_lower: string;
    word: string;
    translation: string;
    status: string;
    added_at: number;
    voice: string | null;
    sr_data: string | null;
  }> = database.selectObjects("SELECT * FROM words ORDER BY added_at DESC");

  return rows.map((row) => ({
    word: row.word,
    wordLower: row.word_lower,
    translation: row.translation,
    status: row.status as "unknown",
    addedAt: row.added_at,
    voice: row.voice ? (JSON.parse(row.voice) as VoiceParams) : undefined,
    srData: row.sr_data
      ? (JSON.parse(row.sr_data) as SpacedRepetitionData)
      : undefined,
  }));
}

// ============================================================================
// PHRASES CRUD
// ============================================================================

export async function putPhrase(entry: PhraseEntry): Promise<void> {
  const database = await getDB();
  const phraseLower = entry.parts.join(" ").toLowerCase();
  const partsJson = JSON.stringify(entry.parts.map((p) => p.toLowerCase()));
  const srDataJson = entry.srData ? JSON.stringify(entry.srData) : null;

  database.exec(
    `INSERT OR REPLACE INTO phrases (phrase_lower, phrase, translation, parts, added_at, sr_data)
     VALUES (?, ?, ?, ?, ?, ?)`,
    {
      bind: [
        phraseLower,
        entry.phrase,
        entry.translation || "",
        partsJson,
        entry.addedAt,
        srDataJson,
      ],
    }
  );
  scheduleSave();
}

export async function getAllPhrases(): Promise<PhraseEntry[]> {
  const database = await getDB();
  const rows: Array<{
    phrase_lower: string;
    phrase: string;
    translation: string;
    parts: string;
    added_at: number;
    sr_data: string | null;
  }> = database.selectObjects("SELECT * FROM phrases ORDER BY added_at DESC");

  return rows.map((row) => ({
    phrase: row.phrase,
    phraseLower: row.phrase_lower,
    translation: row.translation,
    parts: JSON.parse(row.parts) as string[],
    addedAt: row.added_at,
    srData: row.sr_data
      ? (JSON.parse(row.sr_data) as SpacedRepetitionData)
      : undefined,
  }));
}

export async function getPhrase(
  phraseOrLower: string
): Promise<PhraseEntry | undefined> {
  const database = await getDB();
  const key = phraseOrLower.toLowerCase();
  const rows: Array<{
    phrase_lower: string;
    phrase: string;
    translation: string;
    parts: string;
    added_at: number;
    sr_data: string | null;
  }> = database.selectObjects("SELECT * FROM phrases WHERE phrase_lower = ?", [
    key,
  ]);

  if (rows.length === 0) return undefined;

  const row = rows[0];
  return {
    phrase: row.phrase,
    phraseLower: row.phrase_lower,
    translation: row.translation,
    parts: JSON.parse(row.parts) as string[],
    addedAt: row.added_at,
    srData: row.sr_data
      ? (JSON.parse(row.sr_data) as SpacedRepetitionData)
      : undefined,
  };
}

export async function deletePhrase(phraseOrLower: string): Promise<void> {
  const database = await getDB();
  const key = phraseOrLower.toLowerCase();
  database.exec("DELETE FROM phrases WHERE phrase_lower = ?", { bind: [key] });
  scheduleSave();
}

// ============================================================================
// SETTINGS CRUD
// ============================================================================

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

// ============================================================================
// STATS CRUD (Daily Statistics)
// ============================================================================

export interface DailyStats {
  date: string; // "YYYY-MM-DD"
  newCardsStudied: number;
}

export async function getDailyStats(): Promise<DailyStats> {
  const database = await getDB();
  const today = new Date().toISOString().split("T")[0];

  const rows: Array<{
    date: string;
    new_cards_studied: number;
  }> = database.selectObjects("SELECT * FROM stats WHERE date = ?", [today]);

  if (rows.length === 0) {
    return { date: today, newCardsStudied: 0 };
  }

  return {
    date: rows[0].date,
    newCardsStudied: rows[0].new_cards_studied,
  };
}

export async function incrementNewCardsCount(): Promise<void> {
  const database = await getDB();
  const today = new Date().toISOString().split("T")[0];
  const currentStats = await getDailyStats();

  database.exec(
    "INSERT OR REPLACE INTO stats (date, new_cards_studied) VALUES (?, ?)",
    {
      bind: [today, currentStats.newCardsStudied + 1],
    }
  );
  scheduleSave();
}

// ============================================================================
// DATABASE BACKUP / RESTORE (File System Access API)
// ============================================================================

/**
 * Export the database to a file using File System Access API
 */
export async function exportDatabase(): Promise<void> {
  const database = await getDB();

  try {
    // Use cached sqlite3 instance or reinitialize
    if (!sqlite3Instance) {
      const sqliteModule = await import("@sqlite.org/sqlite-wasm");
      const sqlite3InitModule = sqliteModule.default;
      sqlite3Instance = await sqlite3InitModule();
    }

    // Export database to Uint8Array
    const rawData = sqlite3Instance.capi.sqlite3_js_db_export(database);
    // Convert to regular ArrayBuffer to avoid SharedArrayBuffer type issues
    const data = new Uint8Array(rawData);

    // Use File System Access API to save
    if ("showSaveFilePicker" in window) {
      const handle = await (
        window as Window & {
          showSaveFilePicker: (
            options: FilePickerOptions
          ) => Promise<FileSystemFileHandle>;
        }
      ).showSaveFilePicker({
        suggestedName: "lingtext-backup.sqlite",
        types: [
          {
            description: "SQLite Database",
            accept: { "application/x-sqlite3": [".sqlite", ".db", ".sqlite3"] },
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(data.buffer);
      await writable.close();

      console.log("[DB] Database exported successfully");
    } else {
      // Fallback: download via blob
      const blob = new Blob([data.buffer], { type: "application/x-sqlite3" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "lingtext-backup.sqlite";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      console.log("[DB] Export cancelled by user");
      return;
    }
    console.error("[DB] Export failed:", error);
    throw error;
  }
}

/**
 * Import a database file and replace the current OPFS database
 */
export async function importDatabase(): Promise<void> {
  try {
    let fileData: ArrayBuffer;

    if ("showOpenFilePicker" in window) {
      const [handle] = await (
        window as Window & {
          showOpenFilePicker: (
            options: FilePickerOptions
          ) => Promise<FileSystemFileHandle[]>;
        }
      ).showOpenFilePicker({
        types: [
          {
            description: "SQLite Database",
            accept: { "application/x-sqlite3": [".sqlite", ".db", ".sqlite3"] },
          },
        ],
        multiple: false,
      });

      const file = await handle.getFile();
      fileData = await file.arrayBuffer();
    } else {
      // Fallback: use file input
      fileData = await new Promise<ArrayBuffer>((resolve, reject) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".sqlite,.db,.sqlite3";
        input.onchange = async () => {
          const file = input.files?.[0];
          if (!file) {
            reject(new Error("No file selected"));
            return;
          }
          resolve(await file.arrayBuffer());
        };
        input.click();
      });
    }

    // Close current database
    if (db) {
      db.close();
      db = null;
      initPromise = null;
    }

    // Write to OPFS
    const opfsRoot = await navigator.storage.getDirectory();
    const fileHandle = await opfsRoot.getFileHandle(DB_NAME, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(fileData);
    await writable.close();

    // Reinitialize database
    await initDB();

    console.log("[DB] Database imported successfully");
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      console.log("[DB] Import cancelled by user");
      return;
    }
    console.error("[DB] Import failed:", error);
    throw error;
  }
}

/**
 * Check if OPFS is available
 */
export async function isOPFSAvailable(): Promise<boolean> {
  try {
    await navigator.storage.getDirectory();
    return true;
  } catch {
    return false;
  }
}

/**
 * Get database info
 */
export async function getDatabaseInfo(): Promise<{
  isOPFS: boolean;
  filename: string;
  size?: number;
}> {
  const database = await getDB();
  const isOPFS = database.filename.includes(DB_NAME);

  let size: number | undefined;
  if (isOPFS) {
    try {
      const opfsRoot = await navigator.storage.getDirectory();
      const fileHandle = await opfsRoot.getFileHandle(DB_NAME);
      const file = await fileHandle.getFile();
      size = file.size;
    } catch {
      // Ignore errors
    }
  }

  return {
    isOPFS,
    filename: database.filename,
    size,
  };
}

// ============================================================================
// AUDIO REF SERIALIZATION HELPERS
// ============================================================================

interface SerializedAudioRef {
  type: "url" | "file";
  url?: string;
  name?: string;
  // FileHandle cannot be serialized, store only metadata
}

function serializeAudioRef(audioRef: AudioRef): SerializedAudioRef {
  if (audioRef.type === "url") {
    return { type: "url", url: audioRef.url };
  }
  // For file type, we can only store the name
  // FileHandle requires re-authorization on each session
  return { type: "file", name: audioRef.name };
}

function deserializeAudioRef(data: SerializedAudioRef): AudioRef | null {
  if (data.type === "url" && data.url) {
    return { type: "url", url: data.url };
  }
  // File handles cannot be restored from serialization
  // The UI will need to handle re-authorization
  if (data.type === "file" && data.name) {
    // Return a partial object - the fileHandle will be undefined
    // Components should check for this and prompt re-authorization
    return {
      type: "file",
      name: data.name,
      fileHandle: undefined as unknown as FileSystemFileHandle,
    };
  }
  return null;
}

// Type for File Picker options
interface FilePickerOptions {
  suggestedName?: string;
  types?: Array<{
    description: string;
    accept: Record<string, string[]>;
  }>;
  multiple?: boolean;
}
