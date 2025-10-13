import React from "react";
import { Link } from "react-router";

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className = "" }: HeroSectionProps) {
  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 md:py-24 ${className}`}
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-64 h-64 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-[70%] right-[20%] w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      {/* Contenedor principal */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Contenido izquierdo */}
        <div className="max-w-2xl">
          {/* Badge destacado */}
          <div className="inline-flex items-center px-3 py-1.5 mb-6 text-xs font-medium text-purple-700 bg-purple-100 rounded-full border border-purple-200">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Gratuito y Open Source
          </div>

          {/* Título principal */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
            LingText{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Alternativa gratuita a lingQ
            </span>
          </h1>

          {/* Descripción */}
          <p className="text-lg md:text-xl leading-relaxed text-gray-600 mb-8">
            Aprende inglés de forma gratuita a través de la lectura. Agrega tus
            propios textos y audios para sumergirte en el idioma con un método
            probado y efectivo.
          </p>

          {/* Botones CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#library"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Comenzar a Aprender
            </a>
            <Link
              to="/words"
              className="inline-flex items-center justify-center px-6 py-3 bg-transparent text-purple-600 font-medium rounded-lg border-2 border-purple-600 hover:bg-purple-600 hover:text-white transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Progreso
            </Link>
          </div>
        </div>

        {/* Ilustración derecha */}
        <div className="relative h-96 lg:h-[500px] flex items-center justify-center">
          {/* Círculo de conexión */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border-2 border-dashed border-gray-300 rounded-full"></div>

          {/* Nodo central */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-44 h-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-lg flex items-center justify-center font-semibold text-lg hover:scale-105 transition-transform duration-300">
            LingText
          </div>

          {/* Nodo: Lectura Activa */}
          <div className="absolute top-[15%] left-[15%] w-28 h-20 bg-white border-2 border-blue-500 text-blue-600 rounded-lg shadow-md flex flex-col items-center justify-center gap-1 hover:scale-105 hover:shadow-lg transition-all duration-300">
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
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <span className="text-xs font-medium">Lectura</span>
          </div>

          {/* Nodo: Audio */}
          <div className="absolute top-[25%] right-[8%] w-28 h-20 bg-white border-2 border-green-500 text-green-600 rounded-lg shadow-md flex flex-col items-center justify-center gap-1 hover:scale-105 hover:shadow-lg transition-all duration-300">
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
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
            <span className="text-xs font-medium">Audio</span>
          </div>

          {/* Nodo: Traducción */}
          <div className="absolute bottom-[25%] left-[12%] w-28 h-20 bg-white border-2 border-purple-500 text-purple-600 rounded-lg shadow-md flex flex-col items-center justify-center gap-1 hover:scale-105 hover:shadow-lg transition-all duration-300">
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
              <path d="m5 8 6 6"></path>
              <path d="m4 14 6-6 2-3"></path>
              <path d="M2 5h12"></path>
              <path d="M7 2h1"></path>
              <path d="m22 22-5-10-5 10"></path>
              <path d="M14 18h6"></path>
            </svg>
            <span className="text-xs font-medium">Traducción</span>
          </div>

          {/* Nodo: Seguimiento */}
          <div className="absolute bottom-[18%] right-[12%] w-28 h-20 bg-white border-2 border-pink-500 text-pink-600 rounded-lg shadow-md flex flex-col items-center justify-center gap-1 hover:scale-105 hover:shadow-lg transition-all duration-300">
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
              <line x1="12" y1="20" x2="12" y2="10"></line>
              <line x1="18" y1="20" x2="18" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="16"></line>
            </svg>
            <span className="text-xs font-medium">Progreso</span>
          </div>
        </div>
      </div>
    </section>
  );
}
