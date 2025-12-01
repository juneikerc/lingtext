import { useEffect } from "react";
import { getSettings } from "~/services/db";
import type { WordEntry } from "~/types";
import { speak } from "~/utils/tts";
import { isTranslationJson } from "~/helpers/isTranslationJson";
interface CardProps {
  word: WordEntry;
  showTranslation: boolean;
  setShowTranslation: (showTranslation: boolean) => void;
  handleAnswer: (remembered: boolean) => void;
  processing: boolean;
}

export default function Card({
  word,
  showTranslation,
  setShowTranslation,
  handleAnswer,
  processing,
}: CardProps) {
  useEffect(() => {
    playAudio();
  }, [word]);

  const playAudio = async () => {
    if (!word) return;
    const settings = await getSettings();
    await speak(word.word, settings.tts);
  };

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg overflow-hidden">
      {/* Palabra */}
      <div className="p-8 text-center border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            {word.word}
          </h2>
          <button
            onClick={playAudio}
            className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            title="Escuchar pronunciación"
          >
            <span className="text-xl">🔊</span>
          </button>
        </div>

        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
            <span>Agregada: {new Date(word.addedAt).toLocaleDateString()}</span>
          </span>
        </div>
      </div>

      {/* Área de respuesta */}
      <div className="p-8">
        {showTranslation ? (
          <div className="space-y-6">
            {/* Respuesta correcta */}
            <div className="text-center">
              <div className="inline-flex items-center px-6 py-2 mb-4 text-lg font-medium text-gray-700 bg-gray-100/80 dark:bg-gray-700/80 dark:text-gray-300 rounded-full border border-gray-200/50 dark:border-gray-600/50">
                {isTranslationJson(word.translation) ? (
                  <div className="space-y-2">
                    {(() => {
                      const parsed = JSON.parse(word.translation);
                      return Object.entries(parsed.info).map(
                        ([category, translations]) => (
                          <div key={category}>
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                              {category}
                            </p>
                            <p className="text-gray-900 dark:text-gray-100">
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

            {/* Botones de confirmación */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800/40 border border-green-200 dark:border-green-800/50 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
              >
                <span>✅</span>
                <span>La recordaba</span>
              </button>
              <button
                onClick={() => handleAnswer(false)}
                disabled={processing}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/40 border border-red-200 dark:border-red-800/50 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md disabled:opacity-50"
              >
                <span>❌</span>
                <span>No la recordaba</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <button
                onClick={() => setShowTranslation(true)}
                className="flex items-center justify-center space-x-3 px-8 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
              >
                <span>👁️</span>
                <span>Show Translation</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
