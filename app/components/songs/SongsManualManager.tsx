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
      className="relative overflow-hidden border-b border-gray-200 bg-white py-16 sm:py-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-[#0F9EDA]/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-[#0F9EDA]/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
            <span className="mr-2.5 h-2 w-2 rounded-full bg-[#0F9EDA]" />
            Biblioteca de Canciones
          </div>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Agrega canciones y practica con letras en inglés
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600">
            Pega una letra, añade un enlace de YouTube o Spotify y abre tu
            lector interactivo para traducir palabras y frases en contexto real.
          </p>
        </div>

        <div className="mb-12 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F9EDA] text-sm text-white">
              +
            </span>
            {editingSong ? "Editar canción" : "Agregar canción manualmente"}
          </h3>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Título de la canción
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-[#0F9EDA] focus:outline-none focus:ring-2 focus:ring-[#0F9EDA]/20"
                placeholder="Ej: Coldplay - Yellow"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
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
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-[#0F9EDA] focus:outline-none focus:ring-2 focus:ring-[#0F9EDA]/20"
                placeholder="https://www.youtube.com/watch?v=... o https://open.spotify.com/track/..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Letra en inglés
              </label>
              <textarea
                value={form.lyrics}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, lyrics: event.target.value }))
                }
                className="min-h-[220px] w-full resize-vertical rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-[#0F9EDA] focus:outline-none focus:ring-2 focus:ring-[#0F9EDA]/20"
                placeholder="Pega la letra completa..."
              />
            </div>

            {error ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            {success ? (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {success}
              </p>
            ) : null}

            <div className="flex flex-wrap justify-end gap-3">
              {editingSong ? (
                <button
                  type="button"
                  onClick={resetFormState}
                  className="rounded-xl bg-gray-100 px-5 py-3 font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  Cancelar edición
                </button>
              ) : null}

              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-[#0F9EDA] px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0D8EC4] hover:shadow disabled:cursor-not-allowed disabled:bg-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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
            <h3 className="text-2xl font-bold text-gray-900">
              Canciones guardadas
            </h3>
            <span className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {songs.length} total
            </span>
          </div>

          {isLoading ? (
            <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="mb-4 h-5 w-48 rounded bg-gray-200" />
              <div className="space-y-3">
                <div className="h-20 rounded-xl bg-gray-100" />
                <div className="h-20 rounded-xl bg-gray-100" />
              </div>
            </div>
          ) : songs.length > 0 ? (
            songs.map((song) => (
              <article
                key={song.id}
                className="group rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-[#0F9EDA]/30 hover:shadow-md"
              >
                <div className="p-6">
                  <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                    <div className="flex-1">
                      <div className="mb-2 flex items-start justify-between">
                        <h4 className="text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-[#0F9EDA]">
                          {song.title}
                        </h4>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                          {new Date(song.updatedAt).toLocaleDateString("es-ES")}
                        </span>
                      </div>
                      <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                        {song.lyrics.substring(0, 180)}...
                      </p>
                      <span className="inline-flex items-center rounded-full border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 px-3 py-1 text-xs font-medium text-[#0F9EDA]">
                        Fuente:{" "}
                        {song.provider === "youtube" ? "YouTube" : "Spotify"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/aprender-ingles-con-canciones/${song.id}`}
                        reloadDocument
                        className="inline-flex items-center gap-2 rounded-xl bg-[#0F9EDA] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0D8EC4] hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      >
                        Abrir lector
                      </Link>
                      <button
                        type="button"
                        onClick={() => startEdit(song)}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:border-[#0F9EDA] hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => void onDelete(song.id)}
                        className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition-colors duration-200 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <span className="text-3xl">🎵</span>
              </div>
              <h4 className="mb-3 text-2xl font-bold text-gray-900">
                Aún no tienes canciones
              </h4>
              <p className="mx-auto max-w-xl text-gray-600">
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
