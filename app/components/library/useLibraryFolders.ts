import { useState } from "react";

import { addFolder, deleteFolder, updateFolder } from "~/services/db";
import type { Folder, FolderColor } from "~/types";
import { FOLDER_COLORS } from "~/types";

export function useLibraryFolders(
  folders: Folder[],
  refresh: () => Promise<void>
) {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState<FolderColor>(FOLDER_COLORS[0]);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState("");
  const [editFolderColor, setEditFolderColor] = useState<FolderColor>(FOLDER_COLORS[0]);

  async function onCreateFolder() {
    const name = newFolderName.trim();
    if (!name) return;

    await addFolder({
      id: crypto.randomUUID(),
      name,
      color: newFolderColor,
      createdAt: Date.now(),
    });
    setNewFolderName("");
    setNewFolderColor(FOLDER_COLORS[0]);
    setIsCreatingFolder(false);
    await refresh();
  }

  async function onUpdateFolder(folderId: string) {
    const name = editFolderName.trim();
    if (!name) return;

    const existing = folders.find((folder) => folder.id === folderId);
    if (!existing) return;

    await updateFolder({ ...existing, name, color: editFolderColor });
    setEditingFolderId(null);
    await refresh();
  }

  async function onDeleteFolder(folderId: string) {
    const folder = folders.find((item) => item.id === folderId);
    if (!folder) return;

    if (
      !confirm(
        `¿Eliminar la carpeta "${folder.name}"? Los textos se moverán a "Sin carpeta".`
      )
    ) {
      return;
    }

    await deleteFolder(folderId);
    await refresh();
  }

  function onStartEditFolder(folder: Folder) {
    setEditingFolderId(folder.id);
    setEditFolderName(folder.name);
    setEditFolderColor(folder.color as FolderColor);
  }

  function resetFolderCreator() {
    setIsCreatingFolder(false);
    setNewFolderName("");
  }

  return {
    isCreatingFolder,
    setIsCreatingFolder,
    newFolderName,
    setNewFolderName,
    newFolderColor,
    setNewFolderColor,
    editingFolderId,
    setEditingFolderId,
    editFolderName,
    setEditFolderName,
    editFolderColor,
    setEditFolderColor,
    onCreateFolder,
    onUpdateFolder,
    onDeleteFolder,
    onStartEditFolder,
    resetFolderCreator,
  };
}
