import { Link } from "react-router";

const levels = [
  {
    id: "a1",
    name: "A1",
    title: "Principiante",
    description:
      "Textos cortos y sencillos con vocabulario básico y cotidiano.",
  },
  {
    id: "a2",
    name: "A2",
    title: "Elemental",
    description: "Historias simples y descripciones de temas familiares.",
  },
  {
    id: "b1",
    name: "B1",
    title: "Intermedio",
    description: "Textos claros sobre temas de trabajo, estudio o ocio.",
  },
  {
    id: "b2",
    name: "B2",
    title: "Intermedio Alto",
    description: "Artículos detallados sobre temas complejos y abstractos.",
  },
  {
    id: "c1",
    name: "C1",
    title: "Avanzado",
    description: "Textos extensos y exigentes con significados implícitos.",
  },
  {
    id: "c2",
    name: "C2",
    title: "Maestría",
    description: "Cualquier tipo de texto complejo, literario o técnico.",
  },
];

export default function LevelSelector() {
  return (
    <section
      id="levels"
      className="relative overflow-hidden py-16 sm:py-24 bg-gray-50 border-b border-gray-200"
    >
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-64 h-64 bg-[#0F9EDA]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[10%] w-64 h-64 bg-[#0F9EDA]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 bg-white rounded-full border border-gray-200 shadow-sm">
            <span className="w-2 h-2 bg-[#0F9EDA] rounded-full mr-2.5"></span>
            Contenido Curado
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
            Explora por <span className="text-[#0F9EDA]">Niveles</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Encuentra lecturas adaptadas a tu nivel de inglés, desde
            principiante hasta avanzado, para que progreses de manera efectiva y
            sin frustraciones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level) => (
            <Link
              key={level.id}
              to={`/levels/${level.id}`}
              className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#0F9EDA]/30 transition-all duration-200 p-8 flex flex-col h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0F9EDA]/10 text-[#0F9EDA] text-xl font-bold border border-[#0F9EDA]/20 group-hover:bg-[#0F9EDA] group-hover:text-white group-hover:border-[#0F9EDA] transition-colors duration-200">
                  {level.name}
                </span>
                <svg
                  className="w-5 h-5 text-gray-300 group-hover:text-[#0F9EDA] transition-colors duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0F9EDA] transition-colors duration-200">
                {level.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {level.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="mb-4 text-base text-gray-600">
            Explora lecturas para todos los niveles
          </p>
          <Link
            to="/textos-en-ingles"
            className="inline-flex items-center justify-center rounded-xl bg-[#0F9EDA] px-8 py-4 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0D8EC4] hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
          >
            Ver Textos en inglés
            <svg
              className="ml-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
