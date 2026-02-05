import React from "react";

import {
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
}

export default function ReaderText({
  content,
  unknownSet,
  phrases,
  onWordClick,
}: ReaderTextProps) {
  // Guard against undefined content
  if (!content) {
    return <ReaderEmptyState />;
  }

  return (
    <div className="relative">
      {/* Indicador de modo de lectura */}
      <ReaderModeIndicator />

      {/* Área de texto principal */}
      <ReaderContentShell>
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

      {/* Información del progreso */}
      <ReaderProgressFooter unknownCount={unknownSet.size} />
      <ReaderHelpFloatingLink />
    </div>
  );
}
