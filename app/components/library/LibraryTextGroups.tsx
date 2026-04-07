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
  onAudioMenuAction: (textId: string, action: "file" | "url" | "clear") => void;
}

function EmptyLibraryIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-10 w-10 text-[#0F9EDA]"
      aria-hidden="true"
    >
      <path
        d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M12 6v6M9 9h6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
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
    <div id="library">
      {texts.length > 0 ? (
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.folder?.id ?? "uncategorized"}>
              {group.folder ? (
                <details className="group/folder" open>
                  <summary className="list-none cursor-pointer">
                    <div className="mb-4 flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-colors duration-200 hover:border-gray-300 hover:shadow-md">
                      <span
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: group.folder.color }}
                      />
                      <h3 className="text-base font-bold text-gray-900">
                        {group.folder.name}
                      </h3>
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                        {group.texts.length}{" "}
                        {group.texts.length === 1 ? "texto" : "textos"}
                      </span>
                      <ChevronDownIcon className="ml-auto h-4 w-4 text-gray-400 transition-transform duration-200 group-open/folder:rotate-180" />
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
                <details className="group/folder" open>
                  <summary className="list-none cursor-pointer">
                    <div className="mb-4 flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-colors duration-200 hover:border-gray-300 hover:shadow-md">
                      <FolderIcon className="h-5 w-5 text-gray-400" />
                      <h3 className="text-base font-bold text-gray-900">
                        Sin carpeta
                      </h3>
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                        {group.texts.length}{" "}
                        {group.texts.length === 1 ? "texto" : "textos"}
                      </span>
                      <ChevronDownIcon className="ml-auto h-4 w-4 text-gray-400 transition-transform duration-200 group-open/folder:rotate-180" />
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
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-16 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/10">
            <EmptyLibraryIcon />
          </div>
          <h3 className="mb-2 text-2xl font-bold text-gray-900">
            Tu biblioteca está vacía
          </h3>
          <p className="mx-auto mb-8 max-w-md text-gray-600">
            Comienza agregando tu primer texto para comenzar tu viaje de
            aprendizaje en inglés
          </p>
          <button
            className="inline-flex items-center rounded-xl bg-[#0F9EDA] px-8 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0D8EC4] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            onClick={() => titleInputRef.current?.focus()}
          >
            Crear Primer Texto
          </button>
        </div>
      )}
    </div>
  );
}
