/**
 * Explicit SQLite schema migrations for LingText.
 *
 * Each migration is idempotent so existing local-first databases can converge
 * safely even if they were created before schema tracking existed.
 */

export const LATEST_SCHEMA_VERSION = 3;

interface Migration {
  version: number;
  name: string;
  up: (database: SQLiteDatabase) => void;
}

interface MigrationRecord {
  version: number;
  name: string;
  applied_at: number;
}

interface SqlitePragmaVersionRow {
  user_version?: number;
}

interface SqliteTableInfoRow {
  name: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SQLiteDatabase = any;

function ensureMigrationTable(database: SQLiteDatabase): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at INTEGER NOT NULL
    )
  `);
}

function getAppliedMigrationVersions(database: SQLiteDatabase): Set<number> {
  ensureMigrationTable(database);
  const rows: MigrationRecord[] = database.selectObjects(
    "SELECT version, name, applied_at FROM schema_migrations ORDER BY version ASC"
  );
  return new Set(rows.map((row) => row.version));
}

function getUserVersion(database: SQLiteDatabase): number {
  const rows: SqlitePragmaVersionRow[] = database.selectObjects(
    "PRAGMA user_version"
  );
  return rows[0]?.user_version ?? 0;
}

function setUserVersion(database: SQLiteDatabase, version: number): void {
  database.exec(`PRAGMA user_version = ${version}`);
}

function hasColumn(
  database: SQLiteDatabase,
  tableName: string,
  columnName: string
): boolean {
  const rows: SqliteTableInfoRow[] = database.selectObjects(
    `PRAGMA table_info(${tableName})`
  );
  return rows.some((row) => row.name === columnName);
}

function addColumnIfMissing(
  database: SQLiteDatabase,
  tableName: string,
  columnDefinition: string
): void {
  const [columnName] = columnDefinition.trim().split(/\s+/, 1);
  if (!columnName || hasColumn(database, tableName, columnName)) {
    return;
  }

  database.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnDefinition}`);
}

const migrations: Migration[] = [
  {
    version: 1,
    name: "create-initial-schema",
    up(database) {
      database.exec(`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT
        )
      `);

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

      database.exec(`
        CREATE TABLE IF NOT EXISTS songs (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          lyrics TEXT NOT NULL,
          provider TEXT NOT NULL,
          source_url TEXT NOT NULL,
          embed_url TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        )
      `);

      database.exec(`
        CREATE TABLE IF NOT EXISTS language_islands (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          sentences_text TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        )
      `);

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

      database.exec(`
        CREATE TABLE IF NOT EXISTS stats (
          date TEXT PRIMARY KEY,
          new_cards_studied INTEGER DEFAULT 0
        )
      `);

      database.exec(`
        CREATE TABLE IF NOT EXISTS folders (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          color TEXT NOT NULL,
          created_at INTEGER NOT NULL
        )
      `);
    },
  },
  {
    version: 2,
    name: "add-text-folders",
    up(database) {
      addColumnIfMissing(database, "texts", "folder_id TEXT");
    },
  },
  {
    version: 3,
    name: "add-sync-metadata",
    up(database) {
      addColumnIfMissing(database, "words", "updated_at INTEGER");
      addColumnIfMissing(database, "words", "sync_meta TEXT");
      addColumnIfMissing(database, "phrases", "updated_at INTEGER");
      addColumnIfMissing(database, "phrases", "sync_meta TEXT");

      database.exec(`
        UPDATE words
        SET updated_at = COALESCE(updated_at, added_at)
        WHERE updated_at IS NULL
      `);
      database.exec(`
        UPDATE phrases
        SET updated_at = COALESCE(updated_at, added_at)
        WHERE updated_at IS NULL
      `);
    },
  },
];

export interface MigrationResult {
  appliedVersions: number[];
  schemaVersion: number;
}

export function migrateDatabase(database: SQLiteDatabase): MigrationResult {
  ensureMigrationTable(database);

  const appliedVersions = getAppliedMigrationVersions(database);
  const newlyAppliedVersions: number[] = [];

  for (const migration of migrations) {
    if (appliedVersions.has(migration.version)) {
      continue;
    }

    database.exec("BEGIN");

    try {
      migration.up(database);
      database.exec(
        "INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)",
        {
          bind: [migration.version, migration.name, Date.now()],
        }
      );
      setUserVersion(database, migration.version);
      database.exec("COMMIT");
      newlyAppliedVersions.push(migration.version);
    } catch (error) {
      database.exec("ROLLBACK");
      throw error;
    }
  }

  const schemaVersion = Math.max(
    getUserVersion(database),
    LATEST_SCHEMA_VERSION
  );
  if (getUserVersion(database) !== schemaVersion) {
    setUserVersion(database, schemaVersion);
  }

  return {
    appliedVersions: newlyAppliedVersions,
    schemaVersion,
  };
}
