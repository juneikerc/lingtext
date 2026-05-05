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
  const visibleGroups = groups.filter(
    (group) => group.folder || group.texts.length > 0
  );

  return (
    <section
      id="library"
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/10">
          <FolderIcon className="h-5 w-5 text-[#0F9EDA]" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-xl font-bold tracking-tight text-gray-900">
            Carpetas y lecturas
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Organiza y accede a todas tus lecturas guardadas.
          </p>
        </div>
      </div>

      {texts.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
            <div className="mb-2 flex items-center justify-between rounded-xl bg-white px-3 py-2.5 text-sm font-bold text-[#0F9EDA] shadow-sm">
              <span>Todas las lecturas</span>
              <span className="rounded-full bg-[#0F9EDA]/10 px-2 py-0.5 text-xs">
                {texts.length}
              </span>
            </div>
            <div className="space-y-1">
              {visibleGroups.map((group) => (
                <div
                  key={group.folder?.id ?? "uncategorized-nav"}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-600"
                >
                  <span className="inline-flex min-w-0 items-center gap-2">
                    {group.folder ? (
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: group.folder.color }}
                      />
                    ) : (
                      <FolderIcon className="h-4 w-4 shrink-0 text-gray-400" />
                    )}
                    <span className="truncate">
                      {group.folder?.name ?? "Sin carpeta"}
                    </span>
                  </span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-gray-500">
                    {group.texts.length}
                  </span>
                </div>
              ))}
            </div>
          </aside>

          <div className="min-w-0 rounded-2xl border border-gray-200 bg-gray-50 p-3">
            <div className="mb-3 hidden grid-cols-[minmax(0,1fr)_170px_120px_92px_44px] px-4 py-2 text-xs font-bold uppercase tracking-wide text-gray-400 lg:grid">
              <span>Lectura</span>
              <span>Carpeta</span>
              <span className="text-center">Audio</span>
              <span className="text-center">Fecha</span>
              <span />
            </div>

            <div className="space-y-3">
              {visibleGroups.map((group) => (
                <details
                  key={group.folder?.id ?? "uncategorized"}
                  className="group/folder overflow-visible"
                  open
                >
                  <summary className="list-none cursor-pointer">
                    <div className="mb-3 flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors duration-200 hover:border-[#0F9EDA]/30">
                      {group.folder ? (
                        <span
                          className="h-3 w-3 shrink-0 rounded-full"
                          style={{ backgroundColor: group.folder.color }}
                        />
                      ) : (
                        <FolderIcon className="h-5 w-5 text-gray-400" />
                      )}
                      <h4 className="font-bold text-gray-900">
                        {group.folder?.name ?? "Sin carpeta"}
                      </h4>
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500">
                        {group.texts.length}{" "}
                        {group.texts.length === 1 ? "lectura" : "lecturas"}
                      </span>
                      <ChevronDownIcon className="ml-auto h-4 w-4 text-gray-400 transition-transform duration-200 group-open/folder:rotate-180" />
                    </div>
                  </summary>

                  {group.texts.length > 0 ? (
                    <div className="space-y-2">
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
                  ) : (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-5 text-sm text-gray-500">
                      Esta carpeta todavía no tiene lecturas.
                    </div>
                  )}
                </details>
              ))}
            </div>

            <div className="mt-4 border-t border-gray-200 px-2 pt-3 text-sm text-gray-500">
              Mostrando {texts.length}{" "}
              {texts.length === 1 ? "lectura" : "lecturas"}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center sm:p-16">
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
            className="inline-flex min-h-12 items-center rounded-xl bg-[#0F9EDA] px-8 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0D8EC4] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            onClick={() => titleInputRef.current?.focus()}
          >
            Crear Primer Texto
          </button>
        </div>
      )}
    </section>
  );
}
