import type { Route } from "../+types/level";
import { allTexts } from "content-collections";
import { formatSlug } from "~/helpers/formatSlug";
import { type TextCollection } from "~/types";

export function meta({ params }: Route.MetaArgs) {
  return [
    {
      title: `Textos de nivel ${params.level} para aprender inglés | LingText`,
    },
    {
      name: "description",
      content: `En LingText encontrarás textos de nivel ${params.level} para aprender inglés.`,
    },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const level = params.level;

  return allTexts.filter((text: TextCollection) => text.level === level);
}

export default function Level({ loaderData }: Route.ComponentProps) {
  const texts = loaderData;
  return (
    <div>
      {texts.map((text: TextCollection) => {
        return (
          <a
            className="flex items-center"
            href={`/texts/${formatSlug(text.title)}?source=collection`}
            key={text.title}
          >
            {text.title}
          </a>
        );
      })}
    </div>
  );
}
