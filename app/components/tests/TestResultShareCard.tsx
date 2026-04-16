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
    <section className="rounded-2xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/5 p-8 sm:p-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/10">
            <svg
              className="h-6 w-6 text-[#0F9EDA]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.834a3 3 0 110-5.668m0 5.668l3.316 6.65m-3.316-12.5l3.316-6.65m0 0a3 3 0 105.668 0M9.316 3.662l3.316 6.65m0 0l3.316 6.65M15.632 16.65a3 3 0 105.668 0m-5.668 0l-3.316-6.65m3.316 6.65l3.316 6.65"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#0F9EDA]">
            Comparte tu resultado
          </p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            Convierte tu score en una pieza compartible
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
            El enlace compartido apunta a la landing del nivel para que otros
            puedan hacer su propia prueba.
          </p>
        </div>
        <div className="flex-shrink-0 rounded-2xl border border-white/80 bg-white px-5 py-4 text-right shadow-sm">
          <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
            Score
          </p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {scorePercent}%
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center rounded-xl bg-[#0F9EDA] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0D8EC4] hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          Copiar texto
        </button>
        <button
          type="button"
          onClick={() => openShareWindow(buildFacebookUrl(message, shareUrl))}
          className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:border-[#0F9EDA] hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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
          className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:border-[#0F9EDA] hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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
          className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:border-[#0F9EDA] hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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
