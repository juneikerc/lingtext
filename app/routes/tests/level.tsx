import { Link, useNavigate } from "react-router";

import ProseContent from "~/components/ProseContent";
import {
  getLevelTestSummaries,
  getTestLevelMeta,
  getTestSkillMeta,
  isTestLevel,
} from "~/features/tests/catalog";
import { getTestTextByLevel } from "~/lib/content/runtime";
import type { TestSkill } from "~/features/tests/types";
import type { Route } from "./+types/level";

function createSessionId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function loader({ params }: Route.LoaderArgs) {
  const level = params.level;

  if (!level || !isTestLevel(level)) {
    throw new Response("Not Found", { status: 404 });
  }

  const testText = await getTestTextByLevel(level);

  return {
    levelMeta: getTestLevelMeta(level),
    tests: getLevelTestSummaries(level),
    testText,
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData) {
    return [
      { title: "Test no encontrado | LingText" },
      { name: "robots", content: "noindex" },
    ];
  }

  const title =
    loaderData.testText?.title ??
    `${loaderData.levelMeta.title} | Reading, grammar, vocabulary y dictation`;
  const description =
    loaderData.testText?.metaDescription ??
    `${loaderData.levelMeta.description} Practica ${loaderData.levelMeta.name} con sesiones rapidas y vuelve a tus lecturas con una meta clara.`;
  const url = `https://lingtext.org/tests/${loaderData.levelMeta.id}`;

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

export default function TestLevelPage({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { levelMeta, tests } = loaderData;

  function handleStart(skill: TestSkill) {
    void navigate(`/tests/${levelMeta.id}/${skill}/${createSessionId()}`);
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-gray-200 bg-white py-16 sm:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-[8%] top-[10%] h-64 w-64 rounded-full bg-[#0F9EDA]/5 blur-3xl"></div>
          <div className="absolute bottom-[10%] right-[10%] h-64 w-64 rounded-full bg-[#0F9EDA]/5 blur-3xl"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-8 flex flex-wrap gap-4 text-sm font-medium">
            <Link
              to="/tests"
              className="inline-flex items-center gap-1.5 text-gray-500 transition-colors duration-200 hover:text-[#0F9EDA]"
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
              Volver a tests
            </Link>
          </nav>

          <div className="inline-flex items-center rounded-full border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 px-4 py-2 text-sm font-medium text-[#0F9EDA]">
            <span className="mr-2.5 h-2 w-2 rounded-full bg-[#0F9EDA]"></span>
            Nivel {levelMeta.name}
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {levelMeta.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-600">
            {levelMeta.description} Aqui cada skill esta pensada para ayudarte a
            detectar huecos rapido y pasar enseguida a lecturas del mismo nivel.
          </p>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Sesiones activas para {levelMeta.name}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              Todas las pruebas duran pocos minutos para que puedas repetirlas
              sin friccion, compartir tu resultado y luego saltar al contenido
              real.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {tests.map((test) => {
              const skillMeta = getTestSkillMeta(test.skill);

              return (
                <article
                  key={test.skill}
                  className="flex h-full flex-col rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex rounded-full border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#0F9EDA]">
                        {skillMeta.name}
                      </span>
                      <h3 className="mt-4 text-2xl font-bold text-gray-900">
                        {test.title}
                      </h3>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-right">
                      <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
                        Duracion
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {test.durationMinutes} min
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-gray-600">
                    {test.shortDescription}
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-gray-500">
                    {test.summary}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-gray-600">
                    <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
                      {test.questionCount} preguntas
                    </span>
                    <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
                      Sesion corta
                    </span>
                  </div>

                  <div className="mt-auto pt-6">
                    <button
                      type="button"
                      onClick={() => handleStart(test.skill)}
                      className="inline-flex w-full items-center justify-center rounded-xl bg-[#0F9EDA] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#0D8EC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      Empezar
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Disclaimer */}
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-4">
              <div className="shrink-0 pt-0.5">
                <svg
                  className="h-5 w-5 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="space-y-2 text-sm text-amber-800">
                <p>
                  <span className="font-semibold">En constante mejora:</span>{" "}
                  Estamos trabajando para agregar nuevas pruebas y ejercicios
                  con el tiempo. Vuelve pronto para descubrir más formas de
                  practicar y evaluar tu progreso.
                </p>
                <p>
                  <span className="font-semibold">No es un certificado:</span>{" "}
                  Estas pruebas son herramientas de autoevaluación y práctica.
                  No constituyen un certificado oficial ni reemplazan exámenes
                  acreditados como Cambridge, IELTS o TOEFL.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-3xl border border-[#0F9EDA]/15 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#0F9EDA]">
                  Despues del test
                </p>
                <h3 className="mt-2 text-2xl font-bold text-gray-900">
                  Lleva este nivel a lectura real
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
                  Cuando termines una o varias pruebas, pasa a las lecturas de
                  este nivel para reforzar lo que acabas de detectar.
                </p>
              </div>
              <Link
                to={`/levels/${levelMeta.id}`}
                className="inline-flex items-center justify-center rounded-xl bg-[#0F9EDA] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#0D8EC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Ver lecturas {levelMeta.name}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido SEO */}
      {loaderData.testText && (
        <section className="relative overflow-hidden py-16 sm:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProseContent html={loaderData.testText.html} />
          </div>
        </section>
      )}
    </>
  );
}
