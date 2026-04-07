import { Link } from "react-router";

export default function ContactCTA() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-white">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 h-64 w-64 rounded-full bg-[#0F9EDA]/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-[#0F9EDA]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 bg-gray-50 rounded-full border border-gray-200">
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
            className="mr-2 text-[#0F9EDA]"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          Estoy aquí para ayudarte
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
          ¿Tienes alguna <span className="text-[#0F9EDA]">duda?</span>
        </h2>

        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Si algo no te queda claro sobre cómo usar LingText, o simplemente
          quieres compartir tu experiencia, me encantaría escucharte.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/contacto"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0F9EDA] text-white font-semibold rounded-xl hover:bg-[#0D8EC4] transition-all duration-200 shadow-sm hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#0F9EDA] font-semibold rounded-xl border border-[#0F9EDA]/20 hover:border-[#0F9EDA]/40 hover:bg-[#0F9EDA]/5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Escribir directamente
          </a>
        </div>
      </div>
    </section>
  );
}
