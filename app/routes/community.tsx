import type { Route } from "./+types/community";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Comunidad de aprendizaje de inglés | Únete a LingText" },
    {
      name: "description",
      content:
        "Únete a la comunidad de aprendizaje de inglés de LingText. Comparte recursos, estrategias y progresa junto a otros estudiantes en Facebook y Telegram.",
    },
  ];
}

export const links: Route.LinksFunction = () => [
  {
    rel: "canonical",
    href: "https://lingtext.org/comunidad",
  },
];

export default function Community() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <header className="relative overflow-hidden py-16 sm:py-24 border-b border-gray-200 dark:border-gray-800">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-400/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-80 h-80 bg-sky-500/10 dark:bg-sky-400/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver al inicio
            </Link>
          </nav>
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-6">
            Comunidad de{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              aprendizaje de inglés
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10">
            No aprendas solo. Únete a nuestra red de estudiantes y mejora tu
            fluidez compartiendo experiencias, recursos y motivación.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://www.facebook.com/groups/1199904721807372"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Grupo de Facebook
            </a>
            <a
              href="#"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-semibold border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Canal de Telegram (próximamente)
            </a>
          </div>
        </div>
      </header>

      {/* SEO Content: Benefits */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              ¿Por qué unirse a nuestra comunidad de aprendizaje?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              El aprendizaje social acelera la retención de conocimientos y
              mantiene la motivación a largo plazo.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                title: "Intercambio de recursos",
                desc: "Accede a textos, audios y configuraciones de LingText compartidas por otros miembros para enriquecer tu biblioteca personal.",
                icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
              },
              {
                title: "Resolución de dudas",
                desc: "¿No entiendes una expresión gramatical? Nuestra comunidad de aprendizaje de inglés está siempre lista para ayudarte a comprender el contexto real.",
                icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                title: "Motivación Diaria",
                desc: "Comparte tus rachas de estudio y tus progresos con el algoritmo de repetición espaciada. Ver el avance de otros te impulsa a seguir adelante.",
                icon: "M13 10V3L4 14h7v7l9-11h-7z",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
              >
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.icon}
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Long Content */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose dark:prose-invert">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
            Mucho más que un grupo: Tu red de apoyo lingüístico
          </h2>
          <div className="space-y-8 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            <p>
              En el camino hacia la fluidez, rodearse de personas con los mismos
              objetivos es fundamental. Una{" "}
              <strong>comunidad de aprendizaje de inglés</strong> no solo te
              proporciona respuestas técnicas sobre gramática o vocabulario,
              sino que crea un ecosistema de inmersión cultural y apoyo
              emocional.
            </p>
            <p>
              En LingText, fomentamos una cultura de "aprendizaje en público".
              Ya sea a través de nuestro <strong>grupo de Facebook</strong> o
              nuestro <strong>canal de Telegram</strong>, los usuarios comparten
              cómo configuran sus sesiones de lectura, qué voces de TTS
              prefieren y cómo están logrando recordar palabras difíciles
              gracias a la repetición espaciada.
            </p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-12 mb-4">
              ¿Qué encontrarás al unirte?
            </h3>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Sesiones de preguntas y respuestas:</strong> Resolvemos
                dudas sobre el uso de la aplicación y sobre el idioma.
              </li>
              <li>
                <strong>Compartir Decks y Textos:</strong> Exporta tus
                descubrimientos y ayuda a otros a aprender con el contenido que
                tú ya dominas.
              </li>
              <li>
                <strong>Feedback Directo:</strong> Sugiere nuevas
                funcionalidades para LingText y ayuda a dar forma al futuro de
                la herramienta.
              </li>
              <li>
                <strong>Consejos de Inmersión:</strong> Descubre nuevas formas
                de usar el generador de historias para crear contenido que
                realmente te interese.
              </li>
            </ul>
          </div>

          <div className="mt-20 p-8 bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-800 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              ¿Listo para conectar?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Únete hoy mismo y empieza a formar parte de la comunidad de
              aprendizaje de inglés más activa y tecnológica.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://www.facebook.com/groups/1199904721807372"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Unirme en Facebook
              </a>
              <a
                href="#"
                className="px-6 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Unirme en Telegram (próximamente)
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>
          © {new Date().getFullYear()} LingText. Conectando estudiantes de
          idiomas.
        </p>
      </footer>
    </main>
  );
}
