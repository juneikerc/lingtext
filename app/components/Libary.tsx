import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router";
import {
  getAllTexts,
  addText,
  deleteText,
  updateTextAudioRef,
  exportDatabase,
  importDatabase,
  getDatabaseInfo,
} from "../services/db";
import type { TextItem, AudioRef } from "../types";
import { pickAudioFile } from "../utils/fs";
import {
  validateTextContent,
  validateTitle,
  validateFileType,
  sanitizeTextContent,
} from "../utils/validation";
import { seedInitialDataOnce } from "~/utils/seed";

// interface Props {
//   libraryTexts: TextItem[];
// }

export default function Library() {
  const [texts, setTexts] = useState<TextItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [inputFormat, setInputFormat] = useState<"txt" | "markdown">("txt");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Database backup/restore state
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [dbMessage, setDbMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initializeData() {
      try {
        // First, seed initial data if needed
        await seedInitialDataOnce();
        // Then load texts
        if (mounted) {
          await refresh();
        }
      } catch (error) {
        console.error("[Library] Failed to initialize:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initializeData();

    return () => {
      mounted = false;
    };
  }, []);

  async function refresh() {
    const list = await getAllTexts();
    list.sort((a, b) => b.createdAt - a.createdAt);
    setTexts(list);
  }

  // Database export handler
  async function handleExportDatabase() {
    setIsExporting(true);
    setDbMessage(null);
    try {
      const success = await exportDatabase();
      if (success) {
        const info = await getDatabaseInfo();
        setDbMessage({
          type: "success",
          text: `Base de datos exportada (${info.textCount} textos, ${info.wordCount} palabras)`,
        });
      }
      // If not success, user cancelled - no message needed
    } catch (error) {
      setDbMessage({
        type: "error",
        text: `Error al exportar: ${(error as Error).message}`,
      });
    } finally {
      setIsExporting(false);
    }
  }

  // Database import handler
  async function handleImportDatabase() {
    const confirmed = window.confirm(
      "⚠️ Importar una base de datos reemplazará TODOS tus datos actuales.\n\n" +
        "Esto incluye:\n" +
        "• Todos tus textos\n" +
        "• Todas tus palabras guardadas\n" +
        "• Tu progreso de aprendizaje\n\n" +
        "¿Estás seguro de que deseas continuar?"
    );

    if (!confirmed) return;

    setIsImporting(true);
    setDbMessage(null);
    try {
      const success = await importDatabase();
      if (success) {
        setDbMessage({
          type: "success",
          text: "Base de datos importada correctamente. Recargando...",
        });
        // Reload to reflect new data
        setTimeout(() => window.location.reload(), 1500);
      }
      // If not success, user cancelled - no message needed
    } catch (error) {
      setDbMessage({
        type: "error",
        text: `Error al importar: ${(error as Error).message}`,
      });
    } finally {
      setIsImporting(false);
    }
  }

  async function onAdd() {
    if (!content.trim()) return;

    // Validate title
    const titleValidation = validateTitle(title.trim() || "Texto sin título");
    if (!titleValidation.isValid) {
      alert(`Error en el título: ${titleValidation.error}`);
      return;
    }

    // Validate and sanitize content
    const contentValidation = validateTextContent(content.trim());
    if (!contentValidation.isValid) {
      alert(`Error en el contenido: ${contentValidation.error}`);
      return;
    }

    // Show warnings if any
    if (contentValidation.warnings && contentValidation.warnings.length > 0) {
      const warningMessage =
        "Advertencias encontradas:\n" + contentValidation.warnings.join("\n");
      const proceed = confirm(warningMessage + "\n\n¿Deseas continuar?");
      if (!proceed) return;
    }

    const sanitizedContent = sanitizeTextContent(content.trim());

    const text: TextItem = {
      id: crypto.randomUUID(),
      title: title.trim() || "Texto sin título",
      content: sanitizedContent,
      format: inputFormat,
      createdAt: Date.now(),
      audioRef: null,
    };

    await addText(text);
    setTitle("");
    setContent("");
    await refresh();
  }

  async function onImportTxt(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Validate file type and size
      const fileValidation = validateFileType(file);
      if (!fileValidation.isValid) {
        alert(`Error en el archivo: ${fileValidation.error}`);
        e.target.value = "";
        return;
      }

      const text = await file.text();
      const filename = file.name.replace(/\.[^.]+$/, "");

      // Validate content
      const contentValidation = validateTextContent(text, file.name);
      if (!contentValidation.isValid) {
        alert(`Error en el contenido del archivo: ${contentValidation.error}`);
        e.target.value = "";
        return;
      }

      // Show warnings if any
      if (contentValidation.warnings && contentValidation.warnings.length > 0) {
        const warningMessage =
          "Advertencias encontradas en el archivo:\n" +
          contentValidation.warnings.join("\n");
        const proceed = confirm(
          warningMessage + "\n\n¿Deseas continuar con la importación?"
        );
        if (!proceed) {
          e.target.value = "";
          return;
        }
      }

      // Validate title
      const titleValidation = validateTitle(filename);
      if (!titleValidation.isValid) {
        alert(`Error en el nombre del archivo: ${titleValidation.error}`);
        e.target.value = "";
        return;
      }

      const sanitizedContent = sanitizeTextContent(text);
      setTitle(filename);
      setContent(sanitizedContent);
      e.target.value = "";
    } catch (error) {
      console.error("Error importing file:", error);
      alert(
        "Error al importar el archivo. Verifica que sea un archivo de texto válido."
      );
      e.target.value = "";
    }
  }

  async function onAttachAudioUrl(textId: string) {
    const url = window.prompt("Pega la URL del audio (mp3/m4a/ogg/etc.):");
    if (!url) return;
    const ref: AudioRef = { type: "url", url };
    await updateTextAudioRef(textId, ref);
    await refresh();
  }

  async function onAttachAudioFile(textId: string) {
    try {
      // File System Access API
      const handle = await pickAudioFile();
      if (!handle) return;
      const ref: AudioRef = {
        type: "file",
        name: handle.name,
        fileHandle: handle,
      };
      await updateTextAudioRef(textId, ref);
      await refresh();
    } catch (e) {
      console.warn(e);
    }
  }

  async function onClearAudio(textId: string) {
    await updateTextAudioRef(textId, null);
    await refresh();
  }

  async function onDeleteText(id: string) {
    if (!confirm("¿Eliminar este texto? Esta acción no se puede deshacer."))
      return;
    await deleteText(id);
    await refresh();
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="relative overflow-hidden py-12 px-4">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Header skeleton */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-blue-600 bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-300 rounded-full border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              Cargando biblioteca...
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Tus Textos
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Preparando tu colección personal...
            </p>
          </div>

          {/* Skeleton cards */}
          <div className="space-y-6">
            {/* Database section skeleton */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/50 p-6 animate-pulse">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-emerald-200 dark:bg-emerald-800 rounded-xl mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-emerald-200 dark:bg-emerald-800 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-emerald-100 dark:bg-emerald-900 rounded w-48"></div>
                </div>
              </div>
            </div>

            {/* Form skeleton */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
                <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
                <div className="h-12 bg-blue-200 dark:bg-blue-800 rounded-xl w-32"></div>
              </div>
            </div>

            {/* Text cards skeleton */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-6"></div>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                  >
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden py-12 px-4">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header elegante */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-blue-600 bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-300 rounded-full border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            Biblioteca Personal
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Tus Textos
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Crea tu colección personal de textos para aprender inglés de forma
            inmersiva
          </p>
        </div>

        {/* Backup/Restore Database Section - Collapsible */}
        <details className="group mb-8">
          <summary className="cursor-pointer list-none">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/50 p-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-white text-xl">💾</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">
                      Backup de Base de Datos
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Guarda o restaura todos tus datos (textos, palabras,
                      progreso)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full">
                    .sqlite
                  </span>
                  <svg
                    className="w-5 h-5 text-gray-500 transform transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </summary>

          <div className="mt-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Export */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">📤</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      Exportar Backup
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Descarga tu base de datos como archivo .sqlite
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleExportDatabase}
                  disabled={isExporting || isImporting}
                  className="w-full flex items-center justify-center px-4 py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isExporting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Exportando...
                    </>
                  ) : (
                    "Guardar en PC"
                  )}
                </button>
              </div>

              {/* Import */}
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200/50 dark:border-orange-800/50">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">�</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      Restaurar Backup
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      ⚠️ Reemplaza todos los datos actuales
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleImportDatabase}
                  disabled={isExporting || isImporting}
                  className="w-full flex items-center justify-center px-4 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isImporting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Importando...
                    </>
                  ) : (
                    "Cargar desde PC"
                  )}
                </button>
              </div>
            </div>

            {/* Message */}
            {dbMessage && (
              <div
                className={`mt-4 p-3 rounded-lg text-sm ${
                  dbMessage.type === "success"
                    ? "bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                    : "bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
                }`}
              >
                {dbMessage.text}
              </div>
            )}
          </div>
        </details>

        {/* Formulario de agregar texto */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-sm">+</span>
            </div>
            Agregar Nuevo Texto
          </h3>

          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título del texto
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Ej: The Great Gatsby - Chapter 1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Import TXT file option */}
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    ¿Tienes un archivo .txt?
                  </p>
                  <p className="text-xs text-blue-600/70 dark:text-blue-400/70">
                    Importa directamente un archivo de texto plano
                  </p>
                </div>
                <button
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  � Cargar .txt
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,text/plain"
                  style={{ display: "none" }}
                  onChange={onImportTxt}
                />
              </div>
            </div>

            {/* Tabs para cambiar entre texto plano y markdown */}
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setInputFormat("txt")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  inputFormat === "txt"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                📝 Texto Plano
              </button>
              <button
                type="button"
                onClick={() => setInputFormat("markdown")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  inputFormat === "markdown"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                📄 Markdown
              </button>
            </div>

            <textarea
              className="w-full min-h-[140px] px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400 font-mono"
              placeholder={
                inputFormat === "markdown"
                  ? "Pega aquí tu texto en inglés con formato Markdown...\n\nEjemplo:\n# Título\n**negrita** *cursiva* [enlace](url)\n- lista\n> cita"
                  : "Pega aquí tu texto en inglés..."
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="flex justify-end">
              <button
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 transform hover:scale-105 disabled:transform-none transition-all duration-200 shadow-lg hover:shadow-green-500/25 disabled:shadow-none disabled:cursor-not-allowed"
                onClick={onAdd}
                disabled={!content.trim()}
                type="button"
              >
                ✨ Crear Texto
              </button>
            </div>
          </div>
        </div>

        {/* Lista de textos */}
        <div id="library" className="space-y-4">
          {texts.length > 0 ? (
            texts.map((t) => (
              <div
                key={t.id}
                className="group bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <Link to={`/texts/${t.id}`}>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                            {t.title}
                          </h3>
                        </Link>
                        <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                        {t.content.substring(0, 150)}...
                      </p>

                      {t.audioRef && (
                        <div className="flex items-center text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full w-fit">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Audio:{" "}
                          {t.audioRef.type === "url" ? "URL" : t.audioRef.name}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/texts/${t.id}`}
                        className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                      >
                        📖 Leer Ahora
                      </Link>

                      <div className="flex gap-2">
                        <button
                          className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-all duration-200"
                          onClick={() => onAttachAudioUrl(t.id)}
                          title="Agregar audio desde URL"
                          type="button"
                        >
                          🔊 🔗
                        </button>
                        <button
                          className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all duration-200"
                          onClick={() => onAttachAudioFile(t.id)}
                          title="Agregar archivo de audio"
                          type="button"
                        >
                          🔊
                        </button>
                        {t.audioRef && (
                          <button
                            className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900/40 transition-all duration-200"
                            onClick={() => onClearAudio(t.id)}
                            title="Remover audio"
                            type="button"
                          >
                            ❌
                          </button>
                        )}
                        <button
                          className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all duration-200"
                          onClick={() => onDeleteText(t.id)}
                          title="Eliminar texto"
                          type="button"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
                <span className="text-4xl">📚</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Tu biblioteca está vacía
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Comienza agregando tu primer texto para comenzar tu viaje de
                aprendizaje en inglés
              </p>
              <div className="flex justify-center">
                <button
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                  onClick={() =>
                    (
                      document.querySelector(
                        'input[placeholder="Título del texto"]'
                      ) as HTMLInputElement
                    )?.focus()
                  }
                >
                  ✨ Crear Primer Texto
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
