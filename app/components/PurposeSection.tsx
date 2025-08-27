import React from "react";

export default function PurposeSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 bg-gradient-to-br from-white via-indigo-50/30 to-white dark:from-gray-950 dark:via-indigo-950/10 dark:to-gray-950">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-indigo-400/5 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-purple-400/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header elegante */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-indigo-600 bg-indigo-100/80 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full border border-indigo-200/50 dark:border-indigo-800/50 backdrop-blur-sm">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></span>
            Nuestra Filosofía
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
              Aprende Leyendo
            </span>
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed text-gray-600 dark:text-gray-400 max-w-4xl mx-auto font-light">
            La mejor forma de adquirir vocabulario durable es leer mucho, en contexto y con la menor fricción posible
          </p>
        </div>

        {/* Contenido principal */}
        <div className="mb-16">
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8 md:p-12">
            <p className="text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">LingText</span> nace de una idea sencilla: la mejor forma de adquirir vocabulario durable es leer mucho, en contexto y con la menor fricción posible. La app reduce el tiempo entre encontrar una palabra desconocida y comprenderla, permitiendo que el flujo de lectura continúe sin interrupciones largas.
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-300">
              El lector integra traducción instantánea de palabras o fragmentos, pronunciación con TTS, y guardado de términos para repaso posterior. La biblioteca te permite traer tus propios textos, enlazar o adjuntar audio y organizar tu progreso. Todo con una filosofía <span className="font-semibold text-purple-600 dark:text-purple-400">local‑first</span>: tus datos permanecen en tu navegador; cuando no sea posible traducir localmente, la app puede pedir ayuda a un modelo remoto como respaldo.
            </p>
          </div>
        </div>

        {/* Características principales */}
        <div className="grid gap-8 md:grid-cols-3">
          <div className="group bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl hover:border-indigo-300/50 dark:hover:border-indigo-600/50 transition-all duration-300 p-8">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-xl">📖</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Lectura Activa
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Convierte cada página en una sesión de aprendizaje: clic en una palabra, traduce, escucha y añade a tu lista de repaso sin perder el hilo.
            </p>
          </div>

          <div className="group bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl hover:border-purple-300/50 dark:hover:border-purple-600/50 transition-all duration-300 p-8">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-xl">🏠</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Local‑First
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Textos, audio y palabras se guardan en tu navegador. La traducción remota solo se usa como respaldo cuando la opción local no está disponible.
            </p>
          </div>

          <div className="group bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl hover:border-green-300/50 dark:hover:border-green-600/50 transition-all duration-300 p-8">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-xl">🌱</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Aprendizaje Sostenible
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Repite con propósito: guarda palabras desconocidas en contexto y expórtalas a CSV para practicar en Anki cuando quieras.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 rounded-2xl border border-indigo-200/30 dark:border-indigo-800/30 p-8 backdrop-blur-sm">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              ¿Listo para comenzar?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Únete a miles de estudiantes que ya están aprendiendo inglés de forma más efectiva con LingText
            </p>
            <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25">
              🚀 Comenzar Ahora
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
