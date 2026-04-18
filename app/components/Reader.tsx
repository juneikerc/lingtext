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
          : "relative flex flex-col flex-1 pb-40 sm:pb-32 transition-colors duration-200"
      }
      style={
        isCompact
          ? undefined
          : { backgroundColor: "var(--reader-page-bg)", ...appearanceStyles }
      }
      ref={containerRef}
      onMouseUp={() => void handleMouseUp()}
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
        <ReadingShareCard
          visible={hasReachedThreshold}
          textTitle={text.title}
        />
      ) : null}
    </div>
  );
}
