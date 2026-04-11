import type { Route } from "./+types/english-texts";
import { Link } from "react-router";
import TextsByLevelSelector, {
  type LevelTextsCard,
} from "~/components/TextsByLevelSelector";
import { formatSlug } from "~/helpers/formatSlug";
import { getTextsByLevel } from "~/lib/content/runtime";
import type { TextManifestEntry } from "~/lib/content/types";

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
    // Open Graph
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:site_name", content: "LingText" },
    {
      property: "og:image",
      content: "https://lingtext.org/textos-en-ingles-image.png",
    },
    // Twitter Card
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

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-white border-b border-gray-200">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-[10%] top-[10%] w-64 h-64 bg-[#0F9EDA]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[10%] right-[10%] w-64 h-64 bg-[#0F9EDA]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#0F9EDA] transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m15 18-6-6 6-6"
                />
              </svg>
              Volver al inicio
            </Link>
          </nav>

          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-[#0F9EDA] bg-[#0F9EDA]/10 rounded-full border border-[#0F9EDA]/20">
            <span className="w-2 h-2 bg-[#0F9EDA] rounded-full mr-2.5"></span>
            Lecturas para todos los niveles
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
            Textos en inglés para leer y practicar según tu nivel
          </h1>

          <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-gray-600">
            <p>
              Si buscas{" "}
              <strong className="text-gray-900">textos en inglés</strong> para
              mejorar tu lectura, aquí encuentras opciones organizadas por nivel
              desde A1 hasta C2.
            </p>
            <p>
              Cada bloque incluye ejemplos reales para empezar a leer hoy mismo
              y un enlace directo al nivel correspondiente para descubrir más
              lecturas.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href="#textos-por-nivel"
              className="inline-flex items-center justify-center rounded-xl bg-[#0F9EDA] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0D8EC4] hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Ver textos por nivel
            </a>
            <Link
              to="/levels/a1"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:border-[#0F9EDA] hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Empezar con A1
            </Link>
          </div>
        </div>
      </section>

      {/* Textos por nivel */}
      <section
        id="textos-por-nivel"
        className="relative overflow-hidden py-16 sm:py-24 bg-gray-50 border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 bg-white rounded-full border border-gray-200 shadow-sm">
              <span className="w-2 h-2 bg-[#0F9EDA] rounded-full mr-2.5"></span>
              Por nivel
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">
              Textos en inglés organizados por nivel
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Elige tu nivel y empieza con 3 lecturas recomendadas antes de
              pasar al listado completo.
            </p>
          </div>

          <TextsByLevelSelector items={levelCards} />
        </div>
      </section>

      {/* Contenido SEO */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-gray-600">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Cómo aprovechar mejor estos textos en inglés
            </h2>
            <p>
              Leer de forma constante es una de las maneras más efectivas de
              avanzar en el idioma. Cuando eliges textos en inglés adaptados a
              tu nivel, puedes entender mejor el contexto, captar vocabulario
              nuevo sin frustrarte y ganar seguridad a medida que avanzas de una
              lectura a otra.
            </p>
            <p>
              Esta página está pensada para personas que quieren encontrar
              lecturas listas para usar. En lugar de perder tiempo buscando
              material adecuado, aquí puedes ir directo al nivel que te
              corresponde, abrir un texto y empezar a practicar comprensión
              lectora con contenido real.
            </p>
            <p>
              Si estás empezando, los niveles A1 y A2 te ayudan a construir base
              con frases cortas, diálogos sencillos y vocabulario de uso diario.
              Si ya tienes más soltura, los niveles B1 y B2 te ofrecen textos en
              inglés con ideas más desarrolladas. Para lectores avanzados, C1 y
              C2 incluyen lecturas más densas y retadoras, ideales para seguir
              ampliando vocabulario y precisión.
            </p>
            <p>
              La mejor estrategia es simple: elige un nivel, lee varios textos
              en inglés cada semana y repite las lecturas más útiles para ti.
              Con esa práctica, encontrarás nuevas palabras en contexto,
              mejorarás tu velocidad de lectura y tendrás una ruta clara para
              seguir progresando en inglés.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
