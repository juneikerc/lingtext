import type { Route } from "./+types/level";
import {
  getLevelTextByLevel,
  getTextsByLevel,
  getTextBySlug,
} from "~/lib/content/runtime";
import { formatSlug } from "~/helpers/formatSlug";
import ProseContent from "~/components/ProseContent";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { getVisitedTextIds } from "~/utils/visited-texts";

interface TextCardData {
  title: string;
  level: string;
  date: string;
  sound?: string;
  wordCount: number;
  isRecent: boolean;
}

function countWords(raw: string): number {
  return raw
    .replace(/---[\s\S]*?---/, "")
    .split(/\s+/)
    .filter(Boolean).length;
}

function setsAreEqual(left: Set<string>, right: Set<string>) {
  if (left.size !== right.size) {
    return false;
  }

  for (const value of left) {
    if (!right.has(value)) {
      return false;
    }
  }

  return true;
}

export async function loader({ params }: Route.LoaderArgs) {
  const level = params.level;
  const levelText = await getLevelTextByLevel(level ?? "");
  if (!levelText) {
    throw new Response("Not Found", { status: 404 });
  }
  const sorted = [...getTextsByLevel(level ?? "")].sort((left, right) => {
    const dateCompare = right.date.localeCompare(left.date);

    if (dateCompare !== 0) {
      return dateCompare;
    }

    return left.title.localeCompare(right.title, undefined, {
      sensitivity: "base",
    });
  });

  const today = new Date().toISOString().slice(0, 10);
  const texts = await Promise.all(
    sorted.map(async (text): Promise<TextCardData> => {
      const slug = formatSlug(text.title);
      const entry = await getTextBySlug(slug);
      const wordCount = entry ? countWords(entry.content) : 0;
      const diffDays = Math.floor(
        (new Date(today).getTime() - new Date(text.date).getTime()) /
        (1000 * 60 * 60 * 24)
      );
      const isRecent = diffDays >= 0 && diffDays <= 3;

      return {
        title: text.title,
        level: text.level,
        date: text.date,
        sound: text.sound,
        wordCount,
        isRecent,
      };
    })
  );

  return { levelText, texts };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { levelText } = loaderData;
  return [
    {
      title: levelText.title,
    },
    {
      name: "description",
      content: levelText.metaDescription,
    },
    {
      tagName: "link",
      rel: "canonical",
      href: `https://lingtext.org/levels/${levelText.level.toLowerCase()}`,
    },
  ];
}

export default function Level({ loaderData }: Route.ComponentProps) {
  const texts = loaderData.texts;
  const levelText = loaderData.levelText;
  const [visitedTextIds, setVisitedTextIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const nextVisitedTextIds = new Set(getVisitedTextIds());

    setVisitedTextIds((currentVisitedTextIds) =>
      setsAreEqual(currentVisitedTextIds, nextVisitedTextIds)
        ? currentVisitedTextIds
        : nextVisitedTextIds
    );
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-white border-b border-gray-200">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-[#0F9EDA]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[10%] right-[10%] w-64 h-64 bg-[#0F9EDA]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#0F9EDA] transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m15 18-6-6 6-6"
                />
              </svg>
              Volver al inicio
            </Link>
          </nav>

          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-[#0F9EDA] bg-[#0F9EDA]/10 rounded-full border border-[#0F9EDA]/20">
            <span className="w-2 h-2 bg-[#0F9EDA] rounded-full mr-2.5"></span>
            Nivel {levelText.level}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
            {levelText.mainHeading}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl">
            {levelText.intro}
          </p>
        </div>
      </section>

      {/* Textos */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[#0F9EDA]/10 rounded-xl flex items-center justify-center border border-[#0F9EDA]/20">
              <svg
                className="w-5 h-5 text-[#0F9EDA]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Textos de este nivel
            </h2>
          </div>

          <div className="grid gap-4">
            {texts.map((text: TextCardData) => {
              const textId = formatSlug(text.title);
              const isVisited = visitedTextIds.has(textId);

              return (
                <Link
                  key={text.title}
                  to={`/texts/${textId}?source=collection`}
                  className={`group rounded-2xl border shadow-sm transition-all duration-200 overflow-hidden block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 ${isVisited
                    ? "bg-[#0F9EDA]/5 border-[#0F9EDA]/20 hover:shadow-md hover:border-[#0F9EDA]/30"
                    : "bg-white border-gray-200 hover:shadow-md hover:border-[#0F9EDA]/30"
                    }`}
                  rel="nofollow"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 space-y-2 sm:space-y-0">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#0F9EDA] transition-colors duration-200 truncate">
                          {text.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          {isVisited ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 shrink-0">
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Visitado
                            </span>
                          ) : null}
                          {text.sound ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 px-2.5 py-1 text-xs font-semibold text-[#0F9EDA] shrink-0">
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <polygon
                                  points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                />
                                <path
                                  d="M15.54 8.46a5 5 0 0 1 0 7.07"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                />
                              </svg>
                              Audio
                            </span>
                          ) : null}
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 shrink-0">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                            {text.wordCount} words
                          </span>
                          {text.isRecent ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 shrink-0">
                              Nuevo
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <span className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0F9EDA] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 group-hover:bg-[#0D8EC4] shrink-0">
                        {isVisited ? "Volver a leer" : "Leer ahora"}
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* CTA otros niveles */}
          <div className="mt-10 rounded-2xl border border-[#0F9EDA]/15 bg-[#0F9EDA]/5 p-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#0F9EDA]">
                  ¿Quieres más?
                </p>
                <p className="mt-1 text-base text-gray-700">
                  Dale un vistazo a lecturas en otros niveles.
                </p>
              </div>
              <Link
                to="/textos-en-ingles"
                className="shrink-0 inline-flex items-center justify-center rounded-xl bg-[#0F9EDA] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#0D8EC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
              >
                Explorar más lecturas
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido SEO */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProseContent html={levelText.html} />
        </div>
      </section>
    </>
  );
}
