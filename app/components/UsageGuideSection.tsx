export default function UsageGuideSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 bg-gradient-to-b from-white via-emerald-50/60 to-white dark:from-gray-950 dark:via-emerald-950/20 dark:to-gray-950">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/3 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -bottom-24 right-1/3 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Cómo usar LingText paso a paso
        </h2>
        <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          LingText está diseñado para que aprendas en flujo. No necesitas preparar mucho: trae un texto que te motive, comienza a leer y deja que las herramientas te acompañen. Este es un recorrido recomendado para sacarle partido desde el primer minuto.
        </p>
        <ol className="mt-6 space-y-6">
          <li className="rounded-xl border border-gray-200/70 dark:border-gray-800/70 bg-white/70 dark:bg-gray-900/40 p-5 backdrop-blur">
            <div className="font-medium text-gray-900 dark:text-gray-100">1) Crea tu biblioteca</div>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Desde la portada, añade un nuevo texto: elige un título y pega contenido o importa un fichero <code>.txt</code>. Si dispones de audio del texto, puedes adjuntarlo por URL o como archivo local para practicar lectura y escucha al mismo tiempo.
            </p>
          </li>
          <li className="rounded-xl border border-gray-200/70 dark:border-gray-800/70 bg-white/70 dark:bg-gray-900/40 p-5 backdrop-blur">
            <div className="font-medium text-gray-900 dark:text-gray-100">2) Lee con traducción y TTS</div>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Abre el lector y haz clic en cualquier palabra para ver su traducción al instante. También puedes seleccionar una frase completa para traducirla en bloque. Pulsa el icono de sonido para escuchar la pronunciación (TTS) y ajusta la voz o la velocidad en los ajustes de la app.
            </p>
          </li>
          <li className="rounded-xl border border-gray-200/70 dark:border-gray-800/70 bg-white/70 dark:bg-gray-900/40 p-5 backdrop-blur">
            <div className="font-medium text-gray-900 dark:text-gray-100">3) Guarda y repasa palabras</div>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Cuando una palabra sea nueva para ti, márcala como <em>desconocida</em>. Quedará guardada en tu navegador (IndexedDB) junto con su traducción. Más tarde podrás revisar tu lista, escuchar su pronunciación y exportarla a CSV para practicar en Anki.
            </p>
          </li>
          <li className="rounded-xl border border-gray-200/70 dark:border-gray-800/70 bg-white/70 dark:bg-gray-900/40 p-5 backdrop-blur">
            <div className="font-medium text-gray-900 dark:text-gray-100">4) Ajusta el traductor</div>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Desde la cabecera del lector, elige el motor de traducción. Si tu navegador soporta la API de traducción de Chrome, será la opción más rápida. Si no, la app hará <em>fallback</em> a un modelo remoto para darte un resultado útil sin frenar tu lectura.
            </p>
          </li>
        </ol>
      </div>
    </section>
  );
}
