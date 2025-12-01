/**
 * TranslatorSelector - Advanced Model Selection UI
 * Shows model info, download status, and hardware requirements
 * Self-contained: handles model initialization internally
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslatorStore } from "~/context/translatorSelector";
import { TRANSLATORS, MODEL_INFO } from "~/types";
import type { ModelInfo } from "~/types";

// Worker message types
interface WorkerMessage {
  type: string;
  id?: string;
  result?: string;
  error?: string;
  value?: number;
  status?: string;
  message?: string;
  modelId?: string;
  text?: string;
  file?: string;
}

// Icons as simple SVG components
const IconCPU = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
    />
  </svg>
);

const IconGPU = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
    />
  </svg>
);

const IconChrome = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0zM1.931 5.47A11.943 11.943 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.865-2.29zm13.342 2.166a5.446 5.446 0 0 1 1.45 7.09l.002.001h-.002l-3.952 6.848a12.014 12.014 0 0 0 9.229-9.006zM12 16.364a4.364 4.364 0 1 1 0-8.728 4.364 4.364 0 0 1 0 8.728z" />
  </svg>
);

const IconDownload = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

const IconCheck = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const IconWarning = () => (
  <svg
    className="w-4 h-4"
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
);

interface TranslatorSelectorProps {
  onModelChange?: (model: TRANSLATORS) => void;
  compact?: boolean;
}

export default function TranslatorSelector({
  onModelChange,
  compact = false,
}: TranslatorSelectorProps) {
  const {
    selected,
    setSelected,
    status,
    setStatus,
    downloadProgress,
    setDownloadProgress,
    progressText,
    setProgressText,
    modelReady,
    setModelReady,
    hasGPU,
    setHasGPU,
    hasChromeAI,
    setHasChromeAI,
    error,
    setError,
  } = useTranslatorStore();

  const [isOpen, setIsOpen] = useState(false);
  const [hardwareChecked, setHardwareChecked] = useState(false);

  // Worker refs
  const cpuWorkerRef = useRef<Worker | null>(null);
  const gpuWorkerRef = useRef<Worker | null>(null);

  // Check hardware capabilities on mount
  useEffect(() => {
    async function checkHardware() {
      // Check Chrome AI
      const chromeAI = typeof window !== "undefined" && "Translator" in window;
      setHasChromeAI(chromeAI);

      // Check WebGPU - be more lenient
      let gpuAvailable = false;
      if (typeof navigator !== "undefined" && "gpu" in navigator) {
        try {
          // @ts-expect-error WebGPU types
          const adapter = await navigator.gpu.requestAdapter();
          gpuAvailable = adapter !== null;
        } catch (e) {
          console.warn("WebGPU check failed:", e);
          gpuAvailable = false;
        }
      }
      setHasGPU(gpuAvailable);
      setHardwareChecked(true);
    }

    checkHardware();
  }, [setHasGPU, setHasChromeAI]);

  // Cleanup workers on unmount
  useEffect(() => {
    return () => {
      if (cpuWorkerRef.current) {
        cpuWorkerRef.current.terminate();
      }
      if (gpuWorkerRef.current) {
        gpuWorkerRef.current.terminate();
      }
    };
  }, []);

  // Get available models based on hardware (exclude disabled models)
  const availableModels = Object.values(TRANSLATORS).filter((model) => {
    const info = MODEL_INFO[model];
    if (info.disabled) return false; // Skip disabled models
    if (model === TRANSLATORS.CHROME_AI && !hasChromeAI) return false;
    if (info.requiresGPU && !hasGPU) return false;
    return true;
  });

  // Handle worker messages
  const handleWorkerMessage = useCallback(
    (event: MessageEvent<WorkerMessage>) => {
      const {
        type,
        value,
        status: msgStatus,
        message,
        text,
        error: msgError,
      } = event.data;

      switch (type) {
        case "WORKER_READY":
          console.log("Worker ready");
          break;

        case "STATUS":
          if (msgStatus) {
            setStatus(
              msgStatus as
                | "idle"
                | "downloading"
                | "ready"
                | "computing"
                | "error"
            );
          }
          if (message) {
            setProgressText(message);
          }
          if (msgStatus === "ready") {
            setModelReady(true);
            setDownloadProgress(100);
          }
          break;

        case "PROGRESS":
          setStatus("downloading");
          const progress = (value || 0) * 100;
          setDownloadProgress(progress);
          setProgressText(
            text || message || `Descargando... ${Math.round(progress)}%`
          );
          break;

        case "INIT_COMPLETE":
          setStatus("ready");
          setModelReady(true);
          setDownloadProgress(100);
          setProgressText("Modelo listo");
          break;

        case "ERROR":
          setStatus("error");
          setError(msgError || "Error desconocido");
          break;
      }
    },
    [setStatus, setDownloadProgress, setProgressText, setModelReady, setError]
  );

  // Handle model selection
  const handleSelectModel = useCallback(
    (model: TRANSLATORS) => {
      setSelected(model);
      setIsOpen(false);
      onModelChange?.(model);
    },
    [setSelected, onModelChange]
  );

  // Handle initialize/download - now self-contained
  const handleInitialize = useCallback(async () => {
    if (selected === TRANSLATORS.CHROME_AI) {
      // Chrome AI doesn't need initialization
      setModelReady(true);
      setStatus("ready");
      return;
    }

    setStatus("downloading");
    setDownloadProgress(0);
    setError(null);
    setProgressText("Iniciando descarga...");

    try {
      if (selected === TRANSLATORS.CPU_QWEN_05) {
        // Initialize CPU worker
        if (!cpuWorkerRef.current) {
          cpuWorkerRef.current = new Worker(
            new URL("../workers/cpu.worker.ts", import.meta.url),
            { type: "module" }
          );
          cpuWorkerRef.current.onmessage = handleWorkerMessage;
          cpuWorkerRef.current.onerror = (e) => {
            console.error("CPU Worker error:", e);
            setStatus("error");
            setError(`Worker error: ${e.message}`);
          };
        }
        cpuWorkerRef.current.postMessage({ type: "INIT" });
      } else {
        // Initialize GPU worker for Tiers 2-4
        const modelInfo = MODEL_INFO[selected];
        if (!gpuWorkerRef.current) {
          gpuWorkerRef.current = new Worker(
            new URL("../workers/gpu.worker.ts", import.meta.url),
            { type: "module" }
          );
          gpuWorkerRef.current.onmessage = handleWorkerMessage;
          gpuWorkerRef.current.onerror = (e) => {
            console.error("GPU Worker error:", e);
            setStatus("error");
            setError(`Worker error: ${e.message}`);
          };
        }
        gpuWorkerRef.current.postMessage({
          type: "INIT",
          modelId: modelInfo.modelHfId,
        });
      }
    } catch (err) {
      console.error("Initialization error:", err);
      setStatus("error");
      setError(err instanceof Error ? err.message : "Error de inicialización");
    }
  }, [
    selected,
    handleWorkerMessage,
    setStatus,
    setDownloadProgress,
    setError,
    setProgressText,
    setModelReady,
  ]);

  // Get icon for model
  const getModelIcon = (model: TRANSLATORS) => {
    if (model === TRANSLATORS.CHROME_AI) return <IconChrome />;
    if (model === TRANSLATORS.CPU_QWEN_05) return <IconCPU />;
    return <IconGPU />;
  };

  // Get tier badge color
  const getTierColor = (tier: number) => {
    switch (tier) {
      case 0:
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case 1:
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case 2:
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
      case 3:
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
      case 4:
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const selectedInfo = MODEL_INFO[selected];

  // Compact view for header
  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
        >
          {getModelIcon(selected)}
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {selectedInfo.name}
          </span>
          {status === "downloading" && (
            <span className="text-xs text-blue-600 dark:text-blue-400">
              {Math.round(downloadProgress)}%
            </span>
          )}
          {status === "computing" && (
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
          )}
          {modelReady && status === "ready" && (
            <span className="w-2 h-2 bg-green-500 rounded-full" />
          )}
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full mt-2 right-0 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Seleccionar Modelo
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {hasGPU ? "GPU detectada" : "Solo CPU disponible"}
                {hasChromeAI && " • Chrome AI disponible"}
              </p>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {availableModels.map((model) => (
                <ModelOption
                  key={model}
                  model={model}
                  info={MODEL_INFO[model]}
                  isSelected={selected === model}
                  isReady={model === selected && modelReady}
                  onSelect={handleSelectModel}
                  getIcon={getModelIcon}
                  getTierColor={getTierColor}
                />
              ))}
            </div>

            {/* Download button for non-Chrome models */}
            {selected !== TRANSLATORS.CHROME_AI && !modelReady && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                {status === "downloading" ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {progressText || "Descargando..."}
                      </span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {Math.round(downloadProgress)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${downloadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleInitialize}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  >
                    <IconDownload />
                    Descargar ({selectedInfo.downloadSize})
                  </button>
                )}
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                  <IconWarning />
                  {error}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Click outside to close */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  }

  // Full view
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded flex items-center justify-center">
            <span className="text-white text-xs">🌐</span>
          </span>
          Motor de Traducción Local
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          100% privado. Sin conexión a internet.
        </p>
      </div>

      {/* Hardware status */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <IconGPU />
            <span
              className={
                hasGPU ? "text-green-600 dark:text-green-400" : "text-gray-400"
              }
            >
              {hasGPU ? "GPU WebGPU" : "Sin GPU"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <IconChrome />
            <span
              className={
                hasChromeAI
                  ? "text-green-600 dark:text-green-400"
                  : "text-gray-400"
              }
            >
              {hasChromeAI ? "Chrome AI" : "Sin Chrome AI"}
            </span>
          </div>
        </div>
      </div>

      {/* Model list */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {availableModels.map((model) => (
          <ModelOption
            key={model}
            model={model}
            info={MODEL_INFO[model]}
            isSelected={selected === model}
            isReady={model === selected && modelReady}
            onSelect={handleSelectModel}
            getIcon={getModelIcon}
            getTierColor={getTierColor}
            expanded
          />
        ))}
      </div>

      {/* Status / Download section */}
      {selected !== TRANSLATORS.CHROME_AI && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          {status === "downloading" ? (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {progressText || "Descargando modelo..."}
                </span>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {Math.round(downloadProgress)}%
                </span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>
          ) : modelReady ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <IconCheck />
              <span className="font-medium">Modelo listo</span>
            </div>
          ) : (
            <button
              onClick={handleInitialize}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/25"
            >
              <IconDownload />
              Descargar Modelo ({selectedInfo.downloadSize})
            </button>
          )}

          {error && (
            <div className="mt-3 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
              <IconWarning />
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Model option component
interface ModelOptionProps {
  model: TRANSLATORS;
  info: ModelInfo;
  isSelected: boolean;
  isReady: boolean;
  onSelect: (model: TRANSLATORS) => void;
  getIcon: (model: TRANSLATORS) => React.ReactNode;
  getTierColor: (tier: number) => string;
  expanded?: boolean;
}

function ModelOption({
  model,
  info,
  isSelected,
  isReady,
  onSelect,
  getIcon,
  getTierColor,
  expanded = false,
}: ModelOptionProps) {
  return (
    <button
      onClick={() => onSelect(model)}
      className={`w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${
        isSelected ? "bg-blue-50 dark:bg-blue-900/20" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isSelected
              ? "bg-blue-500 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          }`}
        >
          {getIcon(model)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {info.name}
            </span>
            {info.recommended && (
              <span className="px-1.5 py-0.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded">
                Recomendado
              </span>
            )}
            <span
              className={`px-1.5 py-0.5 text-xs font-medium rounded ${getTierColor(info.tier)}`}
            >
              Tier {info.tier}
            </span>
          </div>

          {expanded && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {info.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span>{info.downloadSize}</span>
            {info.vramRequired && <span>VRAM: {info.vramRequired}</span>}
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center">
          {isSelected && isReady && (
            <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <IconCheck />
            </span>
          )}
          {isSelected && !isReady && model !== TRANSLATORS.CHROME_AI && (
            <span className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <IconDownload />
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
