import { useState } from "react";
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

type ImportTab = "manual" | "file" | "url";

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

function FileIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={className ?? "h-4 w-4"}
      aria-hidden="true"
    >
      <path
        d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M14 2v5h5M9 13h6M9 17h4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M12 9v4M12 17h.01M10.3 4.3 2.8 18a2 2 0 0 0 1.8 3h14.8a2 2 0 0 0 1.8-3L13.7 4.3a2 2 0 0 0-3.4 0Z"
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
  const [activeTab, setActiveTab] = useState<ImportTab>("manual");
  const characterCount = content.length.toLocaleString("es");
  const shouldShowEditor = activeTab === "manual" || Boolean(content.trim());

  const tabs: Array<{ id: ImportTab; label: string }> = [
    { id: "manual", label: "Pegar texto" },
    { id: "file", label: "Subir archivo" },
    { id: "url", label: "Importar desde URL" },
  ];

  return (
    <div
      id="library-text-form"
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="mb-7 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 text-[#0F9EDA]">
          <PlusIcon />
        </div>
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-gray-900">
            {isEditing ? "Editar lectura" : "Nueva lectura"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Guarda contenido propio para practicar lectura inmersiva.
          </p>
        </div>
      </div>

      {isEditing ? (
        <div className="mb-6 rounded-xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/5 px-4 py-3 text-sm font-medium text-[#0F9EDA]">
          Estás editando un texto existente. Guarda los cambios o cancela la
          edición.
        </div>
      ) : null}

      <div className="space-y-5">
        <div
          className="grid overflow-hidden rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-600 sm:grid-cols-3"
          role="tablist"
          aria-label="Método para agregar lectura"
        >
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                className={`flex items-center justify-center gap-2 border-b border-gray-200 px-4 py-3 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-inset sm:border-b-0 sm:border-r sm:last:border-r-0 ${
                  isActive
                    ? "bg-white text-[#0F9EDA]"
                    : "hover:bg-white hover:text-gray-900"
                }`}
                onClick={() => setActiveTab(tab.id)}
                type="button"
                role="tab"
                aria-selected={isActive}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                    isActive ? "border-[#0F9EDA]/30" : "border-gray-300"
                  }`}
                >
                  {index + 1}
                </span>
                {tab.label}
              </button>
            );
          })}
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.markdown,text/plain,text/markdown"
            className="hidden"
            onChange={onImportTxt}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="library-title"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              Título de la lectura
            </label>
            <input
              id="library-title"
              ref={titleInputRef}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-[#0F9EDA] focus:outline-none focus:ring-2 focus:ring-[#0F9EDA]/20"
              placeholder="Ej.: The Great Gatsby - Chapter 1"
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="library-folder"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              Selecciona carpeta
            </label>
            <select
              id="library-folder"
              className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-[#0F9EDA] focus:outline-none focus:ring-2 focus:ring-[#0F9EDA]/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
              value={selectedFolderId ?? ""}
              onChange={(event) =>
                onSelectedFolderChange(event.target.value || null)
              }
              disabled={folders.length === 0}
            >
              <option value="">Sin carpeta</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeTab === "file" ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#0F9EDA]/20 bg-white text-[#0F9EDA]">
                  <FileIcon />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Sube un archivo de texto o Markdown
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    Puedes cargar archivos .txt, .md o .markdown para revisarlos
                    antes de crear la lectura.
                  </p>
                </div>
              </div>
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#0F9EDA]/20 bg-white px-5 py-2.5 text-sm font-semibold text-[#0F9EDA] transition-colors duration-200 hover:border-[#0F9EDA]/40 hover:bg-[#0F9EDA]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                <FileIcon />
                Seleccionar archivo
              </button>
            </div>
          </div>
        ) : null}

        {activeTab === "url" ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Importar desde una URL
                </p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  Pegamos el contenido importado en el editor para que puedas
                  revisarlo antes de crear la lectura.
                </p>
              </div>
              <GlobeIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#0F9EDA]" />
            </div>

            <div className="mb-3 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-700">
              <span className="mt-0.5 shrink-0">
                <AlertIcon />
              </span>
              <p>
                La importación desde URL depende de permisos del sitio. No todo
                se procesa completamente desde el navegador, por lo que muchas
                páginas externas pueden fallar por CORS, bloqueos o contenido
                dinámico.
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
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0F9EDA]/20 bg-white px-4 py-2.5 text-sm font-semibold text-[#0F9EDA] transition-colors duration-200 hover:border-[#0F9EDA]/40 hover:bg-[#0F9EDA]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60"
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
                className={`mt-3 rounded-lg border px-3 py-2 text-sm ${
                  urlImportMessage.type === "success"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
                }`}
              >
                {urlImportMessage.text}
              </div>
            ) : null}
          </div>
        ) : null}

        {shouldShowEditor ? (
          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
              <label
                htmlFor="library-content"
                className="block text-sm font-semibold text-gray-800"
              >
                Pega tu texto aquí
              </label>
              <div className="flex rounded-xl bg-gray-100 p-1 text-xs font-semibold text-gray-600">
                <button
                  type="button"
                  onClick={() => onInputFormatChange("txt")}
                  className={`rounded-lg px-3 py-1.5 transition-all duration-200 ${
                    inputFormat === "txt"
                      ? "bg-white text-[#0F9EDA] shadow-sm"
                      : "hover:text-gray-900"
                  }`}
                >
                  Texto plano
                </button>
                <button
                  type="button"
                  onClick={() => onInputFormatChange("markdown")}
                  className={`rounded-lg px-3 py-1.5 transition-all duration-200 ${
                    inputFormat === "markdown"
                      ? "bg-white text-[#0F9EDA] shadow-sm"
                      : "hover:text-gray-900"
                  }`}
                >
                  Markdown
                </button>
              </div>
            </div>

            <textarea
              id="library-content"
              className="min-h-[210px] w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-[#0F9EDA] focus:outline-none focus:ring-2 focus:ring-[#0F9EDA]/20"
              placeholder={
                inputFormat === "markdown"
                  ? "Pega o escribe tu texto en inglés con formato Markdown..."
                  : "Pega o escribe tu texto en inglés..."
              }
              value={content}
              onChange={(event) => onContentChange(event.target.value)}
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
              <p>
                <span className="font-semibold text-amber-600">Consejo:</span>{" "}
                Cuanto más contenido, mejor será tu experiencia de aprendizaje.
              </p>
              <span>{characterCount} caracteres</span>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-2">
          {isEditing ? (
            <button
              className="rounded-xl bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              onClick={onResetForm}
              type="button"
            >
              Cancelar edición
            </button>
          ) : null}
          <button
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#0F9EDA] px-8 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0D8EC4] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none sm:flex-none"
            onClick={onSubmitText}
            disabled={!content.trim()}
            type="button"
          >
            <PlusIcon />
            {isEditing ? "Guardar cambios" : "Crear Texto"}
          </button>
        </div>
      </div>
    </div>
  );
}
