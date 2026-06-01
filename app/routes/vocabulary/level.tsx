import type { Route } from "./+types/level";
import { useCallback } from "react";
import { Link } from "react-router";
import { getVocabularyTextByLevel } from "~/lib/content/runtime";
import { getSettings } from "~/services/db/settings";
import { speak } from "~/utils/tts";
import ProseContent from "~/components/ProseContent";
import Breadcrumbs from "~/components/Breadcrumbs";

const VALID_LEVELS = ["a1", "a2", "b1", "b2", "c1", "c2"] as const;
type Level = (typeof VALID_LEVELS)[number];

const SITE_URL = "https://lingtext.org";

const vocabModules = import.meta.glob("../../data/vocabulary-*.json", {
  eager: false,
});

type VocabEntry = {
  word: string;
  word_in_spanish: string;
  sentence: string;
  sentence_spanish: string;
};

type VocabCategory = {
  category: string;
  vocabulary: VocabEntry[];
};

function isValidLevel(value: string): value is Level {
  return VALID_LEVELS.includes(value as Level);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className ?? "h-4 w-4"}
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function AnkiIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className ?? "h-4 w-4"}
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="4"
        fill="currentColor"
        opacity="0.18"
      />
      <path
        d="m12 5.5 1.72 4.78 5.08.16-4.01 3.13 1.42 4.88L12 15.57l-4.21 2.88 1.42-4.88-4.01-3.13 5.08-.16L12 5.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PdfIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className ?? "h-4 w-4"}
      aria-hidden="true"
    >
      <path
        d="M6 3.5h8l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 20V5A1.5 1.5 0 0 1 6.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M14 3.5V8h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.75 15.75v-3.5h1.18c.76 0 1.22.42 1.22 1.06s-.46 1.05-1.22 1.05h-1.1m4.03 1.39v-3.5h.98c1.02 0 1.68.66 1.68 1.75s-.66 1.75-1.68 1.75h-.98Zm4.17 0v-3.5h2.05m-2.05 1.56h1.72"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export async function loader({ params }: Route.LoaderArgs) {
  const level = params.level?.toLowerCase() ?? "";

  if (!isValidLevel(level)) {
    throw new Response("Not Found", { status: 404 });
  }

  const vocabularyText = await getVocabularyTextByLevel(level);
  if (!vocabularyText) {
    throw new Response("Not Found", { status: 404 });
  }

  const modulePath = `../../data/vocabulary-${level}.json`;
  const loader = vocabModules[modulePath] as
    | (() => Promise<{ default: VocabCategory[] }>)
    | undefined;

  let categories: VocabCategory[] = [];

  if (loader) {
    const mod = await loader();
    categories = mod.default;
  }

  return { vocabularyText, categories, level };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { vocabularyText, level } = loaderData;
  const url = `${SITE_URL}/vocabulario/${level}`;

  return [
    { title: vocabularyText.title },
    { name: "description", content: vocabularyText.metaDescription },
    {
      tagName: "link",
      rel: "canonical",
      href: url,
    },
  ];
}

export default function VocabularyLevelPage({
  loaderData,
}: Route.ComponentProps) {
  const { vocabularyText, categories, level } = loaderData;

  const onSpeak = useCallback(async (text: string) => {
    const settings = await getSettings();
    await speak(text, settings.tts);
  }, []);

  const onDownloadPdf = useCallback(async () => {
    const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
      import("jspdf"),
      import("jspdf-autotable"),
    ]);

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    let cursorY = 56;

    const drawWatermark = () => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(79, 70, 229);
      doc.text("LINGTEXT.ORG", pageWidth - 40, 30, { align: "right" });
      doc.setTextColor(17, 24, 39);
    };

    drawWatermark();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`Vocabulario Ingles Nivel ${level.toUpperCase()}`, 40, cursorY);
    cursorY += 18;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(75, 85, 99);
    doc.text(vocabularyText.mainHeading, 40, cursorY);
    cursorY += 18;

    doc.setTextColor(17, 24, 39);

    categories.forEach((category, index) => {
      if (index > 0) cursorY += 8;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(category.category, 40, cursorY);
      cursorY += 8;

      autoTable(doc, {
        startY: cursorY,
        head: [["Palabra", "Traduccion", "Oracion", "Traduccion oracion"]],
        body: category.vocabulary.map((item) => [
          item.word || "No disponible",
          item.word_in_spanish || "No disponible",
          item.sentence || "No disponible",
          item.sentence_spanish || "No disponible",
        ]),
        margin: { left: 40, right: 40 },
        styles: { font: "helvetica", fontSize: 9, cellPadding: 6 },
        headStyles: {
          fillColor: [249, 250, 251],
          textColor: [17, 24, 39],
          fontStyle: "bold",
        },
        bodyStyles: { textColor: [17, 24, 39] },
        theme: "grid",
        didDrawPage: () => {
          drawWatermark();
        },
      });

      const finalY = (doc as unknown as { lastAutoTable?: { finalY: number } })
        .lastAutoTable?.finalY;
      cursorY = (finalY ?? cursorY) + 12;

      if (cursorY > doc.internal.pageSize.getHeight() - 80) {
        doc.addPage();
        drawWatermark();
        cursorY = 48;
      }
    });

    doc.save(`vocabulario-ingles-${level}.pdf`);
  }, [categories, level, vocabularyText.mainHeading]);

  const hasVocabulary = categories.length > 0;
  const totalWords = categories.reduce(
    (sum, cat) => sum + cat.vocabulary.length,
    0
  );
  const currentLevelIndex = VALID_LEVELS.indexOf(level as Level);
  const previousLevel =
    currentLevelIndex > 0 ? VALID_LEVELS[currentLevelIndex - 1] : undefined;
  const nextLevel =
    currentLevelIndex >= 0 && currentLevelIndex < VALID_LEVELS.length - 1
      ? VALID_LEVELS[currentLevelIndex + 1]
      : undefined;

  return (
    <>
      <div id="top" className="bg-white">
        <section className="relative overflow-hidden border-b border-gray-200 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col gap-6">
              <Breadcrumbs
                items={[
                  { label: "Vocabulario", href: "/vocabulario" },
                  {
                    label: `Nivel ${level.toUpperCase()}`,
                    href: `/vocabulario/${level}`,
                  },
                ]}
              />

              <div className="inline-flex items-center gap-3 self-start rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
                <span className="h-2 w-2 rounded-full bg-[#0F9EDA]" />
                Vocabulario nivel {level.toUpperCase()}
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                  {vocabularyText.mainHeading}
                </h1>
                <div className="max-w-3xl space-y-4 text-base text-gray-600 sm:text-lg">
                  <p>{vocabularyText.intro}</p>
                </div>
              </div>

              {hasVocabulary && (
                <div className="flex flex-wrap gap-3">
                  {vocabularyText.ankiDeck ? (
                    <a
                      href={vocabularyText.ankiDeck.url}
                      rel="nofollow"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F9EDA] px-6 py-3 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-[#0D8EC4] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      <AnkiIcon className="h-5 w-5" />
                      Mazo de Anki {vocabularyText.ankiDeck.price}
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={onDownloadPdf}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    <PdfIcon className="h-5 w-5 text-[#0F9EDA]" />
                    Descargar vocabulario {level.toUpperCase()} en PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {!hasVocabulary ? (
          <section className="relative overflow-hidden bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
                  📚
                </div>
                <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                  Próximamente
                </h2>
                <p className="max-w-md text-gray-600">
                  El vocabulario para el nivel {level.toUpperCase()} estará
                  disponible pronto. Mientras tanto, puedes explorar los niveles
                  que ya están listos.
                </p>
                <Link
                  to="/vocabulario"
                  className="mt-2 inline-flex items-center justify-center rounded-lg bg-[#0F9EDA] px-6 py-3 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-[#0D8EC4] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  Ver todos los niveles
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <>
            <section className="relative overflow-hidden border-b border-gray-200 bg-gray-50 py-12 sm:py-16">
              <div className="mx-auto max-w-6xl px-6">
                <details className="rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:border-gray-300 hover:shadow-md">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-lg font-semibold text-gray-900 sm:text-xl">
                    Tabla de contenidos
                    <span className="text-sm font-medium text-gray-500">
                      {categories.length} categorías · {totalWords} palabras
                    </span>
                  </summary>
                  <div className="border-t border-gray-200 px-5 py-4">
                    <div className="flex flex-wrap gap-3">
                      {categories.map((cat) => (
                        <a
                          key={`toc-${cat.category}`}
                          href={`#${slugify(cat.category)}`}
                          className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                        >
                          {cat.category}
                          <span className="ml-2 text-xs text-gray-400">
                            ({cat.vocabulary.length})
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </details>
              </div>
            </section>

            {categories.map((cat) => (
              <section
                key={cat.category}
                id={slugify(cat.category)}
                className="relative overflow-hidden border-b border-gray-200 bg-white py-12 sm:py-16"
              >
                <div className="mx-auto max-w-6xl px-6">
                  <div className="mb-6 flex items-baseline justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                      {cat.category}
                    </h2>
                    <span className="text-sm text-gray-500">
                      {cat.vocabulary.length} palabras
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full min-w-[720px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50 text-xs font-medium uppercase tracking-wider text-gray-500">
                          <th className="w-12 px-4 py-3 text-center">#</th>
                          <th className="px-4 py-3">Palabra</th>
                          <th className="px-4 py-3">Traducción</th>
                          <th className="px-4 py-3">Oración</th>
                          <th className="px-4 py-3">Traducción oración</th>
                          <th className="w-20 px-4 py-3 text-center">Audio</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {cat.vocabulary.map((item, index) => (
                          <tr
                            key={`${cat.category}-${item.word}-${index}`}
                            className="transition-colors duration-150 hover:bg-[#0F9EDA]/5"
                          >
                            <td className="px-4 py-3 text-center text-xs text-gray-400">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-semibold text-gray-900">
                                {item.word || "—"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              {item.word_in_spanish || "—"}
                            </td>
                            <td className="max-w-xs px-4 py-3">
                              <p className="line-clamp-2 text-gray-700">
                                {item.sentence || "—"}
                              </p>
                            </td>
                            <td className="max-w-xs px-4 py-3">
                              <p className="line-clamp-2 text-gray-600">
                                {item.sentence_spanish || "—"}
                              </p>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors duration-200 hover:bg-[#0F9EDA]/10 hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-30"
                                  title="Reproducir palabra"
                                  aria-label={`Reproducir palabra: ${item.word}`}
                                  disabled={!item.word}
                                  onClick={async () => {
                                    if (!item.word) return;
                                    await onSpeak(item.word);
                                  }}
                                >
                                  <PlayIcon className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors duration-200 hover:bg-[#0F9EDA]/10 hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-30"
                                  title="Reproducir oración"
                                  aria-label={`Reproducir oración: ${item.sentence}`}
                                  disabled={!item.sentence}
                                  onClick={async () => {
                                    if (!item.sentence) return;
                                    await onSpeak(item.sentence);
                                  }}
                                >
                                  <PlayIcon className="h-3 w-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            ))}

            <section className="relative overflow-hidden border-b border-gray-200 bg-gray-50 py-12 sm:py-16">
              <div className="mx-auto max-w-6xl px-6">
                <div className="mb-6 max-w-3xl">
                  <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                    Continúa con vocabulario en inglés por niveles
                  </h2>
                  <p className="mt-3 text-gray-600">
                    Avanza al siguiente nivel cuando ya reconozcas la mayoría de
                    estas palabras, o vuelve al nivel anterior si necesitas
                    reforzar vocabulario básico.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {previousLevel ? (
                    <Link
                      to={`/vocabulario/${previousLevel}`}
                      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-200 hover:border-[#0F9EDA]/30 hover:bg-[#0F9EDA]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
                    >
                      <span className="text-sm font-medium text-gray-500">
                        Nivel anterior
                      </span>
                      <span className="mt-2 block text-xl font-semibold text-gray-900">
                        Vocabulario {previousLevel.toUpperCase()}
                      </span>
                    </Link>
                  ) : null}

                  <Link
                    to="/vocabulario"
                    className="rounded-2xl border border-[#0F9EDA]/20 bg-white p-5 shadow-sm transition-colors duration-200 hover:border-[#0F9EDA]/40 hover:bg-[#0F9EDA]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
                  >
                    <span className="text-sm font-medium text-[#0F9EDA]">
                      Índice principal
                    </span>
                    <span className="mt-2 block text-xl font-semibold text-gray-900">
                      Ver todos los niveles
                    </span>
                  </Link>

                  {nextLevel ? (
                    <Link
                      to={`/vocabulario/${nextLevel}`}
                      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-200 hover:border-[#0F9EDA]/30 hover:bg-[#0F9EDA]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
                    >
                      <span className="text-sm font-medium text-gray-500">
                        Siguiente nivel
                      </span>
                      <span className="mt-2 block text-xl font-semibold text-gray-900">
                        Vocabulario {nextLevel.toUpperCase()}
                      </span>
                    </Link>
                  ) : null}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {VALID_LEVELS.map((entry) =>
                    entry === level ? (
                      <span
                        key={entry}
                        aria-current="page"
                        className="inline-flex items-center rounded-full border border-[#0F9EDA] bg-[#0F9EDA] px-4 py-2 text-sm font-semibold text-white"
                      >
                        {entry.toUpperCase()}
                      </span>
                    ) : (
                      <Link
                        key={entry}
                        to={`/vocabulario/${entry}`}
                        className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:border-[#0F9EDA]/30 hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
                      >
                        {entry.toUpperCase()}
                      </Link>
                    )
                  )}
                </div>
              </div>
            </section>
          </>
        )}

        <section className="relative overflow-hidden border-b border-gray-200 bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-6">
            <ProseContent html={vocabularyText.html} />
          </div>
        </section>
      </div>

      <a
        href="#top"
        className="fixed bottom-6 right-6 inline-flex items-center justify-center rounded-xl bg-[#0F9EDA] p-3 text-white shadow-sm transition-colors duration-200 hover:bg-[#0D8EC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        aria-label="Volver al inicio"
        title="Volver al inicio"
      >
        ↑
      </a>
    </>
  );
}
