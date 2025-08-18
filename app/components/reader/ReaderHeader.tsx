import { Link } from "react-router";

interface ReaderHeaderProps {
  title: string;
}

export default function ReaderHeader({ title }: ReaderHeaderProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 sticky top-0 z-10">
      <div className="mx-auto max-w-3xl w-full flex items-center gap-4 px-4 sm:px-6 lg:px-8 py-2">
        <Link
          to="../"
          className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          ← Volver
        </Link>
        <h1 className="font-semibold  truncate text-gray-900 dark:text-gray-100 text-2xl">
          {title || "Sin título"}
        </h1>
      </div>
    </div>
  );
}
