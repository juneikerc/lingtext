import { getText } from "~/db";
import type { Route } from "./+types/text";
import Reader from "~/components/Reader";
import type { AudioRef } from "~/types";
import ReaderHeader from "~/components/reader/ReaderHeader";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const id = params.id;
  const text = await getText(id);

  document.title = text?.title || "Sin título";
  const formatAudioRef = async (audioRef: AudioRef | null) => {
    if (audioRef?.type === "url") return audioRef.url;
    if (audioRef?.type === "file") {
      try {
        const file = await audioRef.fileHandle.getFile();
        const url = URL.createObjectURL(file);
        return url;
      } catch (e) {
        // No permission or failed to read file. We'll allow reauthorization in the Reader.
        return null;
      }
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

export default function Text({ loaderData }: Route.ComponentProps) {
  const text = loaderData;

  return (
    <>
      <ReaderHeader title={text.title} />
      <Reader text={text} />
    </>
  );
}
