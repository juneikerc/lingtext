import React, { memo, useMemo } from "react";

import type { ReaderPhraseIndex } from "./ReaderLexiconContext";

import LibraryBanner, {
  ReaderContentShell,
  ReaderEmptyState,
  ReaderHelpFloatingLink,
  ReaderModeIndicator,
  ReaderProgressFooter,
} from "./ReaderLayout";
import ReaderWordTokens from "./ReaderWordTokens";

interface ReaderTextProps {
  content: string;
  unknownSet: Set<string>;
  phraseIndex: ReaderPhraseIndex;
  onWordClick: (e: React.MouseEvent<HTMLSpanElement>) => void;
  showChrome?: boolean;
  compact?: boolean;
}

function ReaderText({
  content,
  unknownSet,
  phraseIndex,
  onWordClick,
  showChrome = true,
  compact = false,
}: ReaderTextProps) {
  // Guard against undefined content
  if (!content) {
    return <ReaderEmptyState />;
  }

  const paragraphs = useMemo(() => content.split("\n\n"), [content]);

  return (
    <div className="relative">
      {showChrome ? <ReaderModeIndicator /> : null}

      {/* Área de texto principal */}
      <ReaderContentShell compact={compact}>
        {paragraphs.map((paragraph, paragraphIndex) => (
          <p
            key={paragraphIndex}
            className={`mb-10 last:mb-0 ${paragraph.trim() === "" ? "h-6" : ""}`}
          >
            <ReaderWordTokens
              text={paragraph}
              unknownSet={unknownSet}
              phraseIndex={phraseIndex}
              onWordClick={onWordClick}
              keyPrefix={`p-${paragraphIndex}`}
            />
          </p>
        ))}
      </ReaderContentShell>

      {showChrome ? <LibraryBanner /> : null}

      {showChrome ? (
        <ReaderProgressFooter unknownCount={unknownSet.size} />
      ) : null}
      {showChrome ? <ReaderHelpFloatingLink /> : null}
    </div>
  );
}

const MemoizedReaderText = memo(ReaderText);

MemoizedReaderText.displayName = "ReaderText";

export default MemoizedReaderText;
