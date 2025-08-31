import React from "react";

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className = "" }: HeroSectionProps) {
  //    {/* Estadísticas sociales */}
  //    <div className="flex justify-center items-center mt-16 space-x-8 text-sm text-gray-400">
  //    <div className="flex items-center space-x-2">
  //      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
  //      <span>+1000 usuarios activos</span>
  //    </div>
  //    <div className="hidden sm:block">•</div>
  //    <div className="flex items-center space-x-2">
  //      <span>⭐ 4.8/5 valoración</span>
  //    </div>
  //    <div className="hidden sm:block">•</div>
  //    <div className="flex items-center space-x-2">
  //      <span>100% Gratuito</span>
  //    </div>
  //  </div>

  {
    /* CTA Buttons */
  }
  //    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
  //    <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300">
  //      <span className="relative z-10">Comenzar a Aprender</span>
  //      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  //    </button>

  //    <button className="px-8 py-4 border-2 border-white/20 rounded-xl font-semibold text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300">
  //      Ver Demo
  //    </button>
  //  </div>

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-20 px-4 text-center ${className}`}
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div
          className="absolute top-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Badge destacado */}
        <div className="inline-flex items-center px-4 py-2 mb-8 text-sm font-medium text-purple-200 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
          Gratuito y Open Source
        </div>

        {/* Título principal */}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
          <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            LingText
          </span>
          <br />{" "}
          <span className="text-3xl md:text-4xl font-light text-gray-300 mt-2 block">
            Alternativa gratuita a LingQ
          </span>
        </h1>

        {/* Descripción */}
        <p className="text-xl md:text-2xl leading-relaxed text-gray-300 mb-10 max-w-3xl mx-auto font-light">
          Aprende inglés de forma{" "}
          <span className="font-semibold text-white">gratuita</span> a través de
          la lectura. Agrega tus propios textos y audios para sumergirte en el
          idioma a través de la
          <span className="font-semibold text-purple-300">
            {" "}
            lectura activa inteligente
          </span>
          .
        </p>

        {/* Características destacadas */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📖</span>
            </div>
            <span className="text-gray-200 font-medium">Lectura Activa</span>
          </div>

          <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🔊</span>
            </div>
            <span className="text-gray-200 font-medium">Audio Integrado</span>
          </div>

          <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📊</span>
            </div>
            <span className="text-gray-200 font-medium">Seguimiento</span>
          </div>
        </div>
      </div>
    </section>
  );
}
