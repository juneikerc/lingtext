import { Link } from "react-router";

interface StudyLibraryHeaderProps {
  activeView: string;
  activeViewLabel: string;
  showAlphaWarning: boolean;
  onCloseAlphaWarning: () => void;
  onExportLibrary: () => void;
}

export function StudyLibraryHeader({
  activeView,
  activeViewLabel,
  showAlphaWarning,
  onCloseAlphaWarning,
  onExportLibrary,
}: StudyLibraryHeaderProps) {
  return (
    <>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 self-start rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          <span className="text-lg">←</span>
          <span>Volver</span>
        </Link>

        <div className="flex flex-wrap gap-3">
          <Link
            to={activeView === "all" ? "/review" : `/review?mode=${activeView}`}
            className="inline-flex items-center justify-center rounded-lg bg-[#0F9EDA] px-5 py-3 font-medium text-white transition-colors duration-200 hover:bg-[#0D8EC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            {activeView === "all"
              ? "Estudiar hoy"
              : `Repasar ${activeViewLabel}`}
          </Link>
          <button
            type="button"
            onClick={onExportLibrary}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Exportar biblioteca
          </button>
        </div>
      </div>

      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
          Biblioteca de estudio
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-gray-600">
          Organiza tu vocabulario como una cola de estudio real: busca, filtra,
          ordena y lanza sesiones segun el tipo de tarjeta que quieras trabajar.
        </p>
      </div>

      {showAlphaWarning ? (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 text-2xl">⚠️</div>
            <div className="flex-1">
              <h3 className="mb-2 text-lg font-bold text-amber-900">
                Funcionalidad en fase Alfa
              </h3>
              <p className="mb-3 text-amber-800">
                Esta seccion te permite gestionar todo tu vocabulario guardado:
                ver estadisticas de repaso, filtrar por tipo (nuevas, vencidas,
                frases), ordenar, buscar, y realizar acciones masivas como
                exportar o eliminar.
              </p>
              <p className="text-sm font-medium text-amber-700">
                🚧 Advertencia: Todas las funciones estan en desarrollo activo.
                El comportamiento puede ser inestable, los datos pueden no
                persistir correctamente entre versiones, y la interfaz esta
                sujeta a cambios significativos. Usa con precaucion.
              </p>
            </div>
            <button
              type="button"
              onClick={onCloseAlphaWarning}
              className="flex-shrink-0 rounded-lg p-2 text-amber-700 transition-colors duration-200 hover:bg-amber-100"
              aria-label="Cerrar advertencia"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
