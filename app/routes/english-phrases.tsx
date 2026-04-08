import type { Route } from "./+types/english-phrases";
import { useCallback } from "react";
import { Link } from "react-router";
import data from "~/data/phrases.json";
import { getSettings } from "~/services/db/settings";
import { speak } from "~/utils/tts";

export function meta(_args: Route.MetaArgs) {
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

  const slugify = useCallback((value: string) => {
    return value
      .toLowerCase()
      .trim()
      .normalize("NFKD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
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
    doc.text("1000 Frases Mas Usadas en Ingles", 40, cursorY);
    cursorY += 18;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(75, 85, 99);
    doc.text("Frases con traduccion al espanol.", 40, cursorY);
    cursorY += 18;

    doc.setTextColor(17, 24, 39);

    phrasesByCategory.forEach((group, index) => {
      if (index > 0) cursorY += 8;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(group.category, 40, cursorY);
      cursorY += 8;

      autoTable(doc, {
        startY: cursorY,
        head: [["Phrase", "Traduccion"]],
        body: group.phrases.map((item) => [item.phrase, item.translation]),
        margin: { left: 40, right: 40 },
        styles: { font: "helvetica", fontSize: 10, cellPadding: 6 },
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

    doc.save("1000-frases-en-ingles.pdf");
  }, [phrasesByCategory]);

  return (
    <>
      <div id="top" className="bg-white">
        <section className="relative overflow-hidden border-b border-gray-200 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-3 self-start rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
                <span className="h-2 w-2 rounded-full bg-[#0F9EDA]" />
                Practica con audio
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                  1000 Frases Más Usadas en Inglés
                </h1>
                <div className="space-y-4 text-base text-gray-600 sm:text-lg">
                  <p>
                    Dominar el inglés va más allá de conocer vocabulario
                    aislado. Las frases hechas y expresiones cotidianas son la
                    clave para comunicarte con fluidez y naturalidad en
                    situaciones reales.
                  </p>
                  <p>
                    Esta colección de{" "}
                    <strong className="font-semibold text-gray-900">
                      1000 frases esenciales
                    </strong>{" "}
                    está organizada por categorías temáticas para facilitar tu
                    aprendizaje progresivo.
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
                  Descargar 1000 frases en inglés PDF
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-gray-200 bg-gray-50 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-6">
            <details className="rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:border-gray-300 hover:shadow-md">
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-lg font-semibold text-gray-900 sm:text-xl">
                Tabla de contenidos
                <span className="text-sm font-medium text-gray-500">
                  {phrasesByCategory.length} categorías
                </span>
              </summary>
              <div className="border-t border-gray-200 px-5 py-4">
                <div className="flex flex-wrap gap-3">
                  {phrasesByCategory.map((group) => (
                    <a
                      key={`toc-${group.category}`}
                      href={`#${slugify(group.category)}`}
                      className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      {group.category}
                    </a>
                  ))}
                </div>
              </div>
            </details>
          </div>
        </section>

        {phrasesByCategory.map((group) => (
          <section
            key={group.category}
            id={slugify(group.category)}
            className="relative overflow-hidden border-b border-gray-200 bg-white py-12 sm:py-16"
          >
            <div className="mx-auto max-w-6xl px-6">
              <div className="mb-6 flex items-baseline justify-between">
                <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                  {group.category}
                </h2>
                <span className="text-sm text-gray-500">
                  {group.phrases.length} frases
                </span>
              </div>

              <div className="divide-y divide-gray-100 rounded-xl border border-gray-200">
                {group.phrases.map((phrase) => (
                  <div
                    key={`${group.category}-${phrase.phrase}`}
                    className="group flex items-center gap-4 px-5 py-4 transition-colors duration-150 hover:bg-[#0F9EDA]/5 sm:gap-6"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-medium text-gray-900">
                        {phrase.phrase}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {phrase.translation}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors duration-200 hover:bg-[#0F9EDA]/10 hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      title="Reproducir frase"
                      aria-label={`Reproducir frase: ${phrase.phrase}`}
                      onClick={async () => {
                        await onSpeak(phrase.phrase);
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
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
