import { Link } from "react-router";

export function StudyLibraryEmptyState() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-indigo-200 bg-indigo-100 text-4xl dark:border-indigo-800 dark:bg-indigo-900/20">
        <span>📚</span>
      </div>
      <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
        Tu biblioteca esta vacia
      </h2>
      <p className="mx-auto mb-8 max-w-xl text-gray-600 dark:text-gray-400">
        Marca palabras o frases mientras lees y volveran aqui listas para
        repasar, exportar o convertir en historias.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-950"
      >
        <span>📖 Leer mas textos</span>
      </Link>
    </div>
  );
}
