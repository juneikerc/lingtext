import { useCallback, useRef, useState } from "react";

import { getPhrase, getSettings, getWord } from "~/services/db";
import { normalizeWord, tokenize } from "~/utils/tokenize";
import { speak } from "~/utils/tts";
import { translateTerm } from "~/utils/translate";
import { getLocalWordMeaning } from "~/utils/local-word-bank";
import type { Translator } from "~/types";

import type { SelectionPopupState, WordPopupState } from "./types";

const MAX_SELECTION_TRANSLATE_WORDS = 20;
const READER_COPY_HINTS = ["Clic para traducir"] as const;

function stripReaderCopyHints(rawText: string) {
  return READER_COPY_HINTS.reduce((text, hint) => {
    return text.replaceAll(hint, "");
  }, rawText);
}

function normalizeReaderSelectionText(rawText: string): string {
  return stripReaderCopyHints(rawText)
    .replace(/\u00a0/g, " ")
    .replace(/[\u200b-\u200d\ufeff]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeReaderCopiedText(rawText: string): string {
  return stripReaderCopyHints(rawText)
    .replace(/\u00a0/g, " ")
    .replace(/[\u200b-\u200d\ufeff]/g, "");
}

interface ReaderInteractionsOptions {
  selected: Translator;
  containerRef: React.RefObject<HTMLDivElement | null>;
  markKnownWord: (lower: string) => Promise<void>;
  markUnknownWord: (
    lower: string,
    original: string,
    translation: string
  ) => Promise<void>;
  savePhraseEntry: (
    phrase: string,
    translation: string,
    parts: string[]
  ) => Promise<void>;
}

export function useReaderInteractions({
  selected,
  containerRef,
  markKnownWord,
  markUnknownWord,
  savePhraseEntry,
}: ReaderInteractionsOptions) {
  const [popup, setPopup] = useState<WordPopupState | null>(null);
  const [selPopup, setSelPopup] = useState<SelectionPopupState | null>(null);
  const phraseCacheRef = useRef<Map<string, string>>(new Map());
  const myMemoryQuotaAlertedRef = useRef(false);
  const translateRequestIdRef = useRef(0);

  const relativePos = useCallback(
    (x: number, y: number) => {
      const element = containerRef.current;
      if (!element) return { x, y };
      const rect = element.getBoundingClientRect();
      return { x: x - rect.left, y: y - rect.top };
    },
    [containerRef]
  );

  const notifyTranslationQuota = useCallback((error?: string) => {
    if (
      error === "MYMEMORY_QUOTA_EXCEEDED" &&
      !myMemoryQuotaAlertedRef.current
    ) {
      myMemoryQuotaAlertedRef.current = true;
      alert(
        "Se alcanzó el límite diario del traductor gratis (MyMemory).\n\n" +
          "Sugerencia: cambia el método de traducción (Chrome si está disponible) " +
          "o configura una API Key de OpenRouter para seguir traduciendo."
      );
    }
  }, []);

  const onWordClick = useCallback(
    async (event: React.MouseEvent<HTMLSpanElement>) => {
      const target = event.currentTarget as HTMLSpanElement;
      if (!target?.dataset?.lower || !target?.dataset?.word) return;

      const rect = target.getBoundingClientRect();
      const { x, y } = relativePos(rect.left + rect.width / 2, rect.top);
      const word = target.dataset.word;
      const lower = target.dataset.lower;

      const existing = await getWord(lower);
      if (existing) {
        setPopup({ x, y, word, lower, translation: existing.translation });
        return;
      }

      const localMeaning = getLocalWordMeaning(lower);
      if (localMeaning) {
        setSelPopup(null);
        setPopup({ x, y, word, lower, translation: localMeaning });
        return;
      }

      const requestId = ++translateRequestIdRef.current;
      setSelPopup(null);
      setPopup({ x, y, word, lower, translation: "", isLoading: true });

      const translation = await translateTerm(word, selected);
      if (requestId !== translateRequestIdRef.current) return;

      notifyTranslationQuota(translation.error);
      setPopup({
        x,
        y,
        word,
        lower,
        translation: translation.translation,
        isLoading: false,
        disclaimer: translation.disclaimer,
      });
    },
    [notifyTranslationQuota, relativePos, selected]
  );

  const markUnknown = useCallback(
    async (lower: string, original: string, translation: string) => {
      await markUnknownWord(lower, original, translation);
      setPopup(null);
    },
    [markUnknownWord]
  );

  const markKnown = useCallback(
    async (lower: string) => {
      await markKnownWord(lower);
      setPopup(null);
    },
    [markKnownWord]
  );

  const onSpeak = useCallback(async (word: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const settings = await getSettings();
    await speak(word, settings.tts);
  }, []);

  const clearPopups = useCallback(() => {
    translateRequestIdRef.current += 1;
    setPopup(null);
    setSelPopup(null);
  }, []);

  const handleMouseUp = useCallback(async (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest("[data-reader-popup='true']")) {
      return;
    }

    const selection = window.getSelection();

    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    const parent = containerRef.current;
    if (!parent || !parent.contains(range.commonAncestorContainer)) {
      return;
    }

    const text = normalizeReaderSelectionText(selection.toString());
    if (!text) return;

    const rect = range.getBoundingClientRect();
    const { x, y } = relativePos(rect.left + rect.width / 2, rect.top);
    const parts = tokenize(text)
      .filter((token) => token.isWord)
      .map((token) => token.lower || normalizeWord(token.text))
      .filter((word) => word.length > 0);

    if (parts.length > MAX_SELECTION_TRANSLATE_WORDS) {
      translateRequestIdRef.current += 1;
      setPopup(null);
      setSelPopup(null);
      return;
    }

    if (parts.length >= 2) {
      const phraseLower = parts.join(" ");
      try {
        const existing = await getPhrase(phraseLower);
        if (existing?.translation) {
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
      } catch (_error) {
        phraseCacheRef.current.delete(phraseLower);
      }
    }

    const requestId = ++translateRequestIdRef.current;
    setPopup(null);
    setSelPopup({ x, y, text, translation: "", isLoading: true });

    const translation = await translateTerm(text, selected);
    if (requestId !== translateRequestIdRef.current) return;

    notifyTranslationQuota(translation.error);

    if (parts.length >= 2) {
      phraseCacheRef.current.set(parts.join(" "), translation.translation);
    }

    setSelPopup({
      x,
      y,
      text,
      translation: translation.translation,
      isLoading: false,
      disclaimer: translation.disclaimer,
    });
  }, [containerRef, notifyTranslationQuota, relativePos, selected]);

  const onSavePhrase = useCallback(
    async (text: string, translation: string) => {
      const normalizedText = normalizeReaderSelectionText(text);
      const parts = tokenize(normalizedText)
        .filter((token) => token.isWord)
        .map((token) => token.lower || normalizeWord(token.text))
        .filter((word) => word.length > 0);

      if (parts.length < 2) {
        alert(
          "Selecciona al menos dos palabras para guardar una frase compuesta."
        );
        return;
      }

      await savePhraseEntry(normalizedText, translation, parts);
      setSelPopup(null);
    },
    [savePhraseEntry]
  );

  const onCopy = useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      const selection = window.getSelection();
      const parent = containerRef.current;

      if (
        !selection ||
        selection.isCollapsed ||
        selection.rangeCount === 0 ||
        !parent
      ) {
        return;
      }

      const range = selection.getRangeAt(0);
      if (!parent.contains(range.commonAncestorContainer)) {
        return;
      }

      const copiedText = sanitizeReaderCopiedText(selection.toString());
      if (!copiedText || !event.clipboardData) {
        return;
      }

      event.clipboardData.setData("text/plain", copiedText);
      event.preventDefault();
    },
    [containerRef]
  );

  return {
    popup,
    selPopup,
    setPopup,
    setSelPopup,
    onWordClick,
    markUnknown,
    markKnown,
    onSpeak,
    clearPopups,
    handleMouseUp,
    onSavePhrase,
    onCopy,
  };
}
