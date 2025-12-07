/**
 * Content Script para YouTube
 * Detecta subtítulos y los reemplaza con nuestra UI interactiva
 */

import { useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import SubtitleOverlay from "@/components/SubtitleOverlay";
import WordPopup from "@/components/WordPopup";
import type { WordEntry, PhraseEntry, WordPopupState } from "@/types";
import { translateTerm } from "@/utils/translate";

// Estado global de la extensión en YouTube
interface YouTubeState {
  enabled: boolean;
  unknownSet: Set<string>;
  phrases: string[][];
  currentSubtitle: string;
  popup: WordPopupState | null;
  apiKey: string | null;
}

function YouTubeReader() {
  const [state, setState] = useState<YouTubeState>({
    enabled: true,
    unknownSet: new Set(),
    phrases: [],
    currentSubtitle: "",
    popup: null,
    apiKey: null,
  });

  // Cargar datos iniciales desde el background
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [words, phrases] = await Promise.all([
        chrome.runtime.sendMessage({ type: "GET_WORDS" }) as Promise<
          WordEntry[]
        >,
        chrome.runtime.sendMessage({ type: "GET_PHRASES" }) as Promise<
          PhraseEntry[]
        >,
      ]);

      setState((prev) => ({
        ...prev,
        unknownSet: new Set(words.map((w) => w.wordLower)),
        phrases: phrases.map((p) => p.parts),
      }));
    } catch (error) {
      console.error("[LingText] Error loading data:", error);
    }
  };

  // Observar cambios en los subtítulos de YouTube
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const captionWindow = document.querySelector(
        ".ytp-caption-window-container"
      );
      if (!captionWindow) return;

      const segments = captionWindow.querySelectorAll(".ytp-caption-segment");
      const text = Array.from(segments)
        .map((s) => s.textContent)
        .join(" ")
        .trim();

      if (text && text !== state.currentSubtitle) {
        setState((prev) => ({ ...prev, currentSubtitle: text }));
      }
    });

    // Observar el contenedor de video
    const videoContainer = document.querySelector("#movie_player");
    if (videoContainer) {
      observer.observe(videoContainer, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => observer.disconnect();
  }, [state.currentSubtitle]);

  // Ocultar subtítulos nativos de YouTube
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "lingtext-hide-captions";
    style.textContent = `
      .ytp-caption-window-container {
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `;

    if (state.enabled && state.currentSubtitle) {
      document.head.appendChild(style);
    }

    return () => {
      const existing = document.getElementById("lingtext-hide-captions");
      if (existing) existing.remove();
    };
  }, [state.enabled, state.currentSubtitle]);

  const handleWordClick = useCallback(
    async (word: string, lower: string, x: number, y: number) => {
      // Buscar si ya existe la palabra
      const words = (await chrome.runtime.sendMessage({
        type: "GET_WORDS",
      })) as WordEntry[];
      const existing = words.find((w) => w.wordLower === lower);

      if (existing) {
        setState((prev) => ({
          ...prev,
          popup: { x, y, word, lower, translation: existing.translation },
        }));
        return;
      }

      // Traducir
      const result = await translateTerm(word, state.apiKey || undefined);
      setState((prev) => ({
        ...prev,
        popup: { x, y, word, lower, translation: result.translation || "..." },
      }));
    },
    [state.apiKey]
  );

  const handleSpeak = useCallback((word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  }, []);

  const handleMarkKnown = useCallback(async (lower: string) => {
    await chrome.runtime.sendMessage({ type: "DELETE_WORD", payload: lower });
    setState((prev) => {
      const newSet = new Set(prev.unknownSet);
      newSet.delete(lower);
      return { ...prev, unknownSet: newSet, popup: null };
    });
  }, []);

  const handleMarkUnknown = useCallback(
    async (lower: string, word: string, translation: string) => {
      const entry: WordEntry = {
        word,
        wordLower: lower,
        translation,
        status: "unknown",
        addedAt: Date.now(),
      };
      await chrome.runtime.sendMessage({ type: "PUT_WORD", payload: entry });
      setState((prev) => {
        const newSet = new Set(prev.unknownSet);
        newSet.add(lower);
        return { ...prev, unknownSet: newSet, popup: null };
      });
    },
    []
  );

  const handleClosePopup = useCallback(() => {
    setState((prev) => ({ ...prev, popup: null }));
  }, []);

  if (!state.enabled || !state.currentSubtitle) {
    return null;
  }

  return (
    <>
      {/* Overlay de subtítulos */}
      <div className="lingtext-container">
        <SubtitleOverlay
          text={state.currentSubtitle}
          unknownSet={state.unknownSet}
          phrases={state.phrases}
          onWordClick={handleWordClick}
        />
      </div>

      {/* Popup de palabra */}
      {state.popup && (
        <WordPopup
          popup={state.popup}
          isUnknown={state.unknownSet.has(state.popup.lower)}
          onSpeak={handleSpeak}
          onMarkKnown={handleMarkKnown}
          onMarkUnknown={handleMarkUnknown}
          onClose={handleClosePopup}
        />
      )}
    </>
  );
}

// Inicializar la extensión
function init() {
  // Crear contenedor para React
  const container = document.createElement("div");
  container.id = "lingtext-root";
  document.body.appendChild(container);

  // Crear Shadow DOM para aislar estilos
  const shadow = container.attachShadow({ mode: "open" });

  // Inyectar estilos
  const styleLink = document.createElement("link");
  styleLink.rel = "stylesheet";
  styleLink.href = chrome.runtime.getURL("src/content/youtube.css");
  shadow.appendChild(styleLink);

  // Contenedor para React dentro del Shadow DOM
  const reactRoot = document.createElement("div");
  shadow.appendChild(reactRoot);

  // Montar React
  const root = createRoot(reactRoot);
  root.render(<YouTubeReader />);

  console.log("[LingText] YouTube content script initialized");
}

// Esperar a que el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
