import { Suspense, lazy, useCallback, useMemo } from "react";
import { Link } from "react-router";

import ReaderHeader from "~/components/reader/ReaderHeader";
import { ReaderLexiconProvider } from "~/components/reader/ReaderLexiconContext";
import { ReaderPreferencesProvider } from "~/components/reader/ReaderPreferencesContext";
import { getLanguageIsland, getSettings } from "~/services/db";
import { splitIslandSentences } from "~/utils/language-island";
import { speak } from "~/utils/tts";

import type { Route } from "./+types/island";

const Reader = lazy(() => import("~/components/Reader"));

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData?.island) {
    return [
      { title: "Isla no encontrada | LingText" },
      { name: "robots", content: "noindex" },
    ];
  }

  return [
    { title: `${loaderData.island.title} | Language Island | LingText` },
    {
      name: "description",
      content:
        "Practica inglés por oraciones con traducción y audio en LingText.",
    },
    { name: "robots", content: "noindex" },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const island = await getLanguageIsland(params.id);
  document.title = island?.title || "Isla no encontrada";
  return { island: island ?? null };
}

export default function LanguageIslandDetailPage({
  loaderData,
}: Route.ComponentProps) {
  const { island } = loaderData;

  const sentences = useMemo(() => {
    if (!island) return [];
    return splitIslandSentences(island.sentencesText);
  }, [island]);

  const onSpeakSentence = useCallback(async (sentence: string) => {
    const settings = await getSettings();
    await speak(sentence, settings.tts);
  }, []);

  if (!island) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Isla no encontrada
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            Esta isla no existe o fue eliminada.
          </p>
          <Link
            to="/aprender-con-language-island"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#0F9EDA] px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#0D8EC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Volver a language island
          </Link>
        </div>
      </main>
    );
  }

  return (
    <ReaderPreferencesProvider>
      <ReaderLexiconProvider>
        <main className="min-h-screen bg-gray-50">
          <ReaderHeader title={island.title} />

          <section className="mx-auto mt-6 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                Práctica por oraciones
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Haz clic en palabras para traducir in-line. Cada oración tiene
                su botón de audio para practicar pronunciación y ritmo.
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Total de oraciones: {sentences.length}
              </p>
            </div>
          </section>

          <section className="mx-auto mt-4 w-full max-w-6xl space-y-4 px-4 pb-10 sm:px-6 lg:px-8">
            <Suspense
              fallback={
                <div className="space-y-4">
                  {sentences.slice(0, 3).map((_, index) => (
                    <div
                      key={`island-skeleton-${index}`}
                      className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                      <div className="mt-3 h-4 w-[88%] animate-pulse rounded bg-gray-200" />
                    </div>
                  ))}
                </div>
              }
            >
              {sentences.length > 0 ? (
                sentences.map((sentence, index) => (
                  <article
                    key={`${island.id}-sentence-${index}`}
                    className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm"
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="min-w-0 flex-1">
                        <Reader
                          text={{
                            id: `${island.id}-sentence-${index}`,
                            title: `${island.title} - oración ${index + 1}`,
                            content: sentence,
                            format: "txt",
                          }}
                          variant="compact"
                          showAudioSection={false}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => void onSpeakSentence(sentence)}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0F9EDA] text-lg text-white transition-colors duration-200 hover:bg-[#0D8EC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                        aria-label={`Reproducir oración ${index + 1}`}
                        title={`Audio oración ${index + 1}`}
                      >
                        🔊
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                  Esta isla no tiene oraciones válidas para mostrar.
                </div>
              )}
            </Suspense>
          </section>
        </main>
      </ReaderLexiconProvider>
    </ReaderPreferencesProvider>
  );
}
