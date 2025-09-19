import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router";
import { getAllTexts, addText, deleteText, updateTextAudioRef } from "../db";
import type { TextItem, AudioRef } from "../types";
import { pickAudioFile } from "../utils/fs";
import {
  validateTextContent,
  validateTitle,
  validateFileType,
  sanitizeTextContent,
} from "../utils/validation";

interface Props {
  textsList: TextItem[];
}

export default function Library({ textsList }: Props) {
  const [texts, setTexts] = useState<TextItem[]>(textsList);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [inputFormat, setInputFormat] = useState<"txt" | "markdown">("txt");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // useEffect(() => {
  //   refresh();
  // }, []);

  async function refresh() {
    const list = await getAllTexts();
    list.sort((a, b) => b.createdAt - a.createdAt);
    setTexts(list);
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

        {/* Formulario de agregar texto */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-sm">+</span>
            </div>
            Agregar Nuevo Texto
          </h3>

          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <input
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Título del texto"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  📁 Importar
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
        <div className="space-y-4">
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
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                          {t.title}
                        </h3>
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
                          🔗
                        </button>
                        <button
                          className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all duration-200"
                          onClick={() => onAttachAudioFile(t.id)}
                          title="Agregar archivo de audio"
                          type="button"
                        >
                          📁
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
