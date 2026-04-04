import type { Route } from "./+types/my-library";
import Library from "~/components/Libary";
import { Link } from "react-router";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Mi Biblioteca | LingText" },
    {
      name: "description",
      content:
        "Agrega, edita y organiza tus propios textos para aprender inglés con lectura inmersiva en LingText.",
    },
    {
      name: "robots",
      content: "noindex",
    },
  ];
}

export const links: Route.LinksFunction = () => [
  {
    rel: "canonical",
    href: "https://lingtext.org/my-library",
  },
];

export default function MyLibrary() {
  return (
    <>
      {/* Navegación de regreso */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950 rounded-md px-2 py-1"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-4 h-4 mr-1.5"
              aria-hidden="true"
            >
              <path
                d="m15 18-6-6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </div>

      <Library />
    </>
  );
}
