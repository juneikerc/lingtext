import TestSessionPlayer from "~/components/tests/TestSessionPlayer";
import {
  getTestDefinition,
  getTestLevelMeta,
  getTestSkillMeta,
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
  const skillMeta =
    params.skill && isTestSkill(params.skill)
      ? getTestSkillMeta(params.skill)
      : null;

  return [
    {
      title: `${skillMeta?.name ?? "Test"} ${levelMeta.name} | LingText`,
    },
    {
      name: "description",
      content: `Sesion interactiva de ${skillMeta?.name ?? "test"} para ${levelMeta.name}.`,
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
        <TestSessionPlayer
          sessionId={loaderData.sessionId}
          test={loaderData.test}
        />
      </div>
    </div>
  );
}
