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
  if (!show) return null;

  const [rate, setRate] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [canPlayThrough, setCanPlayThrough] = useState(false);
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

  const handleAudioProgress = () => {
    if (audioRef.current) {
      const buffered = audioRef.current.buffered;
      if (buffered.length > 0) {
        const bufferedEnd = buffered.end(buffered.length - 1);
        const duration = audioRef.current.duration;
        const bufferedPercentage =
          duration > 0 ? (bufferedEnd / duration) * 100 : 0;
      }
    }
  };

  return (
    <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 mb-4">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg overflow-hidden">
        {/* Header compacto */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-100/50 dark:bg-gray-700/50">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">🎵</span>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Reproductor{" "}
              {isLocalFile && (
                <span className="text-xs text-gray-500">(Archivo Local)</span>
              )}
            </span>
            {isLoading && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Cargando...
                </span>
              </div>
            )}
            {canPlayThrough && !isLoading && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600 dark:text-green-400">
                  Listo
                </span>
              </div>
            )}
          </div>

          {/* Información del archivo local */}
          {isLocalFile && fileSize && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {(fileSize / (1024 * 1024)).toFixed(1)}MB
            </div>
          )}
        </div>

        {/* Controles compactos */}
        <div className="px-4 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Velocidad:
              </span>
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  type="button"
                  aria-label="Disminuir velocidad"
                  className="px-2 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  onClick={() => changeRate(-0.05)}
                >
                  −
                </button>
                <div className="px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border-l border-r border-gray-200 dark:border-gray-700 min-w-12 text-center">
                  {rate.toFixed(2)}x
                </div>
                <button
                  type="button"
                  aria-label="Aumentar velocidad"
                  className="px-2 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  onClick={() => changeRate(0.05)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Preset buttons compactos */}
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">
                Predefinidos:
              </span>
              <div className="flex gap-1">
                {[0.5, 1, 1.5, 2, 2.5, 3].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setExact(v)}
                    className={`px-2 py-1 rounded text-xs font-medium border transition-colors duration-200 ${
                      rate === v
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {v}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje de error si existe */}
        {audioError && (
          <div className="mx-4 mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2">
                <span className="text-red-500 text-sm mt-0.5">⚠️</span>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {audioError}
                </p>
              </div>
              <button
                onClick={handleLoadAudio}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white font-medium rounded text-sm transition-colors duration-200 ml-3"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Audio player mejorado */}
        <div className="px-4 pb-4">
          {/* Botón de carga manual para archivos grandes */}
          {fileTooLarge && preloadStrategy === "none" && (
            <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500 text-sm mt-0.5">📁</span>
                  <div>
                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                      Archivo grande detectado
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {(fileSize! / (1024 * 1024)).toFixed(1)}MB • Carga bajo
                      demanda para mejor rendimiento
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLoadAudio}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded text-sm transition-colors duration-200"
                >
                  Cargar Audio
                </button>
              </div>
            </div>
          )}

          <audio
            ref={audioRef}
            className="w-full h-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
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
            onProgress={handleAudioProgress}
          >
            Tu navegador no soporta audio HTML5
          </audio>

          {/* Información adicional para archivos grandes */}
          {src && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              {isLocalFile ? (
                <>💾 Archivo local • Carga optimizada para archivos grandes</>
              ) : (
                <>
                  💡 Para archivos grandes, usa "preload='metadata'" para una
                  carga más eficiente
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mensaje de reautorización compacto */}
      {showReauthorize && (
        <div className="mt-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 rounded-lg">
          <div className="flex items-start space-x-2">
            <span className="text-orange-500 text-sm mt-0.5">🔒</span>
            <div className="flex-1">
              <p className="text-sm text-orange-700 dark:text-orange-300">
                {isLocalFile
                  ? "Se necesita permiso para acceder al archivo de audio local."
                  : "Permiso requerido para acceder al audio."}
              </p>
              <button
                className="mt-1 px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded text-sm transition-colors duration-200"
                onClick={onReauthorize}
              >
                🔓 Reautorizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
