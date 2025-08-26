import { useEffect, useRef, useState } from "react";
import {
  getAllUnknownWords,
  getWord,
  putUnknownWord,
  deleteWord,
  getSettings,
} from "../db";
import { type AudioRef } from "../types";
// import type { Token } from "../utils/tokenize";
import { normalizeWord } from "../utils/tokenize";
import { speak } from "../utils/tts";
import { translateTerm } from "../utils/translate";
import { ensureReadPermission } from "../utils/fs";

import AudioSection from "./reader/AudioSection";
import ReaderText from "./reader/ReaderText";
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
    createdAt: number;
    audioRef?: AudioRef | null;
    audioUrl?: string | null;
  };
}

// Types moved to ./reader/types

export default function Reader({ text }: Props) {
  const { selected } = useTranslatorStore();
  const containerRef = useRef<HTMLDivElement | null>(null);
  // const [item, setItem] = useState<Props["text"] | null>(null);
  // const [tokens, setTokens] = useState<Token[]>([]);
  const [unknownSet, setUnknownSet] = useState<Set<string>>(new Set());
  const [popup, setPopup] = useState<PopupState | null>(null);
  const [selPopup, setSelPopup] = useState<SelPopupState | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioAccessError, setAudioAccessError] = useState(false);

  // If audio file couldn't be materialized by the loader, mark reauthorization required
  useEffect(() => {
    if (text?.audioRef?.type === "file" && !text?.audioUrl) {
      setAudioAccessError(true);
    } else {
      setAudioAccessError(false);
    }
  }, [text?.audioRef, text?.audioUrl]);

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
  }, []);

  async function refreshUnknowns() {
    const all = await getAllUnknownWords();
    setUnknownSet(new Set(all.map((w) => w.wordLower)));
  }

  const onWordClick = async (e: React.MouseEvent<HTMLSpanElement>) => {
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

    const translation = await translateTerm(word, selected);
    setSelPopup(null);
    setPopup({ x, y, word, lower, translation: translation.translation });
  };

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

  async function markUnknown(
    lower: string,
    original: string,
    translation: string
  ) {
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

  async function onSpeak(word: string, e: React.MouseEvent) {
    e.stopPropagation();
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
    const translations: Array<{ word: string; translation: string }> = [];
    for (const w of lowers) {
      const orig = w; // use lower as key; for display we can use w
      const t = await translateTerm(orig, selected);
      translations.push({ word: orig, translation: t.translation });
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
      const t = await translateTerm(lower, selected);
      await putUnknownWord({
        word: lower,
        wordLower: lower,
        translation: t.translation,
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
      <AudioSection
        show={!!text.audioRef}
        src={audioUrl ?? text.audioUrl ?? undefined}
        showReauthorize={Boolean(
          text.audioRef?.type === "file" && audioAccessError
        )}
        onReauthorize={reauthorizeAudio}
      />

      <ReaderText
        content={text.content}
        unknownSet={unknownSet}
        onWordClick={onWordClick}
      />

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
          onSaveUnknowns={saveSelectionUnknowns}
          onClose={() => setSelPopup(null)}
        />
      )}
    </div>
  );
}
