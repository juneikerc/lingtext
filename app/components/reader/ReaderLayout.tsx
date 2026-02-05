import React, { useState } from "react";

import { Link } from "react-router";

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
}

export function ReaderContentShell({
  children,
  contentClassName = "",
}: ReaderContentShellProps) {
  const contentClasses = [
    "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8 md:p-12",
    contentClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      id="reader-text"
      className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12 py-8 leading-relaxed text-lg sm:text-xl select-text bg-gradient-to-b from-transparent via-white/50 to-transparent"
    >
      <div className={contentClasses}>{children}</div>
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
