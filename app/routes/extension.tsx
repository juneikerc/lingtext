import { Link } from "react-router";
import type { Route } from "./+types/extension";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title:
        "LingText for YouTube — Aprende inglés con subtítulos | Extensión Chrome",
    },
    {
      name: "description",
      content:
        "Extensión de Chrome que transforma YouTube en tu lector de inglés. Traduce subtítulos al instante, guarda palabras y sincroniza con LingText.",
    },
  ];
}

export const links: Route.LinksFunction = () => [
  {
    rel: "canonical",
    href: "https://lingtext.org/extension",
  },
];

const CHROME_STORE_URL =
  "https://chromewebstore.google.com/detail/lingtext-for-youtube/phnakkjkhjmobonjiebnbhdknckmobhn";

const features = [
  {
    icon: "\uD83C\uDFA5",
    title: "Subtítulos Interactivos",
    description:
      "Cada palabra del subtítulo se vuelve clickeable. Haz clic para ver la traducción al instante sin pausar el video.",
    bullets: [
      "Traducción palabra por palabra",
      "Traducción de frases completas",
      "Sin interrumpir la reproducción",
    ],
  },
  {
    icon: "\uD83D\uDCBE",
    title: "Guarda Vocabulario",
    description:
      "Marca palabras nuevas mientras ves videos. Quedan guardadas con su contexto y traducción para repasar después.",
    bullets: [
      "Guardado con un clic",
      "Contexto de la frase original",
      "Repaso con repetición espaciada",
    ],
  },
  {
    icon: "\uD83D\uDD17",
    title: "Sincronización con LingText",
    description:
      "Tu vocabulario guardado en la extensión se sincroniza automáticamente con tu cuenta de LingText. Todo unificado.",
    bullets: [
      "Sync bidireccional automático",
      "Fusión inteligente de datos",
      "Web como fuente de verdad",
    ],
  },
  {
    icon: "\uD83D\uDD27",
    title: "Configuración Flexible",
    description:
      "Elige entre Chrome AI (local) o OpenRouter para traducciones. Configura el idioma de los subtítulos y oculta los nativos.",
    bullets: [
      "Traducción local con Chrome AI",
      "OpenRouter como alternativa",
      "Control sobre subtítulos nativos",
    ],
  },
];

const steps = [
  {
    number: 1,
    emoji: "\uD83D\uDCE6",
    title: "Instala la Extensión",
    badge: "Paso 1",
    description:
      "Añade <strong>LingText for YouTube</strong> desde la Chrome Web Store. Es gratuito y se instala en segundos. Aparecerá un ícono en tu barra de extensiones.",
    tip: {
      label: "Tip",
      text: "Fija el ícono en la barra para acceso rápido al popup de configuración.",
    },
  },
  {
    number: 2,
    emoji: "\uD83C\uDFA5",
    title: "Abre un Video en YouTube",
    badge: "Paso 2",
    description:
      "Activa los subtítulos en inglés en cualquier video de YouTube. La extensión inyectará automáticamente un lector interactivo sobre los subtítulos nativos.",
    tip: {
      label: "Nota",
      text: 'Puedes ocultar los subtítulos nativos de YouTube desde el popup para una experiencia más limpia con la opción "Ocultar CC nativo".',
    },
  },
  {
    number: 3,
    emoji: "\uD83D\uDD0D",
    title: "Haz Clic para Traducir",
    badge: "Lectura activa",
    description:
      "Cada palabra del subtítulo es clickeable. Haz clic para ver su traducción. También puedes seleccionar una frase completa para traducirla en bloque. Las traducciones aparecen sin pausar el video.",
    tip: {
      label: "Objetivo",
      text: "Convertir cada video de YouTube en una sesión de aprendizaje activa.",
    },
  },
  {
    number: 4,
    emoji: "\uD83D\uDCBE",
    title: "Guarda y Sincroniza",
    badge: "Vocabulario",
    description:
      "Las palabras que marques como desconocidas quedan guardadas en la extensión. Abre el popup y pulsa <strong>Sincronizar</strong> para enviar tu vocabulario a LingText, donde podrás repasarlas con el algoritmo SM-2.",
    tip: {
      label: "Sincronización",
      text: "Necesitas tener LingText abierto en una pestaña para sincronizar. Si no hay una pestaña abierta, la extensión abrirá una automáticamente.",
    },
  },
];

export default function ExtensionLanding() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <SyncSection />
      <FinalCTASection />
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white border-b border-gray-200 py-20 md:py-28 px-4">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] left-[10%] w-72 h-72 bg-[#0F9EDA]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[15%] w-96 h-96 bg-[#0F9EDA]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Contenido izquierdo */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center px-4 py-2 mb-8 text-sm font-medium text-gray-700 bg-white rounded-full border border-gray-200 shadow-sm">
            <span className="w-2 h-2 bg-[#0F9EDA] rounded-full mr-2.5"></span>
            Extensión de Chrome
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight text-gray-900">
            Aprende inglés con{" "}
            <span className="text-[#0F9EDA]">YouTube</span>
          </h1>

          <p className="text-xl md:text-2xl leading-relaxed text-gray-600 mb-10">
            LingText for YouTube transforma los subtítulos en tu lector
            interactivo. Traduce, guarda palabras y sincroniza con tu
            biblioteca de LingText.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#0F9EDA] text-white font-semibold rounded-xl hover:bg-[#0D8EC4] transition-all duration-200 shadow-sm hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" />
                <line x1="21.17" y1="8" x2="12" y2="8" />
                <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
                <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
              </svg>
              Añadir a Chrome — Gratis
            </a>
            <a
              href="#como-funciona"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-[#0F9EDA] hover:text-[#0F9EDA] transition-all duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              Cómo Funciona
            </a>
          </div>
        </div>

        {/* Ilustración derecha — Mockup del popup */}
        <div className="relative h-[420px] lg:h-[520px] flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-80 h-80 bg-[#0F9EDA]/5 rounded-full blur-3xl"></div>
          </div>

          {/* Browser mockup con subtítulos */}
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 overflow-hidden">
            {/* Barra superior del navegador */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/60"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/60"></div>
              </div>
              <div className="flex-1 mx-3 h-5 rounded-md bg-gray-100 flex items-center px-3">
                <span className="text-[10px] text-gray-400">
                  youtube.com/watch?v=...
                </span>
              </div>
              {/* Extension icon */}
              <div className="w-5 h-5 rounded bg-[#0F9EDA]/10 flex items-center justify-center">
                <span className="text-[8px] font-bold text-[#0F9EDA]">LT</span>
              </div>
            </div>

            {/* Simulación de video */}
            <div className="relative bg-gray-900 aspect-video flex items-end justify-center pb-16">
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg
                    className="w-5 h-5 text-white ml-0.5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              </div>

              {/* Subtítulos interactivos simulados */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 rounded-lg px-4 py-2 max-w-xs">
                <p className="text-sm text-center leading-relaxed">
                  <SubtitleWord word="The" />{" "}
                  <SubtitleWord word="future" active />{" "}
                  <SubtitleWord word="of" />{" "}
                  <SubtitleWord word="language" />{" "}
                  <SubtitleWord word="learning" active />
                </p>
              </div>

              {/* Tooltip de traducción */}
              <div
                className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white rounded-xl border border-gray-200 shadow-lg px-3 py-2 z-10"
                style={{ animation: "floatY 3s ease-in-out infinite" }}
              >
                <p className="text-xs font-semibold text-gray-800">
                  future
                </p>
                <p className="text-xs text-[#0F9EDA]">futuro</p>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-white border-r border-b border-gray-200"></div>
              </div>
            </div>

            {/* Popup simulado */}
            <div className="p-4 space-y-3 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#0F9EDA]/10 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-[#0F9EDA]">
                    LT
                  </span>
                </div>
                <span className="text-xs font-semibold text-gray-700">
                  LingText for YouTube
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                  <span className="text-lg font-bold text-[#0F9EDA]">24</span>
                  <p className="text-[10px] text-gray-500">Palabras</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                  <span className="text-lg font-bold text-[#0F9EDA]">8</span>
                  <p className="text-[10px] text-gray-500">Frases</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SubtitleWord({ word, active }: { word: string; active?: boolean }) {
  return (
    <span
      className={`cursor-default transition-colors duration-200 ${
        active
          ? "text-[#0F9EDA] font-semibold border-b border-dashed border-[#0F9EDA]/50"
          : "text-white"
      }`}
    >
      {word}
    </span>
  );
}

function FeaturesSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 bg-white border-b border-gray-200">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#0F9EDA]/5 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#0F9EDA]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 bg-gray-50 rounded-full border border-gray-200">
            <span className="w-2 h-2 bg-[#0F9EDA] rounded-full mr-2.5"></span>
            Características
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
            YouTube como tu{" "}
            <span className="text-[#0F9EDA]">aula de inglés</span>
          </h2>
          <p className="text-xl leading-relaxed text-gray-600 max-w-3xl mx-auto">
            Convierte cualquier video en una sesión de aprendizaje activa.
            Subtítulos interactivos, guardado de vocabulario y sincronización
            con tu biblioteca.
          </p>
        </div>

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
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section
      id="como-funciona"
      className="relative overflow-hidden py-20 sm:py-24 bg-gray-50 border-b border-gray-200"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-[#0F9EDA]/5 blur-3xl"></div>
        <div className="absolute -bottom-24 right-1/3 h-96 w-96 rounded-full bg-[#0F9EDA]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 bg-white rounded-full border border-gray-200 shadow-sm">
            <span className="w-2 h-2 bg-[#0F9EDA] rounded-full mr-2.5"></span>
            Guía Rápida
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
            Listo en <span className="text-[#0F9EDA]">4 pasos</span>
          </h2>
          <p className="text-xl leading-relaxed text-gray-600 max-w-3xl mx-auto">
            Instala la extensión y empieza a aprender con YouTube en menos de un
            minuto.
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-8"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#0F9EDA]/10 rounded-xl flex items-center justify-center text-[#0F9EDA] font-bold text-lg border border-[#0F9EDA]/20">
                  {step.number}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center flex-wrap gap-2">
                    <span>
                      {step.emoji} {step.title}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      {step.badge}
                    </span>
                  </h3>
                  <p
                    className="text-base text-gray-700 leading-relaxed mb-4"
                    dangerouslySetInnerHTML={{ __html: step.description }}
                  />
                  <div className="bg-[#0F9EDA]/5 rounded-xl p-4 border border-[#0F9EDA]/10">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-[#0F9EDA]">
                        {step.tip.label}:
                      </span>{" "}
                      {step.tip.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SyncSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 bg-white border-b border-gray-200">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-[#0F9EDA]/5 blur-3xl"></div>
        <div className="absolute -bottom-24 left-1/4 h-96 w-96 rounded-full bg-[#0F9EDA]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 bg-gray-50 rounded-full border border-gray-200">
            <span className="w-2 h-2 bg-[#0F9EDA] rounded-full mr-2.5"></span>
            Sincronización
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
            Extensión + Web,{" "}
            <span className="text-[#0F9EDA]">todo unificado</span>
          </h2>
          <p className="text-xl leading-relaxed text-gray-600 max-w-3xl mx-auto">
            El vocabulario que guardes en YouTube aparece en tu biblioteca de
            LingText. Repasa con el algoritmo SM-2, exporta a CSV y lleva tu
            progreso a donde quieras.
          </p>
        </div>

        {/* Diagrama de flujo simplificado */}
        <div className="grid gap-6 md:grid-cols-3 mb-16">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-6 bg-[#0F9EDA]/10 rounded-2xl flex items-center justify-center border border-[#0F9EDA]/20">
              <span className="text-[#0F9EDA] text-2xl">
                {"\uD83C\uDFA5"}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Mira YouTube
            </h3>
            <p className="text-sm text-gray-600">
              Subtítulos interactivos, traducción y guardado de palabras.
            </p>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#0F9EDA]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-6 bg-[#0F9EDA]/10 rounded-2xl flex items-center justify-center border border-[#0F9EDA]/20">
              <span className="text-[#0F9EDA] text-2xl">
                {"\uD83D\uDD17"}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Sincroniza
            </h3>
            <p className="text-sm text-gray-600">
              Pulsa sync en el popup para enviar tu vocabulario a LingText.
            </p>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#0F9EDA]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-6 bg-[#0F9EDA]/10 rounded-2xl flex items-center justify-center border border-[#0F9EDA]/20">
              <span className="text-[#0F9EDA] text-2xl">
                {"\uD83D\uDCDA"}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Repasa en LingText
            </h3>
            <p className="text-sm text-gray-600">
              Repetición espaciada con SM-2, lectura en contexto y exportación.
            </p>
          </div>
        </div>

        {/* Tags de confianza */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 shadow-sm p-8 sm:p-12 text-center">
          <div className="w-14 h-14 mx-auto mb-6 bg-[#0F9EDA]/10 rounded-2xl flex items-center justify-center border border-[#0F9EDA]/20">
            <span className="text-[#0F9EDA] text-2xl">
              {"\uD83D\uDEE1\uFE0F"}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Tus Datos, Siempre Bajo Tu Control
          </h3>
          <p className="text-base text-gray-600 mb-8 max-w-xl mx-auto">
            La extensión almacena datos localmente. La web es la fuente de
            verdad. Puedes exportar tu base de datos SQLite desde LingText en
            cualquier momento.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Datos locales", "Sync seguro", "Exportar SQLite", "Privado"].map(
              (tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-4 py-2 bg-[#0F9EDA]/5 text-[#0F9EDA] text-sm font-medium rounded-full border border-[#0F9EDA]/10"
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 h-64 w-64 rounded-full bg-[#0F9EDA]/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-[#0F9EDA]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 bg-gray-50 rounded-full border border-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 text-[#0F9EDA]"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <line x1="21.17" y1="8" x2="12" y2="8" />
            <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
            <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
          </svg>
          LingText for YouTube
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
          Empieza a aprender{" "}
          <span className="text-[#0F9EDA]">hoy</span>
        </h2>

        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Añade la extensión gratuita y transforma cada video de YouTube en una
          oportunidad para mejorar tu inglés.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={CHROME_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0F9EDA] text-white font-semibold rounded-xl hover:bg-[#0D8EC4] transition-all duration-200 shadow-sm hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="4" />
              <line x1="21.17" y1="8" x2="12" y2="8" />
              <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
              <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
            </svg>
            Añadir a Chrome — Gratis
          </a>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#0F9EDA] font-semibold rounded-xl border border-[#0F9EDA]/20 hover:border-[#0F9EDA]/40 hover:bg-[#0F9EDA]/5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Explorar LingText
          </Link>
        </div>
      </div>
    </section>
  );
}
