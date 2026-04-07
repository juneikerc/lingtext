import type { LibraryMessage } from "./types";

interface LibraryBackupPanelProps {
  isExporting: boolean;
  isImporting: boolean;
  dbMessage: LibraryMessage | null;
  onExportDatabase: () => void;
  onImportDatabase: () => void;
}

function DatabaseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-5 w-5 text-[#0F9EDA]"
      aria-hidden="true"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" strokeWidth="1.8" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" strokeWidth="1.8" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" strokeWidth="1.8" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={className ?? "h-4 w-4"}
      aria-hidden="true"
    >
      <path
        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={className ?? "h-4 w-4"}
      aria-hidden="true"
    >
      <path
        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="h-5 w-5 rotate-0 text-gray-400 transition-transform duration-200 group-open:rotate-180"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

export function LibraryBackupPanel({
  isExporting,
  isImporting,
  dbMessage,
  onExportDatabase,
  onImportDatabase,
}: LibraryBackupPanelProps) {
  return (
    <details className="group">
      <summary className="list-none cursor-pointer">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/10">
                <DatabaseIcon />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  Backup de Base de Datos
                </h3>
                <p className="text-sm text-gray-500">
                  Guarda o restaura todos tus datos
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                .sqlite
              </span>
              <ChevronIcon />
            </div>
          </div>
        </div>
      </summary>

      <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/10">
                <DownloadIcon className="h-5 w-5 text-[#0F9EDA]" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Exportar Backup</h4>
                <p className="text-xs text-gray-500">
                  Descarga tu base de datos como archivo .sqlite
                </p>
              </div>
            </div>
            <button
              onClick={onExportDatabase}
              disabled={isExporting || isImporting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F9EDA] px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#0D8EC4] disabled:cursor-not-allowed disabled:bg-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <DownloadIcon className="h-4 w-4" />
              {isExporting ? "Exportando..." : "Guardar en PC"}
            </button>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-50">
                <UploadIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Restaurar Backup
                </h4>
                <p className="text-xs text-gray-500">
                  Reemplaza todos los datos actuales
                </p>
              </div>
            </div>
            <button
              onClick={onImportDatabase}
              disabled={isExporting || isImporting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <UploadIcon className="h-4 w-4" />
              {isImporting ? "Importando..." : "Cargar desde PC"}
            </button>
          </div>
        </div>

        {dbMessage ? (
          <div
            className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
              dbMessage.type === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {dbMessage.text}
          </div>
        ) : null}
      </div>
    </details>
  );
}
