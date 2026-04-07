const features = [
  {
    icon: "\u26A1",
    title: "Arquitectura Moderna",
    description:
      "React Router 7 con SSR, Vite 6 para el toolchain, Tailwind 4 para estilos y Zustand para estado ligero. El servidor expone un endpoint de traducción que usa OpenRouter cuando es necesario.",
    bullets: [
      "SSR para mejor SEO",
      "Recarga instantánea en desarrollo",
      "APIs nativas del navegador",
    ],
  },
  {
    icon: "\uD83D\uDD12",
    title: "Tus Datos, Tu Control",
    description:
      "Base de datos SQLite en tu navegador. Exporta/importa cuando quieras. La traducción remota solo envía el término, nunca tus textos completos.",
    bullets: [
      "SQLite WASM + OPFS",
      "Exportar/Importar .sqlite",
      "Portable entre dispositivos",
    ],
  },
  {
    icon: "\uD83C\uDFB5",
    title: "Audio y Permisos",
    description:
      "Si adjuntas audio como archivo local, el navegador puede pedir permisos. Si estos caducan, el lector te ofrece re-autorizar sin perder contexto. Las URLs temporales se limpian para evitar fugas de memoria.",
    bullets: [
      "Gestión inteligente de permisos",
      "Limpieza automática de memoria",
      "Re-autorización sin perder contexto",
    ],
  },
  {
    icon: "\uD83D\uDE80",
    title: "Rendimiento Optimizado",
    description:
      "Tokenización y popups ligeros, carga diferida donde aplica, y uso de APIs del navegador para minimizar red y mejorar la respuesta de la interfaz mientras lees.",
    bullets: [
      "Interfaces ligeras y responsivas",
      "Carga diferida inteligente",
      "Minimización de dependencias externas",
    ],
  },
];

export default function TechAndPrivacySection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 bg-gray-50 border-b border-gray-200">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#0F9EDA]/5 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#0F9EDA]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 bg-white rounded-full border border-gray-200 shadow-sm">
            <span className="w-2 h-2 bg-[#0F9EDA] rounded-full mr-2.5"></span>
            Tecnología & Privacidad
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
            Rendimiento y <span className="text-[#0F9EDA]">Seguridad</span>
          </h2>
          <p className="text-xl leading-relaxed text-gray-600 max-w-3xl mx-auto">
            Tecnología moderna que respeta tu privacidad y maximiza tu
            experiencia de aprendizaje.
          </p>
        </div>

        {/* Descripción principal */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 md:p-12">
            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              <span className="font-semibold text-[#0F9EDA]">LingText</span> se
              construye sobre un stack moderno para ofrecer velocidad en
              desarrollo y estabilidad en producción. El SSR de React Router
              mejora la experiencia inicial de carga y la indexación; Vite
              aporta recarga instantánea y bundling eficiente. En el navegador,
              usamos{" "}
              <span className="font-semibold text-gray-900">SQLite WASM</span>{" "}
              con persistencia en OPFS, Web Speech API y, cuando está
              disponible, la API de traducción de Chrome.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              La filosofía es{" "}
              <span className="font-semibold text-[#0F9EDA]">
                local-first con propiedad de datos
              </span>
              . Tu biblioteca de textos, audio y vocabulario se almacenan en una
              base de datos SQLite dentro de tu navegador. Puedes{" "}
              <span className="font-semibold text-gray-900">
                exportar el archivo .sqlite a tu PC
              </span>{" "}
              cuando quieras y llevarlo a otro dispositivo. La traducción remota
              solo envía el término a traducir, nunca tus textos completos.
            </p>
          </div>
        </div>

        {/* Grid de características técnicas */}
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-8"
            >
              <div className="w-12 h-12 bg-[#0F9EDA]/10 rounded-xl flex items-center justify-center mb-6 border border-[#0F9EDA]/20">
                <span className="text-xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {feature.description}
              </p>
              <div className="space-y-2.5">
                {feature.bullets.map((bullet) => (
                  <div
                    key={bullet}
                    className="flex items-center text-sm text-gray-700"
                  >
                    <div className="w-1.5 h-1.5 bg-[#0F9EDA] rounded-full mr-3"></div>
                    {bullet}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sección de confianza */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 sm:p-12">
            <div className="w-14 h-14 mx-auto mb-6 bg-[#0F9EDA]/10 rounded-2xl flex items-center justify-center border border-[#0F9EDA]/20">
              <span className="text-[#0F9EDA] text-2xl">
                {"\uD83D\uDEE1\uFE0F"}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Tu Privacidad es Nuestra Prioridad
            </h3>
            <p className="text-base text-gray-600 mb-8 max-w-xl mx-auto">
              Construimos LingText con el compromiso de proteger tus datos y
              respetar tu privacidad en todo momento.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["SQLite local", "Exportar a PC", "Portable"].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-4 py-2 bg-[#0F9EDA]/5 text-[#0F9EDA] text-sm font-medium rounded-full border border-[#0F9EDA]/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
