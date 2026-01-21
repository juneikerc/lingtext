import React from "react";
import { Link } from "react-router";

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className = "" }: HeroSectionProps) {
  return (
    <section
      className={`relative overflow-hidden bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 py-16 px-4 md:py-24 ${className}`}
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-64 h-64 bg-indigo-500/10 dark:bg-indigo-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-[70%] right-[20%] w-64 h-64 bg-sky-500/10 dark:bg-sky-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Contenedor principal */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Contenido izquierdo */}
        <div className="max-w-2xl">
          {/* Badge destacado */}
          <div className="inline-flex items-center px-3 py-1.5 mb-6 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-800">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
            Gratuito y Open Source
          </div>

          {/* Título principal */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900 dark:text-gray-100">
            LingText{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              Alternativa gratuita a LingQ
            </span>
          </h1>

          {/* Descripción */}
          <p className="text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-400 mb-8">
            Aprende inglés de forma gratuita a través de la lectura. Agrega tus
            propios textos y audios para sumergirte en el idioma con un método
            probado y efectivo.
          </p>

          {/* Botones CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#levels"
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
            >
              Comenzar a Leer
            </a>
          </div>
        </div>

        {/* Ilustración derecha */}
        <div className="relative h-96 lg:h-[500px] flex items-center justify-center">
          {/* Círculo de conexión */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-full"></div>

          {/* Nodo central */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-44 h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm flex items-center justify-center font-semibold text-lg transition-colors duration-200">
            LingText
          </div>

          {/* Nodo: Lectura Activa */}
          <div className="absolute top-[15%] left-[15%] w-28 h-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 rounded-lg shadow-sm flex flex-col items-center justify-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-200">
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
              className="text-indigo-600 dark:text-indigo-400"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <span className="text-xs font-medium">Lectura</span>
          </div>

          {/* Nodo: Audio */}
          <div className="absolute top-[25%] right-[8%] w-28 h-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 rounded-lg shadow-sm flex flex-col items-center justify-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-200">
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
              className="text-indigo-600 dark:text-indigo-400"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
            <span className="text-xs font-medium">Audio</span>
          </div>

          {/* Nodo: Traducción */}
          <div className="absolute bottom-[25%] left-[12%] w-28 h-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 rounded-lg shadow-sm flex flex-col items-center justify-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-200">
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
              className="text-indigo-600 dark:text-indigo-400"
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
          <div className="absolute bottom-[18%] right-[12%] w-28 h-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 rounded-lg shadow-sm flex flex-col items-center justify-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-200">
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
              className="text-indigo-600 dark:text-indigo-400"
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
