import { useMemo, useState } from "react";

interface TestResultShareCardProps {
  levelName: string;
  skillName: string;
  scorePercent: number;
  shareUrl: string;
}

function buildShareMessage(
  levelName: string,
  skillName: string,
  scorePercent: number,
  shareUrl: string
) {
  return `Hice el test de ${skillName} ${levelName} en LingText y saque ${scorePercent}%. Pruebalo aqui: ${shareUrl}`;
}

function buildFacebookUrl(message: string, shareUrl: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(message)}`;
}

function openShareWindow(url: string) {
  window.open(url, "_blank", "noopener,noreferrer,width=620,height=520");
}

export default function TestResultShareCard({
  levelName,
  skillName,
  scorePercent,
  shareUrl,
}: TestResultShareCardProps) {
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const message = useMemo(
    () => buildShareMessage(levelName, skillName, scorePercent, shareUrl),
    [levelName, scorePercent, shareUrl, skillName]
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopyMessage("Texto copiado");
    } catch {
      setCopyMessage("No se pudo copiar");
    }
  }

  return (
    <section className="rounded-3xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/5 p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#0F9EDA]">
            Comparte tu resultado
          </p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            Convierte tu score en una pieza compartible de LingText
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
            El enlace compartido apunta a la landing del nivel para que otros
            puedan hacer su propia prueba.
          </p>
        </div>
        <div className="rounded-2xl border border-white/80 bg-white px-4 py-3 text-right shadow-sm">
          <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
            Score
          </p>
          <p className="text-3xl font-bold text-gray-900">{scorePercent}%</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center rounded-xl bg-[#0F9EDA] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#0D8EC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          Copiar texto
        </button>
        <button
          type="button"
          onClick={() => openShareWindow(buildFacebookUrl(message, shareUrl))}
          className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          Compartir en Facebook
        </button>
        <button
          type="button"
          onClick={() =>
            openShareWindow(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`
            )
          }
          className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          Compartir en X
        </button>
        <button
          type="button"
          onClick={() =>
            openShareWindow(
              `https://wa.me/?text=${encodeURIComponent(message)}`
            )
          }
          className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          Compartir en WhatsApp
        </button>
      </div>

      {copyMessage ? (
        <p className="mt-3 text-sm text-gray-600">{copyMessage}</p>
      ) : null}
    </section>
  );
}
