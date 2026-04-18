import { useEffect, useRef, useState } from "react";

interface ReadingShareCardProps {
  visible: boolean;
  textTitle?: string;
}

const SHARE_TEXT =
  "Completé una lectura interactiva en LingText con traductor integrado. Encuentra lecturas de todos los niveles";
const SHARE_URL = "https://lingtext.org/textos-en-ingles";

function buildShareMessage(textTitle?: string): string {
  const suffix = textTitle ? ` "${textTitle}"` : "";
  return `Completé una lectura interactiva en LingText con traductor integrado${suffix}. Encuentra lecturas de todos los niveles en ${SHARE_URL}`;
}

function buildFacebookUrl(): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}&quote=${encodeURIComponent(SHARE_TEXT)}`;
}

function buildTwitterUrl(textTitle?: string): string {
  const message = buildShareMessage(textTitle);
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
}

function buildWhatsAppUrl(textTitle?: string): string {
  const message = buildShareMessage(textTitle);
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

function openShareWindow(url: string) {
  window.open(url, "_blank", "noopener,noreferrer,width=600,height=450");
}

export default function ReadingShareCard({
  visible,
  textTitle,
}: ReadingShareCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => setAnimate(true));
    } else {
      setAnimate(false);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      onMouseUp={(e) => {
        e.stopPropagation();
      }}
      ref={cardRef}
      className={`mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-6 transition-all duration-300 ${
        animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="rounded-2xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/5 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0F9EDA]/10">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-6 w-6 text-[#0F9EDA]"
              aria-hidden="true"
            >
              <path
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-gray-900">
              Completaste esta lectura
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Comparte tu progreso y ayuda a otros a descubrir LingText
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {/* Facebook */}
          <button
            type="button"
            onClick={() => openShareWindow(buildFacebookUrl())}
            className="inline-flex items-center gap-2.5 rounded-xl bg-[#1877F2] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#1565D8] hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1877F2] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </button>

          {/* Twitter / X */}
          <button
            type="button"
            onClick={() => openShareWindow(buildTwitterUrl(textTitle))}
            className="inline-flex items-center gap-2.5 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-gray-800 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-gray-100 dark:focus-visible:ring-offset-gray-900"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Twitter
          </button>

          {/* WhatsApp */}
          <button
            type="button"
            onClick={() => openShareWindow(buildWhatsAppUrl(textTitle))}
            className="inline-flex items-center gap-2.5 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#20BD5A] hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
          El enlace lleva a textos de todos los niveles en LingText
        </p>
      </div>
    </div>
  );
}
