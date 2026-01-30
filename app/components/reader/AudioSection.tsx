import { useEffect, useRef, useState } from "react";

interface AudioSectionProps {
  show: boolean;
  src?: string;
  showReauthorize: boolean;
  onReauthorize: () => void;
  isLocalFile?: boolean;
  fileSize?: number | null;
}

export default function AudioSection({
  show,
  src,
  showReauthorize,
  onReauthorize,
  isLocalFile = false,
  fileSize = null,
}: AudioSectionProps) {
  const [rate, setRate] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [canPlayThrough, setCanPlayThrough] = useState(false);
  const [preloadStrategy, setPreloadStrategy] = useState<"metadata" | "none">(
    "metadata"
  );
  const [fileTooLarge, setFileTooLarge] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Mobile expand/collapse
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Determinar estrategia de preload basada en el tamaño del archivo
  useEffect(() => {
    if (fileSize) {
      const sizeMB = fileSize / (1024 * 1024);
      // Para archivos muy grandes (>50MB), usar preload="none"
      if (sizeMB > 50) {
        setPreloadStrategy("none");
        setFileTooLarge(true);
      } else {
        setPreloadStrategy("metadata");
        setFileTooLarge(false);
      }
    }
  }, [fileSize]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, [rate]);

  // Limpiar errores cuando cambia la fuente
  useEffect(() => {
    setAudioError(null);
    setIsLoading(false);
    setCanPlayThrough(false);
  }, [src]);

  const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, v));
  const changeRate = (delta: number) =>
    setRate((r) => clamp(Number((r + delta).toFixed(2)), 0.5, 3));
  const setExact = (v: number) => setRate(clamp(v, 0.5, 3));

  const handleAudioLoadStart = () => {
    setIsLoading(true);
    setAudioError(null);
  };

  const handleAudioCanPlay = () => {
    setIsLoading(false);
    setCanPlayThrough(true);
  };

  const handleAudioCanPlayThrough = () => {
    setIsLoading(false);
    setCanPlayThrough(true);
  };

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    setIsLoading(false);
    const audioElement = e.currentTarget;
    let errorMessage = "Error al cargar el audio";

    if (audioElement.error) {
      switch (audioElement.error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = "Reproducción abortada";
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = "Error de red al cargar el audio";
          break;
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = "Error al decodificar el audio";
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = "Formato de audio no soportado";
          break;
        default:
          errorMessage = "Error desconocido en el audio";
      }
    }

    setAudioError(errorMessage);
    console.error("Audio error:", audioElement.error);
  };

  const handleAudioStalled = () => {
    setIsLoading(true);
    setAudioError("Carga del audio detenida - intentando recuperar...");
    // Intentar recuperar después de un breve delay
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
      }
    }, 2000);
  };

  const handleAudioWaiting = () => {
    setIsLoading(true);
  };

  const handleAudioPlaying = () => {
    setIsLoading(false);
    setAudioError(null);
  };

  const handleLoadAudio = () => {
    if (audioRef.current) {
      setIsLoading(true);
      setAudioError(null);
      audioRef.current.load();
    }
  };

  // Early return AFTER all hooks
  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:p-4 pointer-events-none flex justify-center">
      <div className="w-full max-w-4xl pointer-events-auto shadow-2xl rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md transition-all duration-300">
        {/* Error / Reauthorize Banner */}
        {(audioError ||
          showReauthorize ||
          (fileTooLarge && preloadStrategy === "none")) && (
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex-1 flex items-center gap-2 overflow-hidden">
              {audioError ? (
                <>
                  <span className="text-red-500 shrink-0">⚠️</span>
                  <span className="text-red-600 dark:text-red-400 truncate">
                    {audioError}
                  </span>
                </>
              ) : showReauthorize ? (
                <>
                  <span className="text-orange-500 shrink-0">🔒</span>
                  <span className="text-orange-600 dark:text-orange-400 truncate">
                    {isLocalFile
                      ? "Permiso requerido para archivo local"
                      : "Permiso requerido"}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-blue-500 shrink-0">📁</span>
                  <span className="text-blue-600 dark:text-blue-400 truncate">
                    Archivo grande detectado
                  </span>
                </>
              )}
            </div>

            <div className="shrink-0">
              {audioError ? (
                <button
                  onClick={handleLoadAudio}
                  className="px-2 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 rounded transition-colors"
                >
                  Reintentar
                </button>
              ) : showReauthorize ? (
                <button
                  onClick={onReauthorize}
                  className="px-2 py-1 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/40 dark:hover:bg-orange-900/60 text-orange-700 dark:text-orange-300 rounded transition-colors"
                >
                  Reautorizar
                </button>
              ) : (
                <button
                  onClick={handleLoadAudio}
                  className="px-2 py-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded transition-colors"
                >
                  Cargar
                </button>
              )}
            </div>
          </div>
        )}

        {/* Main Player UI */}
        <div className="flex flex-col sm:flex-row items-center gap-3 p-3 sm:p-4">
          {/* Audio Controls */}
          <div className="w-full flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1 sm:mb-0">
              {/* Status Indicator */}
              <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span className="text-sm">🎵</span>
                )}
              </div>

              {/* HTML5 Audio Player */}
              <audio
                ref={audioRef}
                className="w-full h-8 sm:h-10 focus:outline-none player-custom"
                controls
                src={src}
                preload={preloadStrategy}
                onLoadStart={handleAudioLoadStart}
                onCanPlay={handleAudioCanPlay}
                onCanPlayThrough={handleAudioCanPlayThrough}
                onError={handleAudioError}
                onStalled={handleAudioStalled}
                onWaiting={handleAudioWaiting}
                onPlaying={handleAudioPlaying}
                // onProgress={handleAudioProgress}
              >
                Tu navegador no soporta audio HTML5
              </audio>
            </div>
          </div>

          {/* Speed Controls (Collapsible on very small screens if needed, but flex-wrap handles it) */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-gray-100 dark:border-gray-800 pt-2 sm:pt-0">
            {/* Rate Adjuster */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => changeRate(-0.1)}
                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-shadow"
                title="Más lento"
              >
                -
              </button>
              <div className="w-10 text-center text-xs font-bold text-gray-700 dark:text-gray-200">
                {rate.toFixed(1)}x
              </div>
              <button
                onClick={() => changeRate(0.1)}
                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-shadow"
                title="Más rápido"
              >
                +
              </button>
            </div>

            {/* Presets (Hidden on very small mobile to save space) */}
            <div className="hidden sm:flex gap-1">
              {[1, 1.5, 2].map((v) => (
                <button
                  key={v}
                  onClick={() => setExact(v)}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                    rate === v
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                      : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  }`}
                >
                  {v}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
