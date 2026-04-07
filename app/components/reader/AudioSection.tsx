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
  const [preloadStrategy, setPreloadStrategy] = useState<"metadata" | "none">(
    "metadata"
  );
  const [fileTooLarge, setFileTooLarge] = useState(false);
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
  };

  const handleAudioCanPlayThrough = () => {
    setIsLoading(false);
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
      <div className="w-full max-w-4xl pointer-events-auto shadow-2xl rounded-2xl overflow-hidden border border-gray-200/50 bg-white/95 backdrop-blur-md transition-all duration-300">
        {/* Error / Reauthorize Banner */}
        {(audioError ||
          showReauthorize ||
          (fileTooLarge && preloadStrategy === "none")) && (
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex-1 flex items-center gap-2 overflow-hidden">
              {audioError ? (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4 text-red-500 shrink-0"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <line
                      x1="15"
                      y1="9"
                      x2="9"
                      y2="15"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="9"
                      y1="9"
                      x2="15"
                      y2="15"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-red-600 truncate">{audioError}</span>
                </>
              ) : showReauthorize ? (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4 text-orange-500 shrink-0"
                  >
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      ry="2"
                      strokeWidth="2"
                    />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2" />
                  </svg>
                  <span className="text-orange-600 truncate">
                    {isLocalFile
                      ? "Permiso requerido para archivo local"
                      : "Permiso requerido"}
                  </span>
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4 text-blue-500 shrink-0"
                  >
                    <path
                      d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="13 2 13 9 20 9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-blue-600 truncate">
                    Archivo grande detectado
                  </span>
                </>
              )}
            </div>

            <div className="shrink-0">
              {audioError ? (
                <button
                  onClick={handleLoadAudio}
                  className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                >
                  Reintentar
                </button>
              ) : showReauthorize ? (
                <button
                  onClick={onReauthorize}
                  className="px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded transition-colors"
                >
                  Reautorizar
                </button>
              ) : (
                <button
                  onClick={handleLoadAudio}
                  className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
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
              <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#0F9EDA]/10 text-[#0F9EDA]">
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-[#0F9EDA] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <polygon
                      points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.54 8.46a5 5 0 0 1 0 7.07"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
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
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-gray-100 pt-2 sm:pt-0">
            {/* Rate Adjuster */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
              <button
                onClick={() => changeRate(-0.1)}
                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white text-gray-600 transition-shadow"
                title="Más lento"
              >
                -
              </button>
              <div className="w-10 text-center text-xs font-bold text-gray-700">
                {rate.toFixed(1)}x
              </div>
              <button
                onClick={() => changeRate(0.1)}
                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white text-gray-600 transition-shadow"
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
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    rate === v
                      ? "bg-[#0F9EDA]/10 text-[#0F9EDA]"
                      : "text-gray-500 hover:bg-gray-100"
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
