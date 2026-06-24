import { Link } from "react-router";

import type { Route } from "./+types/juneikerc";

export function meta(_args: Route.MetaArgs) {
  return [
    {
      title: "Juneiker Castillo, creador de LingText | Autor",
    },
    {
      name: "description",
      content:
        "Conoce a Juneiker Castillo, creador de LingText y aprendiz de inglés a través del input comprensible.",
    },
    {
      tagName: "link",
      rel: "canonical",
      href: "https://lingtext.org/autor/juneikerc",
    },
  ];
}

const focusAreas = [
  "Input comprensible para aprender inglés con contenido real.",
  "Lectura y escucha como hábitos centrales del aprendizaje.",
  "Vocabulario en contexto en lugar de listas aisladas.",
  "Herramientas simples para mantener exposición diaria al idioma.",
];

const recommendedResources = [
  {
    title: "Textos en inglés",
    description:
      "Lecturas organizadas para exponerte al idioma con más contexto y avanzar sin depender solo de ejercicios aislados.",
    href: "/textos-en-ingles",
  },
  {
    title: "Vocabulario",
    description:
      "Recursos para estudiar palabras frecuentes y conectar vocabulario nuevo con frases y situaciones reales.",
    href: "/vocabulario",
  },
  {
    title: "Pruebas por nivel",
    description:
      "Ejercicios de práctica adaptados por nivel para trabajar comprensión, vocabulario y escucha con una dificultad adecuada.",
    href: "/tests",
  },
];

export default function JuneikerAuthorPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-950">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <nav className="mb-8">
            <Link
              to="/blog"
              className="inline-flex items-center rounded-lg text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver al blog
            </Link>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[0.72fr_1fr] lg:items-center">
            <div>
              <img
                src="/juneiker-castillo.png"
                alt="Foto de Juneiker Castillo"
                className="h-44 w-44 rounded-full border border-gray-200 bg-gray-100 object-cover shadow-sm sm:h-52 sm:w-52"
                decoding="async"
                loading="eager"
              />
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#0F9EDA]">
                Autor en LingText
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
                Juneiker Castillo
              </h1>
              <p className="mt-4 max-w-2xl text-xl leading-8 text-gray-700">
                Creador de LingText y aprendiz de inglés a través del input
                comprensible.
              </p>
              <p className="mt-5 max-w-3xl text-base leading-7 text-gray-600">
                Escribo sobre aprendizaje de inglés desde la experiencia de
                haber usado lectura, escucha y contenido real como parte central
                de mi propio proceso. LingText nació para hacer ese camino más
                claro, constante y accesible para otros estudiantes
                hispanohablantes.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="https://juneikerc.com/"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-950 transition-colors duration-200 hover:border-[#0F9EDA]/40 hover:text-[#0A7AAB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  Visitar sitio personal
                </a>
                <a
                  href="https://www.linkedin.com/in/juneiker-castillo/"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-950 transition-colors duration-200 hover:border-[#0F9EDA]/40 hover:text-[#0A7AAB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#0F9EDA]">
              Sobre el autor
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-gray-950">
              Por qué escribo en LingText
            </h2>
          </div>

          <div className="space-y-6 text-base leading-8 text-gray-600">
            <p>
              Durante mi aprendizaje descubrí que avanzar en inglés no depende
              solo de memorizar reglas o completar ejercicios. Lo que más me
              ayudó fue pasar más tiempo entendiendo contenido en inglés:
              leyendo, escuchando, revisando palabras en contexto y volviendo a
              encontrar esas palabras en nuevas situaciones hasta que empezaban
              a sentirse familiares.
            </p>
            <p>
              Ese proceso me mostró algo importante: cuando el contenido es
              comprensible, interesante y está cerca de tu nivel, estudiar deja
              de sentirse como una lista interminable de temas sueltos. Empiezas
              a reconocer patrones, expresiones y vocabulario dentro de
              historias reales, conversaciones, artículos o subtítulos. Para mí,
              esa exposición repetida fue mucho más útil que estudiar palabras
              aisladas sin contexto.
            </p>
            <p>
              Ese es el punto de partida de LingText. La plataforma está pensada
              para estudiantes que quieren exponerse más al idioma sin perderse
              cada vez que aparece una palabra nueva. El objetivo es convertir
              textos, subtítulos y vocabulario en una experiencia de estudio más
              natural, donde puedas entender más, guardar lo que necesitas
              repasar y volver al contenido con menos fricción.
            </p>
            <p>
              También escribo en LingText porque sé que muchos estudiantes
              hispanohablantes entienden la teoría, pero no siempre saben cómo
              convertirla en una rutina práctica. Por eso intento crear guías
              que expliquen cómo leer más, cómo usar el vocabulario en contexto,
              cómo practicar según tu nivel y cómo mantener contacto frecuente
              con el inglés sin depender únicamente de métodos tradicionales.
            </p>
            <p>
              Mi experiencia como desarrollador me permite construir la
              herramienta, pero el centro de LingText es el aprendizaje: hacer
              que leer, escuchar y practicar inglés sea más fácil de sostener
              todos los días.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#0F9EDA]">
              Recursos
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-gray-950">
              Por dónde empezar en LingText
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Si estás aprendiendo inglés con input comprensible, estos son los
              espacios que mejor conectan lectura, vocabulario y práctica
              ajustada a tu nivel.
            </p>
          </div>

          <div className="grid gap-4">
            {recommendedResources.map((resource) => (
              <Link
                key={resource.href}
                to={resource.href}
                className="group rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-200 hover:border-[#0F9EDA]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
              >
                <h3 className="text-lg font-semibold text-gray-950 transition-colors duration-200 group-hover:text-[#0A7AAB]">
                  {resource.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {resource.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#0F9EDA]">
              Enfoque
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-gray-950">
              Aprender inglés con más contexto y menos fricción
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {focusAreas.map((area) => (
              <div
                key={area}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm leading-6 text-gray-700">{area}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
