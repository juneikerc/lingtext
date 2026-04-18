import { useRef, useState } from "react";

import {
  addText,
  moveTextToFolder,
  updateText,
  updateTextAudioRef,
  deleteText,
} from "~/services/db";
import { deleteFileHandle, saveFileHandle } from "~/services/file-handles";
import type { AudioRef, TextItem } from "~/types";
import { pickAudioFile } from "~/utils/fs";
import { importHtmlFromUrl } from "~/utils/url-import";
import {
  sanitizeTextContent,
  validateFileType,
  validateTextContent,
  validateTitle,
} from "~/utils/validation";

import { normalizeImportedTitle } from "./library-import";
import type { LibraryMessage } from "./types";

export function useLibraryTextForm(
  texts: TextItem[],
  refresh: () => Promise<void>
) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [inputFormat, setInputFormat] = useState<"txt" | "markdown">("txt");
  const [importUrl, setImportUrl] = useState("");
  const [isImportingUrl, setIsImportingUrl] = useState(false);
  const [urlImportMessage, setUrlImportMessage] =
    useState<LibraryMessage | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  const isEditing = editingTextId !== null;

  function resetFormState() {
    setTitle("");
    setContent("");
    setInputFormat("txt");
    setImportUrl("");
    setUrlImportMessage(null);
    setEditingTextId(null);
    setSelectedFolderId(null);
  }

  function onStartEdit(text: TextItem) {
    setEditingTextId(text.id);
    setTitle(text.title);
    setContent(text.content);
    setInputFormat(text.format || "txt");
    setImportUrl("");
    setUrlImportMessage(null);
    setSelectedFolderId(text.folderId ?? null);
    document
      .getElementById("library-text-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => titleInputRef.current?.focus(), 150);
  }

  async function onSubmitText() {
    if (!content.trim()) return;

    const titleValidation = validateTitle(title.trim() || "Texto sin título");
    if (!titleValidation.isValid) {
      alert(`Error en el título: ${titleValidation.error}`);
      return;
    }

    const contentValidation = validateTextContent(content.trim());
    if (!contentValidation.isValid) {
      alert(`Error en el contenido: ${contentValidation.error}`);
      return;
    }

    if (contentValidation.warnings?.length) {
      const proceed = confirm(
        "Advertencias encontradas:\n" +
          contentValidation.warnings.join("\n") +
          "\n\n¿Deseas continuar?"
      );
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

      await updateText({
        ...textToEdit,
        title: title.trim() || "Texto sin título",
        content: sanitizedContent,
        format: inputFormat,
        folderId: selectedFolderId,
      });
      resetFormState();
      await refresh();
      return;
    }

    await addText({
      id: crypto.randomUUID(),
      title: title.trim() || "Texto sin título",
      content: sanitizedContent,
      format: inputFormat,
      createdAt: Date.now(),
      audioRef: null,
      folderId: selectedFolderId,
    });
    resetFormState();
    await refresh();
  }

  async function onImportTxt(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUrlImportMessage(null);

      const fileValidation = validateFileType(file);
      if (!fileValidation.isValid) {
        alert(`Error en el archivo: ${fileValidation.error}`);
        event.target.value = "";
        return;
      }

      const text = await file.text();
      const filename = file.name.replace(/\.[^.]+$/, "");
      const contentValidation = validateTextContent(text, file.name);

      if (!contentValidation.isValid) {
        alert(`Error en el contenido del archivo: ${contentValidation.error}`);
        event.target.value = "";
        return;
      }

      if (contentValidation.warnings?.length) {
        const proceed = confirm(
          "Advertencias encontradas en el archivo:\n" +
            contentValidation.warnings.join("\n") +
            "\n\n¿Deseas continuar con la importación?"
        );
        if (!proceed) {
          event.target.value = "";
          return;
        }
      }

      const titleValidation = validateTitle(filename);
      if (!titleValidation.isValid) {
        alert(`Error en el nombre del archivo: ${titleValidation.error}`);
        event.target.value = "";
        return;
      }

      setTitle(filename);
      setContent(sanitizeTextContent(text));
      setInputFormat("txt");
      setImportUrl("");
      event.target.value = "";
    } catch (error) {
      console.error("Error importing file:", error);
      alert(
        "Error al importar el archivo. Verifica que sea un archivo de texto válido."
      );
      event.target.value = "";
    }
  }

  async function onImportUrl() {
    const rawUrl = importUrl.trim();
    if (!rawUrl) {
      setUrlImportMessage({
        type: "error",
        text: "Pega una URL antes de intentar la importacion.",
      });
      return;
    }

    setIsImportingUrl(true);
    setUrlImportMessage(null);

    try {
      const result = await importHtmlFromUrl(rawUrl, {
        allowServerFallback: false,
      });

      if (!result.ok) {
        setUrlImportMessage({ type: "error", text: result.message });
        return;
      }

      const sanitizedMarkdown = sanitizeTextContent(result.markdown);
      const contentValidation = validateTextContent(
        sanitizedMarkdown,
        result.sourceUrl
      );

      if (!contentValidation.isValid) {
        setUrlImportMessage({
          type: "error",
          text: `No se pudo importar el contenido: ${contentValidation.error}`,
        });
        return;
      }

      setTitle(normalizeImportedTitle(result.title, result.sourceUrl));
      setContent(sanitizedMarkdown);
      setInputFormat("markdown");
      setImportUrl(result.sourceUrl);

      const warningsText = contentValidation.warnings?.length
        ? ` Revisa el resultado antes de guardarlo: ${contentValidation.warnings.join(" ")}`
        : "";

      setUrlImportMessage({
        type: "success",
        text: `Pagina importada como markdown. Ahora puedes revisarla y guardarla.${warningsText}`,
      });

      window.setTimeout(() => titleInputRef.current?.focus(), 50);
    } catch (error) {
      console.error("[Library] Error importing URL:", error);
      setUrlImportMessage({
        type: "error",
        text: "Ocurrio un error inesperado al importar la URL.",
      });
    } finally {
      setIsImportingUrl(false);
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
      const handle = await pickAudioFile();
      if (!handle) return;

      await saveFileHandle(textId, handle);
      await updateTextAudioRef(textId, {
        type: "file",
        name: handle.name,
        fileHandle: handle,
      });
      await refresh();
    } catch (error) {
      console.warn(error);
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

      await updateTextAudioRef(textId, null);
      await deleteFileHandle(textId);
      await refresh();
    } finally {
      closeAudioMenu(textId);
    }
  }

  async function onDeleteText(id: string) {
    if (!confirm("¿Eliminar este texto? Esta acción no se puede deshacer.")) {
      return;
    }
    await deleteText(id);
    await deleteFileHandle(id);
    if (editingTextId === id) {
      resetFormState();
    }
    await refresh();
  }

  async function onMoveTextToFolder(textId: string, folderId: string | null) {
    await moveTextToFolder(textId, folderId);
    await refresh();
  }

  return {
    title,
    setTitle,
    content,
    setContent,
    inputFormat,
    setInputFormat,
    importUrl,
    setImportUrl,
    isImportingUrl,
    urlImportMessage,
    editingTextId,
    isEditing,
    selectedFolderId,
    setSelectedFolderId,
    fileInputRef,
    titleInputRef,
    resetFormState,
    onStartEdit,
    onSubmitText,
    onImportTxt,
    onImportUrl,
    onAudioMenuAction,
    onDeleteText,
    onMoveTextToFolder,
  };
}
