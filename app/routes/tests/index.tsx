import { Link } from "react-router";

import { getAllTestLevels, getAllTestSkills } from "~/features/tests/catalog";
import type { TestSkill } from "~/features/tests/types";
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

const SKILL_ICONS: Record<TestSkill, React.ReactNode> = {
  reading: (
    <svg
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
      <path
        d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  ),
  grammar: (
    <svg
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
      <path
        d="M19.5 7.125 16.875 4.5M5 21h14"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  ),
  vocabulary: (
    <svg
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M7.5 8.25h9M7.5 12h6M21 12c0 4.142-4.03 7.5-9 7.5a10.1 10.1 0 0 1-3.53-.63L3 20.25l1.43-3.81A7.08 7.08 0 0 1 3 12c0-4.142 4.03-7.5 9-7.5s9 3.358 9 7.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  ),
  dictation: (
    <svg
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M4 13.5a8 8 0 0 1 16 0M4 13.5v3A2.5 2.5 0 0 0 6.5 19H8v-7H6.5A2.5 2.5 0 0 0 4 14.5M20 13.5v3a2.5 2.5 0 0 1-2.5 2.5H16v-7h1.5a2.5 2.5 0 0 1 2.5 2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  ),
};

const HERO_BENEFITS = [
  "Contenido ajustado a tu nivel",
  "Explicaciones claras y ejemplos reales",
  "Practica rapida antes de leer",
];

export default function TestsIndexPage({ loaderData }: Route.ComponentProps) {
  const { levels, skills } = loaderData;

  return (
    <>
      <section className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-[4%] top-8 h-72 w-72 rounded-full bg-[#0F9EDA]/10 blur-3xl" />
          <div className="absolute -bottom-24 left-[12%] h-64 w-64 rounded-full bg-[#0F9EDA]/5 blur-3xl" />
          <div className="absolute right-0 top-20 hidden h-[30rem] w-[20rem] rounded-l-full bg-[#0F9EDA]/10 lg:block" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(28rem,0.8fr)] lg:px-8">
          <div>
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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

            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Tests de ingles interactivos para practicar a tu{" "}
              <span className="text-[#0F9EDA]">nivel</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
              LingText convierte la practica en un circuito completo: haces una
              prueba rapida, detectas tu punto actual y luego saltas a lecturas
              y review con una direccion mucho mas clara.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="inline-flex items-center rounded-full border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 px-3 py-1 text-xs font-semibold text-[#0F9EDA]"
                >
                  {skill.name}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/tests/a1"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F9EDA] px-8 py-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0D8EC4] hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Empieza con A1
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
              <Link
                to="/textos-en-ingles"
                className="inline-flex items-center justify-center rounded-xl border border-[#0F9EDA]/20 bg-white px-8 py-4 text-sm font-semibold text-[#0F9EDA] transition-colors duration-200 hover:border-[#0F9EDA]/40 hover:bg-[#0F9EDA]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Ver lecturas por nivel
              </Link>
            </div>

            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              {HERO_BENEFITS.map((benefit) => (
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

          <div className="relative">
            <div className="absolute -right-8 -top-8 hidden h-28 w-28 rounded-full bg-[#0F9EDA]/10 lg:block" />
            <div className="absolute -bottom-8 -left-8 hidden h-36 w-36 rounded-full bg-gray-100 lg:block" />
            <div className="relative rounded-3xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Skills para practicar
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Sesiones cortas por nivel
                  </p>
                </div>
                <span className="rounded-full border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 px-3 py-1 text-xs font-semibold text-[#0F9EDA]">
                  {skills.length} disponibles
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-4 transition-colors duration-200 hover:border-[#0F9EDA]/30 hover:bg-[#0F9EDA]/5"
                  >
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#0F9EDA]/20 bg-white text-[#0F9EDA]">
                      {SKILL_ICONS[skill.id]}
                    </div>
                    <h2 className="text-sm font-bold text-gray-900">
                      {skill.name}
                    </h2>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">
                      {skill.shortDescription}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4">
                <p className="mb-4 text-sm font-semibold text-gray-900">
                  Circuito recomendado
                </p>
                <div className="space-y-3">
                  {[
                    "Haz una prueba corta",
                    "Detecta errores concretos",
                    "Refuerza con lecturas del nivel",
                  ].map((step, index) => (
                    <div key={step} className="flex items-center gap-3">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#0F9EDA]/10 text-xs font-bold text-[#0F9EDA]">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-600">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-b border-gray-200 bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
              <span className="mr-2.5 h-2 w-2 rounded-full bg-[#0F9EDA]" />
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
                className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0F9EDA]/30 hover:shadow-md motion-reduce:hover:translate-y-0"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 text-[#0F9EDA]">
                  {SKILL_ICONS[skill.id]}
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

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
              <span className="mr-2.5 h-2 w-2 rounded-full bg-[#0F9EDA]" />
              Por nivel
            </div>
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Elige tu <span className="text-[#0F9EDA]">nivel</span> y empieza
              un examen
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
                className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-[#0F9EDA]/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 sm:p-8"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 text-lg font-bold text-[#0F9EDA] transition-colors duration-200 group-hover:border-[#0F9EDA] group-hover:bg-[#0F9EDA] group-hover:text-white">
                    {level.name}
                  </span>
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
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-[#0F9EDA]">
                  {level.title}
                </h3>
                <p className="mb-5 text-sm leading-relaxed text-gray-600">
                  {level.description}
                </p>
                <div className="mt-auto flex flex-wrap gap-2">
                  {level.focus.split(", ").map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-12">
            <div className="mb-8 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
              <span className="mr-2.5 h-2 w-2 rounded-full bg-[#0F9EDA]" />
              Guia de evaluacion
            </div>
            <div className="prose prose-lg max-w-none text-gray-600">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Por que las pruebas cortas aceleran tu progreso en ingles
              </h2>
              <p>
                Muchas personas estudian ingles durante años sin saber
                exactamente en que nivel se encuentran. Las pruebas de LingText
                no buscan certificar ni calificar: su funcion es diagnosticar
                con precision para que tu practica sea productiva desde el
                primer dia.
              </p>
              <p>
                Cuando haces una prueba corta de cinco minutos, descubres que
                tipo de errores cometes con mas frecuencia. Puede que domines
                vocabulario basico pero te cuesten los tiempos verbales en
                pasado, o que leas bien pero no reconozcas colocaciones
                naturales. Saber esto cambia por completo como eliges tu
                siguiente lectura.
              </p>
              <p>
                El circuito funciona mejor cuando se repite: test, lectura,
                review y test de nuevo. Cada resultado te dice si estas listo
                para subir de nivel o si conviene consolidar lo que ya tienes.
                No se trata de obtener la nota mas alta, se trata de encontrar
                el punto exacto donde tu ingles puede crecer con el menor
                esfuerzo.
              </p>
              <h2 className="mt-10 text-3xl font-bold tracking-tight text-gray-900">
                De la autoevaluacion a la lectura con proposito
              </h2>
              <p>
                La verdadera ventaja de estos tests es que te conectan
                directamente con contenido util. Cuando terminas una prueba,
                sabes que nivel te resulta comodo y cual todavia exige demasiado
                trabajo mental. Esa informacion es clave para elegir textos en
                ingles que mantengan tu motivacion sin causar frustracion.
              </p>
              <p>
                LingText combina las pruebas con un sistema de lectura
                interactiva. Si un test te muestra que tu vocabulario de trabajo
                es limitado, puedes ir directo a textos B1 sobre oficina y
                rutinas laborales. Mientras lees, tocas las palabras
                desconocidas para ver su significado sin perder el hilo. Asi, el
                test se convierte en un mapa y la lectura en el camino.
              </p>
              <p>
                La mejor estrategia es simple: haz una prueba por semana en el
                nivel que estas practicando, revisa tus errores y usa ese
                diagnostico para filtrar tus lecturas. Con el tiempo, notaras
                que los errores disminuyen y los textos que antes parecian
                dificiles ahora fluyen con naturalidad. Ese es el momento de
                subir de nivel y repetir el ciclo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
