/**
 * Content Script para YouTube
 * Detecta subtítulos y los reemplaza con nuestra UI interactiva
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { createRoot } from "react-dom/client";
import SubtitleOverlay from "@/components/SubtitleOverlay";
import WordPopup from "@/components/WordPopup";
import SelectionPopup from "@/components/SelectionPopup";
import type { WordEntry, PhraseEntry, WordPopupState } from "@/types";
import { translateTerm } from "@/utils/translate";
import { tokenize, normalizeWord } from "@/utils/tokenize";

interface SelectionPopupState {
  x: number;
  y: number;
  text: string;
  translation: string;
}

// Estado global de la extensión en YouTube
interface YouTubeState {
  enabled: boolean;
  unknownSet: Set<string>;
  phrases: string[][];
  currentSubtitle: string;
  popup: WordPopupState | null;
  selPopup: SelectionPopupState | null;
  apiKey: string | null;
  playerRect: DOMRect | null;
}

// Referencia global al shadowRoot para acceder a getSelection
let shadowRootRef: ShadowRoot | null = null;

function YouTubeReader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<YouTubeState>({
    enabled: true,
    unknownSet: new Set(),
    phrases: [],
    currentSubtitle: "",
    popup: null,
    selPopup: null,
    apiKey: null,
    playerRect: null,
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

  // Observar cambios en los subtítulos de YouTube y posición del player
  useEffect(() => {
    const updatePlayerRect = () => {
      const player = document.querySelector("#movie_player");
      if (player) {
        setState((prev) => ({
          ...prev,
          playerRect: player.getBoundingClientRect(),
        }));
      }
    };

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
      updatePlayerRect();
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

    // Actualizar posición en resize y scroll
    window.addEventListener("resize", updatePlayerRect);
    window.addEventListener("scroll", updatePlayerRect);
    updatePlayerRect();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updatePlayerRect);
      window.removeEventListener("scroll", updatePlayerRect);
    };
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
    setState((prev) => ({ ...prev, popup: null, selPopup: null }));
  }, []);

  // Manejar selección de texto (frases)
  const handleMouseUp = useCallback(async () => {
    // En Shadow DOM, necesitamos usar shadowRoot.getSelection() o document.getSelection()
    // @ts-expect-error - getSelection en ShadowRoot es experimental
    const sel = shadowRootRef?.getSelection?.() || document.getSelection();
    if (!sel || sel.isCollapsed) return;

    let range: Range;
    try {
      range = sel.getRangeAt(0);
    } catch {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const text = sel.toString().trim();
    if (!text || text.length < 3) return;

    // Verificar que la selección tiene al menos 2 palabras
    const wordCount = text
      .split(/\s+/)
      .filter((w: string) => w.length > 0).length;
    if (wordCount < 2) return;

    const rect = range.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const x = rect.left + rect.width / 2 - containerRect.left;
    const y = rect.top - containerRect.top;

    // Traducir la selección
    const result = await translateTerm(text, state.apiKey || undefined);
    setState((prev) => ({
      ...prev,
      popup: null,
      selPopup: { x, y, text, translation: result.translation || "..." },
    }));

    // Limpiar selección
    sel.removeAllRanges();
  }, [state.apiKey]);

  const handleSavePhrase = useCallback(
    async (text: string, translation: string) => {
      const parts = tokenize(text)
        .filter((t) => t.isWord)
        .map((t) => t.lower || normalizeWord(t.text))
        .filter((w) => w.length > 0);

      if (parts.length < 2) return;

      const entry = {
        phrase: text,
        phraseLower: parts.join(" "),
        translation,
        parts,
        addedAt: Date.now(),
      };
      await chrome.runtime.sendMessage({ type: "PUT_PHRASE", payload: entry });
      setState((prev) => ({
        ...prev,
        phrases: [...prev.phrases, parts],
        selPopup: null,
      }));
    },
    []
  );

  if (!state.enabled || !state.currentSubtitle || !state.playerRect) {
    return null;
  }

  const { playerRect } = state;

  return (
    <div
      ref={containerRef}
      className="lingtext-wrapper"
      style={{
        position: "fixed",
        left: playerRect.left,
        top: playerRect.top,
        width: playerRect.width,
        height: playerRect.height,
        pointerEvents: "none",
        zIndex: 2147483646,
      }}
      onMouseUp={handleMouseUp}
    >
      {/* Overlay de subtítulos - posicionado en la parte inferior del player */}
      <div className="lingtext-container">
        <SubtitleOverlay
          text={state.currentSubtitle}
          unknownSet={state.unknownSet}
          phrases={state.phrases}
          onWordClick={handleWordClick}
        />
      </div>

      {/* Popup de palabra - aparece ARRIBA del click */}
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

      {/* Popup de selección (frases) */}
      {state.selPopup && (
        <SelectionPopup
          popup={state.selPopup}
          onSave={handleSavePhrase}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
}

// Estilos inline para el Shadow DOM
const STYLES = `
.lingtext-wrapper {
  pointer-events: none;
}
.lingtext-container {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 85%;
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
  position: absolute;
  min-width: 280px;
  max-width: 350px;
  background: white;
  color: #1f2937;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
  pointer-events: auto;
  transform: translateX(-50%) translateY(-100%);
  margin-top: -10px;
}
.lingtext-selection-popup {
  position: absolute;
  min-width: 250px;
  max-width: 400px;
  background: white;
  color: #1f2937;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
  pointer-events: auto;
  transform: translateX(-50%) translateY(-100%);
  margin-top: -10px;
  padding: 16px;
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
.lingtext-btn-save {
  background: #3b82f6;
  color: white;
  border: 1px solid #2563eb;
}
.lingtext-btn-save:hover { background: #2563eb; }
.lingtext-selection-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.lingtext-selection-text {
  font-style: italic;
  color: #4b5563;
  font-size: 15px;
  flex: 1;
  margin-right: 8px;
}
.lingtext-selection-translation {
  margin-bottom: 12px;
}
.lingtext-translation-content {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  white-space: pre-wrap;
}
.lingtext-selection-actions {
  display: flex;
  gap: 8px;
}
`;

// Inicializar la extensión
function init() {
  // Crear contenedor para React
  const container = document.createElement("div");
  container.id = "lingtext-root";
  document.body.appendChild(container);

  // Crear Shadow DOM para aislar estilos
  const shadow = container.attachShadow({ mode: "open" });
  shadowRootRef = shadow;

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
