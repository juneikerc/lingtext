import { Link } from "react-router";

import {
  formatTimeUntilReview,
  isWordReadyForReview,
} from "~/utils/spaced-repetition";
import type { WordEntry } from "~/types";

import {
  getTranslationSections,
  getWordState,
  VISIBLE_ITEMS_STEP,
} from "./utils";

interface StudyLibraryListProps {
  words: WordEntry[];
  visibleWords: WordEntry[];
  visibleCount: number;
  selectedInViewCount: number;
  selectedWords: Set<string>;
  hasMoreItems: boolean;
  onToggleWordSelection: (wordLower: string) => void;
  onPlayAudio: (word: string) => void;
  onDeleteWord: (word: WordEntry) => void;
  onLoadMore: () => void;
  onClearSearch: () => void;
  onResetView: () => void;
}

export function StudyLibraryList({
  words,
  visibleWords,
  visibleCount,
  selectedInViewCount,
  selectedWords,
  hasMoreItems,
  onToggleWordSelection,
  onPlayAudio,
  onDeleteWord,
  onLoadMore,
  onClearSearch,
  onResetView,
}: StudyLibraryListProps) {
  if (words.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <div className="mb-3 text-4xl">🔎</div>
        <h2 className="mb-2 text-xl font-bold text-gray-900">
          No hay resultados para esta vista
        </h2>
        <p className="mb-6 text-gray-600">
          Prueba otra vista, limpia la busqueda o cambia el orden para encontrar
          lo que buscas.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onClearSearch}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
          >
            Limpiar busqueda
          </button>
          <button
            type="button"
            onClick={onResetView}
            className="rounded-lg bg-[#0F9EDA] px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#0D8EC4]"
          >
            Volver a All
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-gray-200 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-bold text-gray-900">Biblioteca activa</h3>
          <p className="text-sm text-gray-500">
            Mostrando {visibleCount} de {words.length} · {selectedInViewCount}{" "}
            seleccionadas en esta vista
          </p>
        </div>
        <div className="text-xs text-gray-500">
          Render incremental para listas largas
        </div>
      </div>

      <div className="divide-y divide-gray-200/70">
        {visibleWords.map((word) => {
          const now = Date.now();
          const translationSections = getTranslationSections(word.translation);
          const wordState = getWordState(word, now);

          return (
            <div
              key={word.wordLower}
              className={`p-5 transition-colors duration-200 ${
                selectedWords.has(word.wordLower)
                  ? "bg-[#0F9EDA]/5]/10"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 flex-1 gap-4">
                  <input
                    type="checkbox"
                    checked={selectedWords.has(word.wordLower)}
                    onChange={() => onToggleWordSelection(word.wordLower)}
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-[#0F9EDA] focus:ring-[#0F9EDA] focus:ring-offset-2"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h4 className="text-lg font-bold text-gray-900">
                        {word.word}
                      </h4>
                      {word.isPhrase ? (
                        <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-700">
                          Phrase
                        </span>
                      ) : null}
                      {wordState === "due" ? (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                          Due
                        </span>
                      ) : null}
                      {wordState === "new" ? (
                        <span className="rounded-full bg-[#0F9EDA]/5 px-2.5 py-1 text-xs font-medium text-[#0A7AAB]]/10]">
                          New
                        </span>
                      ) : null}
                      {wordState === "scheduled" ? (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          Scheduled
                        </span>
                      ) : null}
                    </div>

                    {translationSections ? (
                      <div className="mb-3 space-y-2">
                        {translationSections.map((section) => (
                          <div key={section.category}>
                            <p className="text-sm font-semibold text-gray-600">
                              {section.category}
                            </p>
                            <p className="text-gray-900">{section.text}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mb-3 text-gray-600">{word.translation}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      <span>
                        Guardada {new Date(word.addedAt).toLocaleDateString()}
                      </span>
                      {word.srData ? (
                        <span>
                          Proximo:{" "}
                          {formatTimeUntilReview(word.srData.nextReview)}
                        </span>
                      ) : (
                        <span>Lista para primera pasada</span>
                      )}
                      {isWordReadyForReview(word) && word.srData ? (
                        <span className="font-medium text-amber-600">
                          Repaso pendiente
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  <button
                    type="button"
                    onClick={() => void onPlayAudio(word.word)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    🔊 Escuchar
                  </button>
                  {wordState === "due" || wordState === "new" ? (
                    <Link
                      to={`/review?mode=${wordState}&word=${encodeURIComponent(word.wordLower)}`}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      Abrir review
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => void onDeleteWord(word)}
                    className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors duration-200 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    🗑 Eliminar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {hasMoreItems ? (
        <div className="border-t border-gray-200 px-6 py-4 text-center">
          <button
            type="button"
            onClick={onLoadMore}
            className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Cargar {Math.min(VISIBLE_ITEMS_STEP, words.length - visibleCount)}{" "}
            mas
          </button>
        </div>
      ) : null}
    </div>
  );
}
