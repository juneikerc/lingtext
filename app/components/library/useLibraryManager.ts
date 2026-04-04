import { useEffect, useState } from "react";

import { getAllFolders, getAllTexts } from "~/services/db";
import type { Folder, TextItem } from "~/types";
import { seedInitialDataOnce } from "~/utils/seed";

import type { TextGroup } from "./types";
import { useLibraryBackup } from "./useLibraryBackup";
import { useLibraryFolders } from "./useLibraryFolders";
import { useLibraryTextForm } from "./useLibraryTextForm";

export function useLibraryManager() {
  const [texts, setTexts] = useState<TextItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function refresh() {
    const [textList, folderList] = await Promise.all([getAllTexts(), getAllFolders()]);
    textList.sort((left, right) => right.createdAt - left.createdAt);
    setTexts(textList);
    setFolders(folderList);
  }

  useEffect(() => {
    let mounted = true;

    async function initializeData() {
      try {
        await seedInitialDataOnce();
        if (mounted) {
          await refresh();
        }
      } catch (error) {
        console.error("[Library] Failed to initialize:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void initializeData();

    return () => {
      mounted = false;
    };
  }, []);
  const backup = useLibraryBackup();
  const folderManager = useLibraryFolders(folders, refresh);
  const textForm = useLibraryTextForm(texts, refresh);

  function groupedTexts(): TextGroup[] {
    const groups: TextGroup[] = [];
    groups.push({ folder: null, texts: texts.filter((text) => !text.folderId) });

    for (const folder of folders) {
      groups.push({
        folder,
        texts: texts.filter((text) => text.folderId === folder.id),
      });
    }

    return groups;
  }

  return {
    texts,
    folders,
    isLoading,
    groupedTexts,
    ...backup,
    ...folderManager,
    ...textForm,
  };
}
