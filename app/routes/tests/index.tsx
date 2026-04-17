import { Link } from "react-router";

import { getAllTestLevels, getAllTestSkills } from "~/features/tests/catalog";
import type { Route } from "./+types/index";

export function loader() {
  return {
    levels: getAllTestLevels(),
    skills: getAllTestSkills(),
  };
}

export function meta(_args: Route.MetaArgs) {
  const title = "Tests de ingles interactivos por nivel | LingText";
  const description =
    "Haz test de nivel de ingles A1, A2, B1, B2, C1 y C2 con pruebas interactivas de reading, grammar, vocabulary y dictation.";
  const url = "https://lingtext.org/tests";

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
  ];
}

const SKILL_ICONS: Record<string, string> = {
  reading: "📖",
  grammar: "✏️",
  vocabulary: "💡",
  dictation: "🎧",
};

export default function TestsIndexPage({ loaderData }: Route.ComponentProps) {
  const { levels, skills } = loaderData;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white py-20 md:py-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-[8%] top-[10%] h-64 w-64 rounded-full bg-[#0F9EDA]/5 blur-3xl"></div>
          <div className="absolute bottom-[8%] right-[10%] h-64 w-64 rounded-full bg-[#0F9EDA]/5 blur-3xl"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-[#0F9EDA]"
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
          </nav>

          <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
            <span className="mr-2.5 h-2 w-2 rounded-full bg-[#0F9EDA]"></span>
            Nuevo pilar de practica
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Tests de ingles interactivos para practicar con pruebas ajustadas a
            tu <span className="text-[#0F9EDA]">nivel</span>
          </h1>

          <div className="mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-gray-600">
            <p>
              Lingtext tiene como enfoque principal la practica de idioma a
              través de la lectura. Sin embargo también creemos que pruebas
              sencillas ajustadas a tu nivel pueden beneficiarte mucho para
              medir tu destresa en ciertas habilidades.
            </p>
            <p>
              Esta seccion convierte LingText en un circuito mas completo: haces
              una prueba rapida, detectas tu punto actual y luego saltas a
              lecturas y review con una direccion mucho mas clara.
            </p>
            <p>
              Puedes entrenar{" "}
              <span className="inline-flex items-center rounded-full border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 px-2.5 py-0.5 text-sm font-medium text-[#0F9EDA]">
                reading
              </span>
              ,{" "}
              <span className="inline-flex items-center rounded-full border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 px-2.5 py-0.5 text-sm font-medium text-[#0F9EDA]">
                grammar
              </span>
              ,{" "}
              <span className="inline-flex items-center rounded-full border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 px-2.5 py-0.5 text-sm font-medium text-[#0F9EDA]">
                vocabulary
              </span>{" "}
              y{" "}
              <span className="inline-flex items-center rounded-full border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 px-2.5 py-0.5 text-sm font-medium text-[#0F9EDA]">
                dictation
              </span>{" "}
              segun el nivel que quieras practicar.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/tests/a1"
              className="inline-flex items-center justify-center rounded-xl bg-[#0F9EDA] px-8 py-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0D8EC4] hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Empezar con A1
            </Link>
            <Link
              to="/textos-en-ingles"
              className="inline-flex items-center justify-center rounded-xl border border-[#0F9EDA]/20 bg-white px-8 py-4 text-sm font-semibold text-[#0F9EDA] transition-colors duration-200 hover:border-[#0F9EDA]/40 hover:bg-[#0F9EDA]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Ver lecturas por nivel
            </Link>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="relative border-b border-gray-200 bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
              <span className="mr-2.5 h-2 w-2 rounded-full bg-[#0F9EDA]"></span>
              Skills disponibles
            </div>
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Que <span className="text-[#0F9EDA]">skills</span> puedes
              practicar
            </h2>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
              Cada skill tiene sesiones cortas para mantener ritmo, detectar
              errores y llevarte luego al contenido adecuado dentro de LingText.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {skills.map((skill) => (
              <article
                key={skill.id}
                className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 text-xl">
                  {SKILL_ICONS[skill.id] || "📝"}
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  {skill.name}
                </h3>
                <p className="mb-4 text-sm font-semibold text-[#0F9EDA]">
                  {skill.shortDescription}
                </p>
                <p className="text-sm leading-relaxed text-gray-600">
                  {skill.longDescription}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Levels */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
              <span className="mr-2.5 h-2 w-2 rounded-full bg-[#0F9EDA]"></span>
              Por nivel
            </div>
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Elige tu <span className="text-[#0F9EDA]">nivel</span> y empieza
              un examen.
            </h2>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
              Cada pagina agrupa las pruebas disponibles por nivel y te conecta
              luego con las lecturas del mismo nivel.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {levels.map((level) => (
              <Link
                key={level.id}
                to={`/tests/${level.id}`}
                className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-200 hover:border-[#0F9EDA]/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 text-lg font-bold text-[#0F9EDA] transition-colors duration-200 group-hover:bg-[#0F9EDA] group-hover:text-white group-hover:border-[#0F9EDA]">
                    {level.name}
                  </span>
                  <svg
                    className="h-5 w-5 text-gray-300 transition-colors duration-200 group-hover:text-[#0F9EDA]"
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
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-[#0F9EDA]">
                  {level.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-600">
                  {level.description}
                </p>
                <div className="mt-auto flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    {level.focus}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
