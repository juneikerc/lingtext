import { Link } from "react-router";
import { useTranslatorStore } from "~/context/translatorSelector";
import TranslatorSelector from "~/components/TranslatorSelector";

interface ReaderHeaderProps {
  title: string;
}

export default function ReaderHeader({ title }: ReaderHeaderProps) {
  const { status, modelReady } = useTranslatorStore();

  // Get status indicator
  const getStatusIndicator = () => {
    if (status === "downloading") {
      return (
        <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-xs font-medium">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Descargando</span>
        </div>
      );
    }
    if (status === "computing") {
      return (
        <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-md text-xs font-medium">
          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
          <span>Traduciendo</span>
        </div>
      );
    }
    if (modelReady || status === "ready") {
      return (
        <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md text-xs font-medium">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          <span>Listo</span>
        </div>
      );
    }
    if (status === "error") {
      return (
        <div className="flex items-center space-x-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-xs font-medium">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
          <span>Error</span>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md text-xs font-medium">
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
        <span>Inactivo</span>
      </div>
    );
  };

  return (
    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-20">
      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8">
        {/* Primera fila compacta - Título y navegación */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            <Link
              to="../"
              className="group flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-500 hover:text-white text-gray-700 dark:text-gray-300 font-medium transition-all duration-200"
            >
              <span className="text-sm group-hover:-translate-x-0.5 transition-transform duration-200">
                ←
              </span>
              <span className="text-sm">Volver</span>
            </Link>

            <div className="h-5 w-px bg-gray-300 dark:bg-gray-600"></div>

            <div className="flex-1">
              <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 truncate max-w-sm">
                {title || "Sin título"}
              </h1>
            </div>
          </div>

          {/* Indicador de estado compacto */}
          <div className="hidden sm:flex">{getStatusIndicator()}</div>
        </div>

        {/* Segunda fila compacta - Selector de traductor */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-t border-gray-200/50 dark:border-gray-700/50 pt-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded flex items-center justify-center">
              <span className="text-white text-xs">🌐</span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Traductor Local:
            </span>
          </div>

          <TranslatorSelector compact />
        </div>
      </div>
    </div>
  );
}
