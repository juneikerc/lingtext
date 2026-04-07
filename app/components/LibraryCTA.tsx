import { Link } from "react-router";

const features = [
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          d="M14 2v6h6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          d="M12 18v-6M9 15h6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    ),
    title: "Agrega Textos",
    description:
      "Escribe o pega cualquier texto en inglés para practicar lectura con traducción instantánea.",
    stat: "Ilimitados",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="w-5 h-5"
      >
        <polyline
          points="17 8 12 3 7 8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <line
          x1="12"
          y1="3"
          x2="12"
          y2="15"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    ),
    title: "Importa Archivos",
    description:
      "Importa archivos .txt desde tu dispositivo y comienza a leer en segundos.",
    stat: ".txt",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          d="M3 18v-6a9 9 0 1 1 18 0v6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5ZM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5Z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    ),
    title: "Audio Integrado",
    description: "Adjunta audio a tus textos para escuchar mientras lees.",
    stat: "TTS + URL",
  },
];

function MockupCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
      {/* Barra del navegador */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 bg-gray-50/50">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400/50"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-400/50"></div>
          <div className="w-2 h-2 rounded-full bg-green-400/50"></div>
        </div>
        <div className="flex-1 mx-3 h-6 rounded-md bg-gray-100 flex items-center justify-center">
          <span className="text-[10px] text-gray-400 font-medium">
            Mi Biblioteca
          </span>
        </div>
      </div>

      {/* Contenido simulado */}
      <div className="p-5 flex-1 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-4 w-32 bg-gray-900 rounded-md"></div>
            <div className="h-2.5 w-20 bg-gray-200 rounded-full mt-1.5"></div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#0F9EDA] flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              className="w-4 h-4"
            >
              <path
                d="M12 5v14M5 12h14"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Cards de texto simuladas */}
        {[
          {
            w: "w-full",
            color: "bg-[#0F9EDA]/5 border-[#0F9EDA]/10",
            dot: "bg-green-400",
          },
          {
            w: "w-full",
            color: "bg-gray-50 border-gray-100",
            dot: "bg-green-400",
          },
          {
            w: "w-full",
            color: "bg-gray-50 border-gray-100",
            dot: "bg-yellow-400",
          },
        ].map((item, i) => (
          <div
            key={i}
            className={`${item.w} ${item.color} rounded-xl border p-3.5 transition-all duration-200`}
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-2 h-2 rounded-full ${item.dot} mt-1.5 shrink-0`}
              ></div>
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-gray-300/60 rounded-full w-3/4"></div>
                <div className="h-2 bg-gray-200/80 rounded-full w-full"></div>
                <div className="h-2 bg-gray-200/60 rounded-full w-5/6"></div>
              </div>
            </div>
          </div>
        ))}

        {/* Barra de palabras */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
            <span className="text-[10px] text-gray-400">142 conocidas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
            <span className="text-[10px] text-gray-400">28 por aprender</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  stat,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  stat: string;
}) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#0F9EDA]/30 transition-all duration-200 p-6 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-[#0F9EDA]/10 rounded-xl flex items-center justify-center text-[#0F9EDA] border border-[#0F9EDA]/15 group-hover:bg-[#0F9EDA] group-hover:text-white group-hover:border-[#0F9EDA] transition-colors duration-200">
          {icon}
        </div>
        <span className="text-[10px] font-semibold text-[#0F9EDA] bg-[#0F9EDA]/5 px-2.5 py-1 rounded-full">
          {stat}
        </span>
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-1.5 group-hover:text-[#0F9EDA] transition-colors duration-200">
        {title}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

export default function LibraryCTA() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 bg-gray-50 border-b border-gray-200">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[5%] w-72 h-72 bg-[#0F9EDA]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[5%] w-72 h-72 bg-[#0F9EDA]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 bg-white rounded-full border border-gray-200 shadow-sm">
            <span className="w-2 h-2 bg-[#0F9EDA] rounded-full mr-2.5"></span>
            Biblioteca Personal
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
            Tu Biblioteca <span className="text-[#0F9EDA]">Personal</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Crea tu propia colección de textos para aprender inglés a tu ritmo
            con lectura inmersiva.
          </p>
        </div>

        {/* Bento grid: mockup grande + 3 features */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Mockup - ocupa 3 columnas en lg */}
          <div className="lg:col-span-3">
            <MockupCard />
          </div>

          {/* Features - 2 columnas, 3 cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            to="/my-library"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#0F9EDA] text-white font-semibold rounded-xl hover:bg-[#0D8EC4] transition-all duration-200 shadow-sm hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
          >
            Ir a Mi Biblioteca
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5 ml-2"
              aria-hidden="true"
            >
              <path
                d="m9 18 6-6-6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
