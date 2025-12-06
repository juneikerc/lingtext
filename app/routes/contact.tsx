import type { Route } from "./+types/contact";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contacto | LingText" },
    {
      name: "description",
      content:
        "¿Tienes dudas sobre cómo usar LingText? Escríbeme y te ayudo a sacarle el máximo provecho a tu aprendizaje de inglés.",
    },
  ];
}

export default function Contact() {
  return (
    <section className="relative overflow-hidden min-h-screen bg-gradient-to-br from-white via-indigo-50/30 to-white dark:from-gray-950 dark:via-indigo-950/10 dark:to-gray-950">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-indigo-400/5 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-purple-400/5 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-blue-400/3 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-indigo-600 bg-indigo-100/80 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full border border-indigo-200/50 dark:border-indigo-800/50 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Siempre disponible
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
              Hablemos
            </span>
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
            Aprender un idioma puede ser confuso a veces. Si tienes dudas sobre
            cómo usar LingText, estoy aquí para ayudarte.
          </p>
        </div>

        {/* Contenido principal */}
        <div className="space-y-8">
          {/* Sección de bienvenida */}
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              ¿En qué puedo ayudarte?
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              <p>
                Sé lo frustrante que puede ser quedarse atascado cuando estás
                motivado para aprender. Por eso quiero que sepas que{" "}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  cualquier duda que tengas es válida
                </span>
                , por pequeña que parezca.
              </p>
              <p>
                Tal vez no sabes cómo agregar un texto nuevo, o quieres entender
                mejor cómo funciona la repetición espaciada. Quizás el audio no
                te carga bien, o simplemente quieres saber si hay una forma más
                eficiente de usar la app.{" "}
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  Sea lo que sea, escríbeme.
                </span>
              </p>
              <p>
                LingText es un proyecto que construyo con cariño, y tu feedback
                me ayuda a mejorarlo. Cada pregunta que me haces me muestra qué
                partes de la app necesitan ser más claras o intuitivas.
              </p>
            </div>
          </div>

          {/* Tarjeta de contacto */}
          <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 rounded-3xl border border-indigo-200/30 dark:border-indigo-800/30 p-8 md:p-12 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Icono de correo */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                </div>
              </div>

              {/* Información de contacto */}
              <div className="text-center md:text-left flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  Escríbeme directamente
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Respondo todos los correos personalmente. Normalmente en menos
                  de 24 horas.
                </p>
                <a
                  href="mailto:juneikerc@gmail.com"
                  className="inline-flex items-center gap-2 text-xl font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                  juneikerc@gmail.com
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
                    <path d="M7 7h10v10"></path>
                    <path d="M7 17 17 7"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Sección sobre mí */}
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Un poco sobre mí
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              <p>
                Soy{" "}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  Juneiker
                </span>
                , desarrollador web y la persona detrás de LingText. Creé esta
                herramienta porque yo mismo pasé por la frustración de buscar
                apps de aprendizaje que fueran gratuitas, respetaran mi
                privacidad y me dejaran usar mis propios materiales.
              </p>
              <p>
                Creo firmemente en el aprendizaje a través de la lectura —es
                como aprendí inglés— y quería una herramienta que hiciera ese
                proceso más fluido. Así nació LingText: una app{" "}
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  local-first
                </span>
                , donde tus datos son tuyos y el aprendizaje ocurre sin
                interrupciones.
              </p>
              <p>
                Si quieres conocer más sobre mi trabajo o ver otros proyectos en
                los que estoy involucrado, visita mi web:
              </p>
              <a
                href="https://juneikerc.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25"
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
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                  <path d="M2 12h20"></path>
                </svg>
                juneikerc.com
              </a>
            </div>
          </div>

          {/* Preguntas frecuentes rápidas */}
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
              Antes de escribir, quizás esto te ayude
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  ¿Cómo agrego un texto nuevo?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  En la página principal, busca el botón "Agregar texto" en la
                  biblioteca. Puedes pegar contenido directamente o importar un
                  archivo .txt.
                </p>
              </div>
              <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  ¿Mis datos están seguros?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Absolutamente. Todo se guarda en tu navegador usando SQLite.
                  Nada se envía a servidores externos excepto las palabras que
                  traduces.
                </p>
              </div>
              <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  ¿Puedo usar LingText en el móvil?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Sí, la app es responsive. Sin embargo, algunas funciones como
                  el audio local funcionan mejor en Chrome de escritorio.
                </p>
              </div>
              <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  ¿Cómo funciona la repetición espaciada?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Usa el algoritmo SM-2. Las palabras que marcas como
                  desconocidas aparecerán en sesiones de repaso con intervalos
                  optimizados para tu memoria.
                </p>
              </div>
            </div>
          </div>

          {/* CTA final */}
          <div className="text-center pt-8">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              ¿Todavía tienes dudas? No lo pienses más.
            </p>
            <a
              href="mailto:juneikerc@gmail.com?subject=Duda sobre LingText"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 text-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                <path d="m21.854 2.147-10.94 10.939"></path>
              </svg>
              Envíame un correo
            </a>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
              juneikerc@gmail.com
            </p>
          </div>

          {/* Link de regreso */}
          <div className="text-center pt-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
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
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
              Volver a la biblioteca
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
