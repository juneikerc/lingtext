import React, { useState } from "react";
import { Link } from "react-router";

import { useReaderPreferences } from "./ReaderPreferencesContext";
import { getReaderAppearanceStyles } from "./preferences";

export function ReaderEmptyState() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No hay contenido para mostrar
        </p>
      </div>
    </div>
  );
}

export function ReaderModeIndicator() {
  return (
    <div className="absolute -top-6 left-0 right-0 flex justify-center">
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 rounded-full px-4 py-2 text-sm text-blue-700 dark:text-blue-300 font-medium flex items-center space-x-2 mt-8 z-10">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
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
      : "reader-surface rounded-2xl border shadow-xl p-8 md:p-12",
    contentClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const wrapperClasses = compact
    ? "mx-auto w-full py-2 select-text"
    : "mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 select-text";

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
      className="absolute -bottom-16 left-0 right-0 flex justify-center"
    >
      <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-6 py-3 text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span>Palabras conocidas</span>
        </div>
        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
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
          className="block rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-colors duration-200 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-indigo-500 dark:text-indigo-50 dark:hover:bg-indigo-400 dark:focus-visible:ring-offset-gray-900 animate-pulse motion-reduce:animate-none"
          aria-label="Abrir grupo de Facebook para preguntas"
        >
          ¿Tienes dudas? Pregunta en nuestro grupo de Facebook →
        </a>
        <button
          type="button"
          className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-600 shadow-md transition-colors duration-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
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
    <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12 mt-12 mb-4">
      <Link
        to="/my-library"
        className="group block rounded-2xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/80 dark:bg-indigo-950/30 px-6 py-5 transition-colors duration-200 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 dark:bg-indigo-500">
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
            <div>
              <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                Sube tus propios textos y sigue aprendiendo
              </p>
              <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70 mt-0.5">
                Agrega articulos, libros o cualquier texto en ingles a tu
                biblioteca personal
              </p>
            </div>
          </div>

          <span className="shrink-0 inline-flex items-center rounded-lg bg-indigo-600 dark:bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 group-hover:bg-indigo-700 dark:group-hover:bg-indigo-400">
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
