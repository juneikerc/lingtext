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

function DotsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="5" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="12" cy="19" r="1.8" />
    </svg>
  );
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
  const createdAt = new Date(text.createdAt).toLocaleDateString();

  return (
    <article className="group overflow-visible rounded-xl border border-gray-200 bg-white px-4 py-4 transition-colors duration-200 hover:border-[#0F9EDA]/30 hover:bg-[#0F9EDA]/[0.02]">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_170px_120px_92px_44px] lg:items-center">
        <div className="min-w-0">
          <Link
            to={`/texts/${text.id}?source=library`}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <h3 className="line-clamp-1 font-bold text-gray-900 transition-colors duration-200 group-hover:text-[#0F9EDA]">
              {text.title}
            </h3>
          </Link>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
            {text.content.substring(0, 150)}...
          </p>
          {text.audioRef ? (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Audio disponible
            </div>
          ) : null}
        </div>

        <div className="relative">
          <select
            className="min-h-11 w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 pr-8 text-sm font-semibold text-gray-600 transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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

        <details id={`audio-menu-${text.id}`} className="relative group/audio">
          <summary className="inline-flex min-h-11 w-full cursor-pointer list-none items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-gray-600 transition-colors duration-200 hover:bg-white hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white">
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

        <span className="text-sm font-medium text-gray-500 lg:text-center">
          {createdAt}
        </span>

        <details className="relative justify-self-start group/actions lg:justify-self-end">
          <summary
            className="inline-flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-500 transition-colors duration-200 hover:bg-white hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label="Acciones de lectura"
          >
            <DotsIcon />
          </summary>
          <div className="absolute right-auto z-30 mt-2 w-44 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg lg:right-0">
            <button
              className="inline-flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
              onClick={() => onStartEdit(text)}
              type="button"
            >
              <PencilIcon className="h-4 w-4" aria-hidden="true" />
              Editar
            </button>
            <button
              className="inline-flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors duration-200 hover:bg-red-50"
              onClick={() => onDeleteText(text.id)}
              type="button"
            >
              <TrashIcon className="h-4 w-4" aria-hidden="true" />
              Eliminar
            </button>
            <Link
              to={`/texts/${text.id}?source=library`}
              className="inline-flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#0F9EDA] transition-colors duration-200 hover:bg-[#0F9EDA]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <BookIcon className="h-4 w-4" aria-hidden="true" />
              Leer ahora
            </Link>
          </div>
        </details>
      </div>
    </article>
  );
}
