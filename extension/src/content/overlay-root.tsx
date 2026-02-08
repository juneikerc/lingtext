import { useCallback, useEffect, useRef, useState } from "react";

import SelectionPopup from "@/components/SelectionPopup";
import SubtitleOverlay from "@/components/SubtitleOverlay";
import WordPopup from "@/components/WordPopup";
import type {
  ExtensionSettings,
  PhraseEntry,
  SubtitleCue,
  WordEntry,
  WordPopupState,
} from "@/types";
import { TRANSLATORS } from "@/types";
import { translateTerm } from "@/utils/translate";
import { normalizeWord, tokenize } from "@/utils/tokenize";

import { loadEnglishTranscript } from "./caption-track-loader";
import { stabilizeCues } from "./cue-stabilizer";
import { setNativeCcHidden } from "./native-cc";
import { getCurrentVideoId, watchPlayerRect, watchVideoId } from "./player-observer";
import { findCueIndexAtTime } from "./subtitle-engine";

interface OverlayRootProps {
  shadowRoot: ShadowRoot;
}

interface SelectionPopupState {
  x: number;
  y: number;
  text: string;
  translation: string;
}

const SUBTITLE_TRANSITION_MS = 80;

const defaultSettings: ExtensionSettings = {
  translator: TRANSLATORS.CHROME,
  apiKey: "",
  captionLanguage: "en",
  hideNativeCc: true,
};

export default function OverlayRoot({ shadowRoot }: OverlayRootProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [videoId, setVideoId] = useState<string | null>(getCurrentVideoId());
  const [playerRect, setPlayerRect] = useState<DOMRect | null>(null);
  const [settings, setSettings] = useState<ExtensionSettings>(defaultSettings);

  const [unknownSet, setUnknownSet] = useState<Set<string>>(new Set());
  const [phrases, setPhrases] = useState<string[][]>([]);

  const [transcriptCues, setTranscriptCues] = useState<SubtitleCue[]>([]);
  const [useTranscript, setUseTranscript] = useState(false);

  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [displayedSubtitle, setDisplayedSubtitle] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [popup, setPopup] = useState<WordPopupState | null>(null);
  const [selectionPopup, setSelectionPopup] = useState<SelectionPopupState | null>(null);

  useEffect(() => {
    const stopWatchingVideoId = watchVideoId((nextVideoId) => {
      setVideoId(nextVideoId);
      setCurrentSubtitle("");
      setDisplayedSubtitle("");
      setTranscriptCues([]);
      setUseTranscript(false);
      setPopup(null);
      setSelectionPopup(null);
    });

    const stopWatchingRect = watchPlayerRect((rect) => {
      setPlayerRect(rect);
    });

    return () => {
      stopWatchingVideoId();
      stopWatchingRect();
    };
  }, []);

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const [words, phrasesResult, settingsResult] = await Promise.all([
          chrome.runtime.sendMessage({ type: "LT2_GET_WORDS" }) as Promise<WordEntry[]>,
          chrome.runtime.sendMessage({ type: "LT2_GET_PHRASES" }) as Promise<PhraseEntry[]>,
          chrome.runtime.sendMessage({ type: "LT2_GET_SETTINGS" }) as Promise<ExtensionSettings>,
        ]);

        setUnknownSet(new Set(words.map((word) => word.wordLower)));
        setPhrases(phrasesResult.map((phrase) => phrase.parts));
        setSettings({ ...defaultSettings, ...settingsResult, captionLanguage: "en" });
      } catch (error) {
        console.error("[LingText] Failed to load extension data:", error);
      }
    };

    loadInitial().catch((error) => {
      console.error("[LingText] Failed initial content load:", error);
    });

    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      area: string
    ) => {
      if (area !== "local") {
        return;
      }

      if (changes.lt2_words) {
        const words = (changes.lt2_words.newValue as WordEntry[] | undefined) || [];
        setUnknownSet(new Set(words.map((word) => word.wordLower)));
      }

      if (changes.lt2_phrases) {
        const phraseEntries =
          (changes.lt2_phrases.newValue as PhraseEntry[] | undefined) || [];
        setPhrases(phraseEntries.map((entry) => entry.parts));
      }

      if (changes.lt2_settings) {
        const next =
          (changes.lt2_settings.newValue as ExtensionSettings | undefined) ||
          defaultSettings;
        setSettings({ ...defaultSettings, ...next, captionLanguage: "en" });
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  useEffect(() => {
    if (!videoId || window.location.pathname !== "/watch") {
      setTranscriptCues([]);
      setUseTranscript(false);
      return;
    }

    let cancelled = false;

    const run = async () => {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        const result = await loadEnglishTranscript(videoId);
        if (cancelled) {
          return;
        }

        if (result && result.cues.length > 0) {
          const stableCues = stabilizeCues(result.cues, {
            isAutoGenerated: result.isAutoGenerated,
          });

          setTranscriptCues(stableCues);
          setUseTranscript(stableCues.length > 0);
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 900));
      }

      if (!cancelled) {
        setTranscriptCues([]);
        setUseTranscript(false);
      }
    };

    run().catch((error) => {
      console.error("[LingText] Failed to load transcript:", error);
      if (!cancelled) {
        setTranscriptCues([]);
        setUseTranscript(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [videoId]);

  useEffect(() => {
    if (!useTranscript || transcriptCues.length === 0) {
      return;
    }

    const video = document.querySelector<HTMLVideoElement>("video");
    if (!video) {
      return;
    }

    let rafId = 0;
    let lastIndex = -1;

    const tick = () => {
      const index = findCueIndexAtTime(transcriptCues, video.currentTime);

      if (index !== -1 && index !== lastIndex) {
        lastIndex = index;
        setCurrentSubtitle(transcriptCues[index].text);
      } else if (index === -1 && lastIndex !== -1) {
        lastIndex = -1;
        setCurrentSubtitle("");
      }

      rafId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [useTranscript, transcriptCues]);

  useEffect(() => {
    if (useTranscript || window.location.pathname !== "/watch") {
      return;
    }

    let rafId: number | null = null;
    let cachedText = "";

    const updateFromDom = () => {
      if (rafId !== null) {
        return;
      }

      rafId = requestAnimationFrame(() => {
        rafId = null;

        const segments = document.querySelectorAll(
          ".ytp-caption-window-container .ytp-caption-segment"
        );

        const text = Array.from(segments)
          .map((segment) => segment.textContent || "")
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();

        if (text === cachedText) {
          return;
        }

        cachedText = text;
        setCurrentSubtitle(text);
      });
    };

    const target = document.querySelector("#movie_player");
    if (!target) {
      return;
    }

    const observer = new MutationObserver(updateFromDom);
    observer.observe(target, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    updateFromDom();

    return () => {
      observer.disconnect();
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [useTranscript]);

  useEffect(() => {
    if (currentSubtitle === displayedSubtitle) {
      return;
    }

    if (!currentSubtitle) {
      setDisplayedSubtitle("");
      setIsTransitioning(false);
      return;
    }

    const prev = displayedSubtitle.trim().toLowerCase();
    const next = currentSubtitle.trim().toLowerCase();
    const isGrowth = prev.length > 0 && next.startsWith(prev);

    if (isGrowth) {
      setDisplayedSubtitle(currentSubtitle);
      setIsTransitioning(false);
      return;
    }

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    setIsTransitioning(true);

    transitionTimeoutRef.current = setTimeout(() => {
      setDisplayedSubtitle(currentSubtitle);
      setIsTransitioning(false);
    }, SUBTITLE_TRANSITION_MS);

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [currentSubtitle, displayedSubtitle]);

  useEffect(() => {
    const shouldHide =
      settings.hideNativeCc &&
      window.location.pathname === "/watch" &&
      Boolean(displayedSubtitle);

    setNativeCcHidden(shouldHide);

    return () => {
      setNativeCcHidden(false);
    };
  }, [settings.hideNativeCc, displayedSubtitle]);

  const handleWordClick = useCallback(
    async (word: string, lower: string, x: number, y: number) => {
      try {
        const existing = (await chrome.runtime.sendMessage({
          type: "LT2_GET_WORD",
          payload: lower,
        })) as WordEntry | null;

        if (existing) {
          setPopup({ x, y, word, lower, translation: existing.translation });
          return;
        }

        const translated = await translateTerm(
          word,
          settings.translator,
          settings.apiKey || undefined
        );

        setPopup({
          x,
          y,
          word,
          lower,
          translation: translated.translation || "...",
        });
      } catch (error) {
        console.error("[LingText] Failed to open word popup:", error);
      }
    },
    [settings]
  );

  const handleSpeak = useCallback((word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  }, []);

  const handleMarkKnown = useCallback(async (lower: string) => {
    await chrome.runtime.sendMessage({ type: "LT2_DELETE_WORD", payload: lower });

    setUnknownSet((prev) => {
      const next = new Set(prev);
      next.delete(lower);
      return next;
    });

    setPopup(null);
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

      await chrome.runtime.sendMessage({ type: "LT2_PUT_WORD", payload: entry });

      setUnknownSet((prev) => {
        const next = new Set(prev);
        next.add(lower);
        return next;
      });

      setPopup(null);
    },
    []
  );

  const closePopups = useCallback(() => {
    setPopup(null);
    setSelectionPopup(null);
  }, []);

  const handleMouseUp = useCallback(async () => {
    // @ts-expect-error ShadowRoot.getSelection is not typed in lib.dom.
    const selection = shadowRoot.getSelection?.() || document.getSelection();
    if (!selection || selection.isCollapsed) {
      return;
    }

    let range: Range;
    try {
      range = selection.getRangeAt(0);
    } catch {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const text = selection.toString().trim();
    if (!text || text.length < 3) {
      return;
    }

    const words = text
      .split(/\s+/)
      .map((part: string) => part.trim())
      .filter(Boolean);

    if (words.length < 2) {
      return;
    }

    const result = await translateTerm(
      text,
      settings.translator,
      settings.apiKey || undefined
    );

    const rect = range.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    setSelectionPopup({
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top - containerRect.top,
      text,
      translation: result.translation || "...",
    });

    setPopup(null);
    selection.removeAllRanges();
  }, [settings.apiKey, settings.translator, shadowRoot]);

  const handleSavePhrase = useCallback(async (text: string, translation: string) => {
    const parts = tokenize(text)
      .filter((token) => token.isWord)
      .map((token) => token.lower || normalizeWord(token.text))
      .filter(Boolean);

    if (parts.length < 2) {
      return;
    }

    const entry: PhraseEntry = {
      phrase: text,
      phraseLower: parts.join(" "),
      translation,
      parts,
      addedAt: Date.now(),
    };

    await chrome.runtime.sendMessage({ type: "LT2_PUT_PHRASE", payload: entry });
    setPhrases((prev) => [...prev, parts]);
    setSelectionPopup(null);
  }, []);

  if (window.location.pathname !== "/watch") {
    return null;
  }

  if (!playerRect || !displayedSubtitle) {
    return null;
  }

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
      <div className={`lingtext-container ${isTransitioning ? "lingtext-transitioning" : ""}`}>
        <SubtitleOverlay
          text={displayedSubtitle}
          unknownSet={unknownSet}
          phrases={phrases}
          onWordClick={handleWordClick}
        />
      </div>

      {popup && (
        <WordPopup
          popup={popup}
          isUnknown={unknownSet.has(popup.lower)}
          onSpeak={handleSpeak}
          onMarkKnown={handleMarkKnown}
          onMarkUnknown={handleMarkUnknown}
          onClose={closePopups}
        />
      )}

      {selectionPopup && (
        <SelectionPopup
          popup={selectionPopup}
          onSave={handleSavePhrase}
          onClose={closePopups}
        />
      )}
    </div>
  );
}
