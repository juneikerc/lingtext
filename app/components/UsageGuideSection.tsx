export default function UsageGuideSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 bg-gradient-to-br from-white via-emerald-50/20 to-white dark:from-gray-950 dark:via-emerald-950/10 dark:to-gray-950">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-emerald-400/5 blur-3xl"></div>
        <div className="absolute -bottom-24 right-1/3 h-96 w-96 rounded-full bg-teal-400/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header elegante */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-emerald-600 bg-emerald-100/80 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-full border border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
            Guía de Uso
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 bg-clip-text text-transparent">
              Comienza en Minutos
            </span>
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed text-gray-600 dark:text-gray-400 max-w-4xl mx-auto font-light">
            LingText está diseñado para que aprendas en flujo. Sigue estos pasos
            y estarás aprendiendo inglés de inmediato
          </p>
        </div>

        {/* Pasos de la guía */}
        <div className="space-y-8">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  📚 Crea tu Biblioteca
                  <span className="ml-3 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
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
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50">
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    💡 <strong>Tip:</strong> Comienza con textos que te
                    interesen realmente. La motivación es clave para el
                    aprendizaje efectivo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  📖 Lee con Traducción y TTS
                  <span className="ml-3 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
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
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200/50 dark:border-green-800/50">
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    🎯 <strong>Objetivo:</strong> Convertir cada página en una
                    sesión de aprendizaje activa sin interrumpir el flujo de
                    lectura.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  💾 Guarda y Repasa Palabras
                  <span className="ml-3 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                    Vocabulario
                  </span>
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Cuando una palabra sea nueva para ti, márcala como{" "}
                  <em className="font-semibold text-purple-600 dark:text-purple-400">
                    desconocida
                  </em>
                  . Quedará guardada en SQLite junto con su traducción y datos
                  de repetición espaciada. Ve a <strong>/review</strong> para
                  repasar con el algoritmo SM-2, o exporta a CSV para Anki.
                </p>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200/50 dark:border-purple-800/50">
                  <p className="text-purple-700 dark:text-purple-300 text-sm">
                    🔄 <strong>Repetición espaciada:</strong> El algoritmo SM-2
                    calcula el momento óptimo para repasar cada palabra.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  💾 Exporta tus Datos
                  <span className="ml-3 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium">
                    Backup
                  </span>
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Desde la biblioteca, usa los botones{" "}
                  <em className="font-semibold text-orange-600 dark:text-orange-400">
                    Exportar
                  </em>{" "}
                  e{" "}
                  <em className="font-semibold text-orange-600 dark:text-orange-400">
                    Importar
                  </em>{" "}
                  para guardar tu base de datos SQLite en tu PC o restaurarla
                  desde otro dispositivo. Tus datos son tuyos.
                </p>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200/50 dark:border-orange-800/50">
                  <p className="text-orange-700 dark:text-orange-300 text-sm">
                    🔒 <strong>Privacidad:</strong> Todo se guarda localmente.
                    El archivo .sqlite es portable y estándar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de ayuda adicional */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 rounded-2xl border border-emerald-200/30 dark:border-emerald-800/30 p-8 backdrop-blur-sm">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
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
              <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25">
                📖 Ver Documentación
              </button>
              <button className="px-8 py-4 rounded-xl border-2 border-emerald-300/50 dark:border-emerald-600/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300">
                💬 Comunidad
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
