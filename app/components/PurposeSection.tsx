import React from "react";

export default function PurposeSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 bg-gradient-to-b from-white via-indigo-50/60 to-white dark:from-gray-950 dark:via-indigo-950/20 dark:to-gray-950">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-fuchsia-400/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Aprende inglés leyendo: propósito y visión
        </h2>
        <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          LingText nace de una idea sencilla: la mejor forma de adquirir vocabulario durable es leer mucho, en contexto y con la menor fricción posible. La app reduce el tiempo entre encontrar una palabra desconocida y comprenderla, permitiendo que el flujo de lectura continúe sin interrupciones largas. No es un diccionario más: es un espacio para construir tu propio mapa de palabras, atado a los textos que te importan.
        </p>
        <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          El lector integra traducción instantánea de palabras o fragmentos, pronunciación con TTS, y guardado de términos para repaso posterior. La biblioteca te permite traer tus propios textos, enlazar o adjuntar audio y organizar tu progreso. Todo con una filosofía local‑first: tus datos permanecen en tu navegador; cuando no sea posible traducir localmente, la app puede pedir ayuda a un modelo remoto como respaldo.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200/70 dark:border-gray-800/70 bg-white/70 dark:bg-gray-900/40 p-4 backdrop-blur">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Lectura activa</h3>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              Convierte cada página en una sesión de aprendizaje: clic en una palabra, traduce, escucha y añade a tu lista de repaso sin perder el hilo.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200/70 dark:border-gray-800/70 bg-white/70 dark:bg-gray-900/40 p-4 backdrop-blur">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Local‑first</h3>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              Textos, audio y palabras se guardan en tu navegador. La traducción remota solo se usa como respaldo cuando la opción local no está disponible.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200/70 dark:border-gray-800/70 bg-white/70 dark:bg-gray-900/40 p-4 backdrop-blur">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Aprendizaje sostenible</h3>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              Repite con propósito: guarda palabras desconocidas en contexto y expórtalas a CSV para practicar en Anki cuando quieras.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
