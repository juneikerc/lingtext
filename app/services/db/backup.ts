import {
  getDB,
  initDB,
  sqlite3Instance,
  DB_NAME,
  isPersistent,
  setDB,
} from "./core";
import type { FilePickerOptions } from "./types";

/**
 * DATABASE BACKUP / RESTORE (File System Access API)
 */

/**
 * Export the database to a file using File System Access API
 * @returns true if export was successful, false if cancelled by user
 */
export async function exportDatabase(): Promise<boolean> {
  const database = await getDB();

  try {
    // Ensure sqlite3Instance is available
    if (!sqlite3Instance) {
      await initDB();
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
      return true;
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
      return true;
    }
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      console.log("[DB] Export cancelled by user");
      return false; // User cancelled
    }
    console.error("[DB] Export failed:", error);
    throw error;
  }
}

/**
 * Import a database file and replace the current OPFS database
 * @returns true if import was successful, false if cancelled by user
 */
export async function importDatabase(): Promise<boolean> {
  // Ensure SQLite WASM is initialized first (loads the WASM file)
  await initDB();

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

    // Close current database connection
    const currentDB = await getDB();
    if (currentDB) {
      currentDB.close();
      setDB(null);
    }

    // Write to OPFS
    const opfsRoot = await navigator.storage.getDirectory();
    const fileHandle = await opfsRoot.getFileHandle(DB_NAME, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(fileData);
    await writable.close();

    // Reopen database from OPFS using existing sqlite3Instance
    if (sqlite3Instance) {
      const opfsVfs = sqlite3Instance.oo1.OpfsDb;
      if (opfsVfs) {
        setDB(new opfsVfs(DB_NAME));
        console.log("[DB] Database imported and reopened via OPFS");
      } else {
        // Fallback to in-memory with deserialization
        const newDb = new sqlite3Instance.oo1.DB(":memory:");
        setDB(newDb);
        const data = new Uint8Array(fileData);
        const rc = sqlite3Instance.capi.sqlite3_deserialize(
          newDb.pointer,
          "main",
          data,
          data.byteLength,
          data.byteLength,
          0
        );
        if (rc !== 0) {
          throw new Error(`sqlite3_deserialize failed with code ${rc}`);
        }
        console.log("[DB] Database imported via deserialize (fallback)");
      }
    } else {
      throw new Error("SQLite instance not available");
    }

    console.log("[DB] Database imported successfully");
    return true;
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      console.log("[DB] Import cancelled by user");
      return false; // User cancelled
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
 * Get database info for diagnostics
 */
export async function getDatabaseInfo(): Promise<{
  isPersistent: boolean;
  opfsAvailable: boolean;
  filename: string;
  opfsFileSize?: number;
  tablesExist: boolean;
  textCount: number;
  wordCount: number;
}> {
  const database = await getDB();

  let opfsAvailable = false;
  let opfsFileSize: number | undefined;

  try {
    const opfsRoot = await navigator.storage.getDirectory();
    opfsAvailable = true;
    try {
      const fileHandle = await opfsRoot.getFileHandle(DB_NAME);
      const file = await fileHandle.getFile();
      opfsFileSize = file.size;
    } catch {
      // File doesn't exist yet
    }
  } catch {
    opfsAvailable = false;
  }

  // Check if tables exist and count records
  let tablesExist = false;
  let textCount = 0;
  let wordCount = 0;

  try {
    const texts = database.selectObjects("SELECT COUNT(*) as count FROM texts");
    const words = database.selectObjects("SELECT COUNT(*) as count FROM words");
    tablesExist = true;
    textCount = texts[0]?.count || 0;
    wordCount = words[0]?.count || 0;
  } catch {
    tablesExist = false;
  }

  return {
    isPersistent,
    opfsAvailable,
    filename: database.filename || ":memory:",
    opfsFileSize,
    tablesExist,
    textCount,
    wordCount,
  };
}

/**
 * List all files in OPFS (for debugging)
 */
export async function listOPFSFiles(): Promise<string[]> {
  const files: string[] = [];
  try {
    const opfsRoot = await navigator.storage.getDirectory();
    // @ts-expect-error - entries() is not in all TypeScript definitions
    for await (const [name] of opfsRoot.entries()) {
      files.push(name);
    }
  } catch (error) {
    console.error("[DB] Failed to list OPFS files:", error);
  }
  return files;
}

/**
 * Force save to OPFS (for debugging)
 */
export async function forceSave(): Promise<void> {
  const { saveToOPFS } = await import("./core");
  console.log("[DB] Force saving to OPFS...");
  await saveToOPFS();
}
