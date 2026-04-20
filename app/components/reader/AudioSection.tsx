import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

interface AudioSectionProps {
  alignmentRef?: RefObject<HTMLDivElement | null>;
  show: boolean;
  src?: string;
  showReauthorize: boolean;
  onReauthorize: () => void;
  isLocalFile?: boolean;
  fileSize?: number | null;
}

const SEEK_DELTA = 5;

function isEditableElement(target: EventTarget | null): boolean {
  if (!target) return false;
  const el = target as HTMLElement;
  if (
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.tagName === "SELECT" ||
    el.contentEditable === "true"
  ) {
    return true;
  }
  return false;
}

export default function AudioSection({
  alignmentRef,
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
  const [playerBounds, setPlayerBounds] = useState<{
    left: number;
    width: number;
  } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getAlignmentElement = useCallback(() => {
    const rootElement = alignmentRef?.current;
    if (!rootElement) {
      return null;
    }

    return (
      rootElement.querySelector<HTMLElement>(
        "[data-reader-audio-anchor='true']"
      ) ?? rootElement
    );
  }, [alignmentRef]);

  const updatePlayerBounds = useCallback(() => {
    const alignmentElement = getAlignmentElement();

    if (!alignmentElement) {
      setPlayerBounds(null);
      return;
    }

    const { left, width } = alignmentElement.getBoundingClientRect();
    setPlayerBounds((current) => {
      if (current && current.left === left && current.width === width) {
        return current;
      }

      return { left, width };
    });
  }, [getAlignmentElement]);

  useEffect(() => {
    if (fileSize) {
      const sizeMB = fileSize / (1024 * 1024);
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

  useEffect(() => {
    updatePlayerBounds();

    const alignmentElement = getAlignmentElement();
    const resizeObserver =
      alignmentElement && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updatePlayerBounds)
        : null;

    if (alignmentElement && resizeObserver) {
      resizeObserver.observe(alignmentElement);
    }

    window.addEventListener("resize", updatePlayerBounds);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updatePlayerBounds);
    };
  }, [getAlignmentElement, updatePlayerBounds]);

  useEffect(() => {
    setAudioError(null);
    setIsLoading(false);
  }, [src]);

  const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, v));
  const changeRate = (delta: number) =>
    setRate((r) => clamp(Number((r + delta).toFixed(2)), 0.5, 3));
  const setExact = (v: number) => setRate(clamp(v, 0.5, 3));

  const seekBy = useCallback((delta: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = clamp(audio.currentTime + delta, 0, audio.duration);
  }, []);

  const togglePlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play();
    } else {
      audio.pause();
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (isEditableElement(event.target)) return;
      if (!audioRef.current) return;

      const key = event.key;
      if (key !== " " && key !== "ArrowLeft" && key !== "ArrowRight") return;

      event.preventDefault();

      if (key === " ") {
        togglePlayback();
      } else if (key === "ArrowLeft") {
        seekBy(-SEEK_DELTA);
      } else if (key === "ArrowRight") {
        seekBy(SEEK_DELTA);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [togglePlayback, seekBy]);

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

  if (!show) return null;

  return (
    <div
      className={`fixed bottom-0 z-40 pointer-events-none ${
        playerBounds ? "" : "left-0 right-0"
      }`}
      style={
        playerBounds
          ? {
              left: `${playerBounds.left}px`,
              width: `${playerBounds.width}px`,
            }
          : undefined
      }
    >
      <div className="flex justify-center px-2 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-4 sm:pt-4 sm:pb-4 md:px-6 lg:px-8">
        <div className="w-full pointer-events-auto shadow-2xl rounded-2xl overflow-hidden border border-gray-200/50 bg-white/95 backdrop-blur-md transition-all duration-300">
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

          <div className="flex flex-col gap-2 p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-[#0F9EDA]/10 text-[#0F9EDA]">
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
              >
                Tu navegador no soporta audio HTML5
              </audio>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-t border-gray-100 pt-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => seekBy(-SEEK_DELTA)}
                  className="inline-flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  aria-label={`Retroceder ${SEEK_DELTA} segundos`}
                  title={`Retroceder ${SEEK_DELTA}s`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <polyline
                      points="1 4 1 10 7 10"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <text
                      x="12"
                      y="15"
                      textAnchor="middle"
                      fontSize="6"
                      fill="currentColor"
                      stroke="none"
                      fontWeight="bold"
                    >
                      5
                    </text>
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => seekBy(SEEK_DELTA)}
                  className="inline-flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  aria-label={`Adelantar ${SEEK_DELTA} segundos`}
                  title={`Adelantar ${SEEK_DELTA}s`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <polyline
                      points="23 4 23 10 17 10"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <text
                      x="12"
                      y="15"
                      textAnchor="middle"
                      fontSize="6"
                      fill="currentColor"
                      stroke="none"
                      fontWeight="bold"
                    >
                      5
                    </text>
                  </svg>
                </button>
              </div>

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

              <div className="ml-auto hidden sm:flex items-center gap-1 text-[11px] text-gray-400">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <rect
                    x="2"
                    y="4"
                    width="20"
                    height="16"
                    rx="2"
                    strokeWidth="2"
                  />
                  <path
                    d="M6 8h.01M10 8h.01"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span>
                  <kbd className="px-1 py-0.5 rounded bg-gray-100 text-gray-500 font-mono text-[10px]">
                    Espacio
                  </kbd>{" "}
                  pausa/reproduce ·{" "}
                  <kbd className="px-1 py-0.5 rounded bg-gray-100 text-gray-500 font-mono text-[10px]">
                    ←
                  </kbd>{" "}
                  -{SEEK_DELTA}s ·{" "}
                  <kbd className="px-1 py-0.5 rounded bg-gray-100 text-gray-500 font-mono text-[10px]">
                    →
                  </kbd>{" "}
                  +{SEEK_DELTA}s
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
