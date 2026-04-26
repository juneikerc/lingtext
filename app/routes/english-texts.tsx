import { Link } from "react-router";

import { formatSlug } from "~/helpers/formatSlug";
import { getTextsByLevel } from "~/lib/content/runtime";
import type { TextManifestEntry } from "~/lib/content/types";
import type { Route } from "./+types/english-texts";

type FeaturedText = {
  title: string;
  slug: string;
  hasAudio: boolean;
};

type LevelTextsCard = {
  id: string;
  name: string;
  title: string;
  description: string;
  totalTexts: number;
  texts: FeaturedText[];
};

const levels = [
  {
    id: "a1",
    name: "A1",
    title: "Textos para principiantes",
    description:
      "Lecturas muy sencillas para empezar a leer en inglés con vocabulario cotidiano y frases cortas.",
  },
  {
    id: "a2",
    name: "A2",
    title: "Textos para nivel elemental",
    description:
      "Lecturas breves con situaciones comunes, conversaciones simples y descripciones fáciles de seguir.",
  },
  {
    id: "b1",
    name: "B1",
    title: "Textos para nivel intermedio",
    description:
      "Textos en inglés con más contexto, ideas completas y temas útiles para estudio, trabajo y ocio.",
  },
  {
    id: "b2",
    name: "B2",
    title: "Textos para intermedio alto",
    description:
      "Lecturas más amplias con argumentos, artículos y narraciones para desarrollar comprensión real.",
  },
  {
    id: "c1",
    name: "C1",
    title: "Textos para nivel avanzado",
    description:
      "Lecturas exigentes para entrenar vocabulario abstracto, matices y estructuras complejas del inglés.",
  },
  {
    id: "c2",
    name: "C2",
    title: "Textos para dominio experto",
    description:
      "Textos en inglés muy avanzados para lectores que quieren practicar análisis, precisión y fluidez total.",
  },
];

const READING_BENEFITS = [
  "Textos graduados por nivel",
  "Lectura interactiva palabra a palabra",
  "Audio disponible en lecturas seleccionadas",
];

export function loader() {
  const levelCards: LevelTextsCard[] = levels.map((level) => {
    const texts = getTextsByLevel(level.id);

    return {
      ...level,
      totalTexts: texts.length,
      texts: texts.slice(0, 3).map((text: TextManifestEntry) => ({
        title: text.title,
        slug: formatSlug(text.title),
        hasAudio: Boolean(text.sound),
      })),
    };
  });

  return { levelCards };
}

export function meta(_args: Route.MetaArgs) {
  const title = "Textos en inglés para leer | Lecturas para todos los niveles";
  const description =
    "Encuentra textos en inglés para leer según tu nivel. Explora lecturas A1, A2, B1, B2, C1 y C2 con ejemplos reales y acceso directo a cada nivel.";
  const url = "https://lingtext.org/textos-en-ingles";

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:site_name", content: "LingText" },
    {
      property: "og:image",
      content: "https://lingtext.org/textos-en-ingles-image.png",
    },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "twitter:image",
      content: "https://lingtext.org/textos-en-ingles-image.png",
    },
  ];
}

export default function TextosEnInglesPage({
  loaderData,
}: Route.ComponentProps) {
  const { levelCards } = loaderData;
  const totalTexts = levelCards.reduce(
    (total, level) => total + level.totalTexts,
    0
  );

  return (
    <>
      <section className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-[5%] top-10 h-72 w-72 rounded-full bg-[#0F9EDA]/10 blur-3xl" />
          <div className="absolute -bottom-24 left-[10%] h-64 w-64 rounded-full bg-[#0F9EDA]/5 blur-3xl" />
          <div className="absolute right-0 top-24 hidden h-[30rem] w-[20rem] rounded-l-full bg-[#0F9EDA]/10 lg:block" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)] lg:px-8 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,28rem)]">
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
              Textos en inglés para leer y practicar según tu{" "}
              <span className="text-[#0F9EDA]">nivel</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
              Encuentra lecturas organizadas desde A1 hasta C2, abre textos
              reales y usa LingText para leer con contexto, tocar palabras y
              construir vocabulario sin perder el hilo.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#textos-por-nivel"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F9EDA] px-8 py-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0D8EC4] hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Ver textos por nivel
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
              </a>
              <Link
                to="/levels/a1"
                className="inline-flex items-center justify-center rounded-xl border border-[#0F9EDA]/20 bg-white px-8 py-4 text-sm font-semibold text-[#0F9EDA] transition-colors duration-200 hover:border-[#0F9EDA]/40 hover:bg-[#0F9EDA]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Empezar con A1
              </Link>
            </div>

            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              {READING_BENEFITS.map((benefit) => (
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

          <div className="relative lg:justify-self-end">
            <div className="absolute -right-8 -top-8 hidden h-28 w-28 rounded-full bg-[#0F9EDA]/10 lg:block" />
            <div className="absolute -bottom-8 -left-8 hidden h-36 w-36 rounded-full bg-gray-100 lg:block" />
            <div className="relative rounded-3xl border border-gray-200 bg-white p-5 shadow-lg sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Lecturas disponibles
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Organizadas por nivel CEFR
                  </p>
                </div>
                <span className="rounded-full border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 px-3 py-1 text-xs font-semibold text-[#0F9EDA]">
                  {totalTexts} textos
                </span>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2">
                {levelCards.map((level) => (
                  <Link
                    key={level.id}
                    to={`/levels/${level.id}`}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-3.5 transition-colors duration-200 hover:border-[#0F9EDA]/30 hover:bg-[#0F9EDA]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#0F9EDA]/20 bg-white text-sm font-bold text-[#0F9EDA]">
                      {level.name}
                    </div>
                    <h2 className="text-[13px] font-bold leading-snug text-gray-900">
                      {level.title}
                    </h2>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">
                      {level.totalTexts} textos disponibles
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="textos-por-nivel"
        className="relative overflow-hidden border-b border-gray-200 bg-gray-50 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
              <span className="mr-2.5 h-2 w-2 rounded-full bg-[#0F9EDA]" />
              Por nivel
            </div>
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Textos en inglés organizados por{" "}
              <span className="text-[#0F9EDA]">nivel</span>
            </h2>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
              Elige tu nivel y empieza con lecturas recomendadas antes de pasar
              al listado completo.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {levelCards.map((level) => (
              <article
                key={level.id}
                className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-[#0F9EDA]/30 hover:shadow-md sm:p-8"
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 text-lg font-bold text-[#0F9EDA] transition-colors duration-200 group-hover:border-[#0F9EDA] group-hover:bg-[#0F9EDA] group-hover:text-white">
                    {level.name}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    {level.totalTexts} textos
                  </span>
                </div>

                <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-[#0F9EDA]">
                  {level.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {level.description}
                </p>

                <div className="mt-6 space-y-3">
                  {level.texts.map((text) => (
                    <Link
                      key={`${level.id}-${text.slug}`}
                      to={`/texts/${text.slug}?source=collection`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 transition-colors duration-200 hover:border-[#0F9EDA]/30 hover:bg-[#0F9EDA]/5 hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      rel="nofollow"
                    >
                      <span className="font-medium">{text.title}</span>
                      <span className="inline-flex items-center gap-2">
                        {text.hasAudio ? (
                          <span className="rounded-full border border-[#0F9EDA]/10 bg-[#0F9EDA]/5 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#0F9EDA]">
                            Audio
                          </span>
                        ) : null}
                        <svg
                          className="h-4 w-4 shrink-0"
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
                    </Link>
                  ))}
                </div>

                <div className="mt-auto pt-6">
                  <Link
                    to={`/levels/${level.id}`}
                    className="inline-flex w-full items-center justify-between rounded-xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/5 px-4 py-3 text-sm font-semibold text-[#0F9EDA] transition-colors duration-200 hover:border-[#0F9EDA]/40 hover:bg-[#0F9EDA]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    <span>Ver más lecturas en inglés {level.name}</span>
                    <svg
                      className="h-4 w-4 shrink-0"
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
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-12">
            <div className="mb-8 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
              <span className="mr-2.5 h-2 w-2 rounded-full bg-[#0F9EDA]" />
              Guia de lectura
            </div>
            <div className="prose prose-lg max-w-none text-gray-600">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Cómo aprovechar mejor estos textos en inglés
              </h2>
              <p>
                Leer de forma constante es una de las maneras más efectivas de
                avanzar en el idioma. Cuando eliges textos en inglés adaptados a
                tu nivel, puedes entender mejor el contexto, captar vocabulario
                nuevo sin frustrarte y ganar seguridad a medida que avanzas de
                una lectura a otra.
              </p>
              <p>
                Esta página está pensada para personas que quieren encontrar
                lecturas listas para usar. En lugar de perder tiempo buscando
                material adecuado, aquí puedes ir directo al nivel que te
                corresponde, abrir un texto y empezar a practicar comprensión
                lectora con contenido real.
              </p>
              <p>
                Si estás empezando, los niveles A1 y A2 te ayudan a construir
                base con frases cortas, diálogos sencillos y vocabulario de uso
                diario. Si ya tienes más soltura, los niveles B1 y B2 te ofrecen
                textos en inglés con ideas más desarrolladas. Para lectores
                avanzados, C1 y C2 incluyen lecturas más densas y retadoras,
                ideales para seguir ampliando vocabulario y precisión.
              </p>
              <p>
                La mejor estrategia es simple: elige un nivel, lee varios textos
                en inglés cada semana y repite las lecturas más útiles para ti.
                Con esa práctica, encontrarás nuevas palabras en contexto,
                mejorarás tu velocidad de lectura y tendrás una ruta clara para
                seguir progresando en inglés.
              </p>
              <h2 className="mt-10 text-3xl font-bold tracking-tight text-gray-900">
                La lectura interactiva: aprender inglés sin perder el flujo
              </h2>
              <p>
                El mayor obstáculo al leer en inglés no es la dificultad del
                texto, es la interrupción. Cada vez que buscas una palabra en el
                diccionario, pierdes el hilo de la historia y la motivación
                baja. LingText resuelve esto con un traductor integrado que
                funciona directamente sobre el texto: tocas una palabra y ves su
                significado al instante, sin cambiar de pantalla.
              </p>
              <p>
                Ese flujo continuo es lo que marca la diferencia. Cuando
                mantienes la concentración en la lectura, tu cerebro procesa el
                inglés como información real y no como un ejercicio aislado. Ver
                una palabra en su contexto natural la hace mucho más memorable
                que estudiarla en una lista separada. Además, al no romper la
                experiencia, lees más tiempo y con menos frustración.
              </p>
              <p>
                La clave está en que cada texto se convierte en tu propia
                lección. No necesitas preparar nada antes de empezar: abres una
                lectura de tu nivel, tocas lo que no entiendes y sigues
                avanzando. Con el tiempo, notarás que necesitas tocar menos
                palabras porque ya las reconoces del contexto. Esa es la señal
                real de que estás progresando.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
