import { Link } from "react-router";
import { allVocabularyManifests } from "~/lib/content/runtime";

const SITE_URL = "https://lingtext.org";

type HighFrequencyWordPreview = {
  index: string;
  word: string;
  definition: string;
  example_sentence: string;
};

const HIGH_FREQUENCY_WORD_PREVIEW: HighFrequencyWordPreview[] = [
  {
    index: "1",
    word: "have",
    definition: "1. (v.) Tener.\n2. (v.) Haber.",
    example_sentence: "I have two dogs and a cat.",
  },
  {
    index: "2",
    word: "food",
    definition: "1. (sus.) Comida, alimento",
    example_sentence: "What is your favorite food?",
  },
  {
    index: "3",
    word: "buy",
    definition: "1. (v.) Comprar.\n2. (v.) Creer, aceptar.",
    example_sentence: "Johnathan needs to buy new pants.",
  },
  {
    index: "4",
    word: "store",
    definition:
      "1. (sus.) Tienda, establecimiento comercial.\n2. (v.) Reservar, conservar.",
    example_sentence: "My boyfriend is buying food at the store.",
  },
  {
    index: "5",
    word: "get",
    definition: "1. (v.) Obtener, conseguir, adquirir.\n2. (v.) Recibir.",
    example_sentence: "Michael is getting food from the store.",
  },
  {
    index: "6",
    word: "know",
    definition: "1. (v.) Conocer, saber.\n2. (v.) Comprender.",
    example_sentence: "Do you know where the restaurant is?",
  },
  {
    index: "7",
    word: "where",
    definition: "1. (pron.) Donde.\n2. (adv.) Dónde.",
    example_sentence: "Excuse me, do you know where the bus stop is?",
  },
  {
    index: "8",
    word: "well",
    definition: "1. (adv.) Bien.",
    example_sentence: "I'm doing well! Thanks for asking.",
  },
  {
    index: "9",
    word: "go",
    definition: "1. (v.) Ir, irse.",
    example_sentence: "Where are you going?",
  },
  {
    index: "10",
    word: "all",
    definition: "1. (adj.) Todo.\n2. (adv.) Completamente, totalmente.",
    example_sentence: "All of my family is from Canada.",
  },
  {
    index: "11",
    word: "good",
    definition: "1. (adj.) Bueno, buen.",
    example_sentence: "Wow! You're really good at sports.",
  },
  {
    index: "12",
    word: "think",
    definition: "1. (v.) Pensar.\n2. (v.) Creer.",
    example_sentence: "I thought you were good at math.",
  },
  {
    index: "13",
    word: "take",
    definition: "1. (v.) Tomar, llevar.\n2. (v.) Aguantar.",
    example_sentence: "Take this to my brother, please.",
  },
  {
    index: "14",
    word: "glass",
    definition: "1. (sus.) Vidrio, cristal\n2. (sus.) Vaso",
    example_sentence: "Would you like a glass of orange juice?",
  },
  {
    index: "15",
    word: "pocket",
    definition: "1. (sus.) Bolsillo.\n2. (v.) Embolsar, meter en el bolsillo.",
    example_sentence: "Gianna took his glasses off and put them in his pocket.",
  },
  {
    index: "16",
    word: "about",
    definition: "1. (prep.) Acerca de, sobre.\n2. (prep.) Con respecto a.",
    example_sentence: "This book is about World War II.",
  },
  {
    index: "17",
    word: "tell",
    definition: "1. (v.) Contar.\n2. (v.) Decir.",
    example_sentence: "He told me he really liked working with her.",
  },
  {
    index: "18",
    word: "whole",
    definition: "1. (adj.) Entero, íntegro, completo.\n2. (sus.) Todo.",
    example_sentence: "Isabella was nice the whole time.",
  },
  {
    index: "19",
    word: "life",
    definition: "1. (sus.) Vida.",
    example_sentence: "He's lived in Chicago his whole life.",
  },
  {
    index: "20",
    word: "today",
    definition: "1. (adv.) Hoy.",
    example_sentence: "What are you doing today?",
  },
];

export function meta() {
  return [
    {
      title: "Vocabulario en inglés | Palabras más usadas + Listas por nivel",
    },
    {
      name: "description",
      content:
        "Aprende vocabulario en inglés organizado por niveles: A1, A2, B1, B2, C1, C2 + palabras de alta frecuencia Cada nivel incluye palabra, traducción, oraciones de ejemplo y audio.",
    },
    {
      tagName: "link",
      rel: "canonical",
      href: `${SITE_URL}/vocabulario`,
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
        <section className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-[5%] top-10 h-72 w-72 rounded-full bg-[#0F9EDA]/10 blur-3xl" />
            <div className="absolute -bottom-24 left-[10%] h-64 w-64 rounded-full bg-[#0F9EDA]/5 blur-3xl" />
            <div className="absolute right-0 top-24 hidden h-[30rem] w-[20rem] rounded-l-full bg-[#0F9EDA]/10 lg:block" />
          </div>

          <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,28rem)] lg:px-8 xl:grid-cols-[minmax(0,1fr)_minmax(24rem,30rem)]">
            <div>
              <Link
                to="/"
                className="mb-10 flex w-fit items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="m15 18-6-6 6-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                Volver al inicio
              </Link>

              <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Vocabulario en inglés: palabras más usadas y listas por{" "}
                <span className="text-[#0F9EDA]">nivel (A1 a C2)</span>
              </h1>

              <div className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-gray-600">
                <p>
                  Aprender vocabulario en inglés no consiste en acumular
                  palabras sin orden, sino en entender cuáles necesitas primero,
                  cómo usarlas en contexto y cuándo dar el salto a términos más
                  precisos.
                </p>
                <p>
                  Esta guía te ayuda a elegir un camino: empezar por palabras de
                  alta frecuencia, avanzar según tu nivel y conectar cada nueva
                  palabra con ejemplos, lectura y práctica real.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/500-palabras-en-ingles"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F9EDA] px-8 py-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0D8EC4] hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  Empieza con vocabulario frecuente
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M13 7l5 5m0 0-5 5m5-5H6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </Link>
              </div>

              <div className="mt-9 grid gap-3 sm:grid-cols-3">
                {[
                  "Listas por nivel CEFR",
                  "Palabras de alta frecuencia",
                  "Ejemplos y traducción",
                ].map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-3 text-sm text-gray-600"
                  >
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 text-[#0F9EDA]">
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="m5 13 4 4L19 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                        />
                      </svg>
                    </span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute -right-8 -top-8 hidden h-28 w-28 rounded-full bg-[#0F9EDA]/10 lg:block" />
              <div className="absolute -bottom-8 -left-8 hidden h-36 w-36 rounded-full bg-gray-100 lg:block" />

              <svg
                className="relative w-full max-w-[420px]"
                viewBox="0 0 420 380"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background blob */}
                <ellipse
                  cx="210"
                  cy="190"
                  rx="180"
                  ry="160"
                  fill="#0F9EDA"
                  fillOpacity="0.06"
                />

                {/* Main flashcard stack */}
                <g transform="translate(60, 60)">
                  {/* Card 3 (back) */}
                  <rect
                    x="20"
                    y="10"
                    width="200"
                    height="140"
                    rx="16"
                    fill="white"
                    stroke="#E5E7EB"
                    strokeWidth="1.5"
                    transform="rotate(6 120 80)"
                  />

                  {/* Card 2 (middle) */}
                  <rect
                    x="10"
                    y="5"
                    width="200"
                    height="140"
                    rx="16"
                    fill="white"
                    stroke="#E5E7EB"
                    strokeWidth="1.5"
                    transform="rotate(-3 110 75)"
                  />

                  {/* Card 1 (front) */}
                  <rect
                    x="0"
                    y="0"
                    width="200"
                    height="140"
                    rx="16"
                    fill="white"
                    stroke="#0F9EDA"
                    strokeWidth="2"
                    strokeOpacity="0.2"
                  />

                  {/* Card content */}
                  <text
                    x="100"
                    y="45"
                    textAnchor="middle"
                    fill="#111827"
                    fontSize="22"
                    fontWeight="700"
                    fontFamily="system-ui, sans-serif"
                  >
                    achieve
                  </text>
                  <line
                    x1="40"
                    y1="58"
                    x2="160"
                    y2="58"
                    stroke="#E5E7EB"
                    strokeWidth="1"
                  />
                  <text
                    x="100"
                    y="85"
                    textAnchor="middle"
                    fill="#0F9EDA"
                    fontSize="16"
                    fontWeight="600"
                    fontFamily="system-ui, sans-serif"
                  >
                    lograr, alcanzar
                  </text>
                  <text
                    x="100"
                    y="110"
                    textAnchor="middle"
                    fill="#9CA3AF"
                    fontSize="12"
                    fontFamily="system-ui, sans-serif"
                  >
                    She worked hard to achieve her goals.
                  </text>
                </g>

                {/* Floating word tags */}
                <g transform="translate(280, 40)">
                  <rect
                    x="0"
                    y="0"
                    width="80"
                    height="32"
                    rx="16"
                    fill="#0F9EDA"
                    fillOpacity="0.1"
                    stroke="#0F9EDA"
                    strokeOpacity="0.25"
                    strokeWidth="1"
                  />
                  <text
                    x="40"
                    y="21"
                    textAnchor="middle"
                    fill="#0F9EDA"
                    fontSize="13"
                    fontWeight="600"
                    fontFamily="system-ui, sans-serif"
                  >
                    B2
                  </text>
                </g>

                <g transform="translate(310, 130)">
                  <rect
                    x="0"
                    y="0"
                    width="90"
                    height="32"
                    rx="16"
                    fill="#0F9EDA"
                    fillOpacity="0.1"
                    stroke="#0F9EDA"
                    strokeOpacity="0.25"
                    strokeWidth="1"
                  />
                  <text
                    x="45"
                    y="21"
                    textAnchor="middle"
                    fill="#0F9EDA"
                    fontSize="13"
                    fontWeight="600"
                    fontFamily="system-ui, sans-serif"
                  >
                    3,200+
                  </text>
                </g>

                <g transform="translate(40, 240)">
                  <rect
                    x="0"
                    y="0"
                    width="85"
                    height="32"
                    rx="16"
                    fill="#0F9EDA"
                    fillOpacity="0.1"
                    stroke="#0F9EDA"
                    strokeOpacity="0.25"
                    strokeWidth="1"
                  />
                  <text
                    x="42.5"
                    y="21"
                    textAnchor="middle"
                    fill="#0F9EDA"
                    fontSize="13"
                    fontWeight="600"
                    fontFamily="system-ui, sans-serif"
                  >
                    CEFR
                  </text>
                </g>

                <g transform="translate(290, 240)">
                  <rect
                    x="0"
                    y="0"
                    width="90"
                    height="32"
                    rx="16"
                    fill="#0F9EDA"
                    fillOpacity="0.1"
                    stroke="#0F9EDA"
                    strokeOpacity="0.25"
                    strokeWidth="1"
                  />
                  <text
                    x="45"
                    y="21"
                    textAnchor="middle"
                    fill="#0F9EDA"
                    fontSize="13"
                    fontWeight="600"
                    fontFamily="system-ui, sans-serif"
                  >
                    A1 — C2
                  </text>
                </g>

                {/* Small decorative dots */}
                <circle
                  cx="30"
                  cy="60"
                  r="4"
                  fill="#0F9EDA"
                  fillOpacity="0.15"
                />
                <circle
                  cx="380"
                  cy="300"
                  r="5"
                  fill="#0F9EDA"
                  fillOpacity="0.1"
                />
                <circle
                  cx="50"
                  cy="320"
                  r="3"
                  fill="#0F9EDA"
                  fillOpacity="0.12"
                />
                <circle
                  cx="370"
                  cy="80"
                  r="3"
                  fill="#0F9EDA"
                  fillOpacity="0.1"
                />
              </svg>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-gray-200 bg-gray-50 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
                <span className="mr-2.5 h-2 w-2 rounded-full bg-[#0F9EDA]" />
                Palabras de alta frecuencia
              </div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Por dónde empezar: las palabras más utilizadas que debes conocer
              </h2>
              <div className="space-y-4 text-lg leading-relaxed text-gray-600">
                <p>
                  Sin duda, una de las dudas iniciales más comunes es por dónde
                  arrancar y qué lista de palabras merece la pena priorizar. A
                  veces, los métodos convencionales animan a memorizar largas
                  secuencias de terminología sin hacer distinción, lo que puede
                  acabar siendo una fuente de desánimo. En realidad, distinguir
                  entre vocabulario frecuente y aquel menos útil puede marcar
                  toda la diferencia. Por encima de todo, conviene centrarse en
                  términos que realmente vas a encontrar en contextos
                  habituales, y dejar los más raros para etapas posteriores.
                </p>
                <p>
                  Las{" "}
                  <strong className="font-semibold text-gray-900">
                    500 palabras más usadas en inglés
                  </strong>{" "}
                  son un ejemplo claro de herramienta eficaz para enfocar el
                  estudio. Se trata de palabras seleccionadas porque se usan
                  ampliamente en distintos ámbitos, desde la conversación hasta
                  escenarios profesionales. Lo interesante aquí es que su
                  confección está basada en datos reales provenientes de
                  conversaciones, prensa y literatura, por lo que las palabras
                  elegidas reflejan genuinamente la realidad del inglés actual.
                  Este vocabulario conforma aproximadamente el{" "}
                  <strong className="font-semibold text-gray-900">
                    60 % del idioma
                  </strong>{" "}
                  que encontrarás en la mayoría de textos y situaciones
                  cotidianas, lo que otorga confianza al proceso y ahorra mucho
                  esfuerzo.
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-4xl">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                  <p className="text-sm font-semibold text-gray-900">
                    Muestra de las primeras 20 palabras
                  </p>
                  <span className="rounded-full border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 px-3 py-1 text-xs font-semibold text-[#0F9EDA]">
                    500 palabras
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50 text-xs font-medium uppercase tracking-wider text-gray-500">
                        <th className="w-12 px-4 py-3 text-center">#</th>
                        <th className="px-4 py-3">Palabra</th>
                        <th className="px-4 py-3">Significado</th>
                        <th className="px-4 py-3">Oración de ejemplo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {HIGH_FREQUENCY_WORD_PREVIEW.map((item) => {
                        const primaryDefinition = item.definition
                          .split("\n")
                          .map((l) => l.trim())
                          .find(Boolean)
                          ?.replace(/^\d+\.\s*/, "")
                          .replace(/\([^)]*\)\s*/g, "")
                          .replace(/\.$/, "")
                          .trim();

                        return (
                          <tr
                            key={item.index}
                            className="transition-colors duration-150 hover:bg-[#0F9EDA]/5"
                          >
                            <td className="px-4 py-3 text-center text-xs text-gray-400">
                              {item.index}
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-semibold text-gray-900">
                                {item.word}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              {primaryDefinition ?? "—"}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {item.example_sentence}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link
                  to="/500-palabras-en-ingles"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F9EDA] px-8 py-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0D8EC4] hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  Ver las 500 palabras más usadas
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M13 7l5 5m0 0-5 5m5-5H6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
                <span className="mr-2.5 h-2 w-2 rounded-full bg-[#0F9EDA]" />
                Por nivel
              </div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Vocabulario según tu nivel:{" "}
                <span className="text-[#0F9EDA]">
                  El poder de la clasificación por niveles
                </span>
              </h2>
              <div className="space-y-4 text-lg leading-relaxed text-gray-600">
                <p>
                  Además, la lista de vocabulario asigna un nivel de dificultad
                  a cada palabra, siguiendo el{" "}
                  <strong className="font-semibold text-gray-900">MCER</strong>{" "}
                  (Marco Común Europeo de Referencia para las Lenguas), lo que
                  facilita enormemente la personalización del aprendizaje. Así,
                  no te enfrentas prematuramente a términos que pueden resultar
                  inalcanzables. Es decir, alguien que está empezando puede
                  concentrarse en las palabras propias de los niveles A1 y A2 y,
                  gradualmente, avanzar hasta el C1.
                </p>
                <p>
                  Esta gradación protege tu motivación, ya que estudias
                  vocabulario realmente útil e inmediatamente aplicable. Cada
                  nivel está diseñado para que progreses con confianza,
                  dominando primero lo esencial antes de dar el salto a
                  conceptos más complejos.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {LEVELS.map((level) => {
                const isAvailable = availableLevels.has(level);
                const manifest = allVocabularyManifests.find(
                  (entry) => entry.level === level
                );

                return (
                  <Link
                    key={level}
                    to={isAvailable ? `/vocabulario/${level}` : "#"}
                    className={`group flex h-full flex-col rounded-2xl border p-6 transition-all duration-200 sm:p-8 ${
                      isAvailable
                        ? "border-gray-200 bg-white shadow-sm hover:border-[#0F9EDA]/30 hover:shadow-md"
                        : "border-dashed border-gray-300 bg-gray-50 opacity-60"
                    }`}
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <span
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border text-lg font-bold transition-colors duration-200 ${
                          isAvailable
                            ? "border-[#0F9EDA]/20 bg-[#0F9EDA]/10 text-[#0F9EDA] group-hover:border-[#0F9EDA] group-hover:bg-[#0F9EDA] group-hover:text-white"
                            : "border-gray-200 bg-gray-100 text-gray-400"
                        }`}
                      >
                        {level.toUpperCase()}
                      </span>
                      {/* {!isAvailable && (
                        <span className="text-xs font-medium text-gray-400">
                          Próximamente
                        </span>
                      )} */}
                      {isAvailable && (
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-300 transition-colors duration-200 group-hover:border-[#0F9EDA]/30 group-hover:text-[#0F9EDA]">
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M9 5l7 7-7 7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                        </span>
                      )}
                    </div>
                    <div>
                      <h3
                        className={`text-xl font-bold transition-colors duration-200 ${
                          isAvailable
                            ? "text-gray-900 group-hover:text-[#0F9EDA]"
                            : "text-gray-500"
                        }`}
                      >
                        {manifest?.mainHeading ??
                          `Nivel ${level.toUpperCase()}`}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-600">
                        {LEVEL_DESCRIPTIONS[level]}
                      </p>
                    </div>
                    {manifest?.intro && (
                      <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                        {manifest.intro}
                      </p>
                    )}
                    {isAvailable && (
                      <span className="mt-auto pt-5 text-sm font-semibold text-[#0F9EDA] transition-colors duration-200 group-hover:text-[#0D8EC4]">
                        Ver vocabulario →
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-gray-200 bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
                <span className="mr-2.5 h-2 w-2 rounded-full bg-[#0F9EDA]" />
                Por temáticas
              </div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Vocabulario por temáticas:{" "}
                <span className="text-[#0F9EDA]">
                  aprende lo que realmente necesitas
                </span>
              </h2>
              <div className="space-y-4 text-lg leading-relaxed text-gray-600">
                <p>
                  En la ruta hacia la fluidez, muchos han descubierto que
                  agrupar palabras por temas ayuda a conectar el lenguaje con
                  vivencias reales. Si las palabras se estudian en grupos
                  temáticos, no sólo se recuerda mejor, sino que enseguida
                  pueden aplicarse a situaciones similares. Por ejemplo, tener
                  un conjunto de términos para el restaurante te vuelve más
                  autónomo en ese contexto específico. De hecho, estudiar sin
                  contexto es como querer armar un puzle sin imagen de
                  referencia.
                </p>
              </div>
            </div>

            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Categorías esenciales para tu día a día
              </h3>
              <p className="text-base text-gray-600">
                Las siguientes áreas temáticas cubren muchos de los escenarios
                en los que más frecuentemente se desenvuelven quienes estudian
                inglés:
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  title: "Frases comunes",
                  description:
                    "Tener disponible en nuestra memoria frases que suelen ser muy usadas es una buena forma de hablar con seguridad.",
                  href: "/1000-frases-en-ingles",
                  icon: (
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7.5 8.25h9M7.5 12h6M21 12c0 4.142-4.03 7.5-9 7.5a10.1 10.1 0 0 1-3.53-.63L3 20.25l1.43-3.81A7.08 7.08 0 0 1 3 12c0-4.142 4.03-7.5 9-7.5s9 3.358 9 7.5Z"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Inglés para viajar",
                  description:
                    "Prepárate para pedir indicaciones, gestionar reservas y afrontar pequeños imprevistos en hoteles y aeropuertos.",
                  icon: (
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Inglés laboral y de negocios",
                  description:
                    "Útil para entrevistas, reuniones, correos y negociaciones en diferentes sectores profesionales.",
                  icon: (
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0 1 12 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2m4 6h.01M5 20h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Inglés académico",
                  description:
                    "Especialmente importante en presentaciones universitarias, trabajos escritos o ciencias.",
                  icon: (
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Phrasal verbs y expresiones",
                  description:
                    "Este apartado, aunque desafiante, acerca tu inglés al de los hablantes nativos.",
                  icon: (
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Inglés social y cultural",
                  description:
                    "Términos habituales para actividades de ocio, deportes y situaciones cotidianas.",
                  icon: (
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Vocabulario para mudarse al extranjero",
                  description:
                    "Incluye palabras relacionadas con vivienda, finanzas, trámites y sanidad, entre otros.",
                  icon: (
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Inglés para exámenes",
                  description:
                    "Dirigido a quienes se preparan para pruebas académicas o de acceso internacional.",
                  icon: (
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z"
                      />
                    </svg>
                  ),
                },
              ].map((category) => {
                const CardContent = () => (
                  <>
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 text-[#0F9EDA]">
                      {category.icon}
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-gray-900 transition-colors duration-200">
                      {category.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600">
                      {category.description}
                    </p>
                  </>
                );

                if (category.href) {
                  return (
                    <Link
                      key={category.title}
                      to={category.href}
                      className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0F9EDA]/30 hover:shadow-md sm:p-8 motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      <CardContent />
                      <span className="mt-auto pt-4 text-sm font-semibold text-[#0F9EDA] transition-colors duration-200 group-hover:text-[#0D8EC4]">
                        Explorar →
                      </span>
                    </Link>
                  );
                }

                return (
                  <article
                    key={category.title}
                    className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
                  >
                    <CardContent />
                    {/* <span className="mt-auto pt-4 text-sm font-medium text-gray-400">
                      Próximamente
                    </span> */}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-gray-200 bg-gray-50 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none text-gray-600 prose-headings:text-gray-900 prose-a:text-[#0F9EDA] prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Cómo memorizar vocabulario sin olvidarlo al día siguiente
              </h2>
              <p>
                Seguro que alguna vez te ha pasado: dedicas una tarde a nuevos
                términos y, unos días después, parecen haberse evaporado de tu
                memoria. La llamada curva del olvido es algo muy real. Ahora
                bien, la técnica de <strong>repetición espaciada</strong> se ha
                demostrado sumamente eficaz para fijar el vocabulario de manera
                duradera, ya que presenta las palabras justo antes de que tu
                mente esté por olvidarlas, creando un recuerdo más resistente.
              </p>

              <h3>La ciencia detrás de la retención perfecta</h3>
              <p>
                Entre las aplicaciones de referencia,{" "}
                <strong>
                  <a href="/blog/rol-de-anki-ingles">Anki</a>
                </strong>{" "}
                destaca por ajustar los tiempos de repaso a tu propio ritmo.
                Tras revisar una palabra, puedes valorar cuánto la recuerdas y
                el sistema, usando un algoritmo ampliamente estudiado, programa
                el siguiente repaso en el momento óptimo. Esta personalización
                evita perder horas con palabras que ya has dominado y pone el
                foco allí donde realmente lo necesitas, pareciéndose a un
                entrenador personal que sabe qué músculo debe ejercitar.
              </p>

              <h3>¿Por qué es vital espaciar los repasos?</h3>
              <p>
                La razón de organizar las revisiones en el tiempo no es sólo
                pedagógica: ayuda a consolidar realmente lo estudiado sin
                agotarse en repasos redundantes. La autonomía que brindan estas
                herramientas digitales te permite tener el control del proceso y
                centrar tus esfuerzos allá donde marcan tus propias lagunas, lo
                cual resulta, por experiencia, muy motivador.
              </p>

              <h2>
                Estrategias para usar las nuevas palabras en conversaciones
                reales
              </h2>
              <p>
                A pesar de conocer el significado de muchos términos, llevarlos
                a la práctica oral puede suponer un reto. Solo cuando se aplican
                activamente en situaciones comunicativas o textos, la memoria se
                fortalece y crece la confianza. Por eso, la transición del
                aprendizaje pasivo a la producción espontánea merece especial
                atención.
              </p>

              <h3>Del papel a la práctica: técnicas de inmersión</h3>
              <p>
                La forma más efectiva de que el léxico pase a tu repertorio
                activo es empleándolo en contextos cercanos a situaciones de la
                vida real. Por ejemplo, los ejercicios de rol, como hacer de
                comensal en un restaurante o simular una llamada telefónica,
                invitan a usar palabras nuevas con naturalidad. A veces, leer
                noticias o escribir pequeños textos diarios también facilita que
                las palabras se inserten de modo orgánico en tu día a día,
                logrando que tu inglés adquiera vida propia.
              </p>
              <ul>
                <li>
                  <strong>
                    <a href="/textos-en-ingles">
                      Lecturas en inglés adaptadas por nivel
                    </a>
                  </strong>{" "}
                  y artículos auténticos sirven para ver cómo el vocabulario
                  aparece en contexto, lo cual refuerza su retención.
                </li>
                <li>
                  Llevar un <strong>cuaderno de palabras</strong> donde anotas
                  ejemplos personales ayuda notablemente a que el aprendizaje
                  sea más significativo.
                </li>
                <li>
                  Las tareas de redacción, especialmente en colaboración con
                  otros, dan pie a plantear nuevas frases y recibir sugerencias
                  para optimizar el vocabulario empleado.
                </li>
              </ul>

              <h3>
                ¿Cómo equilibrar el estudio directo y la exposición natural?
              </h3>
              <p>
                En realidad, combinar el aprendizaje por listas con el uso
                incidental (como ocurre leyendo una novela o interactuando en
                foros) resulta especialmente provechoso. Así, las nuevas
                palabras dejan de ser etiquetas abstractas y pasan a ser
                herramientas útiles y recordadas, listas para emerger cuando el
                contexto lo requiere.
              </p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white py-16 sm:py-24">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#0F9EDA]/5 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 text-[#0F9EDA]">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547Z"
                />
              </svg>
            </div>

            <div className="prose prose-lg max-w-none text-gray-600 prose-headings:text-gray-900 prose-strong:text-gray-900">
              <p className="text-xl leading-relaxed sm:text-2xl">
                En definitiva, la adquisición del vocabulario inglés implica una
                mezcla equilibrada de elección estratégica, exposición constante
                y práctica intencional. Organizar el aprendizaje, valerse de
                buenas herramientas y aprovechar la motivación de medir avances
                posibilita que el número de palabras activas crezca de manera
                constante y muy provechosa.
              </p>
              <p className="text-lg leading-relaxed">
                Te animamos a emplear estos recursos con regularidad; poco a
                poco notarás que aquellas palabras que antes parecían
                inaccesibles se incorporan a tu conversación de forma casi
                automática. El verdadero éxito en inglés no radica solo en
                conocer muchas palabras, sino en sentirte capaz, con
                naturalidad, de utilizarlas cuando más las necesitas.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
