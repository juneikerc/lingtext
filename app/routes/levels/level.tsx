import type { Route } from "../+types/level";
import { allTexts, allLevelsTexts } from "content-collections";
import { formatSlug } from "~/helpers/formatSlug";
import { type TextCollection } from "~/types";
import ProseContent from "~/components/ProseContent";
import { Link } from "react-router";

export function loader({ params }: Route.LoaderArgs) {
  const level = params.level;
  const levelText = allLevelsTexts.filter(
    (text: any) => text.level === level
  )[0];
  const texts = allTexts.filter((text: TextCollection) => text.level === level);
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

  return (
    <>
      <section className="relative overflow-hidden py-16 sm:py-24 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-indigo-500/10 dark:bg-indigo-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[10%] right-[10%] w-64 h-64 bg-sky-500/10 dark:bg-sky-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-8">
            <a
              href="/"
              className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
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

          <div className="inline-flex items-center px-3 py-1.5 mb-6 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-full border border-indigo-100 dark:border-indigo-800">
            Nivel {levelText.level}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
            {levelText.mainHeading}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
            {levelText.intro}
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 sm:py-24 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Textos de este nivel
            </h2>
          </div>

          <div className="grid gap-6">
            {texts.map((text: TextCollection) => {
              return (
                <Link
                  key={text.title}
                  to={`/texts/${formatSlug(text.title)}?source=collection`}
                  className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition duration-200 overflow-hidden block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-950"
                  rel="nofollow"
                >
                  <div className="p-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                        {text.title}
                      </h3>
                      <div className="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Leer ahora
                        <svg
                          className="w-4 h-4 ml-1.5"
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
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 sm:py-24 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProseContent content={levelText.content} />
        </div>
      </section>
    </>
  );
}
