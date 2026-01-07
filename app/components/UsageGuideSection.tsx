export default function UsageGuideSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-indigo-500/10 dark:bg-indigo-400/5 blur-3xl"></div>
        <div className="absolute -bottom-24 right-1/3 h-96 w-96 rounded-full bg-sky-500/10 dark:bg-sky-400/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header elegante */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-800">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
            Guía de Uso
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-gray-900 dark:text-gray-100">
            Comienza en{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              Minutos
            </span>
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed text-gray-600 dark:text-gray-400 max-w-4xl mx-auto font-light">
            LingText está diseñado para que aprendas en flujo. Sigue estos pasos
            y estarás aprendiendo inglés de inmediato
          </p>
        </div>

        {/* Pasos de la guía */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  📚 Crea tu Biblioteca
                  <span className="ml-3 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                    Paso inicial
                  </span>
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Desde la portada, añade un nuevo texto: elige un título y pega
                  contenido o importa un fichero{" "}
                  <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">
                    .txt
                  </code>
                  . Si dispones de audio del texto, puedes adjuntarlo por URL o
                  como archivo local para practicar lectura y escucha al mismo
                  tiempo.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    💡 <strong>Tip:</strong> Comienza con textos que te
                    interesen realmente. La motivación es clave para el
                    aprendizaje efectivo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  📖 Lee con Traducción y TTS
                  <span className="ml-3 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                    Lectura activa
                  </span>
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Abre el lector y haz clic en cualquier palabra para ver su
                  traducción al instante. También puedes seleccionar una frase
                  completa para traducirla en bloque. Pulsa el icono de sonido
                  para escuchar la pronunciación (TTS) y ajusta la voz o la
                  velocidad en los ajustes de la app.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    🎯 <strong>Objetivo:</strong> Convertir cada página en una
                    sesión de aprendizaje activa sin interrumpir el flujo de
                    lectura.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  💾 Guarda y Repasa Palabras
                  <span className="ml-3 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                    Vocabulario
                  </span>
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Cuando una palabra sea nueva para ti, márcala como{" "}
                  <em className="font-semibold text-indigo-600 dark:text-indigo-400">
                    desconocida
                  </em>
                  . Quedará guardada en SQLite junto con su traducción y datos
                  de repetición espaciada. Ve a <strong>/review</strong> para
                  repasar con el algoritmo SM-2, o exporta a CSV para Anki.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    🔄 <strong>Repetición espaciada:</strong> El algoritmo SM-2
                    calcula el momento óptimo para repasar cada palabra.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  💾 Exporta tus Datos
                  <span className="ml-3 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                    Backup
                  </span>
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Desde la biblioteca, usa los botones{" "}
                  <em className="font-semibold text-indigo-600 dark:text-indigo-400">
                    Exportar
                  </em>{" "}
                  e{" "}
                  <em className="font-semibold text-indigo-600 dark:text-indigo-400">
                    Importar
                  </em>{" "}
                  para guardar tu base de datos SQLite en tu PC o restaurarla
                  desde otro dispositivo. Tus datos son tuyos.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    🔒 <strong>Privacidad:</strong> Todo se guarda localmente.
                    El archivo .sqlite es portable y estándar.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                5
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  ✨ Genera Historias Personalizadas
                  <span className="ml-3 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                    Práctica en Contexto
                  </span>
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Desde la sección <strong>Palabras</strong>, selecciona hasta{" "}
                  <em className="font-semibold text-indigo-600 dark:text-indigo-400">
                    20 palabras
                  </em>{" "}
                  de tu vocabulario y usa el generador para crear textos
                  personalizados. Elige el tipo (cuento, artículo, conversación,
                  etc.), tema personalizado y nivel CEFR (A2-C2). La IA creará
                  textos que contengan tus palabras en <strong>bold</strong>,
                  reforzando el aprendizaje en contexto.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    💡 <strong>Tip:</strong> Los textos generados se guardan
                    automáticamente en tu biblioteca y puedes leerlos con todas
                    las funcionalidades del lector (traducción, TTS, marca de
                    palabras). El límite de 20 palabras garantiza textos más
                    naturales y efectivos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de ayuda adicional */}
        <div className="text-center mt-16">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-6 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl">❓</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              ¿Necesitas Ayuda?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Explora la documentación completa o únete a nuestra comunidad de
              estudiantes de inglés
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md">
                📖 Ver Documentación
              </button>
              <button className="px-8 py-4 rounded-xl bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                💬 Comunidad
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
