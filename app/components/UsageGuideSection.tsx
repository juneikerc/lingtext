import { Link } from "react-router";

const steps = [
  {
    number: 1,
    emoji: "\uD83D\uDCDA",
    title: "Crea tu Biblioteca",
    badge: "Paso inicial",
    description:
      "Desde la portada, añade un nuevo texto: elige un título y pega contenido o importa un fichero <code>.txt</code>. Si dispones de audio del texto, puedes adjuntarlo por URL o como archivo local para practicar lectura y escucha al mismo tiempo.",
    tip: {
      label: "Tip",
      text: "Comienza con textos que te interesen realmente. La motivación es clave para el aprendizaje efectivo.",
    },
  },
  {
    number: 2,
    emoji: "\uD83D\uDCD6",
    title: "Lee con Traducción y TTS",
    badge: "Lectura activa",
    description:
      "Abre el lector y haz clic en cualquier palabra para ver su traducción al instante. También puedes seleccionar una frase completa para traducirla en bloque. Pulsa el icono de sonido para escuchar la pronunciación (TTS) y ajusta la voz o la velocidad en los ajustes de la app.",
    tip: {
      label: "Objetivo",
      text: "Convertir cada página en una sesión de aprendizaje activa sin interrumpir el flujo de lectura.",
    },
  },
  {
    number: 3,
    emoji: "\uD83D\uDCBE",
    title: "Guarda y Repasa Palabras",
    badge: "Vocabulario",
    description:
      "Cuando una palabra sea nueva para ti, márcala como <em>desconocida</em>. Quedará guardada en SQLite junto con su traducción y datos de repetición espaciada. Ve a <strong>/review</strong> para repasar con el algoritmo SM-2, o exporta a CSV para Anki.",
    tip: {
      label: "Repetición espaciada",
      text: "El algoritmo SM-2 calcula el momento óptimo para repasar cada palabra.",
    },
  },
  {
    number: 4,
    emoji: "\uD83D\uDCBE",
    title: "Exporta tus Datos",
    badge: "Backup",
    description:
      "Desde la biblioteca, usa los botones <em>Exportar</em> e <em>Importar</em> para guardar tu base de datos SQLite en tu PC o restaurarla desde otro dispositivo. Tus datos son tuyos.",
    tip: {
      label: "Privacidad",
      text: "Todo se guarda localmente. El archivo .sqlite es portable y estándar.",
    },
  },
  {
    number: 5,
    emoji: "\u2728",
    title: "Genera Historias Personalizadas",
    badge: "Práctica en Contexto",
    badgePrimary: true,
    description:
      "Desde la sección <strong>Palabras</strong>, selecciona hasta <em>20 palabras</em> de tu vocabulario y usa el generador para crear textos personalizados. Elige el tipo (cuento, artículo, conversación, etc.), tema personalizado y nivel CEFR (A2-C2). La IA creará textos que contengan tus palabras en <strong>bold</strong>, reforzando el aprendizaje en contexto.",
    tip: {
      label: "Tip",
      text: "Los textos generados se guardan automáticamente en tu biblioteca y puedes leerlos con todas las funcionalidades del lector (traducción, TTS, marca de palabras).",
    },
  },
];

export default function UsageGuideSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 bg-white border-b border-gray-200">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-[#0F9EDA]/5 blur-3xl"></div>
        <div className="absolute -bottom-24 right-1/3 h-96 w-96 rounded-full bg-[#0F9EDA]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 bg-gray-50 rounded-full border border-gray-200">
            <span className="w-2 h-2 bg-[#0F9EDA] rounded-full mr-2.5"></span>
            Guía de Uso
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
            Comienza en <span className="text-[#0F9EDA]">Minutos</span>
          </h2>
          <p className="text-xl leading-relaxed text-gray-600 max-w-3xl mx-auto">
            LingText está diseñado para que aprendas en flujo. Sigue estos pasos
            y estarás aprendiendo inglés de inmediato.
          </p>
        </div>

        {/* Pasos */}
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
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        step.badgePrimary
                          ? "bg-[#0F9EDA]/10 text-[#0F9EDA] border border-[#0F9EDA]/20"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
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

        {/* CTA de ayuda */}
        <div className="text-center mt-16">
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 sm:p-12">
            <div className="w-14 h-14 mx-auto mb-6 bg-[#0F9EDA]/10 rounded-2xl flex items-center justify-center border border-[#0F9EDA]/20">
              <span className="text-[#0F9EDA] text-2xl">?</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Necesitas Ayuda?
            </h3>
            <p className="text-base text-gray-600 mb-8 max-w-xl mx-auto">
              Explora la documentación completa o únete a nuestra comunidad de
              estudiantes de inglés.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/comunidad"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[#0F9EDA] text-white font-semibold hover:bg-[#0D8EC4] transition-colors duration-200 shadow-sm hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
              >
                Comunidad
              </Link>
              <Link
                to="/contacto"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:border-[#0F9EDA] hover:text-[#0F9EDA] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
              >
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
