import { useState, useEffect, useRef } from "react";
import { useTranslatorStore } from "~/context/translatorSelector";
import { TRANSLATORS, type Translator } from "~/types";
import { getOpenRouterApiKey } from "~/services/db";
import { isChromeAIAvailable } from "~/utils/translate";
import ApiKeyConfig from "~/components/ApiKeyConfig";
import ReaderPreferencesPanel from "~/components/reader/ReaderPreferencesPanel";

interface ReaderHeaderProps {
  title: string;
}

export default function ReaderHeader({ title }: ReaderHeaderProps) {
  const { selected, setSelected } = useTranslatorStore();
  const [showApiKeyConfig, setShowApiKeyConfig] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [isHidden, setIsHidden] = useState(false);
  const prevSelectedRef = useRef<Translator | null>(null);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    checkApiKey();
  }, []);

  useEffect(() => {
    if (!showPreferences) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowPreferences(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showPreferences]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const prevY = lastScrollYRef.current;
      const delta = currentY - prevY;

      if (Math.abs(delta) < 6) return;

      if (showPreferences) {
        setIsHidden(false);
      } else if (currentY > 80 && delta > 0) {
        setIsHidden(true);
      } else if (delta < 0) {
        setIsHidden(false);
      }

      lastScrollYRef.current = currentY;
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showPreferences]);

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
      <div
        className={`bg-white/95 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-20 transition-transform duration-200 ${
          isHidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8">
          {/* Primera fila compacta - Título y navegación */}
          <div className="flex items-center justify-between py-2 sm:py-3 min-w-0">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="group shrink-0 flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-[#0F9EDA] hover:text-white text-gray-700 font-medium transition-all duration-200"
                aria-label="Volver"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200"
                >
                  <path
                    d="m15 18-6-6 6-6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="hidden sm:inline text-sm">Volver</span>
              </button>

              <div className="hidden sm:block h-5 w-px bg-gray-300"></div>

              <div className="flex-1 min-w-0">
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate w-full">
                  {title || "Sin título"}
                </h1>
              </div>
            </div>

            {/* Indicador de estado compacto */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#0F9EDA]/10 text-[#0F9EDA] rounded-lg text-xs font-medium">
              <div className="w-1.5 h-1.5 bg-[#0F9EDA] rounded-full animate-pulse"></div>
              <span>Listo</span>
            </div>
          </div>

          {/* Segunda fila compacta - Selector de traductor */}
          <div className="flex flex-col gap-2 sm:gap-3 pb-2 sm:pb-3 border-t border-gray-200/50 pt-1.5 sm:pt-2">
            <div className="flex items-center justify-between gap-2">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-5 h-5 bg-[#0F9EDA]/10 rounded-lg flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-3 h-3 text-[#0F9EDA]"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path d="M2 12h20" strokeWidth="2" />
                    <path
                      d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <strong className="text-sm font-medium text-gray-900">
                  Traductor:
                </strong>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div
                  className="sm:hidden shrink-0 w-5 h-5 bg-[#0F9EDA]/10 rounded-lg flex items-center justify-center"
                  aria-hidden="true"
                  title="Traductor"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4 text-[#0F9EDA]"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path d="M2 12h20" strokeWidth="2" />
                    <path
                      d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                <select
                  className="flex-1 sm:flex-none min-w-0 px-2 sm:px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#0F9EDA] focus:border-[#0F9EDA] transition-all duration-200 text-xs sm:text-sm font-medium"
                  value={selected}
                  onChange={(e) => setSelected(e.target.value as Translator)}
                >
                  <option value={TRANSLATORS.CHROME}>
                    ⚡ Rápido/Básico (Solo Chrome en pc)
                  </option>
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
                <div className="hidden sm:block text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                  {selected === TRANSLATORS.CHROME && "Nativo"}
                  {selected === TRANSLATORS.MYMEMORY && "Gratis"}
                  {selected === TRANSLATORS.MEDIUM && "IA Optimizada"}
                  {selected === TRANSLATORS.SMART && "IA Avanzada"}
                </div>

                <button
                  type="button"
                  onClick={() => setShowPreferences((current) => !current)}
                  className={`shrink-0 inline-flex items-center gap-2 rounded-xl border px-2 sm:px-3 py-2 text-xs font-semibold shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                    showPreferences
                      ? "border-[#0F9EDA] bg-[#0F9EDA] text-white"
                      : "border-[#0F9EDA]/20 bg-[#0F9EDA]/5 text-[#0F9EDA] hover:border-[#0F9EDA]/40 hover:bg-[#0F9EDA]/10"
                  }`}
                  aria-expanded={showPreferences}
                  aria-controls="reader-preferences-panel"
                  title={
                    showPreferences
                      ? "Cerrar preferencias de lectura"
                      : "Abrir preferencias de lectura"
                  }
                >
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-lg text-[11px] font-bold ${
                      showPreferences
                        ? "bg-white/20 text-white"
                        : "bg-white text-[#0F9EDA]"
                    }`}
                  >
                    Aa
                  </span>
                  <span className="hidden sm:inline">
                    {showPreferences
                      ? "Cerrar preferencias"
                      : "Personalizar lectura"}
                  </span>
                  <svg
                    className={`hidden sm:block h-3.5 w-3.5 transition-transform duration-200 ${
                      showPreferences ? "rotate-180" : "rotate-0"
                    }`}
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="m5 7.5 5 5 5-5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => setShowApiKeyConfig(true)}
                  className={`shrink-0 flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    needsApiKey
                      ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                  {needsApiKey && (
                    <span className="hidden sm:inline">API Key</span>
                  )}
                </button>
              </div>
            </div>

            {showPreferences ? (
              <div id="reader-preferences-panel">
                <ReaderPreferencesPanel
                  onClose={() => setShowPreferences(false)}
                />
              </div>
            ) : null}
          </div>

          {/* Aviso si falta API Key */}
          {needsApiKey && (
            <div className="pb-2 sm:pb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-amber-50 border border-amber-200 sm:border-2 rounded-xl shadow-sm gap-3 sm:gap-4">
                <div className="flex items-center space-x-2.5 sm:space-x-3">
                  <div className="bg-amber-100 p-1.5 sm:p-2 rounded-full shrink-0">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600"
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
                    <h4 className="text-xs sm:text-sm font-bold text-amber-900">
                      Configuración requerida
                    </h4>
                    <p className="text-[11px] sm:text-xs text-amber-700 mt-0.5">
                      Para usar traductores con IA avanzada, necesitas una clave
                      de OpenRouter.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
                  <a
                    href="https://github.com/juneikerc/lingtext/blob/main/open-router-key.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none text-center px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-sm"
                  >
                    ¿Cómo obtenerla? (Tutorial)
                  </a>
                  <button
                    onClick={() => setShowApiKeyConfig(true)}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors border border-amber-200"
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
