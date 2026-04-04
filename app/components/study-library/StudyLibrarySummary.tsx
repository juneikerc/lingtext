import type { SortOption, StudyLibraryStats } from "./types";
import { MAX_WORDS_FOR_STORY, SORT_OPTIONS, VIEW_OPTIONS } from "./utils";

interface StudyLibrarySummaryProps {
  stats: StudyLibraryStats;
  newCardsPerDay: number;
  newCardsInput: string;
  onNewCardsInputChange: (value: string) => void;
  onPersistNewCardsLimit: () => void;
  isSavingNewCardsLimit: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortByChange: (value: SortOption) => void;
  activeView: string;
  onActiveViewChange: (view: typeof VIEW_OPTIONS[number]["id"]) => void;
  viewCounts: Record<string, number>;
  selectedCount: number;
  resultsCount: number;
  activeViewLabel: string;
  activeSortLabel: string;
  onSelectFilteredWords: () => void;
  onClearSelection: () => void;
  onExportSelection: () => void;
  onOpenStoryGenerator: () => void;
  onDeleteSelection: () => void;
  isStoryDisabled: boolean;
  isBulkProcessing: boolean;
}

export function StudyLibrarySummary({
  stats,
  newCardsPerDay,
  newCardsInput,
  onNewCardsInputChange,
  onPersistNewCardsLimit,
  isSavingNewCardsLimit,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortByChange,
  activeView,
  onActiveViewChange,
  viewCounts,
  selectedCount,
  resultsCount,
  activeViewLabel,
  activeSortLabel,
  onSelectFilteredWords,
  onClearSelection,
  onExportSelection,
  onOpenStoryGenerator,
  onDeleteSelection,
  isStoryDisabled,
  isBulkProcessing,
}: StudyLibrarySummaryProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-5 text-center dark:border-amber-900/30 dark:bg-amber-900/10">
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {stats.reviewsDue}
          </div>
          <div className="text-sm font-medium text-amber-800 dark:text-amber-300">
            Due
          </div>
        </div>
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5 text-center dark:border-indigo-900/30 dark:bg-indigo-900/10">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {stats.newCardsAvailableToday}
          </div>
          <div className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
            New para hoy
          </div>
          <div className="mt-1 text-xs text-indigo-600/80 dark:text-indigo-300/80">
            {stats.newCardsDone}/{newCardsPerDay} ya estudiadas
          </div>
        </div>
        <div className="rounded-xl border border-sky-100 bg-sky-50 p-5 text-center dark:border-sky-900/30 dark:bg-sky-900/10">
          <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
            {stats.phrasesCount}
          </div>
          <div className="text-sm font-medium text-sky-800 dark:text-sky-300">
            Phrases
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-center dark:border-gray-800 dark:bg-gray-900">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.totalCollection}
          </div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total guardadas
          </div>
        </div>
      </div>

      <div className="mb-5 mt-6 rounded-xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-900/30 dark:bg-indigo-900/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
              Nuevas por dia en review
            </h3>
            <p className="mt-1 text-sm text-indigo-700/80 dark:text-indigo-300/80">
              Ajusta cuantas tarjetas nuevas sin repasar entran en la sesion
              diaria.
            </p>
          </div>

          <div className="flex items-end gap-3">
            <div>
              <label
                htmlFor="new-cards-per-day"
                className="mb-2 block text-xs font-medium uppercase tracking-wider text-indigo-800 dark:text-indigo-300"
              >
                Limite diario
              </label>
              <input
                id="new-cards-per-day"
                type="number"
                min={0}
                max={100}
                inputMode="numeric"
                value={newCardsInput}
                onChange={(event) => onNewCardsInputChange(event.target.value)}
                onBlur={onPersistNewCardsLimit}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.currentTarget.blur();
                  }
                }}
                className="w-28 rounded-xl border border-indigo-200 bg-white px-4 py-3 text-gray-900 outline-none transition-colors duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-indigo-800 dark:bg-gray-950 dark:text-gray-100"
              />
            </div>
            <div className="pb-3 text-xs text-indigo-700/80 dark:text-indigo-300/80">
              {isSavingNewCardsLimit ? "Guardando..." : "Enter o blur para guardar"}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex-1">
          <label
            htmlFor="words-search"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Buscar en expresion o significado
          </label>
          <input
            id="words-search"
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Ej. take off, remember, phrasal verb..."
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-colors duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500"
          />
        </div>

        <div className="w-full lg:w-64">
          <label
            htmlFor="words-sort"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Orden
          </label>
          <select
            id="words-sort"
            value={sortBy}
            onChange={(event) => onSortByChange(event.target.value as SortOption)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-colors duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        {VIEW_OPTIONS.map((option) => {
          const isActive = option.id === activeView;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onActiveViewChange(option.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 ${
                isActive
                  ? "border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              <span>{option.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {viewCounts[option.id]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/60 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {selectedCount > 0
              ? `${selectedCount} seleccionadas`
              : `${resultsCount} resultado(s)`}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Vista activa: {activeViewLabel} · Orden: {activeSortLabel}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onSelectFilteredWords}
            disabled={resultsCount === 0}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Seleccionar resultados
          </button>
          <button
            type="button"
            onClick={onClearSelection}
            disabled={selectedCount === 0}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Limpiar seleccion
          </button>
          <button
            type="button"
            onClick={onExportSelection}
            disabled={selectedCount === 0}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Exportar seleccion
          </button>
          <button
            type="button"
            onClick={onOpenStoryGenerator}
            disabled={isStoryDisabled}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 dark:disabled:bg-gray-800 dark:disabled:text-gray-500"
          >
            Generar historia
          </button>
          <button
            type="button"
            onClick={onDeleteSelection}
            disabled={selectedCount === 0 || isBulkProcessing}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 dark:disabled:bg-gray-800 dark:disabled:text-gray-500"
          >
            Eliminar seleccion
          </button>
        </div>
      </div>

      {selectedCount > MAX_WORDS_FOR_STORY ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-300">
          Para generar historias, deja la seleccion en {MAX_WORDS_FOR_STORY}
          tarjetas o menos. Las acciones masivas siguen funcionando.
        </div>
      ) : null}
    </div>
  );
}
