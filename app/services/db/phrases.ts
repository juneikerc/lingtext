import type { PhraseEntry, SpacedRepetitionData } from "../../types";
import { getDB, scheduleSave } from "./core";

/**
 * PHRASES CRUD
 */

export async function putPhrase(entry: PhraseEntry): Promise<void> {
  const database = await getDB();
  const phraseLower = entry.parts.join(" ").toLowerCase();
  const partsJson = JSON.stringify(
    entry.parts.map((p: string) => p.toLowerCase())
  );
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
