import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getAllUnknownWords,
  getText,
  getWord,
  putUnknownWord,
  deleteWord,
  getSettings,
} from "../db";
import type { AudioRef } from "../types";
// import type { Token } from "../utils/tokenize";
import { tokenize, normalizeWord } from "../utils/tokenize";
import { speak } from "../utils/tts";
import { translate } from "../utils/translate";
import { ensureReadPermission } from "../utils/fs";
import { Link } from "react-router";

interface Props {
  text: {
    id: string;
    title: string;
    content: string;
    createdAt: number;
    audioRef?: AudioRef | null;
    audioUrl?: string | null;
  };
}

interface PopupState {
  x: number;
  y: number;
  word: string;
  lower: string;
  translations: string[];
}

interface SelPopupState {
  x: number;
  y: number;
  text: string;
  lowers: string[];
  translations: Array<{ word: string; translations: string[] }>;
}

export default function Reader({ text }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // const [item, setItem] = useState<Props["text"] | null>(null);
  // const [tokens, setTokens] = useState<Token[]>([]);
  const [unknownSet, setUnknownSet] = useState<Set<string>>(new Set());
  const [popup, setPopup] = useState<PopupState | null>(null);
  const [selPopup, setSelPopup] = useState<SelPopupState | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioAccessError, setAudioAccessError] = useState(false);

  // console.log(text.audioRef);

  // load text and tokens
  // useEffect(() => {
  //   let alive = true;
  //   getText(id!).then(async (t) => {
  //     if (!alive) return;
  //     if (t) {
  //       setItem(t);
  //       setTokens(tokenize(t.content));
  //       // prepare audio url if any
  //       if (t.audioRef) {
  //         if (t.audioRef.type === "url") {
  //           setAudioUrl(t.audioRef.url);
  //         } else if (t.audioRef.type === "file") {
  //           try {
  //             // try to read the file; if permission is needed, this may throw
  //             const file = await t.audioRef.fileHandle.getFile();
  //             const url = URL.createObjectURL(file);
  //             if (alive) setAudioUrl(url);
  //             setAudioAccessError(false);
  //           } catch (e) {
  //             console.warn(
  //               "No se pudo acceder al archivo de audio. Reautoriza el acceso desde la biblioteca.",
  //               e
  //             );
  //             setAudioAccessError(true);
  //           }
  //         }
  //       }
  //     }
  //   });
  //   return () => {
  //     alive = false;
  //   };
  // }, [id]);

  // Revoke audio URL when it changes or on unmount
  useEffect(() => {
    if (!audioUrl || audioUrl.startsWith("http")) return;
    return () => {
      URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  // load unknown words
  useEffect(() => {
    refreshUnknowns();
  }, []);

  async function refreshUnknowns() {
    const all = await getAllUnknownWords();
    setUnknownSet(new Set(all.map((w) => w.wordLower)));
  }

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
      const word = target.dataset.word;
      const lower = target.dataset.lower;
      const translations = await translate(word);
      setSelPopup(null);
      setPopup({ x, y, word, lower, translations });
    },
    []
  );

  // const renderParts = useMemo(() => {
  //   return tokenize(text.content).map((t, idx) => {
  //     if (!t.isWord) return <span key={idx}>{t.text}</span>;
  //     const low = t.lower || normalizeWord(t.text);
  //     const isUnknown = unknownSet.has(low);
  //     return (
  //       <span
  //         key={idx}
  //         className={
  //           isUnknown
  //             ? "cursor-pointer underline decoration-wavy decoration-red-500 text-red-700 dark:text-red-300"
  //             : "cursor-pointer hover:underline"
  //         }
  //         data-lower={low}
  //         data-word={t.text}
  //         onClick={onWordClick}
  //       >
  //         {t.text}
  //       </span>
  //     );
  //   });
  // }, [tokens, unknownSet, onWordClick]);

  function relativePos(x: number, y: number) {
    const el = containerRef.current;
    if (!el) return { x, y };
    const r = el.getBoundingClientRect();
    return { x: x - r.left, y: y - r.top };
  }

  async function markUnknown(lower: string, original: string) {
    const translations = await translate(original);
    const settings = await getSettings();
    await putUnknownWord({
      word: original,
      wordLower: lower,
      translations,
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
  }

  async function markKnown(lower: string) {
    await deleteWord(lower);
    setUnknownSet((prev) => {
      const n = new Set(prev);
      n.delete(lower);
      return n;
    });
    setPopup(null);
  }

  async function onSpeak(word: string) {
    const settings = await getSettings();
    await speak(word, settings.tts);
  }

  function clearPopups() {
    setPopup(null);
    setSelPopup(null);
  }

  async function reauthorizeAudio() {
    const t = text;
    if (!t || !t.audioRef || t.audioRef.type !== "file") return;
    const ok = await ensureReadPermission(t.audioRef.fileHandle);
    if (!ok) {
      alert(
        "Permiso denegado. Vuelve a intentarlo o re-adjunta el audio desde la biblioteca."
      );
      return;
    }
    try {
      const file = await t.audioRef.fileHandle.getFile();
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setAudioAccessError(false);
    } catch (e) {
      console.warn("No se pudo abrir el archivo de audio tras reautorizar", e);
      alert(
        "No se pudo abrir el archivo de audio. Re-adjunta el audio desde la biblioteca."
      );
    }
  }

  async function handleMouseUp() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    const parent = containerRef.current;
    if (!parent || !parent.contains(range.commonAncestorContainer)) return;
    const text = sel.toString().trim();
    if (!text) return;
    const rect = range.getBoundingClientRect();
    const { x, y } = relativePos(rect.left + rect.width / 2, rect.top);
    // collect word lowers
    const words = Array.from(text.matchAll(/[A-Za-z]+(?:'[A-Za-z]+)?/g))
      .map((m) => normalizeWord(m[0]))
      .filter(Boolean);
    const lowers = Array.from(new Set(words));
    const translations: Array<{ word: string; translations: string[] }> = [];
    for (const w of lowers) {
      const orig = w; // use lower as key; for display we can use w
      const t = await translate(orig);
      translations.push({ word: orig, translations: t });
    }
    setPopup(null);
    setSelPopup({ x, y, text, lowers, translations });
  }

  async function saveSelectionUnknowns() {
    if (!selPopup) return;
    const settings = await getSettings();
    for (const lower of selPopup.lowers) {
      const existing = await getWord(lower);
      if (existing) continue;
      const t = await translate(lower);
      await putUnknownWord({
        word: lower,
        wordLower: lower,
        translations: t,
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
    }
    await refreshUnknowns();
    setSelPopup(null);
  }

  return (
    <div
      className="relative flex flex-col flex-1 overflow-auto bg-white dark:bg-gray-900"
      ref={containerRef}
      onMouseUp={handleMouseUp}
      onClick={(e) => {
        const t = e.target as HTMLElement;
        if (!t.closest(`.word-token`)) clearPopups();
      }}
    >
      <div className="flex items-center gap-4 px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 sticky top-0 z-10">
        <Link
          to="../"
          className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          ← Volver
        </Link>
        <div className="font-semibold text-base truncate">
          {text.title || "Sin título"}
        </div>
      </div>
      {text.audioRef && (
        <audio
          className="my-3 mx-4 w-[min(500px,100%)] max-w-full"
          controls
          src={text.audioUrl || undefined}
        >
          Tu navegador no soporta audio HTML5
        </audio>
      )}
      {text.audioRef?.type === "file" && audioAccessError && (
        <div className="text-xs text-red-700 dark:text-red-400 mx-3 my-1 flex items-center gap-2">
          No hay permiso para acceder al archivo de audio.
          <button
            className="ml-2 px-2 py-0.5 rounded border border-red-700 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition"
            onClick={reauthorizeAudio}
          >
            Reautorizar audio
          </button>
        </div>
      )}
      <div
        id="reader-text"
        className="p-4 leading-relaxed text-lg whitespace-pre-line break-words min-h-[120px] select-text"
        onMouseUp={(e) => {
          const sel = window.getSelection();
          console.log(sel?.toString());
        }}
        // renderParts uses .word-token for word spans
      >
        {tokenize(text.content).map((t, idx) => {
          if (!t.isWord) return <span key={idx}>{t.text}</span>;
          const low = t.lower || normalizeWord(t.text);
          const isUnknown = unknownSet.has(low);
          return (
            <span
              key={idx}
              className={
                `word-token cursor-pointer transition rounded px-1` +
                (isUnknown
                  ? " bg-yellow-200 dark:bg-yellow-700/40 text-yellow-900 dark:text-yellow-100 font-semibold"
                  : " hover:bg-blue-100 dark:hover:bg-blue-800/50")
              }
              data-lower={low}
              data-word={t.text}
              onClick={onWordClick}
            >
              {t.text}
            </span>
          );
        })}
      </div>
      {popup && (
        <div
          className="absolute min-w-[180px] max-w-[220px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 z-30"
          style={{
            left: Math.max(6, popup.x - 110),
            top: Math.max(6, popup.y - 60),
          }}
        >
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-4 py-2">
            <div className="font-semibold">{popup.word}</div>
            <div className="flex gap-2 items-center">
              <button
                className="hover:text-blue-600"
                onClick={() => onSpeak(popup.word)}
                title="Escuchar"
              >
                🔊
              </button>
              {unknownSet.has(popup.lower) ? (
                <button
                  className="px-2 py-0.5 text-xs rounded border border-green-600 hover:bg-green-100 dark:hover:bg-green-800 transition"
                  onClick={() => markKnown(popup.lower)}
                >
                  Conocida
                </button>
              ) : (
                <button
                  className="px-2 py-0.5 text-xs rounded border border-red-700 text-red-700 dark:border-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition"
                  onClick={() => markUnknown(popup.lower, popup.word)}
                >
                  Desconocida
                </button>
              )}
            </div>
          </div>
          <div className="px-4 py-2 text-sm">
            {popup.translations.length
              ? popup.translations.join(", ")
              : "Sin traducción local"}
          </div>
        </div>
      )}
      {selPopup && (
        <div
          className="absolute min-w-[220px] max-w-[320px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 z-30"
          style={{
            left: Math.max(6, selPopup.x - 130),
            top: Math.max(6, selPopup.y - 70),
          }}
        >
          <div className="px-4 py-2 text-sm italic text-gray-700 dark:text-gray-300 truncate">
            "{selPopup.text.slice(0, 80)}"
          </div>
          <div className="px-4 py-2">
            {selPopup.translations.length ? (
              <ul className="list-disc pl-5 space-y-1">
                {selPopup.translations.map((t) => (
                  <li key={t.word} className="text-sm">
                    <b>{t.word}</b>: {t.translations.join(", ") || "—"}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-400">
                Sin traducciones locales
              </div>
            )}
          </div>
          <div className="flex gap-2 flex-wrap justify-end px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <button
              className="px-2 py-0.5 text-xs rounded border border-red-700 text-red-700 dark:border-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition"
              onClick={saveSelectionUnknowns}
            >
              Guardar como desconocidas
            </button>
            <button
              className="px-2 py-0.5 text-xs rounded border border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 transition"
              onClick={() => setSelPopup(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
