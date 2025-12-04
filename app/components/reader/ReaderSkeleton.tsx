/**
 * Skeleton loader para el Reader que mantiene la estructura visual
 * y evita el salto del layout durante la carga del componente lazy.
 */
export default function ReaderSkeleton() {
  return (
    <div className="relative flex flex-col flex-1 bg-gray-50 dark:bg-gray-900 animate-pulse">
      {/* Contenedor principal del texto */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mx-auto max-w-4xl space-y-4">
          {/* Simular párrafos de texto */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-11/12" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-10/12" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-9/12" />
            </div>
          ))}
        </div>
      </div>

      {/* Indicador de carga centrado */}
      <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 dark:bg-gray-900/50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cargando lector...
          </p>
        </div>
      </div>
    </div>
  );
}
