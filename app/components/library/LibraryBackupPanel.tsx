import type { LibraryMessage } from "./types";

interface LibraryBackupPanelProps {
  isExporting: boolean;
  isImporting: boolean;
  dbMessage: LibraryMessage | null;
  onExportDatabase: () => void;
  onImportDatabase: () => void;
}

export function LibraryBackupPanel({
  isExporting,
  isImporting,
  dbMessage,
  onExportDatabase,
  onImportDatabase,
}: LibraryBackupPanelProps) {
  return (
    <details className="group mb-8">
      <summary className="list-none cursor-pointer">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 transition-colors hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
                <span className="text-xl text-white">💾</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100">
                  Backup de Base de Datos
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Guarda o restaura todos tus datos (textos, palabras, progreso)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                .sqlite
              </span>
              <svg
                className="h-5 w-5 rotate-0 text-gray-500 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </summary>

      <div className="mt-2 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60">
            <div className="mb-3 flex items-start gap-3">
              <span className="text-2xl">📤</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  Exportar Backup
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Descarga tu base de datos como archivo .sqlite
                </p>
              </div>
            </div>
            <button
              onClick={onExportDatabase}
              disabled={isExporting || isImporting}
              className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:disabled:bg-gray-600 dark:focus-visible:ring-offset-gray-950"
            >
              {isExporting ? "Exportando..." : "Guardar en PC"}
            </button>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60">
            <div className="mb-3 flex items-start gap-3">
              <span className="text-2xl">📥</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  Restaurar Backup
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  ⚠️ Reemplaza todos los datos actuales
                </p>
              </div>
            </div>
            <button
              onClick={onImportDatabase}
              disabled={isExporting || isImporting}
              className="flex w-full items-center justify-center rounded-lg bg-amber-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:disabled:bg-gray-600 dark:focus-visible:ring-offset-gray-950"
            >
              {isImporting ? "Importando..." : "Cargar desde PC"}
            </button>
          </div>
        </div>

        {dbMessage ? (
          <div
            className={`mt-4 rounded-lg border p-3 text-sm ${
              dbMessage.type === "success"
                ? "border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300"
                : "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300"
            }`}
          >
            {dbMessage.text}
          </div>
        ) : null}
      </div>
    </details>
  );
}
