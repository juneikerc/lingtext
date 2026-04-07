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
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-3 text-xl font-bold text-gray-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/10">
            <FolderIcon className="h-5 w-5 text-[#0F9EDA]" aria-hidden="true" />
          </div>
          Carpetas
        </h3>
        {!isCreatingFolder ? (
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/5 px-4 py-2.5 text-sm font-medium text-[#0F9EDA] transition-colors duration-200 hover:bg-[#0F9EDA]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            onClick={() => onCreateModeChange(true)}
            type="button"
          >
            <FolderPlusIcon className="h-4 w-4" aria-hidden="true" />
            Nueva carpeta
          </button>
        ) : null}
      </div>

      {isCreatingFolder ? (
        <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-[#0F9EDA] focus:outline-none focus:ring-2 focus:ring-[#0F9EDA]/20"
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
                      ? "scale-110 ring-2 ring-gray-400 ring-offset-2"
                      : "hover:scale-110"
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
              className="rounded-xl bg-[#0F9EDA] px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#0D8EC4] disabled:cursor-not-allowed disabled:bg-gray-400"
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
        <div className="flex flex-wrap gap-2">
          {folders.map((folder) => (
            <div key={folder.id}>
              {editingFolderId === folder.id ? (
                <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
                  <input
                    className="w-36 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F9EDA]"
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
                    className="text-xs font-medium text-[#0F9EDA] hover:underline"
                    onClick={() => onUpdateFolder(folder.id)}
                    type="button"
                  >
                    Guardar
                  </button>
                  <button
                    className="text-xs text-gray-500 hover:text-gray-700"
                    onClick={() => onEditingFolderChange(null)}
                    type="button"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <span
                  className="inline-flex cursor-default items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium"
                  style={{
                    backgroundColor: `${folder.color}18`,
                    color: folder.color,
                  }}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: folder.color }}
                  />
                  {folder.name}
                  <span className="text-xs opacity-60">
                    (
                    {texts.filter((text) => text.folderId === folder.id).length}
                    )
                  </span>
                  <button
                    className="ml-1 opacity-50 transition-opacity duration-200 hover:opacity-100"
                    onClick={() => onStartEditFolder(folder)}
                    type="button"
                    aria-label={`Editar carpeta ${folder.name}`}
                  >
                    <PencilIcon className="h-3 w-3" />
                  </button>
                  <button
                    className="opacity-50 transition-opacity duration-200 hover:opacity-100"
                    onClick={() => onDeleteFolder(folder.id)}
                    type="button"
                    aria-label={`Eliminar carpeta ${folder.name}`}
                  >
                    <TrashIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          ))}
        </div>
      ) : !isCreatingFolder ? (
        <p className="text-sm text-gray-500">
          Crea carpetas para organizar tus textos por temas o niveles.
        </p>
      ) : null}
    </div>
  );
}
