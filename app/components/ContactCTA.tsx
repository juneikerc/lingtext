import { Link } from "react-router";

export default function ContactCTA() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 bg-white dark:bg-gray-950">
      {/* Elementos decorativos */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 h-64 w-64 rounded-full bg-indigo-500/10 dark:bg-indigo-400/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-sky-500/10 dark:bg-sky-400/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          Estoy aquí para ayudarte
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 text-gray-900 dark:text-gray-100">
          ¿Tienes alguna{" "}
          <span className="text-indigo-600 dark:text-indigo-400">duda?</span>
        </h2>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          Si algo no te queda claro sobre cómo usar LingText, o simplemente
          quieres compartir tu experiencia, me encantaría escucharte.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/contacto"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
            Ir a Contacto
          </Link>
          <a
            href="mailto:juneikerc@gmail.com?subject=Duda sobre LingText"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 font-semibold rounded-xl border border-indigo-200 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
          >
            Escribir directamente
          </a>
        </div>
      </div>
    </section>
  );
}
