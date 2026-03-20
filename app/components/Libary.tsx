import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router";
import {
  getAllTexts,
  addText,
  deleteText,
  updateText,
  updateTextAudioRef,
  exportDatabase,
  importDatabase,
  getDatabaseInfo,
  getAllFolders,
  addFolder,
  updateFolder,
  deleteFolder,
  moveTextToFolder,
} from "../services/db";
import type { TextItem, AudioRef, Folder, FolderColor } from "../types";
import { FOLDER_COLORS } from "../types";
import { pickAudioFile } from "../utils/fs";
import {
  validateTextContent,
  validateTitle,
  validateFileType,
  sanitizeTextContent,
} from "../utils/validation";
import { seedInitialDataOnce } from "~/utils/seed";

import { saveFileHandle, deleteFileHandle } from "~/services/file-handles";

type IconProps = React.SVGProps<SVGSVGElement>;

function VolumeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M11 5 6 9H3v6h3l5 4V5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M15.5 9.5a3.5 3.5 0 0 1 0 5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M18.5 7a7 7 0 0 1 0 10"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function XCircleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
      <path
        d="m9 9 6 6M15 9l-6 6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function PencilIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="m3 21 3.75-.75L19 8l-3-3L3.75 17.25 3 21Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="m14.5 6.5 3 3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function TrashIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M4 7h16"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M7 7l1 12a1 1 0 0 0 1 .92h6a1 1 0 0 0 1-.92L17 7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M10 11v6M14 11v6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function BookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3V4Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M8 20h10"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ChevronDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="m6 9 6 6 6-6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function FolderIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6.5l-2-2H5a2 2 0 0 0-2 2Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function FolderPlusIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6.5l-2-2H5a2 2 0 0 0-2 2Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M12 11v6M9 14h6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

interface TextCardProps {
  text: TextItem;
  folders: Folder[];
  onStartEdit: (text: TextItem) => void;
  onDeleteText: (id: string) => void;
  onMoveToFolder: (textId: string, folderId: string | null) => void;
  onAudioMenuAction: (textId: string, action: "file" | "url" | "clear") => void;
}

function TextCard({
  text: t,
  folders,
  onStartEdit,
  onDeleteText,
  onMoveToFolder,
  onAudioMenuAction,
}: TextCardProps) {
  const folderColor = t.folderId
    ? folders.find((f) => f.id === t.folderId)?.color
    : null;

  return (
    <article className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-200 overflow-visible">
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <Link to={`/texts/${t.id}?source=library`} className="min-w-0">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 line-clamp-2">
              {t.title}
            </h3>
          </Link>
          <div className="shrink-0 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            {new Date(t.createdAt).toLocaleDateString()}
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mt-3">
          {t.content.substring(0, 150)}...
        </p>

        {t.audioRef ? (
          <div className="mt-3 flex items-center text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full w-fit">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Audio conectado:{" "}
            {t.audioRef.type === "url" ? "URL" : t.audioRef.name}
          </div>
        ) : null}

        <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-end gap-2">
          {/* Folder selector */}
          <div className="relative">
            <select
              className="appearance-none px-4 py-2.5 pr-8 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
              value={t.folderId ?? ""}
              onChange={(e) => onMoveToFolder(t.id, e.target.value || null)}
              aria-label="Mover a carpeta"
              style={
                folderColor
                  ? { borderLeft: `3px solid ${folderColor}` }
                  : undefined
              }
            >
              <option value="">Sin carpeta</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
            <FolderIcon
              className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              aria-hidden="true"
            />
          </div>

          <details id={`audio-menu-${t.id}`} className="relative group/audio">
            <summary className="list-none cursor-pointer inline-flex items-center px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950">
              <VolumeIcon className="w-4 h-4 mr-1.5" aria-hidden="true" />
              Agregar audio
              <ChevronDownIcon
                className="w-4 h-4 ml-1.5 transition-transform group-open/audio:rotate-180"
                aria-hidden="true"
              />
            </summary>

            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-1.5 z-20">
              <button
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                onClick={() => void onAudioMenuAction(t.id, "file")}
                type="button"
              >
                Desde archivo
              </button>
              <button
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                onClick={() => void onAudioMenuAction(t.id, "url")}
                type="button"
              >
                Desde URL
              </button>
              {t.audioRef ? (
                <button
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 inline-flex items-center"
                  onClick={() => void onAudioMenuAction(t.id, "clear")}
                  type="button"
                >
                  <XCircleIcon className="w-4 h-4 mr-1.5" aria-hidden="true" />
                  Quitar audio
                </button>
              ) : null}
            </div>
          </details>

          <button
            className="inline-flex items-center px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
            onClick={() => onStartEdit(t)}
            type="button"
          >
            <PencilIcon className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Editar
          </button>

          <button
            className="inline-flex items-center px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
            onClick={() => onDeleteText(t.id)}
            type="button"
          >
            <TrashIcon className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Eliminar
          </button>

          <Link
            to={`/texts/${t.id}?source=library`}
            className="inline-flex items-center px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
          >
            <BookIcon className="w-4 h-4 mr-2" aria-hidden="true" />
            Leer ahora
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function Library() {
  const [texts, setTexts] = useState<TextItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [inputFormat, setInputFormat] = useState<"txt" | "markdown">("txt");
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  // Folder state
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState<FolderColor>(
    FOLDER_COLORS[0]
  );
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState("");
  const [editFolderColor, setEditFolderColor] = useState<FolderColor>(
    FOLDER_COLORS[0]
  );
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // Database backup/restore state
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [dbMessage, setDbMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const isEditing = editingTextId !== null;

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
    const [list, folderList] = await Promise.all([
      getAllTexts(),
      getAllFolders(),
    ]);
    list.sort((a, b) => b.createdAt - a.createdAt);
    setTexts(list);
    setFolders(folderList);
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

  function resetFormState() {
    setTitle("");
    setContent("");
    setInputFormat("txt");
    setEditingTextId(null);
    setSelectedFolderId(null);
  }

  function onStartEdit(text: TextItem) {
    setEditingTextId(text.id);
    setTitle(text.title);
    setContent(text.content);
    setInputFormat(text.format || "txt");
    setSelectedFolderId(text.folderId ?? null);
    document
      .getElementById("library-text-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => titleInputRef.current?.focus(), 150);
  }

  async function onSubmitText() {
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

    if (editingTextId) {
      const textToEdit = texts.find((text) => text.id === editingTextId);

      if (!textToEdit) {
        alert("El texto que intentas editar ya no existe.");
        resetFormState();
        await refresh();
        return;
      }

      const updatedText: TextItem = {
        ...textToEdit,
        title: title.trim() || "Texto sin título",
        content: sanitizedContent,
        format: inputFormat,
        folderId: selectedFolderId,
      };

      await updateText(updatedText);
      resetFormState();
      await refresh();
      return;
    }

    const text: TextItem = {
      id: crypto.randomUUID(),
      title: title.trim() || "Texto sin título",
      content: sanitizedContent,
      format: inputFormat,
      createdAt: Date.now(),
      audioRef: null,
      folderId: selectedFolderId,
    };

    await addText(text);
    resetFormState();
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

      // Save handle to IndexedDB
      await saveFileHandle(textId, handle);

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

  function closeAudioMenu(textId: string) {
    const menu = document.getElementById(`audio-menu-${textId}`);
    if (menu instanceof HTMLDetailsElement) {
      menu.open = false;
    }
  }

  async function onAudioMenuAction(
    textId: string,
    action: "file" | "url" | "clear"
  ) {
    try {
      if (action === "file") {
        await onAttachAudioFile(textId);
        return;
      }

      if (action === "url") {
        await onAttachAudioUrl(textId);
        return;
      }

      await onClearAudio(textId);
    } finally {
      closeAudioMenu(textId);
    }
  }

  async function onClearAudio(textId: string) {
    await updateTextAudioRef(textId, null);
    await deleteFileHandle(textId);
    await refresh();
  }

  async function onDeleteText(id: string) {
    if (!confirm("¿Eliminar este texto? Esta acción no se puede deshacer."))
      return;
    await deleteText(id);
    await deleteFileHandle(id);
    if (editingTextId === id) {
      resetFormState();
    }
    await refresh();
  }

  // Folder management functions
  async function onCreateFolder() {
    const name = newFolderName.trim();
    if (!name) return;

    const folder: Folder = {
      id: crypto.randomUUID(),
      name,
      color: newFolderColor,
      createdAt: Date.now(),
    };
    await addFolder(folder);
    setNewFolderName("");
    setNewFolderColor(FOLDER_COLORS[0]);
    setIsCreatingFolder(false);
    await refresh();
  }

  async function onUpdateFolder(folderId: string) {
    const name = editFolderName.trim();
    if (!name) return;

    const existing = folders.find((f) => f.id === folderId);
    if (!existing) return;

    await updateFolder({ ...existing, name, color: editFolderColor });
    setEditingFolderId(null);
    await refresh();
  }

  async function onDeleteFolder(folderId: string) {
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return;
    if (
      !confirm(
        `¿Eliminar la carpeta "${folder.name}"? Los textos se moverán a "Sin carpeta".`
      )
    )
      return;
    await deleteFolder(folderId);
    await refresh();
  }

  async function onMoveTextToFolder(textId: string, folderId: string | null) {
    await moveTextToFolder(textId, folderId);
    await refresh();
  }

  function onStartEditFolder(folder: Folder) {
    setEditingFolderId(folder.id);
    setEditFolderName(folder.name);
    setEditFolderColor(folder.color as FolderColor);
  }

  function groupedTexts() {
    const groups: Array<{
      folder: Folder | null;
      texts: TextItem[];
    }> = [];

    // Texts without folder
    const noFolderTexts = texts.filter((t) => !t.folderId);
    groups.push({ folder: null, texts: noFolderTexts });

    // Texts grouped by folder
    for (const folder of folders) {
      const folderTexts = texts.filter((t) => t.folderId === folder.id);
      groups.push({ folder, texts: folderTexts });
    }

    return groups;
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="relative overflow-hidden py-12 px-4 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-sky-500/10 dark:bg-sky-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Header skeleton */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-800">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
              Cargando biblioteca...
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-gray-100">
              Tus{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                Textos
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Preparando tu colección personal...
            </p>
          </div>

          {/* Skeleton cards */}
          <div className="space-y-6">
            {/* Database section skeleton */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 animate-pulse">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-800/60 rounded w-48"></div>
                </div>
              </div>
            </div>

            {/* Form skeleton */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
                <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-32"></div>
              </div>
            </div>

            {/* Text cards skeleton */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8 animate-pulse">
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
    <section className="relative overflow-hidden py-12 px-4 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-sky-500/10 dark:bg-sky-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header elegante */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-800">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
            Biblioteca Personal
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-gray-100">
            Agrega tus propios{" "}
            <span className="text-indigo-600 dark:text-indigo-400">Textos</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Crea tu colección personal de lecturas para aprender inglés de forma
            inmersiva
          </p>
        </div>

        {/* Backup/Restore Database Section - Collapsible */}
        <details className="group mb-8">
          <summary className="cursor-pointer list-none">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mr-4">
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
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
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

          <div className="mt-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Export */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
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
                  className="w-full flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
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
              <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">📥</span>
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
                  className="w-full flex items-center justify-center px-4 py-2.5 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
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

        {/* Formulario de agregar/editar texto */}
        <div
          id="library-text-form"
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8 mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-sm">+</span>
            </div>
            {isEditing ? "Editar Texto" : "Agregar Nuevo Texto"}
          </h3>

          {isEditing ? (
            <div className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800 dark:border-indigo-900/60 dark:bg-indigo-900/20 dark:text-indigo-300">
              Estás editando un texto existente. Guarda los cambios o cancela la
              edición.
            </div>
          ) : null}

          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título del texto
                </label>
                <input
                  ref={titleInputRef}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Ej: The Great Gatsby - Chapter 1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {folders.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Carpeta
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                    value={selectedFolderId ?? ""}
                    onChange={(e) =>
                      setSelectedFolderId(e.target.value || null)
                    }
                  >
                    <option value="">Sin carpeta</option>
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Import TXT file option */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    ¿Tienes un archivo .txt?
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Importa directamente un archivo de texto plano
                  </p>
                </div>
                <button
                  className="px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
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
            </div>

            {/* Tabs para cambiar entre texto plano y markdown */}
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setInputFormat("txt")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  inputFormat === "txt"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                📝 Texto Plano
              </button>
              <button
                type="button"
                onClick={() => setInputFormat("markdown")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  inputFormat === "markdown"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                📄 Markdown
              </button>
            </div>

            <textarea
              className="w-full min-h-[140px] px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400 font-mono"
              placeholder={
                inputFormat === "markdown"
                  ? "Pega aquí tu texto en inglés con formato Markdown...\n\nEjemplo:\n# Título\n**negrita** *cursiva* [enlace](url)\n- lista\n> cita"
                  : "Pega aquí tu texto en inglés..."
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="flex flex-wrap justify-end gap-3">
              {isEditing ? (
                <button
                  className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                  onClick={resetFormState}
                  type="button"
                >
                  Cancelar edición
                </button>
              ) : null}
              <button
                className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm hover:shadow-md"
                onClick={onSubmitText}
                disabled={!content.trim()}
                type="button"
              >
                {isEditing ? "Guardar cambios" : "Crear Texto"}
              </button>
            </div>
          </div>
        </div>

        {/* Gestión de carpetas */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <FolderIcon className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              Carpetas
            </h3>
            {!isCreatingFolder && (
              <button
                className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
                onClick={() => setIsCreatingFolder(true)}
                type="button"
              >
                <FolderPlusIcon className="w-4 h-4 mr-1.5" aria-hidden="true" />
                Nueva carpeta
              </button>
            )}
          </div>

          {/* Create folder form */}
          {isCreatingFolder && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-4 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Nombre de la carpeta..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onCreateFolder();
                    if (e.key === "Escape") setIsCreatingFolder(false);
                  }}
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  {FOLDER_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-7 h-7 rounded-full transition-all duration-200 ${
                        newFolderColor === color
                          ? "ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-900 scale-110"
                          : "hover:scale-110"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewFolderColor(color)}
                      aria-label={`Color ${color}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    setIsCreatingFolder(false);
                    setNewFolderName("");
                  }}
                  type="button"
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={onCreateFolder}
                  disabled={!newFolderName.trim()}
                  type="button"
                >
                  Crear
                </button>
              </div>
            </div>
          )}

          {/* Folder tags */}
          {folders.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {folders.map((folder) => (
                <div key={folder.id}>
                  {editingFolderId === folder.id ? (
                    <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-2 shadow-sm">
                      <input
                        className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-36"
                        value={editFolderName}
                        onChange={(e) => setEditFolderName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") onUpdateFolder(folder.id);
                          if (e.key === "Escape") setEditingFolderId(null);
                        }}
                        autoFocus
                      />
                      <div className="flex gap-1">
                        {FOLDER_COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`w-5 h-5 rounded-full transition-all ${
                              editFolderColor === color
                                ? "ring-2 ring-offset-1 ring-gray-400"
                                : ""
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() =>
                              setEditFolderColor(color as FolderColor)
                            }
                          />
                        ))}
                      </div>
                      <button
                        className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                        onClick={() => onUpdateFolder(folder.id)}
                        type="button"
                      >
                        Guardar
                      </button>
                      <button
                        className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        onClick={() => setEditingFolderId(null)}
                        type="button"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium cursor-default"
                      style={{
                        backgroundColor: `${folder.color}18`,
                        color: folder.color,
                      }}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: folder.color }}
                      />
                      {folder.name}
                      <span className="text-xs opacity-60">
                        ({texts.filter((t) => t.folderId === folder.id).length})
                      </span>
                      <button
                        className="ml-1 opacity-50 hover:opacity-100 transition-opacity"
                        onClick={() => onStartEditFolder(folder)}
                        type="button"
                        aria-label={`Editar carpeta ${folder.name}`}
                      >
                        <PencilIcon className="w-3 h-3" />
                      </button>
                      <button
                        className="opacity-50 hover:opacity-100 transition-opacity"
                        onClick={() => onDeleteFolder(folder.id)}
                        type="button"
                        aria-label={`Eliminar carpeta ${folder.name}`}
                      >
                        <TrashIcon className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {folders.length === 0 && !isCreatingFolder && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Crea carpetas para organizar tus textos por temas o niveles.
            </p>
          )}
        </div>

        {/* Lista de textos agrupados por carpeta */}
        <div id="library" className="space-y-6">
          {texts.length > 0 ? (
            groupedTexts().map((group) => (
              <div key={group.folder?.id ?? "uncategorized"}>
                {/* Folder header */}
                {group.folder ? (
                  <details className="group/folder" open>
                    <summary className="cursor-pointer list-none">
                      <div className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: group.folder.color }}
                        />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {group.folder.name}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {group.texts.length}{" "}
                          {group.texts.length === 1 ? "texto" : "textos"}
                        </span>
                        <ChevronDownIcon className="w-4 h-4 ml-auto text-gray-400 transition-transform group-open/folder:rotate-180" />
                      </div>
                    </summary>
                    <div className="space-y-4 ml-2">
                      {group.texts.map((t) => (
                        <TextCard
                          key={t.id}
                          text={t}
                          folders={folders}
                          onStartEdit={onStartEdit}
                          onDeleteText={onDeleteText}
                          onMoveToFolder={onMoveTextToFolder}
                          onAudioMenuAction={onAudioMenuAction}
                        />
                      ))}
                    </div>
                  </details>
                ) : group.texts.length > 0 ? (
                  <details className="group/folder" open>
                    <summary className="cursor-pointer list-none">
                      <div className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                        <FolderIcon className="w-5 h-5 text-gray-400" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          Sin carpeta
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {group.texts.length}{" "}
                          {group.texts.length === 1 ? "texto" : "textos"}
                        </span>
                        <ChevronDownIcon className="w-4 h-4 ml-auto text-gray-400 transition-transform group-open/folder:rotate-180" />
                      </div>
                    </summary>
                    <div className="space-y-4 ml-2">
                      {group.texts.map((t) => (
                        <TextCard
                          key={t.id}
                          text={t}
                          folders={folders}
                          onStartEdit={onStartEdit}
                          onDeleteText={onDeleteText}
                          onMoveToFolder={onMoveTextToFolder}
                          onAudioMenuAction={onAudioMenuAction}
                        />
                      ))}
                    </div>
                  </details>
                ) : null}
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
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
                  className="px-8 py-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                  onClick={() => titleInputRef.current?.focus()}
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
