import type { Route } from "./+types/english-words-500";
import { useCallback } from "react";
import { Link } from "react-router";
import data from "~/data/1000-words.json";
import { getSettings } from "~/services/db/settings";
import { speak } from "~/utils/tts";

type SourceWord = {
  index: string;
  word: string;
  definition: string;
  example_sentence: string;
  translation: string;
};

type Word500Item = {
  index: number;
  word: string;
  definition: string;
  exampleSentence: string;
  translation: string;
};

type Word500Group = {
  title: string;
  words: Word500Item[];
};

const PAGE_SIZE = 50;
const TOTAL_WORDS = 500;

export function meta(_args: Route.MetaArgs) {
  return [
    {
      title: "500 palabras más usadas en inglés | audio, oración y significado",
    },
    {
      name: "description",
      content:
        "Aprende las 500 palabras más usadas en inglés con audio de palabra y oración, traducción y significado. Vocabulario más común para hablar inglés con fluidez.",
    },
  ];
}

export const links: Route.LinksFunction = () => [
  {
    rel: "canonical",
    href: "https://lingtext.org/500-palabras-en-ingles",
  },
];

export function loader(): Word500Group[] {
  const first500 = (data as SourceWord[])
    .slice(0, TOTAL_WORDS)
    .map((item) => ({
      index: Number(item.index),
      word: item.word?.trim() ?? "",
      definition: item.definition?.trim() ?? "",
      exampleSentence: item.example_sentence?.trim() ?? "",
      translation: item.translation?.trim() ?? "",
    }))
    .sort((a, b) => a.index - b.index);

  const groups: Word500Group[] = [];

  for (let start = 0; start < first500.length; start += PAGE_SIZE) {
    const chunk = first500.slice(start, start + PAGE_SIZE);
    const from = start + 1;
    const to = start + chunk.length;

    groups.push({
      title: `Palabras ${from}-${to}`,
      words: chunk,
    });
  }

  return groups;
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

function getPrimaryWordTranslation(definition: string): string {
  const firstLine = definition
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  if (!firstLine) return "";

  return firstLine
    .replace(/^\d+\.\s*/, "")
    .replace(/\([^)]*\)\s*/g, "")
    .replace(/\.$/, "")
    .trim();
}

function WordCard({
  item,
  onSpeakWord,
  onSpeakSentence,
}: {
  item: Word500Item;
  onSpeakWord: (word: string) => Promise<void>;
  onSpeakSentence: (sentence: string) => Promise<void>;
}) {
  const hasSentence = Boolean(item.exampleSentence);
  const wordTranslation = getPrimaryWordTranslation(item.definition);

  return (
    <article className="rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:border-gray-300 hover:shadow-md">
      <header className="flex items-center justify-between gap-4 px-5 py-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            #{item.index}
          </p>
          <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">
            {item.word || "Palabra no disponible"}
          </h3>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl bg-gray-50 p-3 text-gray-700 transition-colors duration-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50"
          title="Reproducir palabra"
          aria-label={`Reproducir palabra: ${item.word}`}
          disabled={!item.word}
          onClick={async () => {
            if (!item.word) return;
            await onSpeakWord(item.word);
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><polygon points="5 3 19 12 5 21 5 3" /></svg>
        </button>
      </header>

      <div className="border-t border-gray-200 px-5 py-4">
        <details className="rounded-xl border border-gray-200 bg-gray-50">
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white">
            Significado / traducción de la palabra
          </summary>
          <div className="border-t border-gray-200 px-4 py-3">
            <p className="text-gray-700">
              {wordTranslation || "Traducción no disponible"}
            </p>
            <p className="mt-3 whitespace-pre-line text-sm text-gray-600">
              {item.definition || "Significado no disponible"}
            </p>
          </div>
        </details>
      </div>

      <div className="border-t border-[#0F9EDA]/20 bg-[#0F9EDA]/5/60 px-5 py-4">
        <details className="rounded-xl border border-[#0F9EDA]/20 bg-white/80">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-3 px-4 py-3">
            <div className="space-y-2">
              <p className="text-base text-gray-900">
                {item.exampleSentence || "Oración no disponible"}
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50"
              title="Reproducir oración"
              aria-label={`Reproducir oración: ${item.exampleSentence}`}
              disabled={!hasSentence}
              onClick={async (event) => {
                event.preventDefault();
                event.stopPropagation();
                if (!item.exampleSentence) return;
                await onSpeakSentence(item.exampleSentence);
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            </button>
          </summary>
          <div className="border-t border-[#0F9EDA]/20 px-4 py-3">
            <p className="mt-2 rounded-lg bg-white px-3 py-2 text-gray-700">
              {item.translation || "Traducción no disponible"}
            </p>
          </div>
        </details>
      </div>
    </article>
  );
}

export default function EnglishWords500Page({
  loaderData,
}: Route.ComponentProps) {
  const wordsByGroup = loaderData;

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
    doc.text("500 Palabras Mas Usadas en Ingles", 40, cursorY);
    cursorY += 18;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(75, 85, 99);
    doc.text(
      "Incluye palabra, oracion, traduccion y significado.",
      40,
      cursorY
    );
    cursorY += 18;

    doc.setTextColor(17, 24, 39);

    wordsByGroup.forEach((group, index) => {
      if (index > 0) cursorY += 8;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(group.title, 40, cursorY);
      cursorY += 8;

      autoTable(doc, {
        startY: cursorY,
        head: [["Palabra", "Oracion", "Traduccion", "Significado"]],
        body: group.words.map((item) => [
          item.word || "No disponible",
          item.exampleSentence || "No disponible",
          item.translation || "No disponible",
          item.definition || "No disponible",
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

    doc.save("500-palabras-mas-usadas-en-ingles.pdf");
  }, [wordsByGroup]);

  return (
    <>
      <div id="top" className="bg-white">
        <section className="relative overflow-hidden border-b border-gray-200 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-3 self-start rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
                <span className="h-2 w-2 rounded-full bg-[#0F9EDA]" />
                500 palabras de alta frecuencia del inglés
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                  500 Palabras Más Usadas en Inglés
                </h1>
                <div className="space-y-4 text-base text-gray-600 sm:text-lg">
                  <p>
                    Esta guía reúne las{" "}
                    <strong className="font-semibold text-gray-900">
                      500 palabras más usadas en inglés
                    </strong>{" "}
                    con enfoque práctico: escuchas la palabra, escuchas la
                    oración y estudias su significado paso a paso.
                  </p>
                  <p>
                    Si buscas{" "}
                    <strong className="font-semibold text-gray-900">
                      palabras más comunes en inglés
                    </strong>{" "}
                    o vocabulario más usado para conversar, aquí tienes una
                    lista útil para entrenar comprensión, pronunciación y
                    memoria.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  Volver al inicio
                </Link>
                <button
                  type="button"
                  onClick={onDownloadPdf}
                  className="inline-flex items-center justify-center rounded-lg bg-[#0F9EDA] px-6 py-3 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-[#0D8EC4] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  Descargar 500 palabras en inglés PDF
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-gray-200 bg-gray-50 py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-6">
            <details className="rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:border-gray-300 hover:shadow-md">
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-lg font-semibold text-gray-900 sm:text-xl">
                Tabla de contenidos
                <span className="text-sm font-medium text-gray-500">
                  {wordsByGroup.length} bloques
                </span>
              </summary>
              <div className="border-t border-gray-200 px-5 py-4">
                <div className="flex flex-wrap gap-3">
                  {wordsByGroup.map((group) => (
                    <a
                      key={`toc-${group.title}`}
                      href={`#${slugify(group.title)}`}
                      className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      {group.title}
                    </a>
                  ))}
                </div>
              </div>
            </details>
          </div>
        </section>

        {wordsByGroup.map((group, index) => {
          const sectionClass =
            index % 2 === 0
              ? "relative overflow-hidden border-b border-gray-200 bg-white py-16 sm:py-20"
              : "relative overflow-hidden border-b border-gray-200 bg-gray-50 py-16 sm:py-20";

          return (
            <section
              key={group.title}
              id={slugify(group.title)}
              className={sectionClass}
            >
              <div className="mx-auto max-w-5xl px-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                      {group.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {group.words.length} palabras disponibles
                    </p>
                  </div>

                  <div className="space-y-4">
                    {group.words.map((item) => (
                      <WordCard
                        key={item.index}
                        item={item}
                        onSpeakWord={onSpeak}
                        onSpeakSentence={onSpeak}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
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
