import { getText } from "~/services/db";
import type { Route } from "./+types/text";
import { Suspense, lazy, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import type { AudioRef } from "~/types";
import ReaderHeader from "~/components/reader/ReaderHeader";
import { ReaderLexiconProvider } from "~/components/reader/ReaderLexiconContext";
import { ReaderPreferencesProvider } from "~/components/reader/ReaderPreferencesContext";
import ReaderSkeleton from "~/components/reader/ReaderSkeleton";
import ReaderErrorBoundary from "~/components/ReaderErrorBoundary";
import { getTextBySlug } from "~/lib/content/runtime";
import {
  parseChapterNumber,
  selectTextChapter,
  type TextChapter,
} from "~/lib/content/text-chapters";
import { type TextItem } from "~/types";
import { formatAudioRef } from "~/utils/format-audio-ref";
import { markTextAsVisited } from "~/utils/visited-texts";
import ReaderSidebar from "~/components/ReaderSidebar";

const Reader = lazy(() => import("~/components/Reader"));

interface ChapterNavigationData {
  currentChapterNumber: number;
  totalChapters: number;
  chapters: Pick<TextChapter, "number" | "title">[];
}

type TextRouteData = TextItem & {
  audioUrl?: string | null;
  chapterNavigation?: ChapterNavigationData;
};

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

      const requestedChapterNumber = parseChapterNumber(
        queryParams.get("chapter")
      );
      let chapterSelection;
      try {
        chapterSelection = selectTextChapter(
          text.content,
          text.chapters,
          requestedChapterNumber
        );
      } catch (error) {
        if (error instanceof RangeError) {
          throw new Response("Not Found", { status: 404 });
        }

        throw error;
      }

      document.title = chapterSelection
        ? `${chapterSelection.currentChapter.title} | ${text.title}`
        : text.title;

      return {
        id: params.id,
        title: text.title,
        content: chapterSelection?.currentChapter.content ?? text.content,
        format: "markdown",
        createdAt: Date.now(),
        ...(chapterSelection && {
          chapterNavigation: {
            currentChapterNumber: chapterSelection.currentChapterNumber,
            totalChapters: chapterSelection.totalChapters,
            chapters: chapterSelection.chapters.map((chapter) => ({
              number: chapter.number,
              title: chapter.title,
            })),
          },
        }),
        ...(text.sound && { audioUrl: text.sound }),
      } as TextRouteData;
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
  } as TextRouteData;
}

function ChapterNavigation({
  navigation,
  textId,
}: {
  navigation: ChapterNavigationData;
  textId: string;
}) {
  const navigate = useNavigate();
  const { currentChapterNumber, totalChapters, chapters } = navigation;
  const previousChapterNumber =
    currentChapterNumber > 1 ? currentChapterNumber - 1 : null;
  const nextChapterNumber =
    currentChapterNumber < totalChapters ? currentChapterNumber + 1 : null;

  const getChapterHref = (chapterNumber: number) =>
    `/texts/${textId}?source=collection&chapter=${chapterNumber}`;

  const buttonBaseClass =
    "inline-flex min-h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white";
  const enabledSecondaryClass =
    "border border-gray-300 bg-white text-gray-700 no-underline hover:border-[#0F9EDA]/30 hover:bg-[#0F9EDA]/5 hover:text-[#0A7AAB]";
  const disabledSecondaryClass =
    "cursor-not-allowed border border-gray-200 bg-gray-50 text-gray-400";
  const primaryClass =
    "border border-[#0F9EDA] bg-[#0F9EDA] text-white no-underline hover:border-[#0D8EC4] hover:bg-[#0D8EC4]";
  const disabledPrimaryClass =
    "cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400";

  return (
    <nav
      className="flex w-full items-center gap-2"
      aria-label="Navegación de capítulos"
    >
      {previousChapterNumber ? (
        <Link
          to={getChapterHref(previousChapterNumber)}
          className={`${buttonBaseClass} ${enabledSecondaryClass}`}
        >
          Anterior
        </Link>
      ) : (
        <span
          className={`${buttonBaseClass} ${disabledSecondaryClass}`}
          aria-disabled="true"
        >
          Anterior
        </span>
      )}

      <select
        className="min-h-10 min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:border-[#0F9EDA]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        value={currentChapterNumber}
        onChange={(event) => {
          navigate(getChapterHref(Number(event.target.value)));
        }}
        aria-label="Seleccionar capítulo"
      >
        {chapters.map((chapter) => (
          <option key={chapter.number} value={chapter.number}>
            {chapter.number}/{totalChapters} {chapter.title}
          </option>
        ))}
      </select>

      {nextChapterNumber ? (
        <Link
          to={getChapterHref(nextChapterNumber)}
          className={`${buttonBaseClass} ${primaryClass}`}
        >
          Siguiente
        </Link>
      ) : (
        <span
          className={`${buttonBaseClass} ${disabledPrimaryClass}`}
          aria-disabled="true"
        >
          Siguiente
        </span>
      )}
    </nav>
  );
}

export default function Text({ loaderData }: Route.ComponentProps) {
  const text = loaderData as TextRouteData;
  // Welcome modal flow disabled for now. Keep the implementation commented
  // in case we want to restore it later without rebuilding it from scratch.
  // const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!text.id) return;

    markTextAsVisited(text.id);
  }, [text.id]);

  // useEffect(() => {
  //   if (typeof window === "undefined") return;
  //
  //   const storageKey = "lingtext_texts_welcome_modal_v1";
  //   const hasSeenModal = window.localStorage.getItem(storageKey);
  //
  //   if (!hasSeenModal) {
  //     setShowWelcomeModal(true);
  //   }
  // }, []);
  //
  // const handleCloseModal = () => {
  //   const storageKey = "lingtext_texts_welcome_modal_v1";
  //   window.localStorage.setItem(storageKey, "true");
  //   setShowWelcomeModal(false);
  // };

  return (
    <ReaderPreferencesProvider>
      <ReaderLexiconProvider>
        {/* {showWelcomeModal ? (
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
        ) : null} */}
        <ReaderHeader title={text.title} />
        <div className="lg:flex lg:items-start">
          <div className="min-w-0 flex-1">
            <ReaderErrorBoundary>
              <Suspense fallback={<ReaderSkeleton />}>
                <Reader
                  key={
                    text.chapterNavigation
                      ? `${text.id}-${text.chapterNavigation.currentChapterNumber}`
                      : text.id
                  }
                  text={text}
                  contentFooter={
                    text.chapterNavigation ? (
                      <ChapterNavigation
                        navigation={text.chapterNavigation}
                        textId={text.id}
                      />
                    ) : null
                  }
                />
              </Suspense>
            </ReaderErrorBoundary>
          </div>
          {sidebarOpen ? (
            <ReaderSidebar onClose={() => setSidebarOpen(false)} />
          ) : null}
        </div>

        {!sidebarOpen ? (
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="hidden lg:flex fixed right-4 bottom-4 z-30 items-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all duration-200 hover:bg-indigo-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            aria-label="Mostrar sidebar de LingText PRO"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            LingText PRO
          </button>
        ) : null}
      </ReaderLexiconProvider>
    </ReaderPreferencesProvider>
  );
}
