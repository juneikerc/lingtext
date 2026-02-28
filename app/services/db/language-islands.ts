import type { LanguageIslandItem } from "../../types";
import { getDB, scheduleSave } from "./core";

export async function addLanguageIsland(
  item: LanguageIslandItem
): Promise<void> {
  const database = await getDB();
  database.exec(
    `INSERT INTO language_islands (
      id,
      title,
      sentences_text,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?)`,
    {
      bind: [
        item.id,
        item.title,
        item.sentencesText,
        item.createdAt,
        item.updatedAt,
      ],
    }
  );
  scheduleSave();
}

export async function getAllLanguageIslands(): Promise<LanguageIslandItem[]> {
  const database = await getDB();
  const rows: Array<{
    id: string;
    title: string;
    sentences_text: string;
    created_at: number;
    updated_at: number;
  }> = database.selectObjects(
    "SELECT * FROM language_islands ORDER BY updated_at DESC, created_at DESC"
  );

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    sentencesText: row.sentences_text,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function getLanguageIsland(
  id: string
): Promise<LanguageIslandItem | undefined> {
  const database = await getDB();
  const rows: Array<{
    id: string;
    title: string;
    sentences_text: string;
    created_at: number;
    updated_at: number;
  }> = database.selectObjects("SELECT * FROM language_islands WHERE id = ?", [
    id,
  ]);

  if (rows.length === 0) return undefined;

  const row = rows[0];
  return {
    id: row.id,
    title: row.title,
    sentencesText: row.sentences_text,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function updateLanguageIsland(
  item: LanguageIslandItem
): Promise<void> {
  const database = await getDB();
  database.exec(
    `UPDATE language_islands
     SET title = ?,
         sentences_text = ?,
         updated_at = ?
     WHERE id = ?`,
    {
      bind: [item.title, item.sentencesText, item.updatedAt, item.id],
    }
  );
  scheduleSave();
}

export async function deleteLanguageIsland(id: string): Promise<void> {
  const database = await getDB();
  database.exec("DELETE FROM language_islands WHERE id = ?", { bind: [id] });
  scheduleSave();
}
