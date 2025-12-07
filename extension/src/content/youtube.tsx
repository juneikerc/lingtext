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

// Estilos inline para el Shadow DOM
const STYLES = `
.lingtext-container {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2147483646;
  max-width: 80%;
  text-align: center;
  pointer-events: auto;
}
.lingtext-subtitle-overlay {
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 22px;
  line-height: 1.5;
  font-family: "YouTube Noto", Roboto, Arial, sans-serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}
.lingtext-word {
  cursor: pointer;
  padding: 2px 4px;
  margin: 0 1px;
  border-radius: 4px;
  transition: all 0.15s ease;
  display: inline-block;
}
.lingtext-word:hover {
  background: rgba(59, 130, 246, 0.5);
  transform: scale(1.05);
}
.lingtext-unknown {
  background: rgba(234, 179, 8, 0.4);
  border: 1px solid rgba(234, 179, 8, 0.6);
  font-weight: 600;
}
.lingtext-unknown:hover {
  background: rgba(234, 179, 8, 0.6);
}
.lingtext-phrase {
  text-decoration: underline;
  text-decoration-color: #22c55e;
  text-underline-offset: 4px;
}
.lingtext-popup {
  min-width: 280px;
  max-width: 350px;
  background: white;
  color: #1f2937;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
}
.lingtext-popup-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
}
.lingtext-popup-word {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}
.lingtext-popup-word strong {
  font-size: 18px;
  color: #111827;
}
.lingtext-popup-icon { font-size: 20px; }
.lingtext-popup-speak,
.lingtext-popup-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.15s;
}
.lingtext-popup-speak:hover,
.lingtext-popup-close:hover { background: #e5e7eb; }
.lingtext-popup-body { padding: 16px; }
.lingtext-popup-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
}
.lingtext-popup-translation {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}
.lingtext-popup-category { margin-bottom: 4px; }
.lingtext-popup-category-name {
  font-weight: 600;
  color: #4b5563;
  margin-right: 4px;
}
.lingtext-popup-status { margin-bottom: 12px; }
.lingtext-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}
.lingtext-status-badge.unknown {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
}
.lingtext-status-badge.known {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}
.lingtext-popup-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.lingtext-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.lingtext-btn-known {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}
.lingtext-btn-known:hover { background: #a7f3d0; }
.lingtext-btn-unknown {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
}
.lingtext-btn-unknown:hover { background: #fde68a; }
`;

// Inicializar la extensión
function init() {
  // Crear contenedor para React
  const container = document.createElement("div");
  container.id = "lingtext-root";
  document.body.appendChild(container);

  // Crear Shadow DOM para aislar estilos
  const shadow = container.attachShadow({ mode: "open" });

  // Inyectar estilos inline
  const style = document.createElement("style");
  style.textContent = STYLES;
  shadow.appendChild(style);

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
