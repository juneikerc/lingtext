import React, { useState, useEffect } from "react";
import {
  exportDatabase,
  importDatabase,
  getDatabaseInfo,
  isOPFSAvailable,
} from "~/services/db";

interface DatabaseInfo {
  isOPFS: boolean;
  filename: string;
  size?: number;
}

export default function DatabaseSettings() {
  const [dbInfo, setDbInfo] = useState<DatabaseInfo | null>(null);
  const [opfsAvailable, setOpfsAvailable] = useState<boolean | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    loadDatabaseInfo();
  }, []);

  async function loadDatabaseInfo() {
    try {
      const [info, opfs] = await Promise.all([
        getDatabaseInfo(),
        isOPFSAvailable(),
      ]);
      setDbInfo(info);
      setOpfsAvailable(opfs);
    } catch (error) {
      console.error("Error loading database info:", error);
    }
  }

  async function handleExport() {
    setIsExporting(true);
    setMessage(null);
    try {
      await exportDatabase();
      setMessage({
        type: "success",
        text: "Base de datos exportada correctamente",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: `Error al exportar: ${(error as Error).message}`,
      });
    } finally {
      setIsExporting(false);
    }
  }

  async function handleImport() {
    const confirmed = window.confirm(
      "⚠️ Importar una base de datos reemplazará TODOS tus datos actuales.\n\n" +
        "Esto incluye:\n" +
        "• Todos tus textos\n" +
        "• Todas tus palabras guardadas\n" +
        "• Tu progreso de aprendizaje\n" +
        "• Tus configuraciones\n\n" +
        "¿Estás seguro de que deseas continuar?"
    );

    if (!confirmed) return;

    setIsImporting(true);
    setMessage(null);
    try {
      await importDatabase();
      setMessage({
        type: "success",
        text: "Base de datos importada correctamente. Recargando...",
      });
      // Reload the page to reflect the new data
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: `Error al importar: ${(error as Error).message}`,
      });
    } finally {
      setIsImporting(false);
    }
  }

  function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
          <span className="text-white text-xl">💾</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Gestión de Datos
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Exporta o importa tu base de datos SQLite
          </p>
        </div>
      </div>

      {/* Database Info */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Estado de la Base de Datos
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">
              Almacenamiento:
            </span>
            <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
              {opfsAvailable === null
                ? "Cargando..."
                : opfsAvailable
                  ? "OPFS (Persistente)"
                  : "Memoria (Temporal)"}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Tamaño:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
              {dbInfo?.size ? formatBytes(dbInfo.size) : "N/A"}
            </span>
          </div>
        </div>
        {!opfsAvailable && opfsAvailable !== null && (
          <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              ⚠️ OPFS no está disponible. Los datos se perderán al cerrar el
              navegador. Exporta tu base de datos para guardarla.
            </p>
          </div>
        )}
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
              : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
          }`}
        >
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleExport}
          disabled={isExporting || isImporting}
          className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
        >
          {isExporting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Exportando...
            </>
          ) : (
            <>
              <span className="mr-2">📤</span>
              Exportar Base de Datos
            </>
          )}
        </button>

        <button
          onClick={handleImport}
          disabled={isExporting || isImporting}
          className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium rounded-xl hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
        >
          {isImporting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Importando...
            </>
          ) : (
            <>
              <span className="mr-2">📥</span>
              Importar Base de Datos
            </>
          )}
        </button>
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
          💡 Sobre tus datos
        </h4>
        <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
          <li>• Tus datos se guardan automáticamente en el navegador (OPFS)</li>
          <li>
            • Exporta regularmente para tener un respaldo en tu disco duro
          </li>
          <li>
            • El archivo .sqlite es portable y puedes abrirlo con cualquier
            visor de SQLite
          </li>
          <li>• Al importar, todos los datos actuales serán reemplazados</li>
        </ul>
      </div>
    </div>
  );
}
