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

export function LibraryBackupPanel({
  isExporting,
  isImporting,
  dbMessage,
  onExportDatabase,
  onImportDatabase,
}: LibraryBackupPanelProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/10">
          <DatabaseIcon />
        </div>
        <div>
          <h3 className="text-xl font-bold tracking-tight text-gray-900">
            Respaldo de biblioteca
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Protege y administra tu base de datos de lecturas.
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/5 p-5">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#0F9EDA]/20 bg-white text-[#0F9EDA]">
              <DownloadIcon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#0A7AAB]">Exportar backup</h4>
              <p className="mt-1 text-sm text-gray-600">
                Descarga una copia de seguridad de toda tu biblioteca.
              </p>
            </div>
          </div>
          <button
            onClick={onExportDatabase}
            disabled={isExporting || isImporting}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#0F9EDA]/20 bg-white px-4 py-2.5 text-sm font-semibold text-[#0F9EDA] transition-colors duration-200 hover:border-[#0F9EDA]/40 hover:bg-[#0F9EDA]/5 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto sm:min-w-56"
          >
            <DownloadIcon className="h-4 w-4" />
            {isExporting ? "Exportando..." : "Exportar ahora"}
          </button>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-white text-amber-600">
              <UploadIcon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-amber-700">Restaurar backup</h4>
              <p className="mt-1 text-sm text-gray-600">
                Restaura tu biblioteca desde un archivo de respaldo.
              </p>
            </div>
          </div>
          <button
            onClick={onImportDatabase}
            disabled={isExporting || isImporting}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm font-semibold text-amber-700 transition-colors duration-200 hover:border-amber-300 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto sm:min-w-56"
          >
            <UploadIcon className="h-4 w-4" />
            {isImporting ? "Importando..." : "Restaurar backup"}
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
    </section>
  );
}
