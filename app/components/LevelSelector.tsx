import { Link } from "react-router";

const levels = [
  {
    id: "a1",
    name: "A1",
    title: "Principiante",
    description:
      "Textos cortos y sencillos con vocabulario básico y cotidiano.",
    color: "bg-emerald-500",
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
    <section className="relative overflow-hidden py-16 sm:py-24 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-64 h-64 bg-indigo-500/10 dark:bg-indigo-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[10%] w-64 h-64 bg-sky-500/10 dark:bg-sky-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
            Contenido Curado
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 dark:text-gray-100">
            Explora por{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              Niveles
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Encuentra lecturas adaptadas a tu nivel de inglés, desde
            principiante hasta avanzado, para que progreses de manera efectiva y
            sin frustraciones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {levels.map((level) => (
            <Link
              key={level.id}
              to={`/levels/${level.id}`}
              className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition duration-200 p-8 flex flex-col h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-950"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xl font-bold border border-indigo-100 dark:border-indigo-800 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                  {level.name}
                </span>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200"
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
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                {level.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {level.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
