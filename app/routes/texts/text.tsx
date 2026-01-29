import { getText } from "~/services/db";
import type { Route } from "./+types/text";
import { Suspense, lazy, useEffect, useState } from "react";
import type { AudioRef } from "~/types";
import ReaderHeader from "~/components/reader/ReaderHeader";
import ReaderSkeleton from "~/components/reader/ReaderSkeleton";
import ReaderErrorBoundary from "~/components/ReaderErrorBoundary";
import { allTexts } from "~/lib/content/runtime";
import { formatSlug } from "~/helpers/formatSlug";
import { type TextCollection, type TextItem } from "~/types";
import { formatAudioRef } from "~/utils/format-audio-ref";

const Reader = lazy(() => import("~/components/Reader"));

export function meta() {
  return [
    {
      name: "robots",
      content: "noindex",
    },
  ];
}

export async function clientLoader({
  params,
  request,
}: Route.ClientLoaderArgs) {
  const queryParams = new URL(request.url).searchParams;
  if (queryParams.get("source")) {
    if (queryParams.get("source") === "collection") {
      const text = allTexts.find(
        (_text: TextCollection) => formatSlug(_text.title) === params.id
      );

      return {
        id: formatSlug(text.title),
        title: text.title,
        content: text.content,
        format: "markdown",
        createdAt: Date.now(),
        ...(text.sound && { audioUrl: text.sound }),
      } as TextItem;
    }
  }

  const id = params.id;
  const text = await getText(id);

  document.title = text?.title || "Sin título";

  const audioUrl = await formatAudioRef(text?.audioRef as AudioRef | null);

  return {
    id: text?.id,
    title: text?.title,
    content: text?.content,
    format: text?.format || "txt",
    createdAt: text?.createdAt,
    audioRef: text?.audioRef,
    audioUrl,
  } as TextItem;
}

export default function Text({ loaderData }: Route.ComponentProps) {
  const text = loaderData;
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storageKey = "lingtext_texts_welcome_modal_v1";
    const hasSeenModal = window.localStorage.getItem(storageKey);

    if (!hasSeenModal) {
      setShowWelcomeModal(true);
    }
  }, []);

  const handleCloseModal = () => {
    const storageKey = "lingtext_texts_welcome_modal_v1";
    window.localStorage.setItem(storageKey, "true");
    setShowWelcomeModal(false);
  };

  return (
    <>
      {showWelcomeModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 text-gray-900 shadow-2xl dark:bg-gray-900 dark:text-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  Nota importante
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Mejor experiencia en desktop
                </h2>
              </div>
              <button
                type="button"
                className="rounded-full p-2 text-gray-500 transition-colors duration-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={handleCloseModal}
                aria-label="Cerrar"
              >
                <span aria-hidden="true">✕</span>
              </button>
            </div>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              <p>
                LingText funciona en cualquier dispositivo y navegador, pero la
                mejor experiencia se obtiene en desktop/PC usando Chrome.
              </p>
              <p>
                Si tienes preguntas o quieres compartir feedback, puedes unirte
                a la comunidad en nuestro grupo de Facebook.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <a
                className="inline-flex items-center justify-center rounded-full border border-indigo-600 px-4 py-2 text-sm font-semibold text-indigo-600 transition-colors duration-200 hover:bg-indigo-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:border-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-500 dark:hover:text-white"
                href="https://www.facebook.com/groups/1199904721807372"
                target="_blank"
                rel="noreferrer"
              >
                Ir al grupo de Facebook
              </a>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                onClick={handleCloseModal}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <ReaderHeader title={text.title} />
      <ReaderErrorBoundary>
        <Suspense fallback={<ReaderSkeleton />}>
          <Reader text={text} />
        </Suspense>
      </ReaderErrorBoundary>
    </>
  );
}
