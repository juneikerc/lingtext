import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { useTranslatorStore } from "~/context/translatorSelector";
import { TRANSLATORS } from "~/types";
import { getOpenRouterApiKey } from "~/services/db";
import { isChromeAIAvailable } from "~/utils/translate";
import ApiKeyConfig from "~/components/ApiKeyConfig";

interface ReaderHeaderProps {
  title: string;
}

export default function ReaderHeader({ title }: ReaderHeaderProps) {
  const { selected, setSelected } = useTranslatorStore();
  const [showApiKeyConfig, setShowApiKeyConfig] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const prevSelectedRef = useRef<TRANSLATORS | null>(null);

  useEffect(() => {
    checkApiKey();
  }, []);

  useEffect(() => {
    const prevSelected = prevSelectedRef.current;
    prevSelectedRef.current = selected;

    // Solo alertar cuando el usuario cambia explícitamente a Chrome
    if (
      prevSelected !== null &&
      selected === TRANSLATORS.CHROME &&
      prevSelected !== TRANSLATORS.CHROME &&
      !isChromeAIAvailable()
    ) {
      alert(
        "El traductor nativo de Chrome requiere:\n" +
          "- Navegador Google Chrome de escritorio\n" +
          "- API de traducción activada en tu navegador\n\n" +
          "Si no cumples esos requisitos, puedes usar el traductor gratis (MyMemory) o agregar una API Key de OpenRouter para los modelos con IA."
      );
    }
  }, [selected]);

  async function checkApiKey() {
    const key = await getOpenRouterApiKey();
    setHasApiKey(!!key);
  }

  const needsApiKey =
    (selected === TRANSLATORS.MEDIUM || selected === TRANSLATORS.SMART) &&
    !hasApiKey;

  return (
    <>
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-20">
        <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8">
          {/* Primera fila compacta - Título y navegación */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="group flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-500 hover:text-white text-gray-700 dark:text-gray-300 font-medium transition-all duration-200"
              >
                <span className="text-sm group-hover:-translate-x-0.5 transition-transform duration-200">
                  ←
                </span>
                <span className="text-sm">Volver</span>
              </button>

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
              <strong className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Traductor:
              </strong>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
              <select
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm font-medium"
                value={selected}
                onChange={(e) => setSelected(e.target.value as TRANSLATORS)}
              >
                <option value={TRANSLATORS.CHROME}>⚡ Rápido | Básico</option>
                <option value={TRANSLATORS.MYMEMORY}>
                  🆓 Gratis (Poco Preciso) | MyMemory
                </option>
                <option value={TRANSLATORS.MEDIUM}>
                  🧠 Inteligente | Medio
                </option>
                <option value={TRANSLATORS.SMART}>
                  🚀 Muy Inteligente + costoso
                </option>
              </select>

              {/* Información compacta del traductor seleccionado */}
              <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                {selected === TRANSLATORS.CHROME && "Nativo"}
                {selected === TRANSLATORS.MYMEMORY && "Gratis"}
                {selected === TRANSLATORS.MEDIUM && "IA Optimizada"}
                {selected === TRANSLATORS.SMART && "IA Avanzada"}
              </div>

              {/* Botón de configuración de API Key */}
              <button
                onClick={() => setShowApiKeyConfig(true)}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                  needsApiKey
                    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                title="Configurar API Key"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                {needsApiKey && <span>API Key</span>}
              </button>
            </div>
          </div>

          {/* Aviso si falta API Key */}
          {needsApiKey && (
            <div className="pb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl shadow-sm gap-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-full">
                    <svg
                      className="w-5 h-5 text-amber-600 dark:text-amber-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-900 dark:text-amber-100">
                      Configuración requerida
                    </h4>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                      Para usar traductores con IA avanzada, necesitas una clave
                      de OpenRouter.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <a
                    href="https://github.com/juneikerc/lingtext/blob/main/open-router-key.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none text-center px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 rounded-lg transition-colors shadow-sm"
                  >
                    ¿Cómo obtenerla? (Tutorial)
                  </a>
                  <button
                    onClick={() => setShowApiKeyConfig(true)}
                    className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 hover:bg-amber-200 dark:hover:bg-amber-900/80 rounded-lg transition-colors border border-amber-200 dark:border-amber-800"
                  >
                    Configurar ahora
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showApiKeyConfig && (
        <ApiKeyConfig
          onClose={() => {
            setShowApiKeyConfig(false);
            checkApiKey();
          }}
        />
      )}
    </>
  );
}
