import { Link } from "react-router";
import type { Route } from "./+types/songs";
import SongsManualManager from "~/components/songs/SongsManualManager";

export function meta(_args: Route.MetaArgs) {
  return [
    {
      title:
        "Aprender Inglés con Canciones | Letras + YouTube y Spotify | LingText",
    },
    {
      name: "description",
      content:
        "Aprende inglés con canciones agregando letras manuales y enlaces de YouTube o Spotify. Practica vocabulario real, comprensión y traducción en contexto con LingText.",
    },
  ];
}

export const links: Route.LinksFunction = () => [
  {
    rel: "canonical",
    href: "https://lingtext.org/aprender-ingles-con-canciones",
  },
];

const HOW_TO_STEPS = [
  {
    number: 1,
    title: "Agrega una canción en inglés",
    description:
      "Pega el título, la letra y el enlace de YouTube o Spotify para guardar tu práctica personalizada.",
    tipLabel: "Tip",
    tipText:
      "Empieza con canciones que ya conozcas bien. Así te concentras en las palabras nuevas en lugar de la melodía.",
  },
  {
    number: 2,
    title: "Abre el lector interactivo",
    description:
      "Entra a la canción y reproduce el audio embebido mientras lees la letra completa en paralelo.",
    tipLabel: "Tip",
    tipText:
      "Escucha la canción completa sin leer primero, luego vuelve a reproducirla siguiendo la letra.",
  },
  {
    number: 3,
    title: "Traduce y guarda vocabulario",
    description:
      "Haz clic en palabras o frases para traducirlas y convertirlas en material de repaso activo.",
    tipLabel: "Tip",
    tipText:
      "Después de traducir, intenta escribir tus propias oraciones con las palabras nuevas.",
  },
];

const BENEFITS = [
  {
    icon: "🎵",
    title: "Inglés real y natural",
    description:
      "Las canciones exponen estructuras, vocabulario y pronunciación que sí aparecen en conversaciones reales.",
    bullets: [
      "Lenguaje auténtico y actual",
      "Pronunciación natural de hablantes nativos",
      "Expresiones coloquiales y modismos",
    ],
  },
  {
    icon: "🧠",
    title: "Mejor memoria por repetición",
    description:
      "La música facilita recordar frases completas y patrones gramaticales gracias al ritmo y la repetición.",
    bullets: [
      "El ritmo musical fija patrones",
      "Repetición natural sin aburrimiento",
      "Asociación emocional que mejora retención",
    ],
  },
  {
    icon: "📖",
    title: "Práctica contextual",
    description:
      "No estudias palabras sueltas: entiendes expresiones dentro de una historia y una intención comunicativa.",
    bullets: [
      "Vocabulario en contexto narrativo",
      "Gramática incorporada en las frases",
      "Aprendizaje significativo y duradero",
    ],
  },
  {
    icon: "⚡",
    title: "Flujo de estudio simple",
    description:
      "En una sola pantalla tienes letra, audio embebido y traducción instantánea para estudiar sin fricción.",
    bullets: [
      "Audio y letra sincronizados",
      "Traducción con un clic",
      "Sin cambios de pantalla ni distracciones",
    ],
  },
];

const FAQS = [
  {
    question: "¿Qué enlaces se pueden usar?",
    answer:
      "La herramienta acepta enlaces válidos de YouTube y Spotify. El sistema normaliza el formato para intentar el embebido automáticamente.",
  },
  {
    question: "¿Puedo usar letras de cualquier nivel?",
    answer:
      "Sí. Puedes empezar con canciones lentas y vocabulario frecuente, y luego pasar a letras más complejas según tu nivel.",
  },
  {
    question: "¿Qué hago si un embebido no se reproduce?",
    answer:
      "Algunos contenidos bloquean reproducción embebida por políticas del proveedor. En ese caso, abre la fuente original o prueba otro enlace.",
  },
  {
    question: "¿Por qué aprender inglés con canciones funciona?",
    answer:
      "Porque combina input comprensible, repetición natural, emoción y contexto. Es una forma eficiente de mejorar comprensión y vocabulario.",
  },
];

export default function SongsPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-[5%] top-10 h-72 w-72 rounded-full bg-[#0F9EDA]/10 blur-3xl" />
          <div className="absolute -bottom-24 left-[10%] h-64 w-64 rounded-full bg-[#0F9EDA]/5 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)] lg:px-8">
          <div>
            <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
              <span className="mr-2.5 h-2 w-2 rounded-full bg-[#0F9EDA]" />
              Método práctico con música
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Aprender inglés con canciones: letras, contexto y{" "}
              <span className="text-[#0F9EDA]">práctica real</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
              Usa canciones en inglés para mejorar vocabulario, comprensión y
              pronunciación con un flujo simple: agregas la letra, pegas un
              enlace de YouTube o Spotify, y practicas traducción contextual
              dentro del lector de LingText.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#agregar-cancion-manual"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F9EDA] px-8 py-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0D8EC4] hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Agregar mi primera canción
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M13 7l5 5m0 0-5 5m5-5H6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </a>
              <a
                href="#faq-canciones"
                className="inline-flex items-center justify-center rounded-xl border border-[#0F9EDA]/20 bg-white px-8 py-4 text-sm font-semibold text-[#0F9EDA] transition-colors duration-200 hover:border-[#0F9EDA]/40 hover:bg-[#0F9EDA]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Resolver dudas comunes
              </a>
            </div>
          </div>

          <div className="relative lg:justify-self-end">
            <div className="relative rounded-3xl border border-gray-200 bg-white p-5 shadow-lg sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Aprende con música
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Letras, audio y traducción
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {BENEFITS.slice(0, 3).map((benefit) => (
                  <div
                    key={benefit.title}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#0F9EDA]/20 bg-white text-sm">
                      {benefit.icon}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {benefit.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SongsManualManager />

      <section className="relative overflow-hidden border-b border-gray-200 bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
              <span className="mr-2.5 h-2 w-2 rounded-full bg-[#0F9EDA]" />
              Cómo usar la herramienta
            </div>
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Tu rutina para estudiar inglés con canciones en{" "}
              <span className="text-[#0F9EDA]">3 pasos</span>
            </h2>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
              Sigue este flujo para convertir cualquier canción en una sesión de
              lectura y vocabulario enfocada en progreso real.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {HOW_TO_STEPS.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 text-lg font-bold text-[#0F9EDA]">
                  {step.number}
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  {step.title}
                </h3>
                <p className="mb-4 text-base leading-relaxed text-gray-700">
                  {step.description}
                </p>
                <div className="rounded-xl border border-[#0F9EDA]/10 bg-[#0F9EDA]/5 p-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-[#0F9EDA]">
                      {step.tipLabel}:
                    </span>{" "}
                    {step.tipText}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-gray-200 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
              <span className="mr-2.5 h-2 w-2 rounded-full bg-[#0F9EDA]" />
              Ventajas clave
            </div>
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Beneficios de aprender inglés con letras de{" "}
              <span className="text-[#0F9EDA]">canciones</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/10">
                  <span className="text-xl">{benefit.icon}</span>
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="mb-6 leading-relaxed text-gray-600">
                  {benefit.description}
                </p>
                <div className="space-y-2.5">
                  {benefit.bullets.map((bullet) => (
                    <div
                      key={bullet}
                      className="flex items-center text-sm text-gray-700"
                    >
                      <span className="mr-3 h-1.5 w-1.5 rounded-full bg-[#0F9EDA]" />
                      {bullet}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-gray-200 bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-12">
            <div className="mb-8 inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
              <span className="mr-2.5 h-2 w-2 rounded-full bg-[#0F9EDA]" />
              Recomendaciones prácticas
            </div>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900">
              Qué canciones elegir para progresar más rápido
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-gray-600">
              <p>
                Para un progreso constante, empieza con canciones de tempo
                moderado, frases repetidas y pronunciación clara. Esto facilita
                reconocer estructuras gramaticales y expresiones comunes.
              </p>
              <p>
                Si estás en nivel básico-intermedio, prioriza pop, acústico o
                baladas con narrativa simple. En niveles avanzados, puedes usar
                rap, indie o letras con metáforas para ampliar comprensión
                semántica.
              </p>
              <p>
                Lo importante no es la complejidad inicial, sino la constancia.
                Trabaja cada canción en ciclos cortos: escucha, lectura,
                traducción y repaso de vocabulario.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="faq-canciones"
        className="relative overflow-hidden border-b border-gray-200 bg-white py-16 sm:py-24"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
              <span className="mr-2.5 h-2 w-2 rounded-full bg-[#0F9EDA]" />
              FAQ
            </div>
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Preguntas frecuentes sobre aprender inglés con{" "}
              <span className="text-[#0F9EDA]">canciones</span>
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm transition-shadow duration-200 hover:shadow-md [&[open]]:shadow-md"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-gray-900">
                  <span>{faq.question}</span>
                  <svg
                    className="h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 9l-7 7-7-7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-gray-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/10">
              <span className="text-2xl">🎵</span>
            </div>
            <h3 className="mb-4 text-2xl font-bold text-gray-900">
              Convierte tu música favorita en una rutina de inglés
            </h3>
            <p className="mx-auto mb-8 max-w-xl text-base text-gray-600">
              Empieza hoy con una canción que ya conozcas y úsala para practicar
              lectura, comprensión y vocabulario en un solo flujo.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#agregar-cancion-manual"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F9EDA] px-8 py-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0D8EC4] hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Comenzar ahora
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M13 7l5 5m0 0-5 5m5-5H6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </a>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-xl border border-[#0F9EDA]/20 bg-white px-8 py-4 text-sm font-semibold text-[#0F9EDA] transition-colors duration-200 hover:border-[#0F9EDA]/40 hover:bg-[#0F9EDA]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
