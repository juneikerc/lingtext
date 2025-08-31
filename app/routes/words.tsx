import { getAllUnknownWords } from "~/db";
import type { Route } from "./+types/words";
import { useState } from "react";
import type { WordEntry } from "~/types";
import UnknownWordsSection from "~/components/UnknownWordsSection";

export async function clientLoader() {
  const words = await getAllUnknownWords();
  return words;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Gestión de vocabulario | LingText" },
    {
      name: "description",
      content:
        "Gestiona tus palabras desconocidas marcadas durante tu tiempo de lectura.",
    },
  ];
}

export default function Words({ loaderData }: Route.ComponentProps) {
  const wordsLoaderData = loaderData;
  const [words, setWords] = useState<WordEntry[]>(wordsLoaderData);

  return (
    <UnknownWordsSection
      words={words}
      onRemove={(wordLower) =>
        setWords((prev) => prev.filter((w) => w.wordLower !== wordLower))
      }
    />
  );
}
