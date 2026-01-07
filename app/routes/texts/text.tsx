import { getText } from "~/services/db";
import type { Route } from "./+types/text";
import { Suspense, lazy } from "react";
import type { AudioRef } from "~/types";
import ReaderHeader from "~/components/reader/ReaderHeader";
import ReaderSkeleton from "~/components/reader/ReaderSkeleton";
import ReaderErrorBoundary from "~/components/ReaderErrorBoundary";
import { allTexts } from "content-collections";
import { formatSlug } from "~/helpers/formatSlug";
import { type TextCollection, type TextItem } from "~/types";

const Reader = lazy(() => import("~/components/Reader"));

export function meta() {
  return [
    {
      name: "robots",
      content: "noindex",
    },
  ];
}

export async function clientLoader({
  params,
  request,
}: Route.ClientLoaderArgs) {
  const queryParams = new URL(request.url).searchParams;
  if (queryParams.get("source")) {
    if (queryParams.get("source") === "collection") {
      const text = allTexts.find(
        (_text: TextCollection) => formatSlug(_text.title) === params.id
      );

      if (!text) {
        throw new Response("Not Found", { status: 404 });
      }

      return {
        id: formatSlug(text.title),
        title: text.title,
        content: text.content,
        format: "markdown",
        createdAt: Date.now(),
      } as TextItem;
    }
  }

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
    format: text?.format || "txt",
    createdAt: text?.createdAt,
    audioRef: text?.audioRef,
    audioUrl,
  } as TextItem;
}

export default function Text({ loaderData }: Route.ComponentProps) {
  const text = loaderData;

  return (
    <>
      <ReaderHeader title={text.title} />
      <ReaderErrorBoundary>
        <Suspense fallback={<ReaderSkeleton />}>
          <Reader text={text} />
        </Suspense>
      </ReaderErrorBoundary>
    </>
  );
}
