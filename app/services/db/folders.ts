import type { Folder } from "../../types";
import { getDB, scheduleSave } from "./core";

export async function getAllFolders(): Promise<Folder[]> {
  const database = await getDB();
  const rows: Array<{
    id: string;
    name: string;
    color: string;
    created_at: number;
  }> = database.selectObjects("SELECT * FROM folders ORDER BY created_at ASC");

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    color: row.color,
    createdAt: row.created_at,
  }));
}

export async function addFolder(folder: Folder): Promise<void> {
  const database = await getDB();
  database.exec(
    `INSERT INTO folders (id, name, color, created_at) VALUES (?, ?, ?, ?)`,
    { bind: [folder.id, folder.name, folder.color, folder.createdAt] }
  );
  scheduleSave();
}

export async function updateFolder(folder: Folder): Promise<void> {
  const database = await getDB();
  database.exec("UPDATE folders SET name = ?, color = ? WHERE id = ?", {
    bind: [folder.name, folder.color, folder.id],
  });
  scheduleSave();
}

export async function deleteFolder(id: string): Promise<void> {
  const database = await getDB();
  // Unassign texts from this folder before deleting
  database.exec("UPDATE texts SET folder_id = NULL WHERE folder_id = ?", {
    bind: [id],
  });
  database.exec("DELETE FROM folders WHERE id = ?", { bind: [id] });
  scheduleSave();
}

export async function getFolderTextCount(folderId: string): Promise<number> {
  const database = await getDB();
  const rows: Array<{ count: number }> = database.selectObjects(
    "SELECT COUNT(*) as count FROM texts WHERE folder_id = ?",
    [folderId]
  );
  return rows[0]?.count ?? 0;
}
