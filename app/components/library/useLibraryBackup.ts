import { useState } from "react";

import { exportDatabase, getDatabaseInfo, importDatabase } from "~/services/db";

import type { LibraryMessage } from "./types";

export function useLibraryBackup() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [dbMessage, setDbMessage] = useState<LibraryMessage | null>(null);

  async function handleExportDatabase() {
    setIsExporting(true);
    setDbMessage(null);
    try {
      const success = await exportDatabase();
      if (success) {
        const info = await getDatabaseInfo();
        setDbMessage({
          type: "success",
          text: `Base de datos exportada (${info.textCount} textos, ${info.wordCount} palabras)`,
        });
      }
    } catch (error) {
      setDbMessage({
        type: "error",
        text: `Error al exportar: ${(error as Error).message}`,
      });
    } finally {
      setIsExporting(false);
    }
  }

  async function handleImportDatabase() {
    const confirmed = window.confirm(
      "⚠️ Importar una base de datos reemplazará TODOS tus datos actuales.\n\n" +
        "Esto incluye:\n" +
        "• Todos tus textos\n" +
        "• Todas tus palabras guardadas\n" +
        "• Tu progreso de aprendizaje\n\n" +
        "¿Estás seguro de que deseas continuar?"
    );

    if (!confirmed) return;

    setIsImporting(true);
    setDbMessage(null);
    try {
      const success = await importDatabase();
      if (success) {
        setDbMessage({
          type: "success",
          text: "Base de datos importada correctamente. Recargando...",
        });
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error) {
      setDbMessage({
        type: "error",
        text: `Error al importar: ${(error as Error).message}`,
      });
    } finally {
      setIsImporting(false);
    }
  }

  return {
    isExporting,
    isImporting,
    dbMessage,
    handleExportDatabase,
    handleImportDatabase,
  };
}
