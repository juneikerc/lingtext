import { normalizeWord } from "@shared/tokenize";
import { ensureWordEntrySync, mergeWordEntries } from "@shared/sync";
import type { VoiceParams, SpacedRepetitionData, WordEntry } from "../../types";
import { getDB, scheduleSave } from "./core";

interface WordRow {
  word_lower: string;
  word: string;
  translation: string;
  status: string;
  added_at: number;
  updated_at: number | null;
  voice: string | null;
  sr_data: string | null;
  sync_meta: string | null;
}

function mapWordRow(row: WordRow): WordEntry {
  return {
    word: row.word,
    wordLower: row.word_lower,
    translation: row.translation,
    status: row.status as "unknown",
    addedAt: row.added_at,
    updatedAt: row.updated_at ?? row.added_at,
    voice: row.voice ? (JSON.parse(row.voice) as VoiceParams) : undefined,
    srData: row.sr_data
      ? (JSON.parse(row.sr_data) as SpacedRepetitionData)
      : undefined,
    sync: row.sync_meta ? JSON.parse(row.sync_meta) : undefined,
  };
}

/**
 * WORDS CRUD
 */

export async function putUnknownWord(entry: WordEntry): Promise<void> {
  const database = await getDB();
  const wordLower = entry.wordLower || normalizeWord(entry.word);
  const rows: WordRow[] = database.selectObjects(
    "SELECT * FROM words WHERE word_lower = ?",
    [wordLower]
  );
  const existing = rows[0] ? mapWordRow(rows[0]) : undefined;
  const mergedEntry = mergeWordEntries(
    existing,
    {
      ...entry,
      wordLower,
    },
    "web"
  );
  const normalizedEntry = ensureWordEntrySync(mergedEntry, "web");
  const voiceJson = normalizedEntry.voice
    ? JSON.stringify(normalizedEntry.voice)
    : null;
  const srDataJson = normalizedEntry.srData
    ? JSON.stringify(normalizedEntry.srData)
    : null;
  const syncMetaJson = normalizedEntry.sync
    ? JSON.stringify(normalizedEntry.sync)
    : null;

  database.exec(
    `INSERT OR REPLACE INTO words (word_lower, word, translation, status, added_at, updated_at, voice, sr_data, sync_meta)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    {
      bind: [
        normalizedEntry.wordLower,
        normalizedEntry.word,
        normalizedEntry.translation || "",
        normalizedEntry.status || "unknown",
        normalizedEntry.addedAt,
        normalizedEntry.updatedAt ?? normalizedEntry.addedAt,
        voiceJson,
        srDataJson,
        syncMetaJson,
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
  const key = normalizeWord(wordOrLower);
  const rows: WordRow[] = database.selectObjects(
    "SELECT * FROM words WHERE word_lower = ?",
    [key]
  );

  if (rows.length === 0) return undefined;

  return mapWordRow(rows[0]);
}

export async function getAllUnknownWords(): Promise<WordEntry[]> {
  const database = await getDB();
  const rows: WordRow[] = database.selectObjects(
    "SELECT * FROM words ORDER BY added_at DESC"
  );

  return rows.map(mapWordRow);
}

export async function getAllUnknownWordLowers(): Promise<string[]> {
  const database = await getDB();
  const rows: Array<{ word_lower: string }> = database.selectObjects(
    "SELECT word_lower FROM words ORDER BY added_at DESC"
  );

  return rows.map((row) => row.word_lower);
}
