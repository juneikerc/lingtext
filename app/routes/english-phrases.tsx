import type { Route } from "./+types/english-phrases";
import { useCallback } from "react";
import { Link } from "react-router";
import data from "~/data/phrases.json";
import { getSettings } from "~/services/db/settings";
import { speak } from "~/utils/tts";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "1000 frases mas usadas en ingles | + sonido y traducción" },
    {
      name: "description",
      content:
        "Conoce las 1000 frases más usadas en inglés con traducción al español y audio para mejorar tu pronunciación. Aprende inglés de manera práctica y efectiva.",
    },
  ];
}

export const links: Route.LinksFunction = () => [
  {
    rel: "canonical",
    href: "https://lingtext.org/1000-frases-en-ingles",
  },
];

export function loader() {
  const categories = new Set(data.map((item) => item.category));
  const newData: {
    category: string;
    phrases: { phrase: string; translation: string }[];
  }[] = [];
  categories.forEach((category) => {
    const elems = data.filter((i) => i.category === category);

    newData.push({
      category,
      phrases: elems,
    });
  });

  return newData;
}

export default function EnglishPhrasesPage({
  loaderData,
}: Route.ComponentProps) {
  const phrasesByCategory = loaderData;

  const onSpeak = useCallback(async (phrase: string) => {
    const settings = await getSettings();
    await speak(phrase, settings.tts);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-950">
      <section className="relative overflow-hidden py-16 sm:py-20 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-3 self-start rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              Practica con audio
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
                1000 Frases Más Usadas en Inglés
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-400 sm:text-lg">
                Explora las frases por categoría, escucha su pronunciación y
                despliega la traducción cuando la necesites.
              </p>
            </div>
            <div>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-950"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {phrasesByCategory.map((group, index) => {
        const sectionClass =
          index % 2 === 0
            ? "relative overflow-hidden py-16 sm:py-20 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800"
            : "relative overflow-hidden py-16 sm:py-20 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800";

        return (
          <section key={group.category} className={sectionClass}>
            <div className="mx-auto max-w-5xl px-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 sm:text-2xl">
                    {group.category}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {group.phrases.length} frases disponibles
                  </p>
                </div>

                <div className="space-y-4">
                  {group.phrases.map((phrase) => (
                    <details
                      key={`${group.category}-${phrase.phrase}`}
                      className="group rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
                    >
                      <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left">
                        <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                          {phrase.phrase}
                        </span>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-xl bg-gray-50 p-3 text-gray-700 transition-colors duration-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus-visible:ring-offset-gray-950"
                          title="Reproducir frase"
                          aria-label={`Reproducir frase: ${phrase.phrase}`}
                          onClick={async (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            await onSpeak(phrase.phrase);
                          }}
                        >
                          ▶
                        </button>
                      </summary>
                      <div className="border-t border-gray-200 px-5 py-4 text-gray-600 dark:border-gray-800 dark:text-gray-400">
                        {phrase.translation}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
