import React from "react";
import { Link } from "react-router";
import { ErrorBoundary } from "./ErrorBoundary";

interface ReaderErrorBoundaryProps {
  children: React.ReactNode;
}

export default function ReaderErrorBoundary({
  children,
}: ReaderErrorBoundaryProps) {
  const fallback = (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
          <span className="text-3xl">📖</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Error en el lector
        </h2>
        <p className="text-gray-600 mb-6">
          Ha ocurrido un problema al cargar el texto. Esto puede deberse a un
          archivo corrupto o un problema de permisos.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Reintentar
          </button>
          <Link
            to="/my-library"
            className="block w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Volver a la biblioteca
          </Link>
        </div>
      </div>
    </div>
  );

  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
}
