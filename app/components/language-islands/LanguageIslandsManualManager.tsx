import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

import {
  addLanguageIsland,
  deleteLanguageIsland,
  getAllLanguageIslands,
  updateLanguageIsland,
} from "~/services/db";
import type { LanguageIslandItem } from "~/types";
import {
  normalizeIslandSentencesText,
  splitIslandSentences,
} from "~/utils/language-island";
import {
  sanitizeTextContent,
  validateTextContent,
  validateTitle,
} from "~/utils/validation";

interface IslandFormState {
  title: string;
  sentencesText: string;
}

const EMPTY_FORM: IslandFormState = {
  title: "",
  sentencesText: "",
};

export default function LanguageIslandsManualManager() {
  const [islands, setIslands] = useState<LanguageIslandItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingIslandId, setEditingIslandId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<IslandFormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    void refreshIslands();
  }, []);

  const editingIsland = useMemo(
    () => islands.find((island) => island.id === editingIslandId),
    [islands, editingIslandId]
  );

  async function refreshIslands() {
    try {
      const list = await getAllLanguageIslands();
      setIslands(list);
    } catch (e) {
      console.error("[LanguageIsland] Failed to load islands:", e);
      setError("No se pudieron cargar las islas.");
    } finally {
      setIsLoading(false);
    }
  }

  function resetFormState() {
    setForm(EMPTY_FORM);
    setEditingIslandId(null);
  }

  function startEdit(island: LanguageIslandItem) {
    setError(null);
    setSuccess(null);
    setEditingIslandId(island.id);
    setForm({
      title: island.title,
      sentencesText: island.sentencesText,
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const title = form.title.trim();
    const rawSentencesText = form.sentencesText.trim();

    if (!title || !rawSentencesText) {
      setError("Título y oraciones son obligatorios.");
      return;
    }

    const titleValidation = validateTitle(title);
    if (!titleValidation.isValid) {
      setError(titleValidation.error || "El título no es válido.");
      return;
    }

    const contentValidation = validateTextContent(rawSentencesText);
    if (!contentValidation.isValid) {
      setError(contentValidation.error || "Las oraciones no son válidas.");
      return;
    }

    if (contentValidation.warnings && contentValidation.warnings.length > 0) {
      const warningMessage = contentValidation.warnings.join("\n");
      const proceed = window.confirm(
        `Advertencias encontradas:\n${warningMessage}\n\n¿Deseas continuar?`
      );
      if (!proceed) return;
    }

    const sanitizedText = sanitizeTextContent(rawSentencesText);
    const normalizedText = normalizeIslandSentencesText(sanitizedText);
    const sentenceList = splitIslandSentences(normalizedText);

    if (sentenceList.length === 0) {
      setError("Debes agregar al menos una oración (una por línea).");
      return;
    }

    setIsSaving(true);
    try {
      const now = Date.now();

      if (editingIslandId && !editingIsland) {
        setError("La isla que intentas editar ya no existe.");
        return;
      }

      if (editingIsland) {
        await updateLanguageIsland({
          ...editingIsland,
          title,
          sentencesText: normalizedText,
          updatedAt: now,
        });
        setSuccess("Isla actualizada correctamente.");
      } else {
        const newIsland: LanguageIslandItem = {
          id: crypto.randomUUID(),
          title,
          sentencesText: normalizedText,
          createdAt: now,
          updatedAt: now,
        };
        await addLanguageIsland(newIsland);
        setSuccess("Isla guardada correctamente.");
      }

      resetFormState();
      await refreshIslands();
    } catch (e) {
      console.error("[LanguageIsland] Failed to save island:", e);
      setError("No se pudo guardar la isla. Inténtalo nuevamente.");
    } finally {
      setIsSaving(false);
    }
  }

  async function onDelete(islandId: string) {
    const confirmed = window.confirm(
      "¿Eliminar esta isla? Esta acción no se puede deshacer."
    );
    if (!confirmed) return;

    setError(null);
    setSuccess(null);

    try {
      await deleteLanguageIsland(islandId);
      if (editingIslandId === islandId) {
        resetFormState();
      }
      await refreshIslands();
      setSuccess("Isla eliminada.");
    } catch (e) {
      console.error("[LanguageIsland] Failed to delete island:", e);
      setError("No se pudo eliminar la isla.");
    }
  }

  return (
    <section
      id="agregar-isla-manual"
      className="relative overflow-hidden border-b border-gray-200 bg-white px-4 py-12 dark:border-gray-800 dark:bg-gray-950"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-400/5"></div>
        <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl dark:bg-sky-400/5"></div>
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            <span className="mr-2 h-2 w-2 rounded-full bg-indigo-500"></span>
            Biblioteca de Islas
          </div>
          <h2 className="mb-3 text-3xl font-extrabold text-gray-900 dark:text-gray-100 md:text-4xl">
            Agrega tus language islands y estudia por oraciones
          </h2>
          <p className="mx-auto max-w-3xl text-base text-gray-600 dark:text-gray-400 md:text-lg">
            Crea islas con una oración por línea para practicar traducción en
            contexto, reforzar estructuras y trabajar pronunciación con TTS.
          </p>
        </div>

        <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-6 flex items-center text-2xl font-bold text-gray-900 dark:text-gray-100">
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <span className="text-sm text-white">+</span>
            </div>
            {editingIsland ? "Editar isla" : "Agregar isla manualmente"}
          </h3>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Título de la isla
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition-colors duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Ej: Isla de conversaciones cotidianas"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Oraciones (una por línea)
              </label>
              <textarea
                value={form.sentencesText}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    sentencesText: event.target.value,
                  }))
                }
                className="min-h-[220px] w-full resize-vertical rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition-colors duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                placeholder={
                  "I wake up at 6 AM every day.\nI make coffee before work.\nI review English for 20 minutes."
                }
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Consejo: cada línea se mostrará como una oración individual en
                la ruta de estudio.
              </p>
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

            <div className="flex flex-wrap justify-end gap-3">
              {editingIsland ? (
                <button
                  type="button"
                  onClick={resetFormState}
                  className="rounded-xl bg-gray-100 px-5 py-3 font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Cancelar edición
                </button>
              ) : null}

              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-600"
              >
                {isSaving
                  ? "Guardando..."
                  : editingIsland
                    ? "Actualizar isla"
                    : "Guardar isla"}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4" id="islas-guardadas">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Islas guardadas
            </h3>
            <span className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
              {islands.length} total
            </span>
          </div>

          {isLoading ? (
            <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 h-5 w-48 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="space-y-3">
                <div className="h-20 rounded-xl bg-gray-100 dark:bg-gray-800"></div>
                <div className="h-20 rounded-xl bg-gray-100 dark:bg-gray-800"></div>
              </div>
            </div>
          ) : islands.length > 0 ? (
            islands.map((island) => {
              const sentences = splitIslandSentences(island.sentencesText);
              const preview = sentences.slice(0, 2).join(" ");

              return (
                <article
                  key={island.id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
                >
                  <div className="p-6">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                      <div className="flex-1">
                        <div className="mb-2 flex items-start justify-between">
                          <h4 className="text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-indigo-400">
                            {island.title}
                          </h4>
                          <div className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                            {new Date(island.updatedAt).toLocaleDateString(
                              "es-ES"
                            )}
                          </div>
                        </div>

                        <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                          {preview}
                        </p>

                        <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300">
                          {sentences.length} oraciones
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/aprender-con-language-island/${island.id}`}
                          reloadDocument
                          className="inline-flex items-center rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-indigo-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
                        >
                          Abrir isla
                        </Link>
                        <button
                          type="button"
                          onClick={() => startEdit(island)}
                          className="rounded-xl bg-gray-100 px-4 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => void onDelete(island.id)}
                          className="rounded-xl bg-red-50 px-4 py-3 font-medium text-red-700 transition-colors duration-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/40"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h4 className="mb-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
                Aún no tienes islas
              </h4>
              <p className="mx-auto max-w-xl text-gray-600 dark:text-gray-400">
                Agrega una isla con tus oraciones favoritas para empezar a
                estudiar con traducción contextual.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
