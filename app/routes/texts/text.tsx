import { getText } from "~/db";
import type { Route } from "./+types/text";
import Reader from "~/components/Reader";
import type { AudioRef } from "~/types";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const id = params.id;
  const text = await getText(id);

  document.title = text?.title || "Sin título";
  const formatAudioRef = async (audioRef: AudioRef | null) => {
    if (audioRef?.type === "url") return audioRef.url;
    if (audioRef?.type === "file") {
      const file = await audioRef?.fileHandle.getFile();
      const url = URL.createObjectURL(file!);
      return url;
    }
    return null;
  };

  const audioUrl = await formatAudioRef(text?.audioRef as AudioRef | null);

  return {
    id: text?.id,
    title: text?.title,
    content: text?.content,
    createdAt: text?.createdAt,
    audioRef: text?.audioRef,
    audioUrl,
  } as {
    id: string;
    title: string;
    content: string;
    audioRef?: AudioRef | null;
    createdAt: number;
    audioUrl?: string | null;
  };
}

// export function meta({ loaderData }: Route.MetaArgs) {
//   return [
//     { title: loaderData.title || "Sin título" },
//     { name: "description", content: "" },
//   ];
// }

export default function Text({ loaderData }: Route.ComponentProps) {
  const text = loaderData;

  return <Reader text={text} />;
}
