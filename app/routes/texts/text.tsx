import { getText } from "~/services/db";
import type { Route } from "./+types/text";
import { Suspense, lazy, useEffect, useState } from "react";
import type { AudioRef } from "~/types";
import ReaderHeader from "~/components/reader/ReaderHeader";
import { ReaderLexiconProvider } from "~/components/reader/ReaderLexiconContext";
import { ReaderPreferencesProvider } from "~/components/reader/ReaderPreferencesContext";
import ReaderSkeleton from "~/components/reader/ReaderSkeleton";
import ReaderErrorBoundary from "~/components/ReaderErrorBoundary";
import { getTextBySlug } from "~/lib/content/runtime";
import { type TextItem } from "~/types";
import { formatAudioRef } from "~/utils/format-audio-ref";
import { markTextAsVisited } from "~/utils/visited-texts";
import NewsletterSidebar from "~/components/NewsletterSidebar";

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
      const text = await getTextBySlug(params.id);
      if (!text) {
        throw new Response("Not Found", { status: 404 });
      }

      document.title = text.title;

      return {
        id: params.id,
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
  if (!text) {
    throw new Response("Not Found", { status: 404 });
  }

  document.title = text.title || "Sin título";

  const audioUrl = await formatAudioRef(text.audioRef as AudioRef | null);

  return {
    id: text.id,
    title: text.title,
    content: text.content,
    format: text.format || "txt",
    createdAt: text.createdAt,
    audioRef: text.audioRef,
    audioUrl,
  } as TextItem;
}

export default function Text({ loaderData }: Route.ComponentProps) {
  const text = loaderData;
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!text.id) return;

    markTextAsVisited(text.id);
  }, [text.id]);

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
    <ReaderPreferencesProvider>
      <ReaderLexiconProvider>
        {showWelcomeModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
            <div
              className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
              onClick={handleCloseModal}
            />
            <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 text-gray-900 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                    Nota importante
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                    Mejor experiencia en desktop
                  </h2>
                </div>
                <button
                  type="button"
                  className="rounded-full p-2 text-gray-500 transition-colors duration-200 hover:text-gray-900"
                  onClick={handleCloseModal}
                  aria-label="Cerrar"
                >
                  <span aria-hidden="true">✕</span>
                </button>
              </div>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-700">
                <p>
                  LingText funciona en cualquier dispositivo y navegador, pero
                  la mejor experiencia se obtiene en desktop/PC usando Chrome.
                </p>
                <p>
                  Si tienes preguntas o quieres compartir feedback, puedes
                  unirte a la comunidad en nuestro grupo de Facebook.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <a
                  className="inline-flex items-center justify-center rounded-full border border-[#0F9EDA] px-4 py-2 text-sm font-semibold text-[#0F9EDA] transition-colors duration-200 hover:bg-[#0F9EDA] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2]]]"
                  href="https://www.facebook.com/groups/1199904721807372"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ir al grupo de Facebook
                </a>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full bg-[#0F9EDA] px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#0D8EC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2"
                  onClick={handleCloseModal}
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        ) : null}
        <ReaderHeader title={text.title} />
        <div className="lg:flex lg:items-start">
          <div className="min-w-0 flex-1">
            <ReaderErrorBoundary>
              <Suspense fallback={<ReaderSkeleton />}>
                <Reader text={text} />
              </Suspense>
            </ReaderErrorBoundary>
          </div>
          {sidebarOpen ? (
            <NewsletterSidebar onClose={() => setSidebarOpen(false)} />
          ) : null}
        </div>

        {!sidebarOpen ? (
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="hidden lg:flex fixed right-4 bottom-4 z-30 items-center gap-2 rounded-full bg-[#0F9EDA] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0F9EDA]/30 transition-all duration-200 hover:bg-[#0D8EC4] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2"
            aria-label="Mostrar newsletter"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" strokeWidth="2" />
              <path
                d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Newsletter
          </button>
        ) : null}
      </ReaderLexiconProvider>
    </ReaderPreferencesProvider>
  );
}
