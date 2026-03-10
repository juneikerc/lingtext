import React from "react";
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
  // Lista de frases guardadas, cada una como lista de partes en lower
  phrases: string[][];
  onWordClick: (e: React.MouseEvent<HTMLSpanElement>) => void;
  showChrome?: boolean;
  compact?: boolean;
}

export default function ReaderText({
  content,
  unknownSet,
  phrases,
  onWordClick,
  showChrome = true,
  compact = false,
}: ReaderTextProps) {
  // Guard against undefined content
  if (!content) {
    return <ReaderEmptyState />;
  }

  return (
    <div className="relative">
      {showChrome ? <ReaderModeIndicator /> : null}

      {/* Área de texto principal */}
      <ReaderContentShell compact={compact}>
        {content.split("\n\n").map((paragraph, paragraphIndex) => (
          <p
            key={paragraphIndex}
            className={`mb-10 last:mb-0 ${paragraph.trim() === "" ? "h-6" : ""}`}
          >
            <ReaderWordTokens
              text={paragraph}
              unknownSet={unknownSet}
              phrases={phrases}
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
