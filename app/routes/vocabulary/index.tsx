import { Link } from "react-router";
import { allVocabularyManifests } from "~/lib/content/runtime";

export function meta() {
  return [
    {
      title:
        "Vocabulario en inglés por niveles A1-C2 | LingText",
    },
    {
      name: "description",
      content:
        "Aprende vocabulario en inglés organizado por niveles: A1, A2, B1, B2, C1, C2. Cada nivel incluye palabra, traducción, oraciones de ejemplo y audio.",
    },
  ];
}

const LEVELS = ["a1", "a2", "b1", "b2", "c1", "c2"] as const;

const vocabModules = import.meta.glob("../../data/vocabulary-*.json");

const LEVEL_DESCRIPTIONS: Record<string, string> = {
  a1: "Principiante — Vocabulario básico y esencial",
  a2: "Elemental — Vocabulario cotidiano y funcional",
  b1: "Intermedio — Comunicación en situaciones reales",
  b2: "Intermedio alto — Temas abstractos y especializados",
  c1: "Avanzado — Precisión y matices en contextos complejos",
  c2: "Competencia — Dominio cercano al nativo",
};

export default function VocabularyIndexPage() {
  const availableLevels = new Set(
    Object.keys(vocabModules)
      .map((path) => path.match(/vocabulary-([a-z][0-9])\.json$/)?.[1])
      .filter((level): level is string => Boolean(level))
  );

  return (
    <>
      <div className="bg-white">
        <section className="relative overflow-hidden border-b border-gray-200 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-3 self-start rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
                <span className="h-2 w-2 rounded-full bg-[#0F9EDA]" />
                Vocabulario por niveles
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                  Vocabulario en Inglés por Niveles
                </h1>
                <div className="max-w-3xl space-y-4 text-base text-gray-600 sm:text-lg">
                  <p>
                    Cada nivel reúne las{" "}
                    <strong className="font-semibold text-gray-900">
                      palabras más importantes
                    </strong>{" "}
                    que necesitas dominar. Incluye traducción al español,
                    oraciones de ejemplo y audio para practicar pronunciación.
                  </p>
                  <p>
                    Selecciona tu nivel para empezar a estudiar vocabulario de
                    forma organizada y progresiva.
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
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {LEVELS.map((level) => {
                const isAvailable = availableLevels.has(level);
                const manifest = allVocabularyManifests.find(
                  (entry) => entry.level === level
                );

                return (
                  <Link
                    key={level}
                    to={isAvailable ? `/vocabulario/${level}` : "#"}
                    className={`group relative flex flex-col gap-3 rounded-2xl border p-6 transition-all duration-200 ${
                      isAvailable
                        ? "border-gray-200 bg-white shadow-sm hover:border-[#0F9EDA]/30 hover:shadow-md"
                        : "border-dashed border-gray-300 bg-gray-50 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                          isAvailable
                            ? "bg-[#0F9EDA]/10 text-[#0F9EDA]"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {level.toUpperCase()}
                      </span>
                      {!isAvailable && (
                        <span className="text-xs font-medium text-gray-400">
                          Próximamente
                        </span>
                      )}
                    </div>
                    <div>
                      <h2
                        className={`text-lg font-semibold ${
                          isAvailable ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {manifest?.mainHeading ?? `Nivel ${level.toUpperCase()}`}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {LEVEL_DESCRIPTIONS[level]}
                      </p>
                    </div>
                    {manifest?.intro && (
                      <p className="line-clamp-2 text-sm text-gray-600">
                        {manifest.intro}
                      </p>
                    )}
                    {isAvailable && (
                      <span className="mt-auto text-sm font-medium text-[#0F9EDA] transition-colors duration-200 group-hover:text-[#0D8EC4]">
                        Ver vocabulario →
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
