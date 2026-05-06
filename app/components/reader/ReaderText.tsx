import React, { memo, useMemo } from "react";

import type { ReaderPhraseIndex } from "./ReaderLexiconContext";

import LibraryBanner, {
  ReaderContentShell,
  ReaderEmptyState,
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
  contentFooter?: React.ReactNode;
}

function ReaderText({
  content,
  unknownSet,
  phraseIndex,
  onWordClick,
  showChrome = true,
  compact = false,
  contentFooter,
}: ReaderTextProps) {
  const paragraphs = useMemo(() => content.split("\n\n"), [content]);

  if (!content) {
    return <ReaderEmptyState />;
  }

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
        {contentFooter ? (
          <div className="mt-10 border-t border-gray-200 pt-6">
            {contentFooter}
          </div>
        ) : null}
      </ReaderContentShell>

      {showChrome ? <LibraryBanner /> : null}

      {showChrome ? (
        <ReaderProgressFooter unknownCount={unknownSet.size} />
      ) : null}
    </div>
  );
}

const MemoizedReaderText = memo(ReaderText);

MemoizedReaderText.displayName = "ReaderText";

export default MemoizedReaderText;
