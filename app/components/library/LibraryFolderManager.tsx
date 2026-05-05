import type { Folder, FolderColor, TextItem } from "~/types";
import { FOLDER_COLORS } from "~/types";

import { FolderIcon, FolderPlusIcon, PencilIcon, TrashIcon } from "./icons";

interface LibraryFolderManagerProps {
  folders: Folder[];
  texts: TextItem[];
  isCreatingFolder: boolean;
  newFolderName: string;
  newFolderColor: FolderColor;
  editingFolderId: string | null;
  editFolderName: string;
  editFolderColor: FolderColor;
  onCreateModeChange: (value: boolean) => void;
  onNewFolderNameChange: (value: string) => void;
  onNewFolderColorChange: (value: FolderColor) => void;
  onEditFolderNameChange: (value: string) => void;
  onEditFolderColorChange: (value: FolderColor) => void;
  onEditingFolderChange: (value: string | null) => void;
  onCreateFolder: () => void;
  onUpdateFolder: (folderId: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onStartEditFolder: (folder: Folder) => void;
}

export function LibraryFolderManager({
  folders,
  texts,
  isCreatingFolder,
  newFolderName,
  newFolderColor,
  editingFolderId,
  editFolderName,
  editFolderColor,
  onCreateModeChange,
  onNewFolderNameChange,
  onNewFolderColorChange,
  onEditFolderNameChange,
  onEditFolderColorChange,
  onEditingFolderChange,
  onCreateFolder,
  onUpdateFolder,
  onDeleteFolder,
  onStartEditFolder,
}: LibraryFolderManagerProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/10">
            <FolderIcon className="h-5 w-5 text-[#0F9EDA]" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-gray-900">
              Carpetas
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Organiza tus lecturas por tema, nivel o rutina de estudio.
            </p>
          </div>
        </div>
        {!isCreatingFolder ? (
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0F9EDA] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#0D8EC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            onClick={() => onCreateModeChange(true)}
            type="button"
          >
            <FolderPlusIcon className="h-4 w-4" aria-hidden="true" />
            Nueva carpeta
          </button>
        ) : null}
      </div>

      {isCreatingFolder ? (
        <div className="mb-5 rounded-2xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/5 p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-[#0F9EDA] focus:outline-none focus:ring-2 focus:ring-[#0F9EDA]/20"
              placeholder="Nombre de la carpeta..."
              value={newFolderName}
              onChange={(event) => onNewFolderNameChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") onCreateFolder();
                if (event.key === "Escape") onCreateModeChange(false);
              }}
            />
            <div className="flex items-center gap-2">
              {FOLDER_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`h-7 w-7 rounded-full transition-all duration-200 ${
                    newFolderColor === color
                      ? "ring-2 ring-gray-400 ring-offset-2"
                      : "hover:ring-2 hover:ring-gray-200 hover:ring-offset-2"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => onNewFolderColorChange(color)}
                  aria-label={`Color ${color}`}
                />
              ))}
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button
              className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200"
              onClick={() => onCreateModeChange(false)}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="rounded-xl bg-[#0F9EDA] px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#0D8EC4] disabled:cursor-not-allowed disabled:bg-gray-400"
              onClick={onCreateFolder}
              disabled={!newFolderName.trim()}
              type="button"
            >
              Crear
            </button>
          </div>
        </div>
      ) : null}

      {folders.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {folders.map((folder) => (
            <div key={folder.id}>
              {editingFolderId === folder.id ? (
                <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <input
                    className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F9EDA]"
                    value={editFolderName}
                    onChange={(event) =>
                      onEditFolderNameChange(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") onUpdateFolder(folder.id);
                      if (event.key === "Escape") onEditingFolderChange(null);
                    }}
                  />
                  <div className="flex gap-1">
                    {FOLDER_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`h-5 w-5 rounded-full transition-all ${
                          editFolderColor === color
                            ? "ring-2 ring-gray-400 ring-offset-1"
                            : ""
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => onEditFolderColorChange(color)}
                      />
                    ))}
                  </div>
                  <button
                    className="rounded-lg bg-[#0F9EDA] px-3 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#0D8EC4]"
                    onClick={() => onUpdateFolder(folder.id)}
                    type="button"
                  >
                    Guardar
                  </button>
                  <button
                    className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition-colors duration-200 hover:bg-gray-100"
                    onClick={() => onEditingFolderChange(null)}
                    type="button"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                  style={{
                    borderLeftColor: folder.color,
                    borderLeftWidth: 4,
                  }}
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: folder.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {folder.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {
                        texts.filter((text) => text.folderId === folder.id)
                          .length
                      }{" "}
                      lecturas
                    </p>
                  </div>
                  <button
                    className="rounded-lg p-2 text-gray-400 transition-colors duration-200 hover:bg-white hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    onClick={() => onStartEditFolder(folder)}
                    type="button"
                    aria-label={`Editar carpeta ${folder.name}`}
                  >
                    <PencilIcon className="h-3 w-3" />
                  </button>
                  <button
                    className="rounded-lg p-2 text-gray-400 transition-colors duration-200 hover:bg-white hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    onClick={() => onDeleteFolder(folder.id)}
                    type="button"
                    aria-label={`Eliminar carpeta ${folder.name}`}
                  >
                    <TrashIcon className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : !isCreatingFolder ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-6 text-sm text-gray-500">
          Crea carpetas para organizar tus textos por temas o niveles.
        </div>
      ) : null}
    </section>
  );
}
