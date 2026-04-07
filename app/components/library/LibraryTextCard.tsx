import { Link } from "react-router";

import type { Folder, TextItem } from "~/types";

import {
  BookIcon,
  ChevronDownIcon,
  FolderIcon,
  PencilIcon,
  TrashIcon,
  VolumeIcon,
  XCircleIcon,
} from "./icons";

interface LibraryTextCardProps {
  text: TextItem;
  folders: Folder[];
  onStartEdit: (text: TextItem) => void;
  onDeleteText: (id: string) => void;
  onMoveToFolder: (textId: string, folderId: string | null) => void;
  onAudioMenuAction: (textId: string, action: "file" | "url" | "clear") => void;
}

export function LibraryTextCard({
  text,
  folders,
  onStartEdit,
  onDeleteText,
  onMoveToFolder,
  onAudioMenuAction,
}: LibraryTextCardProps) {
  const folderColor = text.folderId
    ? folders.find((folder) => folder.id === text.folderId)?.color
    : null;

  return (
    <article className="group overflow-visible rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-[#0F9EDA]/30 hover:shadow-md">
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <Link to={`/texts/${text.id}?source=library`} className="min-w-0">
            <h3 className="line-clamp-2 text-lg font-bold text-gray-900 transition-colors duration-200 group-hover:text-[#0F9EDA]">
              {text.title}
            </h3>
          </Link>
          <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
            {new Date(text.createdAt).toLocaleDateString()}
          </span>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-500">
          {text.content.substring(0, 150)}...
        </p>

        {text.audioRef ? (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Audio: {text.audioRef.type === "url" ? "URL" : text.audioRef.name}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-gray-100 pt-4">
          <div className="relative">
            <select
              className="cursor-pointer appearance-none rounded-xl bg-gray-50 px-4 py-2.5 pr-8 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              value={text.folderId ?? ""}
              onChange={(event) =>
                onMoveToFolder(text.id, event.target.value || null)
              }
              aria-label="Mover a carpeta"
              style={
                folderColor
                  ? { borderLeft: `3px solid ${folderColor}` }
                  : undefined
              }
            >
              <option value="">Sin carpeta</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
            <FolderIcon
              className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
          </div>

          <details
            id={`audio-menu-${text.id}`}
            className="relative group/audio"
          >
            <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white">
              <VolumeIcon className="h-4 w-4" aria-hidden="true" />
              Audio
              <ChevronDownIcon
                className="h-4 w-4 transition-transform duration-200 group-open/audio:rotate-180"
                aria-hidden="true"
              />
            </summary>

            <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
              <button
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
                onClick={() => void onAudioMenuAction(text.id, "file")}
                type="button"
              >
                Desde archivo
              </button>
              <button
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
                onClick={() => void onAudioMenuAction(text.id, "url")}
                type="button"
              >
                Desde URL
              </button>
              {text.audioRef ? (
                <button
                  className="inline-flex w-full items-center gap-1.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors duration-200 hover:bg-red-50"
                  onClick={() => void onAudioMenuAction(text.id, "clear")}
                  type="button"
                >
                  <XCircleIcon className="h-4 w-4" aria-hidden="true" />
                  Quitar audio
                </button>
              ) : null}
            </div>
          </details>

          <button
            className="inline-flex items-center gap-1.5 rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            onClick={() => onStartEdit(text)}
            type="button"
          >
            <PencilIcon className="h-4 w-4" aria-hidden="true" />
            Editar
          </button>

          <button
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors duration-200 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            onClick={() => onDeleteText(text.id)}
            type="button"
          >
            <TrashIcon className="h-4 w-4" aria-hidden="true" />
            Eliminar
          </button>

          <Link
            to={`/texts/${text.id}?source=library`}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0F9EDA] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0D8EC4] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <BookIcon className="h-4 w-4" aria-hidden="true" />
            Leer ahora
          </Link>
        </div>
      </div>
    </article>
  );
}
