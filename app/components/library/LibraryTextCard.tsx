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
  onAudioMenuAction: (
    textId: string,
    action: "file" | "url" | "clear"
  ) => void;
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
    <article className="group overflow-visible rounded-2xl border border-gray-200 bg-white shadow-sm transition-colors duration-200 hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <Link to={`/texts/${text.id}?source=library`} className="min-w-0">
            <h3 className="line-clamp-2 text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-indigo-400">
              {text.title}
            </h3>
          </Link>
          <div className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            {new Date(text.createdAt).toLocaleDateString()}
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {text.content.substring(0, 150)}...
        </p>

        {text.audioRef ? (
          <div className="mt-3 flex w-fit items-center rounded-full bg-green-50 px-3 py-1 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">
            <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
            Audio conectado: {text.audioRef.type === "url" ? "URL" : text.audioRef.name}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-gray-200 pt-4 dark:border-gray-800">
          <div className="relative">
            <select
              className="cursor-pointer appearance-none rounded-xl bg-gray-100 px-4 py-2.5 pr-8 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus-visible:ring-offset-gray-950"
              value={text.folderId ?? ""}
              onChange={(event) => onMoveToFolder(text.id, event.target.value || null)}
              aria-label="Mover a carpeta"
              style={
                folderColor ? { borderLeft: `3px solid ${folderColor}` } : undefined
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

          <details id={`audio-menu-${text.id}`} className="relative group/audio">
            <summary className="inline-flex cursor-pointer list-none items-center rounded-xl bg-gray-100 px-4 py-2.5 font-medium text-gray-700 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-gray-800 dark:text-gray-200 dark:focus-visible:ring-offset-gray-950">
              <VolumeIcon className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Agregar audio
              <ChevronDownIcon
                className="ml-1.5 h-4 w-4 transition-transform group-open/audio:rotate-180"
                aria-hidden="true"
              />
            </summary>

            <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg dark:border-gray-700 dark:bg-gray-900">
              <button
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                onClick={() => void onAudioMenuAction(text.id, "file")}
                type="button"
              >
                Desde archivo
              </button>
              <button
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                onClick={() => void onAudioMenuAction(text.id, "url")}
                type="button"
              >
                Desde URL
              </button>
              {text.audioRef ? (
                <button
                  className="inline-flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  onClick={() => void onAudioMenuAction(text.id, "clear")}
                  type="button"
                >
                  <XCircleIcon className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  Quitar audio
                </button>
              ) : null}
            </div>
          </details>

          <button
            className="inline-flex items-center rounded-xl bg-gray-100 px-4 py-2.5 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus-visible:ring-offset-gray-950"
            onClick={() => onStartEdit(text)}
            type="button"
          >
            <PencilIcon className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Editar
          </button>

          <button
            className="inline-flex items-center rounded-xl bg-red-50 px-4 py-2.5 font-medium text-red-700 transition-colors duration-200 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/40 dark:focus-visible:ring-offset-gray-950"
            onClick={() => onDeleteText(text.id)}
            type="button"
          >
            <TrashIcon className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Eliminar
          </button>

          <Link
            to={`/texts/${text.id}?source=library`}
            className="inline-flex items-center rounded-xl bg-indigo-600 px-6 py-2.5 font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-indigo-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
          >
            <BookIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            Leer ahora
          </Link>
        </div>
      </div>
    </article>
  );
}
