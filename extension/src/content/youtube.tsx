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
import { translateTerm, TRANSLATORS } from "@/utils/translate";
import { tokenize, normalizeWord } from "@/utils/tokenize";

interface SelectionPopupState {
  x: number;
  y: number;
  text: string;
  translation: string;
}

// Estructura para cues del transcript
interface TranscriptCue {
  start: number; // segundos
  duration: number;
  text: string;
}

// Estado global de la extensión en YouTube
interface YouTubeState {
  enabled: boolean;
  unknownSet: Set<string>;
  phrases: string[][];
  currentSubtitle: string;
  displayedSubtitle: string;
  isTransitioning: boolean;
  popup: WordPopupState | null;
  selPopup: SelectionPopupState | null;
  apiKey: string | null;
  translator: TRANSLATORS;
  playerRect: DOMRect | null;
  transcript: TranscriptCue[]; // Transcript completo
  useTranscript: boolean; // Si usamos transcript en lugar de DOM
}

// Referencia global al shadowRoot para acceder a getSelection
let shadowRootRef: ShadowRoot | null = null;

// Buffer de subtítulos para precargar
const SUBTITLE_DELAY_MS = 100; // Delay antes de mostrar nuevo subtítulo

// Parsear XML del transcript de YouTube
function parseTranscriptXml(xmlText: string): TranscriptCue[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "text/xml");
  const textElements = doc.querySelectorAll("text");

  return Array.from(textElements).map((el) => ({
    start: parseFloat(el.getAttribute("start") || "0"),
    duration: parseFloat(el.getAttribute("dur") || "2"),
    text: (el.textContent || "")
      .replace(/&amp;/g, "&")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/\n/g, " ")
      .trim(),
  }));
}

// Fusionar cues cortos consecutivos para mejorar legibilidad
function mergeTranscriptCues(cues: TranscriptCue[]): TranscriptCue[] {
  if (cues.length === 0) return [];

  const merged: TranscriptCue[] = [];
  let currentCue = { ...cues[0] };

  for (let i = 1; i < cues.length; i++) {
    const nextCue = cues[i];

    // Calcular gap entre fin del actual y comienzo del siguiente
    // Nota: A veces los subs automáticos se solapan, por lo que gap puede ser negativo
    const gap = nextCue.start - (currentCue.start + currentCue.duration);

    // Criterios para fusionar:
    // 1. Son consecutivos (gap pequeño < 0.5s) o solapados
    // 2. La duración combinada es razonable (< 7s)
    // 3. El texto no es excesivamente largo (< 120 caracteres)
    // 4. El cue actual no parece terminar una frase (. ! ?) - aunque subs automáticos a veces no tienen puntuación

    const isConsecutive = gap < 0.5;
    const isShortDuration =
      nextCue.start + nextCue.duration - currentCue.start < 8;
    const isShortText = currentCue.text.length + nextCue.text.length < 120;
    const hasSentenceEnd = /[.!?]$/.test(currentCue.text);

    // Si cumple criterios, fusionar
    if (isConsecutive && isShortDuration && isShortText && !hasSentenceEnd) {
      currentCue.text += " " + nextCue.text;
      // Extender duración hasta el final del siguiente
      currentCue.duration = nextCue.start + nextCue.duration - currentCue.start;
    } else {
      // Si no, guardar el actual y empezar uno nuevo
      merged.push(currentCue);
      currentCue = { ...nextCue };
    }
  }

  merged.push(currentCue);
  return merged;
}

function YouTubeReader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const subtitleBufferRef = useRef<string>("");
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const [state, setState] = useState<YouTubeState>({
    enabled: true,
    unknownSet: new Set(),
    phrases: [],
    currentSubtitle: "",
    displayedSubtitle: "",
    isTransitioning: false,
    popup: null,
    selPopup: null,
    apiKey: null,
    translator: TRANSLATORS.CHROME,
    playerRect: null,
    transcript: [],
    useTranscript: false,
  });

  const [videoId, setVideoId] = useState<string | null>(null);

  // Detectar cambios de URL (SPA navigation)
  useEffect(() => {
    const checkUrl = () => {
      const id = new URLSearchParams(window.location.search).get("v");
      if (id && id !== videoId) {
        console.log(`[LingText] Video changed: ${id}`);
        setVideoId(id);
        // Limpiar estado anterior
        setState((prev) => ({
          ...prev,
          transcript: [],
          useTranscript: false,
          currentSubtitle: "",
          displayedSubtitle: "",
        }));
      }
    };

    checkUrl();
    const interval = setInterval(checkUrl, 1000);
    return () => clearInterval(interval);
  }, [videoId]);

  // Cargar configuración guardada (traductor y API key)
  useEffect(() => {
    // Cargar inicial
    chrome.storage.local.get(["translator", "openrouter_key"], (result) => {
      setState((prev) => ({
        ...prev,
        translator: (result.translator as TRANSLATORS) || TRANSLATORS.CHROME,
        apiKey: result.openrouter_key || null,
      }));
    });

    // Escuchar cambios en storage para actualizar sin recargar
    const handleStorageChange = (changes: {
      [key: string]: chrome.storage.StorageChange;
    }) => {
      if (changes.translator) {
        setState((prev) => ({
          ...prev,
          translator:
            (changes.translator.newValue as TRANSLATORS) || TRANSLATORS.CHROME,
        }));
      }
      if (changes.openrouter_key) {
        setState((prev) => ({
          ...prev,
          apiKey: changes.openrouter_key.newValue || null,
        }));
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  // Cargar transcript cuando cambia el video
  useEffect(() => {
    if (!videoId) return;

    let attempts = 0;
    const maxAttempts = 5;

    const tryLoadTranscript = async () => {
      const success = await loadTranscript(videoId);
      if (!success && attempts < maxAttempts) {
        attempts++;
        console.log(
          `[LingText] Retrying transcript load (attempt ${attempts}/${maxAttempts})...`
        );
        setTimeout(tryLoadTranscript, 1500);
      }
    };

    // Esperar un poco para que YouTube cargue
    setTimeout(tryLoadTranscript, 500);
  }, [videoId]);

  const loadTranscript = async (currentVideoId: string): Promise<boolean> => {
    try {
      console.log(`[LingText] Loading transcript for video: ${currentVideoId}`);

      // Intentar múltiples fuentes para obtener el transcript
      let captionTracks: any[] | null = null;
      let baseUrl: string | null = null;

      // Método 1: ytInitialPlayerResponse (disponible en carga inicial)
      const ytInitialData = (window as any).ytInitialPlayerResponse;
      if (
        ytInitialData?.captions?.playerCaptionsTracklistRenderer?.captionTracks
      ) {
        captionTracks =
          ytInitialData.captions.playerCaptionsTracklistRenderer.captionTracks;
        console.log(
          "[LingText] Found caption tracks in ytInitialPlayerResponse"
        );
      }

      // Método 2: Buscar en el HTML de la página (más robusto)
      if (!captionTracks) {
        const html = document.documentElement.innerHTML;
        // Buscar el patrón de captionTracks en el HTML
        const captionMatch = html.match(
          /"captionTracks":\s*(\[[\s\S]*?\])(?=,")/
        );
        if (captionMatch) {
          try {
            captionTracks = JSON.parse(captionMatch[1]);
            console.log("[LingText] Found caption tracks in HTML");
          } catch (e) {
            console.log("[LingText] Failed to parse caption tracks from HTML");
          }
        }
      }

      // Método 3: Buscar baseUrl directamente en el HTML
      if (!baseUrl && !captionTracks) {
        const html = document.documentElement.innerHTML;
        // Buscar URLs de timedtext en el HTML
        const urlMatch = html.match(
          /https:\/\/www\.youtube\.com\/api\/timedtext[^"\\]+/
        );
        if (urlMatch) {
          baseUrl = urlMatch[0].replace(/\\u0026/g, "&");
          console.log("[LingText] Found timedtext URL directly in HTML");
        }
      }

      // Si tenemos captionTracks, extraer la URL
      if (captionTracks && captionTracks.length > 0) {
        // Preferir inglés (manual o autogenerado)
        // Aceptamos 'en', 'en-US', 'en-GB', etc. y también ASR
        const track =
          captionTracks.find(
            (t: any) =>
              (t.languageCode && t.languageCode.startsWith("en")) ||
              (t.vssId && t.vssId.includes(".en")) ||
              t.kind === "asr"
          ) || captionTracks[0];

        if (track?.baseUrl) {
          // Agregar fmt=json3 para obtener formato JSON con todos los datos
          baseUrl = track.baseUrl + "&fmt=json3";
          console.log(
            `[LingText] Using track: ${track.languageCode || "unknown"} (${track.kind || "standard"})`
          );
        }
      }

      // Si no tenemos URL, intentar construirla
      if (!baseUrl) {
        console.log("[LingText] No caption URL found, trying direct API");
        // Intentar la API directa (puede no funcionar para todos los videos)
        const timedtextUrl = `https://www.youtube.com/api/timedtext?v=${currentVideoId}&lang=en&fmt=srv3`;
        try {
          const response = await fetch(timedtextUrl);
          if (response.ok) {
            const xmlText = await response.text();
            if (xmlText.includes("<text")) {
              const cues = parseTranscriptXml(xmlText);
              if (cues.length > 0) {
                const mergedCues = mergeTranscriptCues(cues);
                console.log(
                  `[LingText] Loaded ${cues.length} cues (merged to ${mergedCues.length}) via direct API`
                );
                setState((prev) => ({
                  ...prev,
                  transcript: mergedCues,
                  useTranscript: true,
                }));
                return true;
              }
            }
          }
        } catch {}

        console.log("[LingText] No caption tracks found for this video");
        return false;
      }

      // Descargar el transcript
      console.log(
        "[LingText] Fetching transcript from:",
        baseUrl.substring(0, 100) + "..."
      );
      const response = await fetch(baseUrl);
      if (!response.ok) {
        console.log("[LingText] Failed to fetch transcript:", response.status);
        return false;
      }

      const xmlText = await response.text();
      console.log(
        "[LingText] Transcript response (first 500 chars):",
        xmlText.substring(0, 500)
      );

      const cues = parseTranscriptXml(xmlText);

      if (cues.length === 0) {
        console.log(
          "[LingText] No cues found in transcript XML. Trying JSON format..."
        );
        // Intentar parsear como JSON (formato srv3)
        try {
          const jsonData = JSON.parse(xmlText);
          if (jsonData.events) {
            const jsonCues: TranscriptCue[] = jsonData.events
              .filter((e: any) => e.segs && e.tStartMs !== undefined)
              .map((e: any) => ({
                start: e.tStartMs / 1000,
                duration: (e.dDurationMs || 2000) / 1000,
                text: e.segs
                  .map((s: any) => s.utf8)
                  .join("")
                  .trim(),
              }))
              .filter((c: TranscriptCue) => c.text.length > 0);

            if (jsonCues.length > 0) {
              const mergedCues = mergeTranscriptCues(jsonCues);
              console.log(
                `[LingText] ✓ Loaded ${jsonCues.length} cues (merged to ${mergedCues.length}) from JSON format`
              );
              setState((prev) => ({
                ...prev,
                transcript: mergedCues,
                useTranscript: true,
              }));
              return true;
            }
          }
        } catch {}
        return false;
      }

      const mergedCues = mergeTranscriptCues(cues);
      console.log(
        `[LingText] ✓ Loaded ${cues.length} cues (merged to ${mergedCues.length}) successfully`
      );
      setState((prev) => ({
        ...prev,
        transcript: mergedCues,
        useTranscript: true,
      }));
      return true;
    } catch (error) {
      console.error("[LingText] Error loading transcript:", error);
      return false;
    }
  };

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

  // Efecto para manejar la transición suave de subtítulos
  // Detecta si es una línea nueva o si el subtítulo está "creciendo" (autogenerado)
  useEffect(() => {
    if (state.currentSubtitle === state.displayedSubtitle) return;

    if (!state.currentSubtitle) {
      // Si no hay subtítulo, limpiar inmediatamente
      setState((prev) => ({
        ...prev,
        displayedSubtitle: "",
        isTransitioning: false,
      }));
      return;
    }

    // Detectar si el nuevo subtítulo es una extensión del anterior (autogenerado)
    // o si es una línea completamente nueva
    const isGrowing =
      state.currentSubtitle.startsWith(state.displayedSubtitle) ||
      state.displayedSubtitle.startsWith(state.currentSubtitle.slice(0, -20));

    // Si está creciendo (autogenerado añadiendo palabras), actualizar inmediatamente sin transición
    if (isGrowing && state.displayedSubtitle.length > 0) {
      setState((prev) => ({
        ...prev,
        displayedSubtitle: prev.currentSubtitle,
        isTransitioning: false,
      }));
      return;
    }

    // Es una línea nueva - aplicar transición suave
    // Limpiar timeout anterior
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // Iniciar transición de salida
    setState((prev) => ({ ...prev, isTransitioning: true }));

    // Después del delay, mostrar el nuevo subtítulo
    transitionTimeoutRef.current = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        displayedSubtitle: prev.currentSubtitle,
        isTransitioning: false,
      }));
    }, SUBTITLE_DELAY_MS);

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [state.currentSubtitle, state.displayedSubtitle]);

  // Sincronizar subtítulos con el tiempo del video (cuando usamos transcript)
  useEffect(() => {
    if (!state.useTranscript || state.transcript.length === 0) return;

    const video = document.querySelector("video");
    if (!video) return;

    let animationFrameId: number;
    let lastCueIndex = -1;

    const syncSubtitle = () => {
      const currentTime = video.currentTime;

      // Buscar el cue que corresponde al tiempo actual
      const cueIndex = state.transcript.findIndex(
        (cue) =>
          currentTime >= cue.start && currentTime < cue.start + cue.duration
      );

      if (cueIndex !== -1 && cueIndex !== lastCueIndex) {
        lastCueIndex = cueIndex;
        const cue = state.transcript[cueIndex];
        setState((prev) => ({ ...prev, currentSubtitle: cue.text }));
      } else if (cueIndex === -1 && lastCueIndex !== -1) {
        // No hay cue activo
        lastCueIndex = -1;
        setState((prev) => ({ ...prev, currentSubtitle: "" }));
      }

      animationFrameId = requestAnimationFrame(syncSubtitle);
    };

    syncSubtitle();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state.useTranscript, state.transcript]);

  // Observar cambios en los subtítulos de YouTube y posición del player
  // (fallback cuando no hay transcript disponible)
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

    // Solo observar DOM si no estamos usando transcript
    const observer = new MutationObserver(() => {
      // Siempre actualizar rect del player
      updatePlayerRect();

      // Solo leer subtítulos del DOM si no usamos transcript
      if (state.useTranscript) return;

      const captionWindow = document.querySelector(
        ".ytp-caption-window-container"
      );
      if (!captionWindow) return;

      const segments = captionWindow.querySelectorAll(".ytp-caption-segment");
      const text = Array.from(segments)
        .map((s) => s.textContent)
        .join(" ")
        .trim();

      // Solo actualizar si el texto cambió
      if (text !== subtitleBufferRef.current) {
        subtitleBufferRef.current = text;
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

    // Actualizar posición en resize y scroll
    window.addEventListener("resize", updatePlayerRect);
    window.addEventListener("scroll", updatePlayerRect);
    updatePlayerRect();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updatePlayerRect);
      window.removeEventListener("scroll", updatePlayerRect);
    };
  }, [state.useTranscript]);

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
      const result = await translateTerm(
        word,
        state.translator,
        state.apiKey || undefined
      );
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
    const result = await translateTerm(
      text,
      state.translator,
      state.apiKey || undefined
    );
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

  if (!state.enabled || !state.displayedSubtitle || !state.playerRect) {
    return null;
  }

  const { playerRect, isTransitioning } = state;

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
      <div
        className={`lingtext-container ${isTransitioning ? "lingtext-transitioning" : ""}`}
      >
        <SubtitleOverlay
          text={state.displayedSubtitle}
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
  width: 90%;
  text-align: center;
  pointer-events: auto;
  opacity: 1;
  transition: opacity 0.10s ease-in-out;
}
.lingtext-container.lingtext-transitioning {
  opacity: 0.8;
}
.lingtext-subtitle-overlay {
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  font-size: 28px;
  line-height: 1.5;
  font-family: "YouTube Noto", Roboto, Arial, sans-serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}
.lingtext-word {
  cursor: pointer;
  padding: 2px 4px;
  margin: 0 1px;
  border-radius: 4px;
  transition: all 0.1s ease;
  display: inline-block;
}
.lingtext-word:hover {
  background: rgba(59, 130, 246, 0.5);
  transform: scale(1.08);
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
