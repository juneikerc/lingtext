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
      style={{
        ...appearanceStyles,
        ...(isCompact ? {} : { backgroundColor: "var(--reader-page-bg)" }),
      }}
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

          <div className="mt-5 border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-900 mb-3">
              ¿Tienes dudas? Únete a la comunidad
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="https://www.facebook.com/groups/1199904721807372/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-[#1877F2]/20 bg-[#1877F2]/5 px-3 py-2.5 text-sm font-medium text-[#1877F2] transition-colors duration-200 hover:bg-[#1877F2]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1877F2] focus-visible:ring-offset-2"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
                Grupo de Facebook
              </a>
              <a
                href="https://www.facebook.com/lingtext/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-[#1877F2]/20 bg-[#1877F2]/5 px-3 py-2.5 text-sm font-medium text-[#1877F2] transition-colors duration-200 hover:bg-[#1877F2]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1877F2] focus-visible:ring-offset-2"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
                Página de Facebook
              </a>
              <a
                href="https://www.instagram.com/lingtext1/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-[#E4405F]/20 bg-[#E4405F]/5 px-3 py-2.5 text-sm font-medium text-[#E4405F] transition-colors duration-200 hover:bg-[#E4405F]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E4405F] focus-visible:ring-offset-2"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
                Instagram
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
