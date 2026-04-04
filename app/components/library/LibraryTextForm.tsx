import type React from "react";

import type { Folder } from "~/types";

import type { LibraryMessage } from "./types";

interface LibraryTextFormProps {
  folders: Folder[];
  title: string;
  content: string;
  inputFormat: "txt" | "markdown";
  importUrl: string;
  isImportingUrl: boolean;
  urlImportMessage: LibraryMessage | null;
  isEditing: boolean;
  selectedFolderId: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  titleInputRef: React.RefObject<HTMLInputElement | null>;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onInputFormatChange: (value: "txt" | "markdown") => void;
  onImportUrlChange: (value: string) => void;
  onSelectedFolderChange: (value: string | null) => void;
  onImportTxt: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImportUrl: () => void;
  onSubmitText: () => void;
  onResetForm: () => void;
}

export function LibraryTextForm({
  folders,
  title,
  content,
  inputFormat,
  importUrl,
  isImportingUrl,
  urlImportMessage,
  isEditing,
  selectedFolderId,
  fileInputRef,
  titleInputRef,
  onTitleChange,
  onContentChange,
  onInputFormatChange,
  onImportUrlChange,
  onSelectedFolderChange,
  onImportTxt,
  onImportUrl,
  onSubmitText,
  onResetForm,
}: LibraryTextFormProps) {
  return (
    <div
      id="library-text-form"
      className="mb-12 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <h3 className="mb-6 flex items-center text-2xl font-bold text-gray-900 dark:text-gray-100">
        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
          <span className="text-sm text-white">+</span>
        </div>
        {isEditing ? "Editar Texto" : "Agregar Nuevo Texto"}
      </h3>

      {isEditing ? (
        <div className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800 dark:border-indigo-900/60 dark:bg-indigo-900/20 dark:text-indigo-300">
          Estás editando un texto existente. Guarda los cambios o cancela la edición.
        </div>
      ) : null}

      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Título del texto
            </label>
            <input
              ref={titleInputRef}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition-all duration-200 placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
              placeholder="Ej: The Great Gatsby - Chapter 1"
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
            />
          </div>

          {folders.length > 0 ? (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Carpeta
              </label>
              <select
                className="w-full cursor-pointer rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                value={selectedFolderId ?? ""}
                onChange={(event) => onSelectedFolderChange(event.target.value || null)}
              >
                <option value="">Sin carpeta</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/60">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  ¿Tienes un archivo .txt?
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Importa directamente un archivo de texto plano
                </p>
              </div>
              <button
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-950"
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                📄 Cargar .txt
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,text/plain"
                style={{ display: "none" }}
                onChange={onImportTxt}
              />
            </div>

            <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Importar desde una URL
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Intentamos leer la pagina directamente desde tu navegador y convertirla
                  a markdown. Si el sitio bloquea CORS, te lo avisaremos.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 transition-all duration-200 placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400"
                  placeholder="https://example.com/article"
                  value={importUrl}
                  onChange={(event) => onImportUrlChange(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      onImportUrl();
                    }
                  }}
                  inputMode="url"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                />
                <button
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-950"
                  onClick={onImportUrl}
                  disabled={isImportingUrl || !importUrl.trim()}
                  type="button"
                >
                  {isImportingUrl ? "Importando..." : "🌐 Importar URL"}
                </button>
              </div>

              {urlImportMessage ? (
                <div
                  className={`rounded-lg border px-3 py-2 text-sm ${
                    urlImportMessage.type === "success"
                      ? "border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                  }`}
                >
                  {urlImportMessage.text}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mb-2 flex gap-2">
          <button
            type="button"
            onClick={() => onInputFormatChange("txt")}
            className={`rounded-lg px-4 py-2 font-medium transition-colors ${
              inputFormat === "txt"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            📝 Texto Plano
          </button>
          <button
            type="button"
            onClick={() => onInputFormatChange("markdown")}
            className={`rounded-lg px-4 py-2 font-medium transition-colors ${
              inputFormat === "markdown"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            📄 Markdown
          </button>
        </div>

        <textarea
          className="min-h-[140px] w-full resize-y rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 font-mono text-gray-900 transition-all duration-200 placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
          placeholder={
            inputFormat === "markdown"
              ? "Pega aquí tu texto en inglés con formato Markdown...\n\nEjemplo:\n# Título\n**negrita** *cursiva* [enlace](url)\n- lista\n> cita"
              : "Pega aquí tu texto en inglés..."
          }
          value={content}
          onChange={(event) => onContentChange(event.target.value)}
        />

        <div className="flex flex-wrap justify-end gap-3">
          {isEditing ? (
            <button
              className="rounded-xl bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              onClick={onResetForm}
              type="button"
            >
              Cancelar edición
            </button>
          ) : null}
          <button
            className="rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-600"
            onClick={onSubmitText}
            disabled={!content.trim()}
            type="button"
          >
            {isEditing ? "Guardar cambios" : "Crear Texto"}
          </button>
        </div>
      </div>
    </div>
  );
}
