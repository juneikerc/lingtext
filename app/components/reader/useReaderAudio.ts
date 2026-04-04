import { useEffect, useState } from "react";

import type { AudioRef } from "~/types";
import { getFileHandle, saveFileHandle } from "~/services/file-handles";
import { ensureReadPermission, pickAudioFile } from "~/utils/fs";

interface ReaderAudioInput {
  id: string;
  audioRef?: AudioRef | null;
  audioUrl?: string | null;
}

export function useReaderAudio(text: ReaderAudioInput) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioAccessError, setAudioAccessError] = useState(false);
  const [isLocalFile, setIsLocalFile] = useState(false);
  const [fileSize, setFileSize] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadAudio() {
      if (text.audioRef?.type === "file") {
        setIsLocalFile(true);

        let handle = text.audioRef.fileHandle;

        if (!handle) {
          try {
            const savedHandle = await getFileHandle(text.id);
            if (savedHandle && mounted) {
              handle = savedHandle;
              const hasPermission = await ensureReadPermission(handle);
              if (hasPermission) {
                const file = await handle.getFile();
                const nextAudioUrl = URL.createObjectURL(file);
                setAudioUrl(nextAudioUrl);
                setFileSize(file.size);
                setAudioAccessError(false);
                return;
              }
            }
          } catch (error) {
            console.warn("Error restoring file handle:", error);
          }
        }

        if (mounted) {
          if (text.audioRef.fileHandle) {
            setAudioAccessError(!text.audioUrl);
          } else {
            setAudioAccessError(true);
          }
        }

        return;
      }

      if (mounted) {
        setIsLocalFile(false);
        setAudioAccessError(false);
        setFileSize(null);
      }
    }

    void loadAudio();

    return () => {
      mounted = false;
    };
  }, [text.audioRef, text.audioUrl, text.id]);

  useEffect(() => {
    if (!audioUrl || audioUrl.startsWith("http")) return;
    return () => {
      URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  useEffect(() => {
    const src = text.audioUrl;
    if (!src || src.startsWith("http")) return;
    return () => {
      URL.revokeObjectURL(src);
    };
  }, [text.audioUrl]);

  async function reauthorizeAudio() {
    if (!text.audioRef || text.audioRef.type !== "file") return;

    try {
      if (audioUrl && !audioUrl.startsWith("http")) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }

      let file: File;

      if (text.audioRef.fileHandle) {
        const hasPermission = await ensureReadPermission(text.audioRef.fileHandle);
        if (!hasPermission) {
          console.warn("Permiso denegado para archivo local");
          setAudioAccessError(true);
          alert(
            "Permiso denegado. Vuelve a intentarlo o re-adjunta el audio desde la biblioteca."
          );
          return;
        }
        file = await text.audioRef.fileHandle.getFile();
      } else {
        const newHandle = await pickAudioFile();
        if (!newHandle) {
          return;
        }
        file = await newHandle.getFile();
        await saveFileHandle(text.id, newHandle);
      }

      const fileName = file.name.toLowerCase();
      const isAudioFile =
        file.type.startsWith("audio/") ||
        fileName.endsWith(".mp3") ||
        fileName.endsWith(".wav") ||
        fileName.endsWith(".m4a") ||
        fileName.endsWith(".aac") ||
        fileName.endsWith(".ogg") ||
        fileName.endsWith(".flac");

      if (!isAudioFile) {
        throw new Error(
          `Tipo de archivo no válido: ${file.type || "desconocido"}. Solo se permiten archivos de audio (MP3, WAV, M4A, AAC, OGG, FLAC).`
        );
      }

      const maxSize = 500 * 1024 * 1024;
      if (file.size > maxSize) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        const shouldContinue = confirm(
          `El archivo es muy grande (${sizeMB}MB). Puede causar problemas de rendimiento. ¿Deseas continuar?`
        );
        if (!shouldContinue) {
          setAudioAccessError(true);
          return;
        }
      }

      setFileSize(file.size);

      const nextAudioUrl = URL.createObjectURL(file);
      setAudioUrl(nextAudioUrl);
      setAudioAccessError(false);
    } catch (error) {
      console.error("Error al cargar archivo local:", error);
      setAudioAccessError(true);

      let errorMessage = "Error desconocido al cargar el archivo";

      if (error instanceof Error) {
        if (error.message.includes("NotAllowedError")) {
          errorMessage = "Permiso denegado para acceder al archivo";
        } else if (error.message.includes("NotFoundError")) {
          errorMessage = "El archivo ya no existe o ha sido movido";
        } else if (error.message.includes("Tipo de archivo")) {
          errorMessage = error.message;
        } else {
          errorMessage = `Error al cargar archivo: ${error.message}`;
        }
      }

      alert(`${errorMessage}. Re-adjunta el audio desde la biblioteca.`);
    }
  }

  return {
    audioUrl,
    audioAccessError,
    isLocalFile,
    fileSize,
    reauthorizeAudio,
  };
}
