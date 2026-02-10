import { Link } from "react-router";
import type { Route } from "./+types/song";
import Reader from "~/components/Reader";
import ReaderHeader from "~/components/reader/ReaderHeader";
import { getSong } from "~/services/db";
import { parseSongEmbed } from "~/utils/song-embed";

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData?.song) {
    return [
      { title: "Canción no encontrada | LingText" },
      { name: "robots", content: "noindex" },
    ];
  }

  return [
    { title: `${loaderData.song.title} | Canciones | LingText` },
    {
      name: "description",
      content: "Practica inglés con canciones y traducción contextual.",
    },
    { name: "robots", content: "noindex" },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const song = await getSong(params.id);
  document.title = song?.title || "Canción no encontrada";
  return { song: song ?? null };
}

export default function SongPage({ loaderData }: Route.ComponentProps) {
  const { song } = loaderData;

  if (!song) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-950">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Canción no encontrada
          </h1>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Esta canción no existe o fue eliminada.
          </p>
          <Link
            to="/aprender-ingles-con-canciones"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
          >
            Volver a canciones
          </Link>
        </div>
      </main>
    );
  }

  const normalizedEmbed = parseSongEmbed(song.embedUrl || song.sourceUrl);
  const embedUrl =
    "error" in normalizedEmbed ? song.embedUrl : normalizedEmbed.embedUrl;
  const provider =
    "error" in normalizedEmbed ? song.provider : normalizedEmbed.provider;
  const isSpotify = provider === "spotify";
  const canRenderEmbed = Boolean(embedUrl);
  let iframeSrc = embedUrl;

  if (provider === "youtube" && embedUrl) {
    try {
      const youtubeUrl = new URL(embedUrl);
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      if (origin) {
        youtubeUrl.searchParams.set("origin", origin);
        youtubeUrl.searchParams.set("widget_referrer", origin);
      }
      youtubeUrl.searchParams.set("enablejsapi", "1");
      iframeSrc = youtubeUrl.toString();
    } catch {
      iframeSrc = embedUrl;
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <ReaderHeader title={song.title} />

      <section className="mx-auto mt-6 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {canRenderEmbed ? (
            <div
              className={
                isSpotify
                  ? "relative h-[352px] w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
                  : "relative aspect-video w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
              }
            >
              <iframe
                src={iframeSrc}
                title={`${song.title} embed`}
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow={
                  isSpotify
                    ? "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    : "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                }
                allowFullScreen={!isSpotify}
              />
            </div>
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-900/60 dark:bg-amber-900/20 dark:text-amber-300">
              No pudimos generar el embebido para este enlace. Prueba editar la
              canción con una URL válida de YouTube o Spotify.
            </div>
          )}
          <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">
            Fuente original:{" "}
            <a
              href={song.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 underline underline-offset-2 transition-colors duration-200 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              {song.sourceUrl}
            </a>
          </p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Si aparece el mensaje{" "}
            <span className="font-semibold">“refused to connect”</span>, ese
            contenido tiene el embebido bloqueado por el proveedor (por ejemplo,
            algunos videos con copyright). En ese caso usa otro enlace o abre la
            fuente original.
          </p>
        </div>
      </section>

      <section className="mt-6">
        <Reader
          text={{
            id: song.id,
            title: song.title,
            content: song.lyrics,
            format: "txt",
          }}
        />
      </section>
    </main>
  );
}
