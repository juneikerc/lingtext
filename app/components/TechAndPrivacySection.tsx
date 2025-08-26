export default function TechAndPrivacySection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 bg-gradient-to-b from-white via-amber-50/60 to-white dark:from-gray-950 dark:via-amber-950/20 dark:to-gray-950">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-rose-400/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Tecnología, rendimiento y privacidad
        </h2>
        <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          LingText se construye sobre un stack moderno para ofrecer velocidad en desarrollo y estabilidad en producción. El SSR de React Router mejora la experiencia inicial de carga y la indexación; Vite aporta recarga instantánea y bundling eficiente. En el navegador, el uso de APIs nativas como IndexedDB, Web Speech y, cuando está disponible, la API de traducción de Chrome, permite disminuir la dependencia de servicios externos y mantener la latencia baja.
        </p>
        <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          La filosofía es <em>local‑first</em>. Tu biblioteca de textos, los archivos de audio que adjuntas y el historial de palabras se almacenan en tu dispositivo. Cuando necesitas traducción y tu navegador no ofrece una opción local, la app puede recurrir a un endpoint remoto como respaldo; este intercambio es acotado: se envía solo el término o fragmento a traducir, y nunca tus textos completos ni tu base de datos de palabras.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200/70 dark:border-gray-800/70 bg-white/70 dark:bg-gray-900/40 p-5 backdrop-blur">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Arquitectura</h3>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              React Router 7 con SSR, Vite 6 para el toolchain, Tailwind 4 para estilos y Zustand para estado ligero. El servidor expone un endpoint de traducción que usa OpenRouter cuando es necesario.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200/70 dark:border-gray-800/70 bg-white/70 dark:bg-gray-900/40 p-5 backdrop-blur">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Privacidad</h3>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              Datos locales por defecto. El fallback de traducción remota solo envía el texto a traducir. Controlas si habilitas un API key para usar modelos remotos.
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200/70 dark:border-gray-800/70 bg-white/70 dark:bg-gray-900/40 p-5 backdrop-blur">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Audio y permisos</h3>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              Si adjuntas audio como archivo local, el navegador puede pedir permisos. Si estos caducan, el lector te ofrece re‑autorizar sin perder contexto. Las URLs temporales se limpian para evitar fugas de memoria.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200/70 dark:border-gray-800/70 bg-white/70 dark:bg-gray-900/40 p-5 backdrop-blur">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Rendimiento</h3>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              Tokenización y popups ligeros, carga diferida donde aplica, y uso de APIs del navegador para minimizar red y mejorar la respuesta de la interfaz mientras lees.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
