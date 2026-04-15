import { Link, useNavigate } from "react-router";

import {
  getLevelTestSummaries,
  getTestLevelMeta,
  getTestSkillMeta,
  isTestLevel,
} from "~/features/tests/catalog";
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

export function loader({ params }: Route.LoaderArgs) {
  const level = params.level;

  if (!level || !isTestLevel(level)) {
    throw new Response("Not Found", { status: 404 });
  }

  return {
    levelMeta: getTestLevelMeta(level),
    tests: getLevelTestSummaries(level),
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData) {
    return [
      { title: "Test no encontrado | LingText" },
      { name: "robots", content: "noindex" },
    ];
  }

  const title = `${loaderData.levelMeta.title} | Reading, grammar, vocabulary y dictation`;
  const description = `${loaderData.levelMeta.description} Practica ${loaderData.levelMeta.name} con sesiones rapidas y vuelve a tus lecturas con una meta clara.`;
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
            <Link
              to={`/levels/${levelMeta.id}`}
              className="text-gray-500 transition-colors duration-200 hover:text-[#0F9EDA]"
            >
              Ver lecturas {levelMeta.name}
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

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to={`/levels/${levelMeta.id}`}
              className="inline-flex items-center justify-center rounded-xl bg-[#0F9EDA] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#0D8EC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Abrir lecturas {levelMeta.name}
            </Link>
            <Link
              to="/review"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:border-[#0F9EDA] hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Ir a review
            </Link>
          </div>
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
                    {skillMeta.longDescription}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-gray-600">
                    <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
                      {test.questionCount} preguntas
                    </span>
                    <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
                      {test.shortDescription}
                    </span>
                  </div>

                  <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => handleStart(test.skill)}
                      className="inline-flex items-center justify-center rounded-xl bg-[#0F9EDA] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#0D8EC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      Iniciar sesion
                    </button>
                    <Link
                      to={`/levels/${levelMeta.id}`}
                      className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:border-[#0F9EDA] hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      Practicar leyendo
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
