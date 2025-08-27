import { useEffect, useRef, useState } from "react";
interface AudioSectionProps {
  show: boolean;
  src?: string;
  showReauthorize: boolean;
  onReauthorize: () => void;
}

export default function AudioSection({
  show,
  src,
  showReauthorize,
  onReauthorize,
}: AudioSectionProps) {
  if (!show) return null;
  const [rate, setRate] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, [rate, src]);

  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
  const changeRate = (delta: number) => setRate((r) => clamp(Number((r + delta).toFixed(2)), 0.5, 3));
  const setExact = (v: number) => setRate(clamp(v, 0.5, 3));

  return (
    <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 mb-4">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg overflow-hidden">
        {/* Header compacto */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/30 to-purple-50/30 dark:from-blue-950/10 dark:to-purple-950/10">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">🎵</span>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reproductor</span>
          </div>
        </div>

        {/* Controles compactos */}
        <div className="px-4 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Velocidad:</span>
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  type="button"
                  aria-label="Disminuir velocidad"
                  className="px-2 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white transition-colors duration-200"
                  onClick={() => changeRate(-0.05)}
                >
                  −
                </button>
                <div className="px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-900 border-l border-r border-gray-200 dark:border-gray-700 min-w-12 text-center">
                  {rate.toFixed(2)}x
                </div>
                <button
                  type="button"
                  aria-label="Aumentar velocidad"
                  className="px-2 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white transition-colors duration-200"
                  onClick={() => changeRate(0.05)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Preset buttons compactos */}
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">Predefinidos:</span>
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

        {/* Audio player compacto */}
        <div className="px-4 pb-4">
          <audio
            ref={audioRef}
            className="w-full h-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            controls
            src={src}
          >
            Tu navegador no soporta audio HTML5
          </audio>
        </div>
      </div>

      {/* Mensaje de reautorización compacto */}
      {showReauthorize && (
        <div className="mt-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 rounded-lg">
          <div className="flex items-start space-x-2">
            <span className="text-red-500 text-sm mt-0.5">⚠️</span>
            <div className="flex-1">
              <p className="text-sm text-red-700 dark:text-red-300">
                Permiso requerido para acceder al audio.
              </p>
              <button
                className="mt-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white font-medium rounded text-sm transition-colors duration-200"
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
