import type { TextItem, AudioRef } from "../../types";
import { getDB, scheduleSave } from "./core";
import { serializeAudioRef, deserializeAudioRef } from "./audio-ref";

/**
 * TEXTS CRUD
 */

export async function addText(item: TextItem): Promise<void> {
  const database = await getDB();
  const audioRefJson = item.audioRef
    ? JSON.stringify(serializeAudioRef(item.audioRef))
    : null;

  database.exec(
    `INSERT OR REPLACE INTO texts (id, title, content, format, created_at, audio_ref, folder_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    {
      bind: [
        item.id,
        item.title,
        item.content,
        item.format || "txt",
        item.createdAt,
        audioRefJson,
        item.folderId ?? null,
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
    folder_id: string | null;
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
    folderId: row.folder_id ?? null,
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
    folder_id: string | null;
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
    folderId: row.folder_id ?? null,
  };
}

export async function deleteText(id: string): Promise<void> {
  const database = await getDB();
  database.exec("DELETE FROM texts WHERE id = ?", { bind: [id] });
  scheduleSave();
}

export async function updateText(item: TextItem): Promise<void> {
  const database = await getDB();
  const audioRefJson = item.audioRef
    ? JSON.stringify(serializeAudioRef(item.audioRef))
    : null;

  database.exec(
    `UPDATE texts
     SET title = ?, content = ?, format = ?, audio_ref = ?, folder_id = ?
     WHERE id = ?`,
    {
      bind: [
        item.title,
        item.content,
        item.format || "txt",
        audioRefJson,
        item.folderId ?? null,
        item.id,
      ],
    }
  );
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

export async function moveTextToFolder(
  textId: string,
  folderId: string | null
): Promise<void> {
  const database = await getDB();
  database.exec("UPDATE texts SET folder_id = ? WHERE id = ?", {
    bind: [folderId, textId],
  });
  scheduleSave();
}
