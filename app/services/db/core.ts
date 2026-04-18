/**
 * Core SQLite Database Engine and Initialization
 */

import { LATEST_SCHEMA_VERSION, migrateDatabase } from "./migrations";

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

function noop(): void {}

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
    return file.arrayBuffer();
  } catch {
    return null;
  }
}

/**
 * Save database to OPFS
 */
export async function saveToOPFS(): Promise<void> {
  if (!db || !sqlite3Instance) {
    return;
  }

  try {
    const data = sqlite3Instance.capi.sqlite3_js_db_export(db);
    const opfsRoot = await navigator.storage.getDirectory();
    const fileHandle = await opfsRoot.getFileHandle(DB_NAME, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(new Uint8Array(data));
    await writable.close();
  } catch (error) {
    console.error(
      "[DB] Error: no se pudo guardar la base de datos en OPFS:",
      error
    );
  }
}

/**
 * Schedule a save to OPFS (debounced to avoid too many writes)
 */
export function scheduleSave(): void {
  if (!isPersistent) {
    return;
  }

  if (saveTimer) {
    clearTimeout(saveTimer);
  }

  saveTimer = setTimeout(() => {
    void saveToOPFS();
    saveTimer = null;
  }, 500);
}

function getSqliteInitOptions() {
  return {
    print: import.meta.env.DEV ? console.warn : noop,
    printErr: console.error,
    ...(import.meta.env.DEV
      ? {}
      : {
          locateFile: (file: string) =>
            file && file.endsWith(".wasm") ? `/assets/${file}` : file,
        }),
  };
}

export function deserializeDatabaseBytes(
  sqlite3: typeof sqlite3Instance,
  bytes: Uint8Array
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  const database = new sqlite3.oo1.DB();
  const pData = sqlite3.wasm.allocFromTypedArray(bytes);
  const rc = sqlite3.capi.sqlite3_deserialize(
    database.pointer,
    "main",
    pData,
    bytes.length,
    bytes.length,
    sqlite3.capi.SQLITE_DESERIALIZE_FREEONCLOSE |
      sqlite3.capi.SQLITE_DESERIALIZE_RESIZEABLE
  );

  if (rc !== 0) {
    database.close();
    throw new Error(`sqlite3_deserialize failed with code ${rc}`);
  }

  return database;
}

async function openDatabase(sqlite3: typeof sqlite3Instance) {
  let opfsAvailable = false;

  try {
    await navigator.storage.getDirectory();
    opfsAvailable = true;
  } catch {
    opfsAvailable = false;
  }

  if (!opfsAvailable) {
    isPersistent = false;
    console.warn(
      "[DB] No hay OPFS disponible; la base de datos funcionará solo en memoria."
    );
    return new sqlite3.oo1.DB(":memory:");
  }

  isPersistent = true;
  const existingData = await loadFromOPFS();

  if (!existingData || existingData.byteLength <= 100) {
    return new sqlite3.oo1.DB(":memory:");
  }

  try {
    return deserializeDatabaseBytes(sqlite3, new Uint8Array(existingData));
  } catch (loadError) {
    console.warn(
      "[DB] No se pudo restaurar la base de datos existente; se usará una nueva instancia.",
      loadError
    );
    return new sqlite3.oo1.DB(":memory:");
  }
}

/**
 * Initialize SQLite WASM and open the database
 * Uses OPFS for persistence - loads existing DB or creates new one
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function initDB(): Promise<any> {
  if (!isBrowser()) {
    throw new Error("[DB] SQLite can only be initialized in the browser");
  }

  if (db) return db;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const sqliteModule = await import("@sqlite.org/sqlite-wasm");
      const sqlite3InitModule = sqliteModule.default;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sqlite3: any = await sqlite3InitModule(getSqliteInitOptions());
      sqlite3Instance = sqlite3;

      db = await openDatabase(sqlite3);
      const migrationResult = migrateDatabase(db);

      if (isPersistent && migrationResult.appliedVersions.length > 0) {
        await saveToOPFS();
      }

      return db;
    } catch (error) {
      console.error("[DB] Error: no se pudo inicializar SQLite:", error);
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

export function getExpectedSchemaVersion(): number {
  return LATEST_SCHEMA_VERSION;
}
