import React from "react";

export default function PurposeSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 bg-gray-50 border-b border-gray-200">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#0F9EDA]/5]/10 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#0F9EDA]/5]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header elegante */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 bg-white rounded-full border border-gray-200 shadow-sm">
            <span className="w-2 h-2 bg-[#0F9EDA] rounded-full mr-2.5"></span>
            Nuestra Filosofía
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 tracking-tight">
            Aprende <span className="text-[#0F9EDA]">Leyendo</span>
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed text-gray-600 max-w-4xl mx-auto">
            La mejor forma de adquirir vocabulario durable es leer mucho, en
            contexto y con la menor fricción posible
          </p>
        </div>

        {/* Contenido principal */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 md:p-12">
            <p className="text-lg md:text-xl leading-relaxed text-gray-700 mb-6">
              <span className="font-semibold text-[#0F9EDA]">LingText</span>{" "}
              nace de una idea sencilla: la mejor forma de adquirir vocabulario
              durable es leer mucho, en contexto y con la menor fricción
              posible. La app reduce el tiempo entre encontrar una palabra
              desconocida y comprenderla, permitiendo que el flujo de lectura
              continúe sin interrupciones largas.
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-gray-700">
              El lector integra traducción instantánea de palabras o fragmentos,
              pronunciación con TTS, guardado de términos y un sistema de{" "}
              <span className="font-semibold text-[#0F9EDA]">
                repetición espaciada
              </span>{" "}
              para repaso óptimo. La biblioteca te permite traer tus propios
              textos, enlazar o adjuntar audio y organizar tu progreso. Todo con
              una filosofía{" "}
              <span className="font-semibold text-[#0F9EDA]">local‑first</span>:
              tus datos se almacenan en una base de datos SQLite dentro de tu
              navegador, y puedes exportarla a tu PC cuando quieras.
            </p>
          </div>
        </div>

        {/* Características principales */}
        <div className="grid gap-8 md:grid-cols-3">
          <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#0F9EDA]/30 transition-all duration-200 p-8">
            <div className="w-12 h-12 bg-[#0F9EDA] rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-[#0F9EDA]/20">
              <span className="text-white text-xl">📖</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Lectura Activa
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Convierte cada página en una sesión de aprendizaje: clic en una
              palabra, traduce, escucha y añade a tu lista de repaso sin perder
              el hilo.
            </p>
          </div>

          <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#0F9EDA]/30 transition-all duration-200 p-8">
            <div className="w-12 h-12 bg-[#0F9EDA] rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-[#0F9EDA]/20">
              <span className="text-white text-xl">💾</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Tus Datos, Tu Control
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Todo se guarda en SQLite dentro de tu navegador. Exporta tu base
              de datos a tu PC cuando quieras y llévala a otro dispositivo.
            </p>
          </div>

          <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#0F9EDA]/30 transition-all duration-200 p-8">
            <div className="w-12 h-12 bg-[#0F9EDA] rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-[#0F9EDA]/20">
              <span className="text-white text-xl">🌱</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Repetición Espaciada
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Algoritmo SM-2 integrado para repasar vocabulario en el momento
              óptimo. También puedes exportar a CSV para Anki.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              ¿Listo para comenzar?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Únete a cientos de estudiantes que ya están aprendiendo inglés de
              forma más efectiva con LingText
            </p>
            <a
              href="#levels"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[#0F9EDA] text-white font-semibold hover:bg-[#0D8EC4] transition-all duration-200 shadow-lg shadow-[#0F9EDA]/25"
            >
              <span className="mr-2">🚀</span>
              Comenzar Ahora
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
