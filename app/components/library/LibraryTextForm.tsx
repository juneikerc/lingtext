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

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M12 5v14M5 12h14"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={className ?? "h-4 w-4"}
      aria-hidden="true"
    >
      <path
        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={className ?? "h-4 w-4"}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" strokeWidth="1.8" />
      <path
        d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
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
      className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
    >
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/10">
          <PlusIcon />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Editar Texto" : "Agregar Nuevo Texto"}
        </h3>
      </div>

      {isEditing ? (
        <div className="mb-6 rounded-xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/5 px-4 py-3 text-sm text-[#0F9EDA]">
          Estás editando un texto existente. Guarda los cambios o cancela la
          edición.
        </div>
      ) : null}

      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Título del texto
            </label>
            <input
              ref={titleInputRef}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-[#0F9EDA] focus:outline-none focus:ring-2 focus:ring-[#0F9EDA]/20"
              placeholder="Ej: The Great Gatsby - Chapter 1"
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
            />
          </div>

          {folders.length > 0 ? (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Carpeta
              </label>
              <select
                className="w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 transition-all duration-200 focus:border-[#0F9EDA] focus:outline-none focus:ring-2 focus:ring-[#0F9EDA]/20"
                value={selectedFolderId ?? ""}
                onChange={(event) =>
                  onSelectedFolderChange(event.target.value || null)
                }
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
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  ¿Tienes un archivo .txt?
                </p>
                <p className="text-xs text-gray-500">
                  Importa directamente un archivo de texto plano
                </p>
              </div>
              <button
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-200 hover:border-[#0F9EDA]/30 hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                <UploadIcon />
                Cargar archivo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,text/plain"
                style={{ display: "none" }}
                onChange={onImportTxt}
              />
            </div>

            <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Importar desde una URL
                </p>
                <p className="text-xs text-gray-500">
                  Leemos la página desde tu navegador y la convertimos a
                  markdown. Si el sitio bloquea CORS, te lo avisaremos.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-[#0F9EDA] focus:outline-none focus:ring-2 focus:ring-[#0F9EDA]/20"
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
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-200 hover:border-[#0F9EDA]/30 hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={onImportUrl}
                  disabled={isImportingUrl || !importUrl.trim()}
                  type="button"
                >
                  <GlobeIcon />
                  {isImportingUrl ? "Importando..." : "Importar"}
                </button>
              </div>

              {urlImportMessage ? (
                <div
                  className={`rounded-lg border px-3 py-2 text-sm ${
                    urlImportMessage.type === "success"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                  }`}
                >
                  {urlImportMessage.text}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onInputFormatChange("txt")}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              inputFormat === "txt"
                ? "bg-[#0F9EDA] text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Texto Plano
          </button>
          <button
            type="button"
            onClick={() => onInputFormatChange("markdown")}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              inputFormat === "markdown"
                ? "bg-[#0F9EDA] text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Markdown
          </button>
        </div>

        <textarea
          className="min-h-[140px] w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-[#0F9EDA] focus:outline-none focus:ring-2 focus:ring-[#0F9EDA]/20"
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
              className="rounded-xl bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-200"
              onClick={onResetForm}
              type="button"
            >
              Cancelar edición
            </button>
          ) : null}
          <button
            className="rounded-xl bg-[#0F9EDA] px-8 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0D8EC4] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none"
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
