import TestSessionPlayer from "~/components/tests/TestSessionPlayer";
import {
  getTestDefinition,
  getTestLevelMeta,
  isTestLevel,
  isTestSkill,
} from "~/features/tests/catalog";
import { shuffleQuestions } from "~/features/tests/engine";
import type { Route } from "./+types/session";

export function loader({ params }: Route.LoaderArgs) {
  const { level, skill, sessionId } = params;

  if (
    !level ||
    !isTestLevel(level) ||
    !skill ||
    !isTestSkill(skill) ||
    !sessionId
  ) {
    throw new Response("Not Found", { status: 404 });
  }

  const test = getTestDefinition(level, skill);

  if (!test) {
    throw new Response("Not Found", { status: 404 });
  }

  return {
    sessionId,
    test: {
      ...test,
      questions: shuffleQuestions(
        test.questions,
        `${sessionId}:${level}:${skill}`
      ),
    },
  };
}

export function meta({ loaderData, params }: Route.MetaArgs) {
  if (!loaderData || !params.level || !isTestLevel(params.level)) {
    return [
      { title: "Sesion no encontrada | LingText" },
      { name: "robots", content: "noindex" },
    ];
  }

  const levelMeta = getTestLevelMeta(params.level);

  return [
    {
      title: `${loaderData.test.title} | LingText`,
    },
    {
      name: "description",
      content: `${loaderData.test.summary} Sesion interactiva para ${levelMeta.name}.`,
    },
    { name: "robots", content: "noindex" },
    {
      tagName: "link",
      rel: "canonical",
      href: `https://lingtext.org/tests/${levelMeta.id}`,
    },
  ];
}

export default function TestSessionPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="bg-gray-50 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950">
          <div className="flex items-start gap-3">
            <span
              className="mt-0.5 text-xl"
              aria-hidden="true"
            >
              🚧
            </span>
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-50">
                Estamos en modo "romper cosas y aprender"
              </p>
              <p className="mt-1 text-sm leading-relaxed text-amber-800 dark:text-amber-100">
                Los tests todavía están en fase de pruebas — sí, lo sé, suena
                redundante hacer tests de prueba, pero aquí estamos. Sabemos que
                pueden ser muy básicos y poco intuitivos (lo prometemos, no es
                falta de cariño). Agradecemos tu paciencia mientras seguimos
                puliendo la experiencia; nos esforzamos cada día para mejorar la
                web. Mientras tanto, si buscas algo más fluido, te recomendamos
                darle una vuelta a{" "}
                <a
                  href={`/levels/${loaderData.test.level}`}
                  className="font-medium underline underline-offset-2 transition-colors duration-200 hover:text-amber-950 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-600 dark:text-amber-200 dark:hover:text-amber-50"
                >
                  las lecturas de este nivel
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        <TestSessionPlayer test={loaderData.test} />
      </div>
    </div>
  );
}
