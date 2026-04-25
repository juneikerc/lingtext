import { useRef } from "react";

import type { AudioRef } from "../types";
import { useTranslatorStore } from "~/context/translatorSelector";
import { useReadingProgress } from "~/hooks/useReadingProgress";

import AudioSection from "./reader/AudioSection";
import MarkdownReaderText from "./reader/MarkdownReaderText";
import ReaderText from "./reader/ReaderText";
import ReadingProgressBar from "./reader/ReadingProgressBar";
import ReadingShareCard from "./reader/ReadingShareCard";
import SelectionPopup from "./reader/SelectionPopup";
import WordPopup from "./reader/WordPopup";
import { useReaderLexicon } from "./reader/ReaderLexiconContext";
import { useReaderPreferences } from "./reader/ReaderPreferencesContext";
import { getReaderAppearanceStyles } from "./reader/preferences";
import { useReaderAudio } from "./reader/useReaderAudio";
import { useReaderInteractions } from "./reader/useReaderInteractions";

interface Props {
  text: {
    id: string;
    title: string;
    content: string;
    format?: "txt" | "markdown";
    audioRef?: AudioRef | null;
    audioUrl?: string | null;
  };
  variant?: "default" | "compact";
  showAudioSection?: boolean;
}

export default function Reader({
  text,
  variant = "default",
  showAudioSection = true,
}: Props) {
  const { selected } = useTranslatorStore();
  const { preferences } = useReaderPreferences();
  const {
    markKnownWord,
    markUnknownWord,
    phraseIndex,
    savePhraseEntry,
    unknownSet,
  } = useReaderLexicon();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isCompact = variant === "compact";
  const appearanceStyles = getReaderAppearanceStyles(preferences, isCompact);
  const { progress, hasReachedThreshold } = useReadingProgress({
    containerRef,
    threshold: 95,
  });
  const {
    audioUrl,
    audioAccessError,
    isLocalFile,
    fileSize,
    reauthorizeAudio,
  } = useReaderAudio(text);
  const {
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
  } = useReaderInteractions({
    selected,
    containerRef,
    markKnownWord,
    markUnknownWord,
    savePhraseEntry,
  });

  const readerContent =
    text.format === "markdown" ? (
      <MarkdownReaderText
        content={text.content}
        unknownSet={unknownSet}
        phraseIndex={phraseIndex}
        onWordClick={onWordClick}
        showChrome={!isCompact}
        compact={isCompact}
      />
    ) : (
      <ReaderText
        content={text.content}
        unknownSet={unknownSet}
        phraseIndex={phraseIndex}
        onWordClick={onWordClick}
        showChrome={!isCompact}
        compact={isCompact}
      />
    );

  return (
    <div
      className={
        isCompact
          ? "relative flex flex-col bg-transparent pb-2"
          : "relative flex flex-col flex-1 pb-[calc(12rem+env(safe-area-inset-bottom))] sm:pb-40 md:pb-36 transition-colors duration-200"
      }
      style={
        isCompact
          ? undefined
          : { backgroundColor: "var(--reader-page-bg)", ...appearanceStyles }
      }
      ref={containerRef}
      onMouseUp={(event) => void handleMouseUp(event)}
      onCopy={onCopy}
      onClick={(event) => {
        const target = event.target as HTMLElement;
        const selection = window.getSelection();
        if (
          !target.closest(".word-token") &&
          (!selection || selection.isCollapsed)
        ) {
          clearPopups();
        }
      }}
    >
      {!isCompact && <ReadingProgressBar progress={progress} show />}

      {readerContent}

      {!isCompact ? (
        <div className="lg:hidden mx-4 mb-6">
          <div className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-5">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-indigo-100/60 blur-2xl" />
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 border border-indigo-200 mb-4">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="h-5 w-5 text-indigo-600"
                  aria-hidden="true"
                >
                  <path
                    d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900">
                LingText PRO está en camino
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                Diccionario/traductor con IA preciso, textos exclusivos con
                sonido, importación de artículos, de YouTube a lecciones.
                Entérate antes que nadie.
              </p>
              <a
                href="/pro"
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
              >
                Únete a la lista de espera
              </a>
            </div>
          </div>
        </div>
      ) : null}

      {popup ? (
        <WordPopup
          popup={popup}
          isUnknown={unknownSet.has(popup.lower)}
          onSpeak={onSpeak}
          onMarkKnown={markKnown}
          onMarkUnknown={markUnknown}
          onClose={() => setPopup(null)}
        />
      ) : null}

      {selPopup ? (
        <SelectionPopup
          selPopup={selPopup}
          onSpeak={onSpeak}
          onClose={() => setSelPopup(null)}
          onSavePhrase={onSavePhrase}
        />
      ) : null}

      {showAudioSection ? (
        <AudioSection
          alignmentRef={containerRef}
          show={Boolean(text.audioRef || text.audioUrl)}
          src={audioUrl ?? text.audioUrl ?? undefined}
          showReauthorize={Boolean(
            text.audioRef?.type === "file" && audioAccessError
          )}
          onReauthorize={reauthorizeAudio}
          isLocalFile={isLocalFile}
          fileSize={fileSize}
        />
      ) : null}

      {hasReachedThreshold && !isCompact ? (
        <div className="hidden lg:block">
          <ReadingShareCard
            visible={hasReachedThreshold}
            textTitle={text.title}
          />
        </div>
      ) : null}
    </div>
  );
}
