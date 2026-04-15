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
    "Haz tests de ingles A1, A2, B1, B2, C1 y C2 con pruebas interactivas de reading, grammar, vocabulary y dictation.";
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

export default function TestsIndexPage({ loaderData }: Route.ComponentProps) {
  const { levels, skills } = loaderData;

  return (
    <>
      <section className="relative overflow-hidden border-b border-gray-200 bg-white py-16 sm:py-24">
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

          <div className="inline-flex items-center rounded-full border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 px-4 py-2 text-sm font-medium text-[#0F9EDA]">
            <span className="mr-2.5 h-2 w-2 rounded-full bg-[#0F9EDA]"></span>
            Nuevo pilar de practica
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Tests de ingles interactivos para medir tu nivel y volver a leer con
            objetivo
          </h1>

          <div className="mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-gray-600">
            <p>
              Esta seccion convierte LingText en un circuito mas completo: haces
              una prueba rapida, detectas tu punto actual y luego saltas a
              lecturas y review con una direccion mucho mas clara.
            </p>
            <p>
              Puedes entrenar <strong className="text-gray-900">reading</strong>
              , <strong className="text-gray-900">grammar</strong>,{" "}
              <strong className="text-gray-900">vocabulary</strong> y{" "}
              <strong className="text-gray-900">dictation</strong> segun el
              nivel que quieras practicar.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/tests/a1"
              className="inline-flex items-center justify-center rounded-xl bg-[#0F9EDA] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#0D8EC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Empezar con A1
            </Link>
            <Link
              to="/textos-en-ingles"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:border-[#0F9EDA] hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Ver lecturas por nivel
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Que skills puedes practicar ahora
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              Cada skill tiene sesiones cortas para mantener ritmo, detectar
              errores y llevarte luego al contenido adecuado dentro de LingText.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {skills.map((skill) => (
              <article
                key={skill.id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="inline-flex rounded-2xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 px-3 py-2 text-sm font-semibold text-[#0F9EDA]">
                  {skill.name}
                </div>
                <h3 className="mt-4 text-xl font-bold text-gray-900">
                  {skill.shortDescription}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {skill.longDescription}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Elige tu nivel y lanza una sesion
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              Cada landing por nivel agrupa las pruebas disponibles y te conecta
              luego con las lecturas del mismo nivel.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {levels.map((level) => (
              <article
                key={level.id}
                className="flex h-full flex-col rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#0F9EDA]/20 bg-white text-lg font-bold text-[#0F9EDA]">
                    {level.name}
                  </span>
                  <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-gray-600">
                    Tests por nivel
                  </span>
                </div>
                <h3 className="mt-5 text-2xl font-bold text-gray-900">
                  {level.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {level.description}
                </p>
                <p className="mt-4 text-sm font-medium text-gray-700">
                  Foco: {level.focus}
                </p>
                <div className="mt-auto pt-6">
                  <Link
                    to={`/tests/${level.id}`}
                    className="inline-flex w-full items-center justify-between rounded-xl bg-[#0F9EDA] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#0D8EC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
                  >
                    <span>Ver pruebas {level.name}</span>
                    <svg
                      className="h-4 w-4"
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
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
