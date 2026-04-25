import type { Route } from "./+types/pro";
import { Link } from "react-router";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "LingText Pro | Lista de espera" },
    {
      name: "description",
      content:
        "Únete a la lista de espera de LingText Pro: traductor potenciado por IA, app móvil, textos exclusivos, audio en todos los textos, importación de artículos y lecciones con YouTube.",
    },
    { name: "robots", content: "noindex, nofollow" },
    // Open Graph
    { property: "og:title", content: "LingText Pro | Lista de espera" },
    {
      property: "og:description",
      content: "LingText Pro está en camino. Sé el primero en enterarte.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://lingtext.org/pro" },
    { property: "og:site_name", content: "LingText" },
  ];
}

export const links: Route.LinksFunction = () => [
  {
    rel: "canonical",
    href: "https://lingtext.org/pro",
  },
];

const features = [
  {
    title: "Traductor potenciado por IA",
    description:
      "Traducciones mucho más precisas y con contexto real, pensadas para que entiendas el inglés de verdad.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 5h12M9 3v2m0 14v2m0-10h6m3-2l-3 3m0 0l3 3m-3-3h-6"
        />
      </svg>
    ),
  },
  {
    title: "App móvil nativa",
    description:
      "Lleva tu aprendizaje en el bolsillo. Sincroniza tu biblioteca y estudia donde quieras.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "Textos exclusivos por nivel",
    description:
      "Contenido mejor curado y organizado para que progreses de forma estructurada desde tu nivel actual.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    title: "Audio en todos los textos",
    description:
      "Escucha cada lectura con voz natural para entrenar pronunciación y comprensión auditiva.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
        />
      </svg>
    ),
  },
  {
    title: "Importa artículos de cualquier web",
    description:
      "Convierte cualquier página en una lección interactiva con un solo clic.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    ),
  },
  {
    title: "YouTube como lecciones",
    description:
      "Transforma videos de YouTube en sesiones de lectura con subtítulos interactivos.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

export default function ProPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-gray-200">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#0F9EDA]/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-[#0F9EDA] bg-[#0F9EDA]/10 rounded-full border border-[#0F9EDA]/20">
            <span className="w-2 h-2 bg-[#0F9EDA] rounded-full mr-2.5" />
            Próximamente
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
            LingText <span className="text-[#0F9EDA]">Pro</span> está en camino
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed">
            Una versión más potente de LingText con traductor por IA, app móvil,
            textos exclusivos y mucho más. Déjanos tu correo y te avisamos en
            cuanto esté lista.
          </p>

          <form
            action="https://app.kit.com/forms/9369216/subscriptions"
            method="post"
            target="_blank"
            className="max-w-md mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                name="email_address"
                placeholder="Tu correo electrónico"
                required
                aria-label="Correo electrónico"
                className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-[#0F9EDA] focus:outline-none focus:ring-2 focus:ring-[#0F9EDA]/20"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-[#0F9EDA] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#0D8EC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Suscribirme
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Sin spam. Puedes darte de baja cuando quieras.
            </p>
          </form>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Lo que incluirá LingText Pro
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Estamos construyendo una experiencia de aprendizaje mucho más
              completa para ayudarte a dominar el inglés.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm"
              >
                <div className="w-12 h-12 bg-[#0F9EDA]/10 text-[#0F9EDA] rounded-xl flex items-center justify-center mb-5">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Preguntas frecuentes
          </h2>
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Cuándo estará disponible LingText Pro?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Aún no tenemos una fecha exacta. Estamos trabajando en ello y los
                suscritos a la lista de espera serán los primeros en saberlo.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Será de pago?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Estamos definiendo el modelo, pero la versión gratuita de
                LingText seguirá disponible. Pro será una mejora opcional para
                quienes quieran más funciones.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Mis datos actuales se transferirán a Pro?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Sí. Todo lo que tengas guardado en LingText podrá sincronizarse
                cuando Pro esté disponible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            ¿Listo para ser el primero en probarlo?
          </h2>
          <p className="text-gray-600 mb-8">
            Suscríbete a la lista de espera y te avisamos en cuanto abramos el
            acceso.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:border-[#0F9EDA] hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
