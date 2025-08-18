import { useEffect, useRef, useState } from "react";
// import styles from "./Library.module.css";
import { addText, deleteText, getAllTexts, updateTextAudioRef } from "../db";
import type { AudioRef, TextItem } from "../types";
import { uid } from "../utils/id";
import { pickAudioFile } from "../utils/fs";
import { Link } from "react-router";

interface Props {
  onOpen: (id: string) => void;
}

export default function Library({ onOpen }: Props) {
  const [texts, setTexts] = useState<TextItem[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    const list = await getAllTexts();
    list.sort((a, b) => b.createdAt - a.createdAt);
    setTexts(list);
  }

  async function onAdd() {
    const t = title.trim() || "Sin título";
    const c = content.trim();
    if (!c) return;
    const item: TextItem = {
      id: uid(),
      title: t,
      content: c,
      createdAt: Date.now(),
      audioRef: null,
    };
    await addText(item);
    setTitle("");
    setContent("");
    await refresh();
  }

  async function onImportTxt(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setTitle(file.name.replace(/\.[^.]+$/, ""));
    setContent(text);
    e.target.value = "";
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
    <div className="max-w-2xl mx-auto mt-8 bg-white dark:bg-gray-900 rounded-lg shadow p-6 flex flex-col gap-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        Tu Biblioteca
      </h2>

      <div className="flex flex-col md:flex-row gap-2 md:items-end">
        <input
          className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="px-4 py-2 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 text-sm font-medium"
          onClick={() => fileInputRef.current?.click()}
          type="button"
        >
          Importar .txt
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,text/plain"
          style={{ display: "none" }}
          onChange={onImportTxt}
        />
        <button
          className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 text-sm font-medium disabled:opacity-40"
          onClick={onAdd}
          disabled={!content.trim()}
          type="button"
        >
          Agregar texto
        </button>
      </div>

      <textarea
        className="w-full min-h-[120px] rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
        placeholder="Pega aquí tu texto en inglés..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="space-y-4">
        {texts.map((t) => (
          <div
            key={t.id}
            className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
          >
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {t.title}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(t.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
              <Link
                to={`/texts/${t.id}`}
                className="px-3 py-1 rounded bg-blue-500 text-white text-xs font-medium hover:bg-blue-600"
              >
                Leer
              </Link>
              <button
                className="px-3 py-1 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 text-xs font-medium hover:bg-yellow-200 dark:hover:bg-yellow-800"
                onClick={() => onAttachAudioUrl(t.id)}
                type="button"
              >
                Audio URL
              </button>
              <button
                className="px-3 py-1 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-100 text-xs font-medium hover:bg-indigo-200 dark:hover:bg-indigo-800"
                onClick={() => onAttachAudioFile(t.id)}
                type="button"
              >
                Audio Archivo
              </button>
              {t.audioRef ? (
                <button
                  className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
                  onClick={() => onClearAudio(t.id)}
                  type="button"
                >
                  Quitar Audio
                </button>
              ) : null}
              <button
                className="px-3 py-1 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 text-xs font-medium hover:bg-red-200 dark:hover:bg-red-800"
                onClick={() => onDeleteText(t.id)}
                style={{ color: "#b00" }}
                type="button"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
        {texts.length === 0 && (
          <div className="p-3 text-center text-gray-500">
            Aún no hay textos. Agrega uno arriba.
          </div>
        )}
      </div>
    </div>
  );
}
