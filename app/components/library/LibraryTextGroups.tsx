import type React from "react";

import type { Folder, TextItem } from "~/types";

import { LibraryTextCard } from "./LibraryTextCard";
import { ChevronDownIcon, FolderIcon } from "./icons";
import type { TextGroup } from "./types";

interface LibraryTextGroupsProps {
  groups: TextGroup[];
  folders: Folder[];
  texts: TextItem[];
  titleInputRef: React.RefObject<HTMLInputElement | null>;
  onStartEdit: (text: TextItem) => void;
  onDeleteText: (id: string) => void;
  onMoveTextToFolder: (textId: string, folderId: string | null) => void;
  onAudioMenuAction: (
    textId: string,
    action: "file" | "url" | "clear"
  ) => void;
}

export function LibraryTextGroups({
  groups,
  folders,
  texts,
  titleInputRef,
  onStartEdit,
  onDeleteText,
  onMoveTextToFolder,
  onAudioMenuAction,
}: LibraryTextGroupsProps) {
  return (
    <div id="library" className="space-y-6">
      {texts.length > 0 ? (
        groups.map((group) => (
          <div key={group.folder?.id ?? "uncategorized"}>
            {group.folder ? (
              <details className="group/folder">
                <summary className="list-none cursor-pointer">
                  <div className="mb-3 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 transition-colors hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: group.folder.color }}
                    />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {group.folder.name}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {group.texts.length} {group.texts.length === 1 ? "texto" : "textos"}
                    </span>
                    <ChevronDownIcon className="ml-auto h-4 w-4 text-gray-400 transition-transform group-open/folder:rotate-180" />
                  </div>
                </summary>
                <div className="ml-2 space-y-4">
                  {group.texts.map((text) => (
                    <LibraryTextCard
                      key={text.id}
                      text={text}
                      folders={folders}
                      onStartEdit={onStartEdit}
                      onDeleteText={onDeleteText}
                      onMoveToFolder={onMoveTextToFolder}
                      onAudioMenuAction={onAudioMenuAction}
                    />
                  ))}
                </div>
              </details>
            ) : group.texts.length > 0 ? (
              <details className="group/folder">
                <summary className="list-none cursor-pointer">
                  <div className="mb-3 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 transition-colors hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
                    <FolderIcon className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      Sin carpeta
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {group.texts.length} {group.texts.length === 1 ? "texto" : "textos"}
                    </span>
                    <ChevronDownIcon className="ml-auto h-4 w-4 text-gray-400 transition-transform group-open/folder:rotate-180" />
                  </div>
                </summary>
                <div className="ml-2 space-y-4">
                  {group.texts.map((text) => (
                    <LibraryTextCard
                      key={text.id}
                      text={text}
                      folders={folders}
                      onStartEdit={onStartEdit}
                      onDeleteText={onDeleteText}
                      onMoveToFolder={onMoveTextToFolder}
                      onAudioMenuAction={onAudioMenuAction}
                    />
                  ))}
                </div>
              </details>
            ) : null}
          </div>
        ))
      ) : (
        <div className="py-16 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <span className="text-4xl">📚</span>
          </div>
          <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Tu biblioteca está vacía
          </h3>
          <p className="mx-auto mb-8 max-w-md text-gray-600 dark:text-gray-400">
            Comienza agregando tu primer texto para comenzar tu viaje de aprendizaje
            en inglés
          </p>
          <div className="flex justify-center">
            <button
              className="rounded-xl bg-indigo-600 px-8 py-4 font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-indigo-700 hover:shadow-md"
              onClick={() => titleInputRef.current?.focus()}
            >
              ✨ Crear Primer Texto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
