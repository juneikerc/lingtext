export default function TechAndPrivacySection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 bg-gradient-to-br from-white via-amber-50/20 to-white dark:from-gray-950 dark:via-amber-950/10 dark:to-gray-950">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-amber-400/5 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-orange-400/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header elegante */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-amber-600 bg-amber-100/80 dark:bg-amber-900/30 dark:text-amber-300 rounded-full border border-amber-200/50 dark:border-amber-800/50 backdrop-blur-sm">
            <span className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></span>
            Tecnología & Privacidad
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-800 bg-clip-text text-transparent">
              Rendimiento y Seguridad
            </span>
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed text-gray-600 dark:text-gray-400 max-w-4xl mx-auto font-light">
            Tecnología moderna que respeta tu privacidad y maximiza tu
            experiencia de aprendizaje
          </p>
        </div>

        {/* Descripción principal */}
        <div className="mb-16">
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8 md:p-12">
            <p className="text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                LingText
              </span>{" "}
              se construye sobre un stack moderno para ofrecer velocidad en
              desarrollo y estabilidad en producción. El SSR de React Router
              mejora la experiencia inicial de carga y la indexación; Vite
              aporta recarga instantánea y bundling eficiente. En el navegador,
              usamos <span className="font-semibold">SQLite WASM</span> con
              persistencia en OPFS, Web Speech API y, cuando está disponible, la
              API de traducción de Chrome.
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-300">
              La filosofía es{" "}
              <span className="font-semibold text-orange-600 dark:text-orange-400">
                local‑first con propiedad de datos
              </span>
              . Tu biblioteca de textos, audio y vocabulario se almacenan en una
              base de datos SQLite dentro de tu navegador. Puedes{" "}
              <span className="font-semibold">
                exportar el archivo .sqlite a tu PC
              </span>{" "}
              cuando quieras y llevarlo a otro dispositivo. La traducción remota
              solo envía el término a traducir, nunca tus textos completos.
            </p>
          </div>
        </div>

        {/* Grid de características técnicas */}
        <div className="grid gap-8 md:grid-cols-2 mb-16">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
              <span className="text-white text-xl">⚡</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Arquitectura Moderna
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              React Router 7 con SSR, Vite 6 para el toolchain, Tailwind 4 para
              estilos y Zustand para estado ligero. El servidor expone un
              endpoint de traducción que usa OpenRouter cuando es necesario.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                SSR para mejor SEO
              </div>
              <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Recarga instantánea en desarrollo
              </div>
              <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                APIs nativas del navegador
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
              <span className="text-white text-xl">🔒</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Tus Datos, Tu Control
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Base de datos SQLite en tu navegador. Exporta/importa cuando
              quieras. La traducción remota solo envía el término, nunca tus
              textos completos.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                SQLite WASM + OPFS
              </div>
              <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Exportar/Importar .sqlite
              </div>
              <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Portable entre dispositivos
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
              <span className="text-white text-xl">🎵</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Audio y Permisos
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Si adjuntas audio como archivo local, el navegador puede pedir
              permisos. Si estos caducan, el lector te ofrece re‑autorizar sin
              perder contexto. Las URLs temporales se limpian para evitar fugas
              de memoria.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-purple-600 dark:text-purple-400">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Gestión inteligente de permisos
              </div>
              <div className="flex items-center text-sm text-purple-600 dark:text-purple-400">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Limpieza automática de memoria
              </div>
              <div className="flex items-center text-sm text-purple-600 dark:text-purple-400">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Re-autorización sin perder contexto
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6">
              <span className="text-white text-xl">🚀</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Rendimiento Optimizado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Tokenización y popups ligeros, carga diferida donde aplica, y uso
              de APIs del navegador para minimizar red y mejorar la respuesta de
              la interfaz mientras lees.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-orange-600 dark:text-orange-400">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                Interfaces ligeras y responsivas
              </div>
              <div className="flex items-center text-sm text-orange-600 dark:text-orange-400">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                Carga diferida inteligente
              </div>
              <div className="flex items-center text-sm text-orange-600 dark:text-orange-400">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                Minimización de dependencias externas
              </div>
            </div>
          </div>
        </div>

        {/* Sección de confianza */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-2xl border border-amber-200/30 dark:border-amber-800/30 p-8 backdrop-blur-sm">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl">🛡️</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Tu Privacidad es Nuestra Prioridad
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Construimos LingText con el compromiso de proteger tus datos y
              respetar tu privacidad en todo momento
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
                💾 SQLite local
              </span>
              <span className="px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
                📤 Exportar a PC
              </span>
              <span className="px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
                🔄 Portable
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
