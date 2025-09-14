import React from "react";
import { Link } from "react-router";
import { ErrorBoundary } from "./ErrorBoundary";

interface ReaderErrorBoundaryProps {
  children: React.ReactNode;
}

export default function ReaderErrorBoundary({ children }: ReaderErrorBoundaryProps) {
  const fallback = (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
          <span className="text-3xl">📖</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Error en el lector
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Ha ocurrido un problema al cargar el texto. Esto puede deberse a un archivo corrupto o un problema de permisos.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Reintentar
          </button>
          <Link
            to="/"
            className="block w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            Volver a la biblioteca
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
}
