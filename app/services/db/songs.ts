import type { SongItem } from "../../types";
import { getDB, scheduleSave } from "./core";

export async function addSong(item: SongItem): Promise<void> {
  const database = await getDB();
  database.exec(
    `INSERT INTO songs (
      id,
      title,
      lyrics,
      provider,
      source_url,
      embed_url,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    {
      bind: [
        item.id,
        item.title,
        item.lyrics,
        item.provider,
        item.sourceUrl,
        item.embedUrl,
        item.createdAt,
        item.updatedAt,
      ],
    }
  );
  scheduleSave();
}

export async function getAllSongs(): Promise<SongItem[]> {
  const database = await getDB();
  const rows: Array<{
    id: string;
    title: string;
    lyrics: string;
    provider: string;
    source_url: string;
    embed_url: string;
    created_at: number;
    updated_at: number;
  }> = database.selectObjects(
    "SELECT * FROM songs ORDER BY updated_at DESC, created_at DESC"
  );

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    lyrics: row.lyrics,
    provider: row.provider as SongItem["provider"],
    sourceUrl: row.source_url,
    embedUrl: row.embed_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function getSong(id: string): Promise<SongItem | undefined> {
  const database = await getDB();
  const rows: Array<{
    id: string;
    title: string;
    lyrics: string;
    provider: string;
    source_url: string;
    embed_url: string;
    created_at: number;
    updated_at: number;
  }> = database.selectObjects("SELECT * FROM songs WHERE id = ?", [id]);

  if (rows.length === 0) return undefined;

  const row = rows[0];
  return {
    id: row.id,
    title: row.title,
    lyrics: row.lyrics,
    provider: row.provider as SongItem["provider"],
    sourceUrl: row.source_url,
    embedUrl: row.embed_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function updateSong(item: SongItem): Promise<void> {
  const database = await getDB();
  database.exec(
    `UPDATE songs
     SET title = ?,
         lyrics = ?,
         provider = ?,
         source_url = ?,
         embed_url = ?,
         updated_at = ?
     WHERE id = ?`,
    {
      bind: [
        item.title,
        item.lyrics,
        item.provider,
        item.sourceUrl,
        item.embedUrl,
        item.updatedAt,
        item.id,
      ],
    }
  );
  scheduleSave();
}

export async function deleteSong(id: string): Promise<void> {
  const database = await getDB();
  database.exec("DELETE FROM songs WHERE id = ?", { bind: [id] });
  scheduleSave();
}
