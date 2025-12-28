/**
 * Core SQLite Database Engine and Initialization
 */

export const DB_NAME = "lingtext.sqlite3";

// SQLite WASM instance (singleton)
// Using 'any' for SQLite types due to complex WASM type definitions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let db: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let initPromise: Promise<any> | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let sqlite3Instance: any = null;

// Flag to track if we're using persistent storage
export let isPersistent = false;
// Debounce timer for saving to OPFS
let saveTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Check if we're running in a browser environment
 */
export function isBrowser(): boolean {
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
 * Save database to OPFS
 */
export async function saveToOPFS(): Promise<void> {
  if (!db || !sqlite3Instance) {
    console.warn("[DB] Cannot save - db or sqlite3Instance not ready");
    return;
  }

  try {
    console.log("[DB] Exporting database...");
    const data = sqlite3Instance.capi.sqlite3_js_db_export(db);
    console.log("[DB] Exported", data.byteLength, "bytes");

    const opfsRoot = await navigator.storage.getDirectory();
    const fileHandle = await opfsRoot.getFileHandle(DB_NAME, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(new Uint8Array(data));
    await writable.close();
    console.log("[DB] ✅ Saved to OPFS:", data.byteLength, "bytes");

    // Verify the save
    const verifyHandle = await opfsRoot.getFileHandle(DB_NAME);
    const verifyFile = await verifyHandle.getFile();
    console.log("[DB] Verified file size:", verifyFile.size, "bytes");
  } catch (error) {
    console.error("[DB] ❌ Failed to save to OPFS:", error);
  }
}

/**
 * Schedule a save to OPFS (debounced to avoid too many writes)
 */
export function scheduleSave(): void {
  if (!isPersistent) {
    console.log("[DB] scheduleSave skipped - not persistent");
    return;
  }
  console.log("[DB] Scheduling save...");
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    console.log("[DB] Executing scheduled save");
    saveToOPFS();
    saveTimer = null;
  }, 500); // Save 500ms after last write
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
 * Initialize SQLite WASM and open the database
 * Uses OPFS for persistence - loads existing DB or creates new one
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function initDB(): Promise<any> {
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

      // Build init options
      // In production, we need to specify where to find the WASM file
      // In development, Vite handles it automatically
      const initOptions: Record<string, unknown> = {
        print: console.log,
        printErr: console.error,
      };

      // Only add locateFile in production
      if (!import.meta.env.DEV) {
        initOptions.locateFile = (file: string) => {
          if (file && file.endsWith(".wasm")) {
            return `/assets/${file}`;
          }
          return file;
        };
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sqlite3: any = await sqlite3InitModule(initOptions);
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

        if (existingData && existingData.byteLength > 100) {
          // Import existing database using the simpler approach
          try {
            // Create a new DB and import the data
            db = new sqlite3.oo1.DB();
            const bytes = new Uint8Array(existingData);

            // Use the capi to deserialize
            const pDb = db.pointer;
            const pData = sqlite3.wasm.allocFromTypedArray(bytes);
            const rc = sqlite3.capi.sqlite3_deserialize(
              pDb,
              "main",
              pData,
              bytes.length,
              bytes.length,
              sqlite3.capi.SQLITE_DESERIALIZE_FREEONCLOSE |
                sqlite3.capi.SQLITE_DESERIALIZE_RESIZEABLE
            );

            if (rc === 0) {
              console.log("[DB] Successfully loaded database from OPFS");
            } else {
              console.warn(
                "[DB] Deserialize returned:",
                rc,
                "- creating new database"
              );
              db.close();
              db = new sqlite3.oo1.DB(":memory:");
            }
          } catch (loadError) {
            console.warn("[DB] Failed to load from OPFS:", loadError);
            db = new sqlite3.oo1.DB(":memory:");
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
 * Get the database instance (initializes if needed)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getDB(): Promise<any> {
  return initDB();
}

/**
 * Update the db singleton (used during import)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setDB(newDb: any): void {
  db = newDb;
}
