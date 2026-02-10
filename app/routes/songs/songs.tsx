import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/songs";
import { addSong, deleteSong, getAllSongs, updateSong } from "~/services/db";
import type { SongItem } from "~/types";
import { parseSongEmbed } from "~/utils/song-embed";
import {
  sanitizeTextContent,
  validateTextContent,
  validateTitle,
} from "~/utils/validation";

interface SongFormState {
  title: string;
  lyrics: string;
  sourceUrl: string;
}

const EMPTY_FORM: SongFormState = {
  title: "",
  lyrics: "",
  sourceUrl: "",
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Aprender Inglés Con Canciones | LingText" },
    {
      name: "description",
      content:
        "Guarda letras de canciones en inglés y practica lectura con embebidos de YouTube o Spotify.",
    },
  ];
}

export const links: Route.LinksFunction = () => [
  {
    rel: "canonical",
    href: "https://lingtext.org/aprender-ingles-con-canciones",
  },
];

export default function SongsPage() {
  const [songs, setSongs] = useState<SongItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSongId, setEditingSongId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<SongFormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    void refreshSongs();
  }, []);

  const editingSong = useMemo(
    () => songs.find((song) => song.id === editingSongId),
    [songs, editingSongId]
  );

  async function refreshSongs() {
    try {
      const list = await getAllSongs();
      setSongs(list);
    } catch (e) {
      console.error("[Songs] Failed to load songs:", e);
      setError("No se pudieron cargar las canciones.");
    } finally {
      setIsLoading(false);
    }
  }

  function resetFormState() {
    setForm(EMPTY_FORM);
    setEditingSongId(null);
  }

  function startEdit(song: SongItem) {
    setError(null);
    setSuccess(null);
    setEditingSongId(song.id);
    setForm({
      title: song.title,
      lyrics: song.lyrics,
      sourceUrl: song.sourceUrl,
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const title = form.title.trim();
    const lyrics = form.lyrics.trim();
    const rawUrl = form.sourceUrl.trim();

    if (!title || !lyrics || !rawUrl) {
      setError("Título, letra y enlace son obligatorios.");
      return;
    }

    const titleValidation = validateTitle(title);
    if (!titleValidation.isValid) {
      setError(titleValidation.error || "El título no es válido.");
      return;
    }

    const contentValidation = validateTextContent(lyrics);
    if (!contentValidation.isValid) {
      setError(contentValidation.error || "La letra no es válida.");
      return;
    }

    if (contentValidation.warnings && contentValidation.warnings.length > 0) {
      const warningMessage = contentValidation.warnings.join("\n");
      const proceed = window.confirm(
        `Advertencias encontradas:\n${warningMessage}\n\n¿Deseas continuar?`
      );
      if (!proceed) return;
    }

    const sanitizedLyrics = sanitizeTextContent(lyrics);

    const embed = parseSongEmbed(rawUrl);
    if ("error" in embed) {
      setError(embed.error);
      return;
    }

    setIsSaving(true);
    try {
      const now = Date.now();

      if (editingSongId && !editingSong) {
        setError("La canción que intentas editar ya no existe.");
        return;
      }

      if (editingSong) {
        await updateSong({
          ...editingSong,
          title,
          lyrics: sanitizedLyrics,
          provider: embed.provider,
          sourceUrl: embed.sourceUrl,
          embedUrl: embed.embedUrl,
          updatedAt: now,
        });
        setSuccess("Canción actualizada correctamente.");
      } else {
        const newSong: SongItem = {
          id: crypto.randomUUID(),
          title,
          lyrics: sanitizedLyrics,
          provider: embed.provider,
          sourceUrl: embed.sourceUrl,
          embedUrl: embed.embedUrl,
          createdAt: now,
          updatedAt: now,
        };
        await addSong(newSong);
        setSuccess("Canción guardada correctamente.");
      }

      resetFormState();
      await refreshSongs();
    } catch (e) {
      console.error("[Songs] Failed to save song:", e);
      setError("No se pudo guardar la canción. Inténtalo nuevamente.");
    } finally {
      setIsSaving(false);
    }
  }

  async function onDelete(songId: string) {
    const confirmed = window.confirm(
      "¿Eliminar esta canción? Esta acción no se puede deshacer."
    );
    if (!confirmed) return;

    setError(null);
    setSuccess(null);
    try {
      await deleteSong(songId);
      if (editingSongId === songId) {
        resetFormState();
      }
      await refreshSongs();
      setSuccess("Canción eliminada.");
    } catch (e) {
      console.error("[Songs] Failed to delete song:", e);
      setError("No se pudo eliminar la canción.");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            Nuevo modo
          </p>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
            Aprender inglés con canciones
          </h1>
          <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
            Guarda una letra, pega un enlace de YouTube o Spotify y practica con
            el lector interactivo de LingText.
          </p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[380px_1fr]">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {editingSong ? "Editar canción" : "Agregar canción"}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Campos obligatorios: título, letra y un enlace de YouTube o
              Spotify.
            </p>

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Título
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-900/40"
                  placeholder="Ej: Yellow - Coldplay"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enlace (YouTube o Spotify)
                </label>
                <input
                  type="url"
                  value={form.sourceUrl}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      sourceUrl: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-900/40"
                  placeholder="https://www.youtube.com/watch?v=... o https://open.spotify.com/track/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Letra
                </label>
                <textarea
                  value={form.lyrics}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, lyrics: event.target.value }))
                  }
                  className="mt-2 min-h-[220px] w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 transition-colors duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-indigo-900/40"
                  placeholder="Pega aquí la letra completa..."
                />
              </div>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-300">
                  {error}
                </p>
              )}

              {success && (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-900/20 dark:text-emerald-300">
                  {success}
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:bg-indigo-300 dark:focus-visible:ring-offset-gray-900"
                >
                  {isSaving
                    ? "Guardando..."
                    : editingSong
                      ? "Actualizar canción"
                      : "Guardar canción"}
                </button>

                {editingSong && (
                  <button
                    type="button"
                    onClick={resetFormState}
                    className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
                  >
                    Cancelar edición
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Tus canciones
              </h2>
              <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {songs.length} guardadas
              </span>
            </div>

            {isLoading ? (
              <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                Cargando canciones...
              </p>
            ) : songs.length === 0 ? (
              <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                Aún no tienes canciones. Agrega la primera desde el formulario.
              </p>
            ) : (
              <ul className="mt-6 space-y-3">
                {songs.map((song) => (
                  <li
                    key={song.id}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {song.title}
                      </h3>
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                        {song.provider === "youtube" ? "YouTube" : "Spotify"}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      Actualizada:{" "}
                      {new Date(song.updatedAt).toLocaleDateString("es-ES")}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        to={`/aprender-ingles-con-canciones/${song.id}`}
                        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
                      >
                        Abrir lector
                      </Link>
                      <button
                        type="button"
                        onClick={() => startEdit(song)}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => void onDelete(song.id)}
                        className="inline-flex items-center justify-center rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors duration-200 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-red-900/60 dark:text-red-300 dark:hover:bg-red-900/20 dark:focus-visible:ring-offset-gray-900"
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
