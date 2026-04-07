import type { Route } from "./+types/level";
import { getLevelTextByLevel, getTextsByLevel } from "~/lib/content/runtime";
import { formatSlug } from "~/helpers/formatSlug";
import ProseContent from "~/components/ProseContent";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { getVisitedTextIds } from "~/utils/visited-texts";
import type { TextManifestEntry } from "~/lib/content/types";

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
  const texts = getTextsByLevel(level ?? "");
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
      <section className="relative overflow-hidden py-16 sm:py-24 bg-white border-b border-gray-200">
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-[#0F9EDA]/5]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[10%] right-[10%] w-64 h-64 bg-sky-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-8">
            <a
              href="/"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-[#0F9EDA]] transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver al inicio
            </a>
          </nav>

          <div className="inline-flex items-center px-3 py-1.5 mb-6 text-xs font-semibold uppercase tracking-wider text-[#0F9EDA]] bg-[#0F9EDA]/5]/10 rounded-full border border-[#0F9EDA]/20]/30">
            Nivel {levelText.level}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            {levelText.mainHeading}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl">
            {levelText.intro}
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 sm:py-24 bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[#0F9EDA] rounded-xl flex items-center justify-center shadow-sm">
              <svg
                className="w-6 h-6 text-white"
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
            <h2 className="text-3xl font-bold text-gray-900">
              Textos de este nivel
            </h2>
          </div>

          <div className="grid gap-6">
            {texts.map((text: TextManifestEntry) => {
              const textId = formatSlug(text.title);
              const isVisited = visitedTextIds.has(textId);

              return (
                <Link
                  key={text.title}
                  to={`/texts/${textId}?source=collection`}
                  className={`group rounded-2xl border shadow-sm transition duration-200 overflow-hidden block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 ${
                    isVisited
                      ? "bg-[#0F9EDA]/5]/10 border-[#0F9EDA]/20]/30 hover:shadow-md hover:border-[#0F9EDA]/30]/40"
                      : "bg-white border-gray-200 hover:shadow-md hover:border-gray-300"
                  }`}
                  rel="nofollow"
                >
                  <div className="p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#0F9EDA]] transition-colors duration-200">
                          {text.title}
                        </h3>
                        {isVisited ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
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
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Visitado
                          </span>
                        ) : null}
                        {text.sound ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0F9EDA]/20]/30 bg-[#0F9EDA]/5]/10 px-2.5 py-1 text-xs font-semibold text-[#0A7AAB]]">
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
                                d="M11 5L6 9H3v6h3l5 4V5z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.5 8.5a5 5 0 010 7"
                              />
                            </svg>
                            Audio
                          </span>
                        ) : null}
                      </div>
                      <span className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0F9EDA] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 group-hover:bg-[#0D8EC4]]">
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

          <div className="mt-10 rounded-2xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/5 p-6]/30]/10">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#0A7AAB]]">
                  ¿Quieres más?
                </p>
                <p className="mt-1 text-base text-gray-700">
                  Dale un vistazo a lecturas en otros niveles
                </p>
              </div>
              <Link
                to="/textos-en-ingles"
                className="shrink-0 inline-flex items-center justify-center rounded-full bg-[#0F9EDA] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#0D8EC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50]"
              >
                Explorar mas lecturas en inglés
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

      <section className="relative overflow-hidden py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProseContent html={levelText.html} />
        </div>
      </section>
    </>
  );
}
