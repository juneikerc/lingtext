import type { Route } from "./+types/pro";
import { Link } from "react-router";
import { useState } from "react";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "LingText Pro | Lista de espera" },
    {
      name: "description",
      content:
        "Únete a la lista de espera de LingText Pro: traductor potenciado por IA, app móvil, textos exclusivos, audio en todos los textos, importación de artículos y lecciones con YouTube.",
    },
    { name: "robots", content: "noindex, nofollow" },
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
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
  },
  {
    title: "App móvil nativa",
    description:
      "Lleva tu aprendizaje en el bolsillo. Sincroniza tu biblioteca y estudia donde quieras.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
  },
  {
    title: "Textos exclusivos por nivel",
    description:
      "Contenido curado profesionalmente y organizado para que progreses de forma estructurada desde tu nivel actual.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    title: "Audio en todos los textos",
    description:
      "Escucha cada lectura con voz natural de alta calidad para entrenar pronunciación y comprensión auditiva.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
      </svg>
    ),
  },
  {
    title: "Importa artículos de cualquier web",
    description:
      "Convierte cualquier página en una lección interactiva con traducción integrada y vocabulario automático.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
  },
  {
    title: "YouTube como lecciones",
    description:
      "Transforma videos de YouTube en sesiones de lectura interactivas con subtítulos sincronizados.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
      </svg>
    ),
  },
];

const faqs = [
  {
    question: "¿Cuándo estará disponible LingText Pro?",
    answer:
      "Aún no tenemos una fecha exacta de lanzamiento. Estamos desarrollando cada función con cuidado para garantizar la mejor experiencia. Los suscritos a la lista de espera serán los primeros en saberlo y tendrán acceso prioritario.",
  },
  {
    question: "¿Será de pago?",
    answer:
      "Estamos definiendo el modelo de precios, pero la versión gratuita de LingText seguirá disponible con todas sus funciones actuales. Pro será una mejora opcional para quienes quieran llevar su aprendizaje al siguiente nivel.",
  },
  {
    question: "¿Mis datos actuales se transferirán a Pro?",
    answer:
      "Sí, absolutamente. Todo lo que tengas guardado en LingText — textos, palabras desconocidas, progreso de repaso — podrá sincronizarse sin problemas cuando Pro esté disponible.",
  },
  {
    question: "¿Necesito tarjeta de crédito para apuntarme?",
    answer:
      "No. Apuntarte a la lista de espera es totalmente gratuito y no requiere ningún dato de pago. Solo te pedimos tu correo para avisarte cuando LingText Pro esté disponible.",
  },
];

function AccordionItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border border-gray-200/80 rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm">
      <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50/50 transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-gray-900 pr-4">
          {question}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-5 text-gray-600 leading-relaxed">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#0F9EDA]/[0.03] rounded-full blur-3xl" />
          <div className="absolute top-20 right-[10%] w-72 h-72 bg-blue-400/[0.04] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-[5%] w-96 h-96 bg-[#0F9EDA]/[0.02] rounded-full blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 sm:pt-32 sm:pb-28">
          {/* Top badge */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm shadow-gray-200/50">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0F9EDA] opacity-40" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0F9EDA]" />
              </span>
              <span className="text-sm font-medium text-gray-700">
                Próximamente — en desarrollo activo
              </span>
            </div>
          </div>

          {/* Main headline */}
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-950 tracking-tight mb-6 leading-[1.1]">
              LingText{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#0F9EDA]">Pro</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-[#0F9EDA]/20"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 8 Q50 0 100 8 T200 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl sm:text-2xl text-gray-500 font-light leading-relaxed">
              Estoy construyendo la versión de LingText que siempre quise usar:
              traducciones con IA que entienden contexto, app móvil para
              estudiar donde sea y textos que realmente ayudan.
            </p>
          </div>

          {/* Email form */}
          <div className="max-w-lg mx-auto mb-16">
            <form
              action="https://app.kit.com/forms/9369216/subscriptions"
              method="post"
              target="_blank"
              className="relative"
            >
              <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-white border border-gray-200 shadow-xl shadow-gray-200/50">
                <input
                  type="email"
                  name="email_address"
                  placeholder="tu@email.com"
                  required
                  aria-label="Correo electrónico"
                  className="flex-1 px-5 py-4 text-base bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-8 py-4 rounded-xl bg-[#0F9EDA] text-white font-semibold text-sm tracking-wide shadow-lg shadow-[#0F9EDA]/25 transition-all duration-300 hover:bg-[#0D8EC4] hover:shadow-xl hover:shadow-[#0F9EDA]/30 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Unirme a la lista
                </button>
              </div>
              <p className="mt-4 text-center text-sm text-gray-400">
                Sin spam. Puedes darte de baja cuando quieras.
              </p>
            </form>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Acceso prioritario</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Sin compromiso</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Notificaciones exclusivas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Features Section */}
      <section className="relative py-24 sm:py-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0F9EDA]/[0.015] rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <span className="inline-block text-sm font-semibold text-[#0F9EDA] uppercase tracking-widest mb-4">
              Funciones
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-950 tracking-tight mb-5">
              Todo lo que incluirá Pro
            </h2>
            <p className="max-w-xl mx-auto text-lg text-gray-500">
              Estamos construyendo la experiencia de aprendizaje de inglés que
              siempre quisimos tener.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group relative p-8 rounded-3xl bg-white border border-gray-100 shadow-sm shadow-gray-100/50 hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-500"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Gradient top border on hover */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0F9EDA]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-3xl" />

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F9EDA]/10 to-[#0F9EDA]/5 text-[#0F9EDA] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-950 mb-3">
                  {f.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-[15px]">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Comparison / Why Pro Section */}
      <section className="py-24 sm:py-32 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-[#0F9EDA] uppercase tracking-widest mb-4">
              La diferencia
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-950 tracking-tight mb-5">
              De gratuito a Pro
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free card */}
            <div className="relative p-8 sm:p-10 rounded-3xl bg-white border border-gray-200/80">
              <div className="mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                  Actual
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-950 mb-2">
                LingText
              </h3>
              <p className="text-gray-500 mb-8">
                Todo lo que ya tienes, siempre gratuito.
              </p>
              <ul className="space-y-4">
                {[
                  "Lectura interactiva",
                  "Traducción básica",
                  "Biblioteca personal",
                  "Repetición espaciada",
                  "Importar textos manualmente",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-600">
                    <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro card */}
            <div className="relative p-8 sm:p-10 rounded-3xl bg-gray-950 border border-gray-800 text-white overflow-hidden">
              {/* Glow effect */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#0F9EDA]/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#0F9EDA]/10 rounded-full blur-3xl" />

              <div className="relative">
                <div className="mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0F9EDA]/20 text-[#0F9EDA] text-sm font-medium">
                    Próximamente
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2">LingText Pro</h3>
                <p className="text-gray-400 mb-8">
                  El siguiente nivel de aprendizaje.
                </p>
                <ul className="space-y-4">
                  {[
                    "Todo lo de la versión gratuita",
                    "Traductor potenciado por IA",
                    "App móvil nativa",
                    "Textos exclusivos por nivel",
                    "Audio en todos los textos",
                    "Importar desde cualquier web",
                    "YouTube como lecciones",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-300">
                      <svg className="w-5 h-5 text-[#0F9EDA] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* FAQ Section */}
      <section className="py-24 sm:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-[#0F9EDA] uppercase tracking-widest mb-4">
              FAQ
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-950 tracking-tight">
              Preguntas frecuentes
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gray-950" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0F9EDA]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-[10%] w-72 h-72 bg-[#0F9EDA]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-6">
            Sé de los primeros en probarlo
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
            Suscríbete a la lista de espera y recibe acceso prioritario cuando
            LingText Pro esté disponible.
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
                placeholder="tu@email.com"
                required
                aria-label="Correo electrónico"
                className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#0F9EDA]/50 focus:ring-2 focus:ring-[#0F9EDA]/20 transition-all"
              />
              <button
                type="submit"
                className="px-8 py-4 rounded-xl bg-[#0F9EDA] text-white font-semibold text-sm tracking-wide shadow-lg shadow-[#0F9EDA]/25 transition-all duration-300 hover:bg-[#0D8EC4] hover:shadow-xl hover:shadow-[#0F9EDA]/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                Unirme a la lista
              </button>
            </div>
          </form>

          <div className="mt-12 pt-8 border-t border-white/10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Volver a LingText
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
