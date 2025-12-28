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

export * from "./db/index";
