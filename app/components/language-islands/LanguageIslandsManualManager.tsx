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
            Biblioteca de Islas
          </div>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Agrega tus language islands y estudia por oraciones
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600">
            Crea islas con una oración por línea para practicar traducción en
            contexto, reforzar estructuras y trabajar pronunciación con TTS.
          </p>
        </div>

        <div className="mb-12 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F9EDA] text-sm text-white">
              +
            </span>
            {editingIsland ? "Editar isla" : "Agregar isla manualmente"}
          </h3>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Título de la isla
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-[#0F9EDA] focus:outline-none focus:ring-2 focus:ring-[#0F9EDA]/20"
                placeholder="Ej: Isla de conversaciones cotidianas"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
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
                className="min-h-[220px] w-full resize-vertical rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-[#0F9EDA] focus:outline-none focus:ring-2 focus:ring-[#0F9EDA]/20"
                placeholder={
                  "I wake up at 6 AM every day.\nI make coffee before work.\nI review English for 20 minutes."
                }
              />
              <p className="mt-2 text-xs text-gray-500">
                Consejo: cada línea se mostrará como una oración individual en
                la ruta de estudio.
              </p>
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
              {editingIsland ? (
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
                  : editingIsland
                    ? "Actualizar isla"
                    : "Guardar isla"}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4" id="islas-guardadas">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-2xl font-bold text-gray-900">
              Islas guardadas
            </h3>
            <span className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {islands.length} total
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
          ) : islands.length > 0 ? (
            islands.map((island) => {
              const sentences = splitIslandSentences(island.sentencesText);
              const preview = sentences.slice(0, 2).join(" ");

              return (
                <article
                  key={island.id}
                  className="group rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-[#0F9EDA]/30 hover:shadow-md"
                >
                  <div className="p-6">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                      <div className="flex-1">
                        <div className="mb-2 flex items-start justify-between">
                          <h4 className="text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-[#0F9EDA]">
                            {island.title}
                          </h4>
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                            {new Date(island.updatedAt).toLocaleDateString(
                              "es-ES"
                            )}
                          </span>
                        </div>

                        <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                          {preview}
                        </p>

                        <span className="inline-flex items-center rounded-full border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 px-3 py-1 text-xs font-medium text-[#0F9EDA]">
                          {sentences.length} oraciones
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/aprender-con-language-island/${island.id}`}
                          reloadDocument
                          className="inline-flex items-center gap-2 rounded-xl bg-[#0F9EDA] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0D8EC4] hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                        >
                          Abrir isla
                        </Link>
                        <button
                          type="button"
                          onClick={() => startEdit(island)}
                          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:border-[#0F9EDA] hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => void onDelete(island.id)}
                          className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition-colors duration-200 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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
            <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center shadow-sm">
              <h4 className="mb-3 text-2xl font-bold text-gray-900">
                Aún no tienes islas
              </h4>
              <p className="mx-auto max-w-xl text-gray-600">
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
