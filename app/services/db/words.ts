import type { WordEntry, VoiceParams, SpacedRepetitionData } from "../../types";
import { getDB, scheduleSave } from "./core";

/**
 * WORDS CRUD
 */

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
