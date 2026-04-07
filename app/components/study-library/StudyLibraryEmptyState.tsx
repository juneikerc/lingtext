import { Link } from "react-router";

export function StudyLibraryEmptyState() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/5 text-4xl]/30]/10">
        <span>📚</span>
      </div>
      <h2 className="mb-3 text-2xl font-bold text-gray-900">
        Tu biblioteca esta vacia
      </h2>
      <p className="mx-auto mb-8 max-w-xl text-gray-600">
        Marca palabras o frases mientras lees y volveran aqui listas para
        repasar, exportar o convertir en historias.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        <span>📖 Leer mas textos</span>
      </Link>
    </div>
  );
}
