import React from "react";
import { Link } from "react-router";

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className = "" }: HeroSectionProps) {
  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-b from-gray-50 to-white border-b border-gray-200 py-20 md:py-28 px-4 ${className}`}
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] left-[10%] w-72 h-72 bg-[#0F9EDA]/5]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[15%] w-96 h-96 bg-[#0F9EDA]/5]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Contenedor principal */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Contenido izquierdo */}
        <div className="max-w-2xl">
          {/* Badge destacado */}
          <div className="inline-flex items-center px-4 py-2 mb-8 text-sm font-medium text-gray-700 bg-white rounded-full border border-gray-200 shadow-sm">
            <span className="w-2 h-2 bg-[#0F9EDA] rounded-full mr-2.5"></span>
            Gratuito y Open Source
          </div>

          {/* Título principal */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight text-gray-900">
            LingText{" "}
            <span className="text-[#0F9EDA]">Alternativa gratuita a LingQ</span>
          </h1>

          {/* Descripción */}
          <p className="text-xl md:text-2xl leading-relaxed text-gray-600 mb-10">
            Aprende inglés de forma gratuita a través de la lectura. Agrega tus
            propios textos y audios para sumergirte en el idioma con un método
            probado y efectivo.
          </p>

          {/* Botones CTA */}
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <a
              href="#levels"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#0F9EDA] text-white font-semibold rounded-xl hover:bg-[#0D8EC4] transition-all duration-200 shadow-sm hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Comenzar a Leer
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
            <Link
              to="/aprender-ingles-con-canciones"
              reloadDocument
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-[#0F9EDA] hover:text-[#0F9EDA] transition-all duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
              Aprender con Canciones
            </Link>
            <Link
              to="/aprender-con-language-island"
              reloadDocument
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-[#0F9EDA] hover:text-[#0F9EDA] transition-all duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Language Island
            </Link>
          </div>
        </div>

        {/* Ilustración derecha - Simulación de lector interactivo */}
        <div className="relative h-[450px] lg:h-[550px] flex items-center justify-center">
          {/* Fondo con gradiente sutil */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-80 h-80 bg-[#0F9EDA]/5 rounded-full blur-3xl"></div>
          </div>

          {/* Tarjeta del lector simulado */}
          <div className="relative w-full max-w-sm bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 overflow-hidden">
            {/* Barra superior del lector */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/60"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/60"></div>
              </div>
              <div className="flex-1 mx-3 h-5 rounded-md bg-gray-100 flex items-center px-3">
                <span className="text-[10px] text-gray-400">
                  lingtext.org/texts/....
                </span>
              </div>
            </div>

            {/* Contenido del texto simulado */}
            <div className="p-6 space-y-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-4">
                The Future of Language Learning
              </h4>
              <p className="text-xs leading-relaxed text-gray-500">
                <HeroWord word="Learning" translation="Aprendiendo" delay={0} />
                {" a new "}
                <HeroWord word="language" translation="idioma" delay={1} />
                {" is one of the most "}
                <HeroWord
                  word="rewarding"
                  translation="gratificante"
                  delay={2}
                />
                {" experiences. When you "}
                <HeroWord word="immerse" translation="sumergirte" delay={3} />
                {" yourself in "}
                <HeroWord word="authentic" translation="auténticos" delay={4} />
                {" content, your brain makes "}
                <HeroWord
                  word="connections"
                  translation="conexiones"
                  delay={5}
                />
                {" naturally."}
              </p>

              {/* Línea de traducción animada */}
              <TranslationReveal />

              {/* Barra de progreso simulada */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-medium text-gray-400">
                    Progreso de lectura
                  </span>
                  <ProgressCounter />
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <ProgressBar />
                </div>
              </div>
            </div>

            {/* Panel flotante de traducción */}
            <FloatingTranslation />
          </div>

          {/* Cards flotantes animadas */}
          <FloatingFeatureCard
            icon={
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
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            }
            label="Audio"
            position="top-4 -right-3 lg:-right-8"
            delay={0}
          />
          <FloatingFeatureCard
            icon={
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
              >
                <line x1="12" y1="20" x2="12" y2="10"></line>
                <line x1="18" y1="20" x2="18" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="16"></line>
              </svg>
            }
            label="Seguimiento"
            position="bottom-8 -left-3 lg:-left-8"
            delay={1}
          />
          <FloatingFeatureCard
            icon={
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
              >
                <path d="m5 8 6 6"></path>
                <path d="m4 14 6-6 2-3"></path>
                <path d="M2 5h12"></path>
                <path d="M7 2h1"></path>
                <path d="m22 22-5-10-5 10"></path>
                <path d="M14 18h6"></path>
              </svg>
            }
            label="Traducción"
            position="bottom-24 -right-3 lg:-right-10"
            delay={2}
          />
        </div>
      </div>
    </section>
  );
}

function HeroWord({
  word,
  translation,
  delay,
}: {
  word: string;
  translation: string;
  delay: number;
}) {
  return (
    <span className="group relative inline-block">
      <span
        className="relative z-10 font-semibold text-[#0F9EDA] cursor-default border-b-2 border-dashed border-[#0F9EDA]/30 transition-colors duration-200 group-hover:border-[#0F9EDA]"
        style={{
          animation: `heroWordPulse 4s ease-in-out ${delay * 0.6}s infinite`,
        }}
      >
        {word}
      </span>
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-800 px-2.5 py-1 text-[10px] font-medium text-white opacity-0 shadow-lg transition-all duration-300 group-hover:-top-7 group-hover:opacity-100 z-20">
        {translation}
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-gray-800"></span>
      </span>
    </span>
  );
}

function TranslationReveal() {
  const texts = [
    { word: "rewarding", translation: "gratificante" },
    { word: "connections", translation: "conexiones" },
    { word: "immerse", translation: "sumergirte" },
  ];
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-[#0F9EDA]/5 rounded-xl">
      <div className="w-6 h-6 rounded-lg bg-[#0F9EDA]/10 flex items-center justify-center shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#0F9EDA]"
        >
          <path d="m5 8 6 6"></path>
          <path d="m4 14 6-6 2-3"></path>
          <path d="M2 5h12"></path>
          <path d="M7 2h1"></path>
          <path d="m22 22-5-10-5 10"></path>
          <path d="M14 18h6"></path>
        </svg>
      </div>
      <div className="text-[10px]">
        <span className="text-gray-400">"</span>
        <span className="font-semibold text-gray-700">
          {texts[activeIndex].word}
        </span>
        <span className="text-gray-400">" </span>
        <span className="text-gray-400">= </span>
        <span
          className="font-semibold text-[#0F9EDA]"
          key={activeIndex}
          style={{ animation: "fadeInUp 0.4s ease-out" }}
        >
          {texts[activeIndex].translation}
        </span>
      </div>
    </div>
  );
}

function ProgressCounter() {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-[10px] font-semibold text-[#0F9EDA]">{count}%</span>
  );
}

function ProgressBar() {
  return (
    <div
      className="h-full bg-gradient-to-r from-[#0F9EDA] to-[#0D8EC4] rounded-full"
      style={{
        animation: "progressGrow 8s linear infinite",
        width: "0%",
      }}
    />
  );
}

function FloatingTranslation() {
  return (
    <div
      className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-2xl border border-gray-200 shadow-lg shadow-gray-200/60 px-4 py-3 flex items-center gap-3 z-10"
      style={{ animation: "floatY 3s ease-in-out infinite" }}
    >
      <div className="w-8 h-8 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#16a34a"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <div>
        <p className="text-[10px] font-semibold text-gray-700">
          Palabra conocida
        </p>
        <p className="text-[9px] text-gray-400">Vista 5 veces</p>
      </div>
    </div>
  );
}

function FloatingFeatureCard({
  icon,
  label,
  position,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  position: string;
  delay: number;
}) {
  return (
    <div
      className={`absolute ${position} bg-white rounded-2xl border border-gray-200 shadow-md shadow-gray-100 px-4 py-2.5 flex items-center gap-2.5 z-10`}
      style={{
        animation: `floatY 4s ease-in-out ${delay * 0.7}s infinite`,
      }}
    >
      <div className="w-7 h-7 rounded-lg bg-[#0F9EDA]/10 flex items-center justify-center text-[#0F9EDA]">
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}
