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

const SKILL_ICONS: Record<string, string> = {
  reading: "📖",
  grammar: "✏️",
  vocabulary: "💡",
  dictation: "🎧",
};

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
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white py-20 md:py-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-[8%] top-[10%] h-64 w-64 rounded-full bg-[#0F9EDA]/5 blur-3xl"></div>
          <div className="absolute bottom-[10%] right-[10%] h-64 w-64 rounded-full bg-[#0F9EDA]/5 blur-3xl"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-8">
            <Link
              to="/tests"
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
              Volver a tests
            </Link>
          </nav>

          <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
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

      {/* Test sessions */}
      <section className="border-b border-gray-200 bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
              <span className="mr-2.5 h-2 w-2 rounded-full bg-[#0F9EDA]"></span>
              Sesiones disponibles
            </div>
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Sesiones activas para{" "}
              <span className="text-[#0F9EDA]">{levelMeta.name}</span>
            </h2>
            <p className="text-xl leading-relaxed text-gray-600">
              Todas las pruebas duran pocos minutos para que puedas repetirlas
              sin friccion, compartir tu resultado y luego saltar al contenido
              real.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 mb-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 pt-0.5">
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
              <div className="space-y-3 text-sm text-amber-800">
                <p>
                  <span className="font-semibold">En constante mejora:</span>{" "}
                  Estamos trabajando para agregar nuevas pruebas y ejercicios
                  con el tiempo. Vuelve pronto para descubrir mas formas de
                  practicar y evaluar tu progreso.
                </p>
                <p className="text-2xl">
                  <span className="font-semibold">
                    OJO estas no son pruebas de certificado:
                  </span>{" "}
                  Estas pruebas son herramientas de autoevaluacion y practica.
                  No constituyen un certificado oficial ni reemplazan examenes
                  acreditados como Cambridge, IELTS o TOEFL.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {tests.map((test) => {
              const skillMeta = getTestSkillMeta(test.skill);

              return (
                <article
                  key={test.skill}
                  className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 text-xl">
                        {SKILL_ICONS[test.skill] || "📝"}
                      </div>
                      <div className="mb-3 flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center rounded-full border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#0F9EDA]">
                          {skillMeta.name}
                        </span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                          Sesion corta
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {test.title}
                      </h3>
                    </div>
                    <div className="flex-shrink-0 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-right">
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

                  <div className="mt-5 flex flex-wrap gap-3">
                    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-600">
                      {test.questionCount} preguntas
                    </span>
                  </div>

                  <div className="mt-auto pt-6">
                    <button
                      type="button"
                      onClick={() => handleStart(test.skill)}
                      className="inline-flex w-full items-center justify-center rounded-xl bg-[#0F9EDA] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0D8EC4] hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      Empezar
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
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
                className="inline-flex flex-shrink-0 items-center justify-center rounded-xl bg-[#0F9EDA] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0D8EC4] hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Ver lecturas {levelMeta.name}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEO content */}
      {loaderData.testText && (
        <section className="relative overflow-hidden bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <ProseContent html={loaderData.testText.html} />
          </div>
        </section>
      )}
    </>
  );
}
