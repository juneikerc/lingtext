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
    <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8">
      <div className="my-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Reproductor</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Velocidad</span>
            <div className="flex items-center rounded-md border border-gray-300 dark:border-gray-700 overflow-hidden">
              <button
                type="button"
                aria-label="Disminuir velocidad"
                className="px-2 py-1 text-sm bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => changeRate(-0.05)}
              >
                −0.05
              </button>
              <div className="px-3 py-1 text-sm font-semibold text-gray-800 dark:text-gray-200 border-l border-r border-gray-300 dark:border-gray-700 min-w-14 text-center">
                ×{rate.toFixed(2)}
              </div>
              <button
                type="button"
                aria-label="Aumentar velocidad"
                className="px-2 py-1 text-sm bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => changeRate(0.05)}
              >
                +0.05
              </button>
            </div>
            <div className="hidden sm:flex items-center gap-1 ml-2">
              {[0.5, 1, 1.5, 2, 2.5, 3].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setExact(v)}
                  className={
                    `px-2 py-0.5 rounded text-xs border transition ` +
                    (rate === v
                      ? "border-blue-600 text-blue-700 dark:text-blue-300"
                      : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800")
                  }
                >
                  {v}x
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 pt-2">
          <audio ref={audioRef} className="w-full" controls src={src}>
            Tu navegador no soporta audio HTML5
          </audio>
        </div>
      </div>
      {showReauthorize && (
        <div className="text-xs text-red-700 dark:text-red-400 my-1 flex items-center gap-2">
          No hay permiso para acceder al archivo de audio.
          <button
            className="ml-2 px-2 py-0.5 rounded border border-red-700 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition"
            onClick={onReauthorize}
          >
            Reautorizar audio
          </button>
        </div>
      )}
    </div>
  );
}
