import {
  ensurePhraseEntrySync,
  mergePhraseEntries,
} from "@shared/sync";
import type { PhraseEntry, SpacedRepetitionData } from "../../types";
import { getDB, scheduleSave } from "./core";

interface PhraseRow {
  phrase_lower: string;
  phrase: string;
  translation: string;
  parts: string;
  added_at: number;
  updated_at: number | null;
  sr_data: string | null;
  sync_meta: string | null;
}

function mapPhraseRow(row: PhraseRow): PhraseEntry {
  return {
    phrase: row.phrase,
    phraseLower: row.phrase_lower,
    translation: row.translation,
    parts: JSON.parse(row.parts) as string[],
    addedAt: row.added_at,
    updatedAt: row.updated_at ?? row.added_at,
    srData: row.sr_data
      ? (JSON.parse(row.sr_data) as SpacedRepetitionData)
      : undefined,
    sync: row.sync_meta ? JSON.parse(row.sync_meta) : undefined,
  };
}

/**
 * PHRASES CRUD
 */

export async function putPhrase(entry: PhraseEntry): Promise<void> {
  const database = await getDB();
  const phraseLower = entry.phraseLower || entry.parts.join(" ").toLowerCase();
  const rows: PhraseRow[] = database.selectObjects(
    "SELECT * FROM phrases WHERE phrase_lower = ?",
    [phraseLower]
  );
  const existing = rows[0] ? mapPhraseRow(rows[0]) : undefined;
  const mergedEntry = mergePhraseEntries(
    existing,
    {
      ...entry,
      phraseLower,
    },
    "web"
  );
  const normalizedEntry = ensurePhraseEntrySync(mergedEntry, "web");
  const partsJson = JSON.stringify(
    normalizedEntry.parts.map((p: string) => p.toLowerCase())
  );
  const srDataJson = normalizedEntry.srData
    ? JSON.stringify(normalizedEntry.srData)
    : null;
  const syncMetaJson = normalizedEntry.sync
    ? JSON.stringify(normalizedEntry.sync)
    : null;

  database.exec(
    `INSERT OR REPLACE INTO phrases (phrase_lower, phrase, translation, parts, added_at, updated_at, sr_data, sync_meta)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    {
      bind: [
        normalizedEntry.phraseLower,
        normalizedEntry.phrase,
        normalizedEntry.translation || "",
        partsJson,
        normalizedEntry.addedAt,
        normalizedEntry.updatedAt ?? normalizedEntry.addedAt,
        srDataJson,
        syncMetaJson,
      ],
    }
  );
  scheduleSave();
}

export async function getAllPhrases(): Promise<PhraseEntry[]> {
  const database = await getDB();
  const rows: PhraseRow[] = database.selectObjects(
    "SELECT * FROM phrases ORDER BY added_at DESC"
  );

  return rows.map(mapPhraseRow);
}

export async function getAllPhraseParts(): Promise<string[][]> {
  const database = await getDB();
  const rows: Array<{ parts: string }> = database.selectObjects(
    "SELECT parts FROM phrases ORDER BY added_at DESC"
  );

  return rows.map((row) => JSON.parse(row.parts) as string[]);
}

export async function getPhrase(
  phraseOrLower: string
): Promise<PhraseEntry | undefined> {
  const database = await getDB();
  const key = phraseOrLower.toLowerCase();
  const rows: PhraseRow[] = database.selectObjects(
    "SELECT * FROM phrases WHERE phrase_lower = ?",
    [key]
  );

  if (rows.length === 0) return undefined;

  return mapPhraseRow(rows[0]);
}

export async function deletePhrase(phraseOrLower: string): Promise<void> {
  const database = await getDB();
  const key = phraseOrLower.toLowerCase();
  database.exec("DELETE FROM phrases WHERE phrase_lower = ?", { bind: [key] });
  scheduleSave();
}
