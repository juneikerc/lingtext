import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  getAllUnknownWords,
  getWord,
  putUnknownWord,
  deleteWord,
  getSettings,
  getAllPhrases,
  putPhrase,
  getPhrase,
} from "../services/db";
import { type AudioRef } from "../types";
import { normalizeWord, tokenize } from "../utils/tokenize";
import { speak } from "../utils/tts";
import { translateTerm } from "../utils/translate";
import { ensureReadPermission } from "../utils/fs";

import AudioSection from "./reader/AudioSection";
import ReaderText from "./reader/ReaderText";
import MarkdownReaderText from "./reader/MarkdownReaderText";
import WordPopup from "./reader/WordPopup";
import SelectionPopup from "./reader/SelectionPopup";
import type {
  WordPopupState as PopupState,
  SelectionPopupState as SelPopupState,
} from "./reader/types";
import { useTranslatorStore } from "~/context/translatorSelector";

interface Props {
  text: {
    id: string;
    title: string;
    content: string;
    format?: "txt" | "markdown";
    audioRef?: AudioRef | null;
    audioUrl?: string | null;
  };
}

// Types moved to ./reader/types

export default function Reader({ text }: Props) {
  const { selected } = useTranslatorStore();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [unknownSet, setUnknownSet] = useState<Set<string>>(new Set());
  const [phrases, setPhrases] = useState<string[][]>([]);
  const [popup, setPopup] = useState<PopupState | null>(null);
  const [selPopup, setSelPopup] = useState<SelPopupState | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioAccessError, setAudioAccessError] = useState(false);
  const [isLocalFile, setIsLocalFile] = useState(false);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const phraseCacheRef = useRef<Map<string, string>>(new Map());

  // Detectar si es archivo local y obtener información
  useEffect(() => {
    if (text?.audioRef?.type === "file") {
      setIsLocalFile(true);
      // Intentar obtener información del archivo sin solicitar permiso aún
      if (text.audioRef.fileHandle) {
        // No solicitamos el archivo aquí, solo verificamos permisos
        setAudioAccessError(!text.audioUrl); // Solo mostrar error si no hay URL
      }
    } else {
      setIsLocalFile(false);
      setAudioAccessError(false);
      setFileSize(null);
    }
  }, [text?.audioRef, text?.audioUrl]);

  // Revoke audio URL when it changes or on unmount
  useEffect(() => {
    if (!audioUrl || audioUrl.startsWith("http")) return;
    return () => {
      URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  // Revoke object URL provided by clientLoader on unmount/change
  useEffect(() => {
    const src = text.audioUrl;
    if (!src || src.startsWith("http")) return;
    return () => {
      URL.revokeObjectURL(src);
    };
  }, [text.audioUrl]);

  // load unknown words
  useEffect(() => {
    refreshUnknowns();
    refreshPhrases();
  }, []);

  const refreshUnknowns = useCallback(async () => {
    const all = await getAllUnknownWords();
    setUnknownSet(new Set(all.map((w) => w.wordLower)));
  }, []);

  const refreshPhrases = useCallback(async () => {
    const all = await getAllPhrases();
    setPhrases(all.map((p) => p.parts));
  }, []);

  const onWordClick = useCallback(
    async (e: React.MouseEvent<HTMLSpanElement>) => {
      const target = e.currentTarget as HTMLSpanElement;
      if (!target?.dataset?.lower || !target?.dataset?.word) return;
      const rect = target.getBoundingClientRect();
      const el = containerRef.current;
      let x = rect.left + rect.width / 2;
      let y = rect.top;
      if (el) {
        const r = el.getBoundingClientRect();
        x -= r.left;
        y -= r.top;
      }
      const word = target.dataset.word!;
      const lower = target.dataset.lower!;

      const existing = await getWord(lower);

      if (existing) {
        setPopup({ x, y, word, lower, translation: existing.translation });
        return;
      }

      const translation = await translateTerm(word, selected);
      setSelPopup(null);
      setPopup({ x, y, word, lower, translation: translation.translation });
    },
    [selected]
  );

  const relativePos = useCallback((x: number, y: number) => {
    const el = containerRef.current;
    if (!el) return { x, y };
    const r = el.getBoundingClientRect();
    return { x: x - r.left, y: y - r.top };
  }, []);

  const markUnknown = useCallback(
    async (lower: string, original: string, translation: string) => {
      const settings = await getSettings();
      await putUnknownWord({
        word: original,
        wordLower: lower,
        translation: translation,
        status: "unknown",
        addedAt: Date.now(),
        voice: {
          name: settings.tts.voiceName,
          lang: settings.tts.lang,
          rate: settings.tts.rate,
          pitch: settings.tts.pitch,
          volume: settings.tts.volume,
        },
      });
      setUnknownSet((prev) => new Set(prev).add(lower));
      setPopup(null);
    },
    []
  );

  const markKnown = useCallback(async (lower: string) => {
    await deleteWord(lower);
    setUnknownSet((prev) => {
      const n = new Set(prev);
      n.delete(lower);
      return n;
    });
    setPopup(null);
  }, []);

  const onSpeak = useCallback(async (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const settings = await getSettings();
    await speak(word, settings.tts);
  }, []);

  const clearPopups = useCallback(() => {
    setPopup(null);
    setSelPopup(null);
  }, []);

  async function reauthorizeAudio() {
    const t = text;
    if (!t || !t.audioRef || t.audioRef.type !== "file") return;

    try {
      // Limpiar URL anterior si existe
      if (audioUrl && !audioUrl.startsWith("http")) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }

      // Verificar y solicitar permisos
      const hasPermission = await ensureReadPermission(t.audioRef.fileHandle);
      if (!hasPermission) {
        console.warn("Permiso denegado para archivo local");
        setAudioAccessError(true);
        alert(
          "Permiso denegado. Vuelve a intentarlo o re-adjunta el audio desde la biblioteca."
        );
        return;
      }

      // Obtener el archivo
      const file = await t.audioRef.fileHandle.getFile();

      // Validar que sea un archivo de audio válido
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

      // Verificar tamaño del archivo (advertir si es muy grande)
      const maxSize = 500 * 1024 * 1024; // 500MB
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

      // Crear ObjectURL de forma segura
      const url = URL.createObjectURL(file);

      setAudioUrl(url);
      setAudioAccessError(false);
    } catch (error) {
      console.error("Error al cargar archivo local:", error);

      // Limpiar estado de error
      setAudioAccessError(true);

      // Determinar tipo de error y mostrar mensaje apropiado
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

  async function handleMouseUp() {
    const sel = window.getSelection();

    if (!sel || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    const parent = containerRef.current;
    if (!parent || !parent.contains(range.commonAncestorContainer)) return;

    const text = sel.toString().trim().replaceAll("Clic para traducir", "");

    if (!text) return;
    const rect = range.getBoundingClientRect();
    const { x, y } = relativePos(rect.left + rect.width / 2, rect.top);
    // collect word lowers
    // const words = Array.from(text.matchAll(/[A-Za-z]+(?:'[A-Za-z]+)?/g))
    //   .map((m) => normalizeWord(m[0]))
    //   .filter(Boolean);

    // const lowers = Array.from(new Set(words));
    // const translations: Array<{ word: string; translation: string }> = [];
    // for (const w of lowers) {
    //   const orig = w; // use lower as key; for display we can use w
    //   const t = await translateTerm(orig, selected);
    //   translations.push({ word: orig, translation: t.translation });
    // }

    // Intentar usar cache de frases: primero en DB, luego en memoria
    const parts = tokenize(text)
      .filter((t) => t.isWord)
      .map((t) => t.lower || normalizeWord(t.text))
      .filter((w) => w.length > 0);

    if (parts.length >= 2) {
      const phraseLower = parts.join(" ");
      try {
        const existing = await getPhrase(phraseLower);
        if (existing && existing.translation) {
          setPopup(null);
          setSelPopup({ x, y, text, translation: existing.translation });
          return;
        }
        const cached = phraseCacheRef.current.get(phraseLower);
        if (cached) {
          setPopup(null);
          setSelPopup({ x, y, text, translation: cached });
          return;
        }
      } catch {}
    }

    const translation = await translateTerm(text, selected);
    // Guardar en cache en memoria si es frase (multi-palabra)
    if (parts.length >= 2) {
      const phraseLower = parts.join(" ");
      phraseCacheRef.current.set(phraseLower, translation.translation);
    }
    setPopup(null);
    setSelPopup({ x, y, text, translation: translation.translation });
  }

  const onSavePhrase = useCallback(
    async (text: string, translation: string) => {
      const parts = tokenize(text)
        .filter((t) => t.isWord)
        .map((t) => t.lower || normalizeWord(t.text))
        .filter((w) => w.length > 0);

      if (parts.length < 2) {
        alert(
          "Selecciona al menos dos palabras para guardar una frase compuesta."
        );
        return;
      }

      const phraseLower = parts.join(" ");
      await putPhrase({
        phrase: text,
        phraseLower,
        translation,
        parts,
        addedAt: Date.now(),
      });

      // Actualizar lista local de frases para subrayado inmediato
      setPhrases((prev) => [...prev, parts]);

      setSelPopup(null);
    },
    []
  );

  // async function saveSelectionUnknowns() {
  //   if (!selPopup) return;
  //   const settings = await getSettings();
  //   for (const lower of selPopup.lowers) {
  //     const existing = await getWord(lower);
  //     if (existing) continue;
  //     const t = await translateTerm(lower, selected);
  //     await putUnknownWord({
  //       word: lower,
  //       wordLower: lower,
  //       translation: t.translation,
  //       status: "unknown",
  //       addedAt: Date.now(),
  //       voice: {
  //         name: settings.tts.voiceName,
  //         lang: settings.tts.lang,
  //         rate: settings.tts.rate,
  //         pitch: settings.tts.pitch,
  //         volume: settings.tts.volume,
  //       },
  //     });
  //   }
  //   await refreshUnknowns();
  //   setSelPopup(null);
  // }

  return (
    <div
      className="relative flex flex-col flex-1 bg-gray-50 dark:bg-gray-900"
      ref={containerRef}
      onMouseUp={handleMouseUp}
      onClick={(e) => {
        const t = e.target as HTMLElement;
        if (!t.closest(`.word-token`)) clearPopups();
      }}
    >
      <AudioSection
        show={!!text.audioRef}
        src={audioUrl ?? text.audioUrl ?? undefined}
        showReauthorize={Boolean(
          text.audioRef?.type === "file" && audioAccessError
        )}
        onReauthorize={reauthorizeAudio}
        isLocalFile={isLocalFile}
        fileSize={fileSize}
      />

      {text.format === "markdown" ? (
        <MarkdownReaderText
          content={text.content}
          unknownSet={unknownSet}
          phrases={phrases}
          onWordClick={onWordClick}
        />
      ) : (
        <ReaderText
          content={text.content}
          unknownSet={unknownSet}
          phrases={phrases}
          onWordClick={onWordClick}
        />
      )}

      {popup && (
        <WordPopup
          popup={popup}
          isUnknown={unknownSet.has(popup.lower)}
          onSpeak={onSpeak}
          onMarkKnown={markKnown}
          onMarkUnknown={markUnknown}
        />
      )}

      {selPopup && (
        <SelectionPopup
          selPopup={selPopup}
          onClose={() => setSelPopup(null)}
          onSavePhrase={onSavePhrase}
        />
      )}
    </div>
  );
}
