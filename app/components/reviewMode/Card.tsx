import { useEffect } from "react";
import { getSettings } from "~/services/db";
import type { WordEntry } from "~/types";
import type { ReviewGrade } from "~/utils/spaced-repetition";
import { speak } from "~/utils/tts";
import { isTranslationJson } from "~/helpers/isTranslationJson";

interface CardProps {
  word: WordEntry;
  showTranslation: boolean;
  setShowTranslation: (showTranslation: boolean) => void;
  handleAnswer: (grade: ReviewGrade) => void;
  answerOptions: Array<{
    id: ReviewGrade;
    label: string;
    shortLabel: string;
    quality: number;
    intervalLabel: string;
  }>;
  processing: boolean;
}

const BUTTON_STYLES: Record<ReviewGrade, string> = {
  again:
    "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  hard: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  good: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  easy: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
};

export default function Card({
  word,
  showTranslation,
  setShowTranslation,
  handleAnswer,
  answerOptions,
  processing,
}: CardProps) {
  useEffect(() => {
    void playAudio();
  }, [word]);

  const playAudio = async () => {
    if (!word) return;
    const settings = await getSettings();
    await speak(word.word, settings.tts);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-8 text-center">
        <div className="mb-4 flex items-center justify-center space-x-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {word.word}
          </h2>
          <button
            onClick={() => void playAudio()}
            className="rounded-lg bg-gray-100 p-3 text-gray-600 transition-colors duration-200 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            title="Escuchar pronunciación"
          >
            <span className="text-xl">🔊</span>
          </button>
        </div>

        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
            <span>Agregada: {new Date(word.addedAt).toLocaleDateString()}</span>
          </span>
        </div>
      </div>

      <div className="p-8">
        {showTranslation ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex max-w-full items-center px-6 py-3 text-lg font-medium text-gray-700 bg-gray-100 rounded-2xl border border-gray-200">
                {isTranslationJson(word.translation) ? (
                  <div className="space-y-2">
                    {(() => {
                      const parsed = JSON.parse(word.translation);
                      return Object.entries(parsed.info).map(
                        ([category, translations]) => (
                          <div key={category}>
                            <p className="text-sm font-semibold text-gray-600">
                              {category}
                            </p>
                            <p className="text-gray-900">
                              {(translations as string[]).join(", ")}
                            </p>
                          </div>
                        )
                      );
                    })()}
                  </div>
                ) : (
                  <span>{word.translation}</span>
                )}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              {answerOptions.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => void handleAnswer(option.id)}
                  disabled={processing}
                  className={`rounded-xl border px-4 py-4 text-left transition-colors duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${BUTTON_STYLES[option.id]}`}
                >
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wider opacity-75">
                    {index + 1}
                  </div>
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-sm opacity-80">{option.shortLabel}</div>
                  <div className="mt-2 text-sm font-medium">
                    {option.intervalLabel}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <button
                onClick={() => setShowTranslation(true)}
                className="flex items-center justify-center space-x-3 px-8 py-4 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <span>👁️</span>
                <span>Mostrar respuesta</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
