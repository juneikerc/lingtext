import type { Route } from "./+types/english-texts";
import { Link } from "react-router";
import TextsByLevelSelector, {
  type LevelTextsCard,
} from "~/components/TextsByLevelSelector";
import { formatSlug } from "~/helpers/formatSlug";
import { getTextsByLevel } from "~/lib/content/runtime";

const levels = [
  {
    id: "a1",
    name: "A1",
    title: "Textos para principiantes",
    description:
      "Lecturas muy sencillas para empezar a leer en ingles con vocabulario cotidiano y frases cortas.",
  },
  {
    id: "a2",
    name: "A2",
    title: "Textos para nivel elemental",
    description:
      "Lecturas breves con situaciones comunes, conversaciones simples y descripciones faciles de seguir.",
  },
  {
    id: "b1",
    name: "B1",
    title: "Textos para nivel intermedio",
    description:
      "Textos en ingles con mas contexto, ideas completas y temas utiles para estudio, trabajo y ocio.",
  },
  {
    id: "b2",
    name: "B2",
    title: "Textos para intermedio alto",
    description:
      "Lecturas mas amplias con argumentos, articulos y narraciones para desarrollar comprension real.",
  },
  {
    id: "c1",
    name: "C1",
    title: "Textos para nivel avanzado",
    description:
      "Lecturas exigentes para entrenar vocabulario abstracto, matices y estructuras complejas del ingles.",
  },
  {
    id: "c2",
    name: "C2",
    title: "Textos para dominio experto",
    description:
      "Textos en ingles muy avanzados para lectores que quieren practicar analisis, precision y fluidez total.",
  },
];

export function loader() {
  const levelCards: LevelTextsCard[] = levels.map((level) => {
    const texts = getTextsByLevel(level.id);

    return {
      ...level,
      totalTexts: texts.length,
      texts: texts.slice(0, 3).map((text) => ({
        title: text.title,
        slug: formatSlug(text.title),
        hasAudio: Boolean(text.sound),
      })),
    };
  });

  return { levelCards };
}

export function meta(_args: Route.MetaArgs) {
  return [
    {
      title:
        "Textos en ingles para leer | Lecturas para todos los niveles",
    },
    {
      name: "description",
      content:
        "Encuentra textos en ingles para leer segun tu nivel. Explora lecturas A1, A2, B1, B2, C1 y C2 con ejemplos reales y acceso directo a cada nivel.",
    },
    {
      tagName: "link",
      rel: "canonical",
      href: "https://lingtext.org/textos-en-ingles",
    },
  ];
}

export default function TextosEnInglesPage({
  loaderData,
}: Route.ComponentProps) {
  const { levelCards } = loaderData;

  return (
    <>
      <section className="relative overflow-hidden border-b border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-950 sm:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-[10%] top-[10%] h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-400/5" />
          <div className="absolute bottom-[10%] right-[10%] h-64 w-64 rounded-full bg-sky-500/10 blur-3xl dark:bg-sky-400/5" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
            >
              <svg
                className="mr-2 h-4 w-4"
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
            </Link>
          </nav>

          <div className="mb-6 inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
            Lecturas para todos los niveles
          </div>

          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-gray-900 dark:text-gray-100 sm:text-5xl lg:text-6xl">
            Textos en ingles para leer y practicar segun tu nivel
          </h1>

          <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400 sm:text-xl">
            <p>
              Si buscas{" "}
              <strong className="text-gray-900 dark:text-gray-100">
                textos en ingles
              </strong>{" "}
              para mejorar tu lectura, aqui encuentras opciones organizadas por
              nivel desde A1 hasta C2.
            </p>
            <p>
              Cada bloque incluye ejemplos reales para empezar a leer hoy mismo
              y un enlace directo al nivel correspondiente para descubrir mas
              lecturas.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#textos-por-nivel"
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:hover:bg-indigo-500 dark:focus-visible:ring-offset-gray-950"
            >
              Ver textos por nivel
            </a>
            <Link
              to="/levels/a1"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-950"
            >
              Empezar con A1
            </Link>
          </div>
        </div>
      </section>

      <section
        id="textos-por-nivel"
        className="relative overflow-hidden border-b border-gray-200 bg-gray-50 py-16 dark:border-gray-800 dark:bg-gray-950 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-sm">
              <svg
                className="h-6 w-6 text-white"
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
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Textos en ingles organizados por nivel
              </h2>
              <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                Elige tu nivel y empieza con 3 lecturas recomendadas antes de
                pasar al listado completo.
              </p>
            </div>
          </div>

          <TextsByLevelSelector items={levelCards} />
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-16 dark:bg-gray-950 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-gray-600 dark:prose-invert dark:text-gray-400">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Como aprovechar mejor estos textos en ingles
            </h2>
            <p>
              Leer de forma constante es una de las maneras mas efectivas de
              avanzar en el idioma. Cuando eliges textos en ingles adaptados a
              tu nivel, puedes entender mejor el contexto, captar vocabulario
              nuevo sin frustrarte y ganar seguridad a medida que avanzas de una
              lectura a otra.
            </p>
            <p>
              Esta pagina esta pensada para personas que quieren encontrar
              lecturas listas para usar. En lugar de perder tiempo buscando
              material adecuado, aqui puedes ir directo al nivel que te
              corresponde, abrir un texto y empezar a practicar comprension
              lectora con contenido real.
            </p>
            <p>
              Si estas empezando, los niveles A1 y A2 te ayudan a construir base
              con frases cortas, dialogos sencillos y vocabulario de uso diario.
              Si ya tienes mas soltura, los niveles B1 y B2 te ofrecen textos en
              ingles con ideas mas desarrolladas. Para lectores avanzados, C1 y
              C2 incluyen lecturas mas densas y retadoras, ideales para seguir
              ampliando vocabulario y precision.
            </p>
            <p>
              La mejor estrategia es simple: elige un nivel, lee varios textos
              en ingles cada semana y repite las lecturas mas utiles para ti.
              Con esa practica, encontraras nuevas palabras en contexto,
              mejoraras tu velocidad de lectura y tendras una ruta clara para
              seguir progresando en ingles.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
