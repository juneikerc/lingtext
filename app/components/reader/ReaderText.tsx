import React from "react";
import { normalizeWord, tokenize } from "../../utils/tokenize";

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
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No hay contenido para mostrar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Indicador de modo de lectura */}
      <div className="absolute -top-6 left-0 right-0 flex justify-center">
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 rounded-full px-4 py-2 text-sm text-blue-700 dark:text-blue-300 font-medium flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Haz clic en cualquier palabra para traducirla</span>
        </div>
      </div>

      {/* Área de texto principal */}
      <div
        id="reader-text"
        className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12 py-8 leading-relaxed text-lg sm:text-xl select-text bg-gradient-to-b from-transparent via-white/50 to-transparent"
      >
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8 md:p-12">
          {content.split("\n\n").map((paragraph, paragraphIndex) => (
            <p
              key={paragraphIndex}
              className={`mb-10 last:mb-0 ${
                paragraph.trim() === "" ? "h-6" : ""
              }`}
            >
              {(() => {
                const tokens = tokenize(paragraph);
                // Marca tokens que pertenecen a alguna frase guardada cuando aparecen contiguamente
                const isPhraseToken: boolean[] = new Array(tokens.length).fill(
                  false
                );

                const tryMatch = (
                  startIdx: number,
                  parts: string[]
                ): number[] | null => {
                  const indices: number[] = [];
                  let p = 0;
                  let j = startIdx;
                  while (j < tokens.length && p < parts.length) {
                    if (!tokens[j].isWord) {
                      j++;
                      continue;
                    }
                    const low =
                      tokens[j].lower || normalizeWord(tokens[j].text);
                    if (low !== parts[p]) return null;
                    indices.push(j);
                    p++;
                    j++;
                  }
                  return p === parts.length ? indices : null;
                };

                for (let i = 0; i < tokens.length; i++) {
                  if (!tokens[i].isWord) continue;
                  for (const parts of phrases) {
                    if (parts.length < 2) continue;
                    const startLow =
                      tokens[i].lower || normalizeWord(tokens[i].text);
                    if (startLow !== parts[0]) continue;
                    const matchIdxs = tryMatch(i, parts);
                    if (matchIdxs) {
                      for (const idx of matchIdxs) isPhraseToken[idx] = true;
                    }
                  }
                }

                return tokens.map((t, tokenIndex) => {
                  if (!t.isWord) {
                    return (
                      <span key={`${paragraphIndex}-${tokenIndex}`}>
                        {t.text}
                      </span>
                    );
                  }
                  const low = t.lower || normalizeWord(t.text);
                  const isUnknown = unknownSet.has(low);
                  const isPhrasePart = isPhraseToken[tokenIndex] === true;
                  return (
                    <span
                      key={`${paragraphIndex}-${tokenIndex}`}
                      className={`word-token relative inline-block px-1 py-0.5 mx-0.5 rounded-lg cursor-pointer transition-all duration-200 group ${
                        isUnknown
                          ? "bg-yellow-200 dark:bg-yellow-700/40 text-yellow-900 dark:text-yellow-100 font-semibold shadow-lg border border-yellow-300 dark:border-yellow-600"
                          : "hover:bg-blue-100 dark:hover:bg-blue-800/50 hover:text-blue-900 dark:hover:text-blue-100 hover:shadow-md"
                      } ${isPhrasePart ? "underline decoration-green-500 decoration-2 underline-offset-4" : ""}`}
                      data-lower={low}
                      data-word={t.text}
                      data-phrase-part={isPhrasePart ? "true" : undefined}
                      onClick={onWordClick}
                    >
                      {t.text}
                      {!isUnknown && (
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                          Clic para traducir
                          <span className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></span>
                        </span>
                      )}
                      {isUnknown && (
                        <span className="absolute -top-2 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></span>
                      )}
                    </span>
                  );
                });
              })()}
            </p>
          ))}
        </div>
      </div>

      {/* Información del progreso */}
      <div className="absolute -bottom-16 left-0 right-0 flex justify-center">
        <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-6 py-3 text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Palabras conocidas</span>
          </div>
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            <span>Palabras por aprender ({unknownSet.size})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
