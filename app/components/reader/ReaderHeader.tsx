import { Link } from "react-router";
import { useTranslatorStore } from "~/context/translatorSelector";
import { TRANSLATORS } from "~/types";

interface ReaderHeaderProps {
  title: string;
}

export default function ReaderHeader({ title }: ReaderHeaderProps) {
  const { selected, setSelected } = useTranslatorStore();
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
              <span className="text-sm group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
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
          <div className="hidden sm:flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md text-xs font-medium">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span>Listo</span>
          </div>
        </div>

        {/* Segunda fila compacta - Selector de traductor */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-t border-gray-200/50 dark:border-gray-700/50 pt-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded flex items-center justify-center">
              <span className="text-white text-xs">🌐</span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Traductor:</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
            <select
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm font-medium"
              value={selected}
              onChange={(e) => setSelected(e.target.value as TRANSLATORS)}
            >
              <option value={TRANSLATORS.CHROME}>⚡ Rápido | Básico</option>
              <option value={TRANSLATORS.GEMMA_3N_E4B_IT_FREE}>🧠 Inteligente | Medio</option>
              <option value={TRANSLATORS.GPT_OSS_20B_FREE}>🚀 Muy Inteligente | Lento</option>
            </select>

            {/* Información compacta del traductor seleccionado */}
            <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {selected === TRANSLATORS.CHROME && "Nativo"}
              {selected === TRANSLATORS.GEMMA_3N_E4B_IT_FREE && "IA Optimizada"}
              {selected === TRANSLATORS.GPT_OSS_20B_FREE && "IA Avanzada"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
