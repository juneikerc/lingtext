import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
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

export default function SongsManualManager() {
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
    <section
      id="agregar-cancion-manual"
      className="relative overflow-hidden py-12 px-4 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-sky-500/10 dark:bg-sky-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-800">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
            Biblioteca de Canciones
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3 text-gray-900 dark:text-gray-100">
            Agrega canciones y practica con letras en inglés
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Pega una letra, añade un enlace de YouTube o Spotify y abre tu
            lector interactivo para traducir palabras y frases en contexto real.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8 mb-10">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-sm">+</span>
            </div>
            {editingSong ? "Editar canción" : "Agregar canción manualmente"}
          </h3>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título de la canción
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                placeholder="Ej: Coldplay - Yellow"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enlace de YouTube o Spotify
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
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                placeholder="https://www.youtube.com/watch?v=... o https://open.spotify.com/track/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Letra en inglés
              </label>
              <textarea
                value={form.lyrics}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, lyrics: event.target.value }))
                }
                className="w-full min-h-[220px] px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical transition-colors duration-200"
                placeholder="Pega la letra completa..."
              />
            </div>

            {error ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-300">
                {error}
              </p>
            ) : null}

            {success ? (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-900/20 dark:text-emerald-300">
                {success}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-3 justify-end">
              {editingSong ? (
                <button
                  type="button"
                  onClick={resetFormState}
                  className="px-5 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancelar edición
                </button>
              ) : null}

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                {isSaving
                  ? "Guardando..."
                  : editingSong
                    ? "Actualizar canción"
                    : "Guardar canción"}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4" id="canciones-guardadas">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Canciones guardadas
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-800">
              {songs.length} total
            </span>
          </div>

          {isLoading ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8 animate-pulse">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
              <div className="space-y-3">
                <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
                <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
              </div>
            </div>
          ) : songs.length > 0 ? (
            songs.map((song) => (
              <article
                key={song.id}
                className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                          {song.title}
                        </h4>
                        <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                          {new Date(song.updatedAt).toLocaleDateString("es-ES")}
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                        {song.lyrics.substring(0, 180)}...
                      </p>
                      <span className="inline-flex items-center text-xs text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full">
                        Fuente:{" "}
                        {song.provider === "youtube" ? "YouTube" : "Spotify"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/aprender-ingles-con-canciones/${song.id}`}
                        reloadDocument
                        className="inline-flex items-center px-5 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
                      >
                        Abrir lector
                      </Link>
                      <button
                        type="button"
                        onClick={() => startEdit(song)}
                        className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => void onDelete(song.id)}
                        className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors duration-200"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="w-20 h-20 mx-auto mb-5 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-3xl">🎵</span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                Aún no tienes canciones
              </h4>
              <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                Empieza agregando una letra y un enlace para crear tu primera
                práctica de inglés con música.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
