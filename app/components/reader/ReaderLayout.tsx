import React, { useState } from "react";
import { Link } from "react-router";

import { useReaderPreferences } from "./ReaderPreferencesContext";
import { getReaderAppearanceStyles } from "./preferences";

export function ReaderEmptyState() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div
        className="backdrop-blur-sm rounded-2xl border shadow-xl p-8 text-center"
        style={{
          backgroundColor: "var(--reader-surface-bg)",
          borderColor: "var(--reader-border-color)",
          color: "var(--reader-text-color)",
        }}
      >
        <p style={{ opacity: 0.6 }}>No hay contenido para mostrar</p>
      </div>
    </div>
  );
}

export function ReaderModeIndicator() {
  return (
    <div className="absolute -top-6 left-0 right-0 flex justify-center">
      <div className="rounded-full px-4 py-2 text-sm font-medium flex items-center space-x-2 mt-8 z-10 border bg-[#0F9EDA]/10 border-[#0F9EDA]/20 text-[#0A7AAB]">
        <div className="w-2 h-2 bg-[#0F9EDA] rounded-full animate-pulse"></div>
        <span>Haz clic en cualquier palabra para traducirla</span>
      </div>
    </div>
  );
}

interface ReaderContentShellProps {
  children: React.ReactNode;
  contentClassName?: string;
  compact?: boolean;
}

export function ReaderContentShell({
  children,
  contentClassName = "",
  compact = false,
}: ReaderContentShellProps) {
  const { preferences } = useReaderPreferences();
  const appearanceStyles = getReaderAppearanceStyles(preferences, compact);
  const contentClasses = [
    compact
      ? "reader-surface rounded-xl border p-4 sm:p-5"
      : "reader-surface rounded-2xl border shadow-xl p-4 sm:p-6 md:p-8 lg:p-12",
    contentClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const wrapperClasses = compact
    ? "mx-auto w-full py-2 select-text"
    : "mx-auto w-full px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 select-text";

  return (
    <div id="reader-text" className={wrapperClasses}>
      <div
        className="mx-auto w-full"
        style={{
          ...appearanceStyles,
          maxWidth: compact ? "100%" : "var(--reader-content-max-width)",
        }}
      >
        <div className={contentClasses} style={appearanceStyles}>
          {children}
        </div>
      </div>
    </div>
  );
}

interface ReaderProgressFooterProps {
  unknownCount: number;
}

export function ReaderProgressFooter({
  unknownCount,
}: ReaderProgressFooterProps) {
  return (
    <Link
      to="/words"
      className="flex justify-center"
    >
      <div
        className="rounded-full px-6 py-3 text-sm flex items-center space-x-4 border"
        style={{
          backgroundColor: "var(--reader-muted-bg)",
          borderColor: "var(--reader-border-color)",
          color: "var(--reader-text-color)",
        }}
      >
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span>Palabras conocidas</span>
        </div>
        <div
          className="w-px h-4"
          style={{ backgroundColor: "var(--reader-border-color)" }}
        ></div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
          <span>Palabras por aprender ({unknownCount})</span>
        </div>
      </div>
    </Link>
  );
}

export function ReaderHelpFloatingLink() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-20 max-w-[18rem]">
      <div className="relative">
        <a
          href="https://www.facebook.com/groups/1199904721807372/"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl bg-[#E53E3E] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#E53E3E]/50 transition-all duration-200 hover:bg-[#C53030] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E53E3E] focus-visible:ring-offset-2 focus-visible:ring-offset-white animate-pulse [animation-duration:3s] motion-reduce:animate-none"
          aria-label="Abrir grupo de Facebook para preguntas"
        >
          ¿Tienes dudas? Pregunta en nuestro grupo de Facebook →
        </a>
        <button
          type="button"
          className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-600 shadow-md transition-colors duration-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E53E3E] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          aria-label="Ocultar ayuda"
          onClick={() => setIsVisible(false)}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </div>
  );
}

export default function LibraryBanner() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 mb-4">
      <Link
        to="/my-library"
        className="group block rounded-2xl border px-4 sm:px-6 py-4 sm:py-5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 border-[#0F9EDA]/20 bg-[#0F9EDA]/5 hover:border-[#0F9EDA]/40 hover:bg-[#0F9EDA]/10 focus-visible:ring-offset-white"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0F9EDA]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-5 w-5 text-white"
                aria-hidden="true"
              >
                <path
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#0A7AAB]">
                Sube tus propios textos y sigue aprendiendo
              </p>
              <p className="text-xs mt-0.5 text-[#0F9EDA]/70">
                Agrega articulos, libros o cualquier texto en ingles a tu
                biblioteca personal
              </p>
            </div>
          </div>

          <span className="shrink-0 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 bg-[#0F9EDA] group-hover:bg-[#0D8EC4]">
            Ir a Mi Biblioteca
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="ml-1.5 h-4 w-4"
              aria-hidden="true"
            >
              <path
                d="m9 18 6-6-6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </span>
        </div>
      </Link>
    </div>
  );
}
