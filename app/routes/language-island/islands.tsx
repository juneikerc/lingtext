import { Link } from "react-router";

import LanguageIslandsManualManager from "~/components/language-islands/LanguageIslandsManualManager";

import type { Route } from "./+types/islands";

export function meta(_args: Route.MetaArgs) {
  return [
    {
      title:
        "Language Island para aprender inglés | Estudio por oraciones | LingText",
    },
    {
      name: "description",
      content:
        "Crea tus Language Islands con oraciones reales y estudia inglés con traducción contextual y audio por oración en LingText.",
    },
  ];
}

export const links: Route.LinksFunction = () => [
  {
    rel: "canonical",
    href: "https://lingtext.org/aprender-con-language-island",
  },
];

const HOW_TO_STEPS = [
  {
    number: 1,
    title: "Crea tu isla con una intención clara",
    description:
      "Define un tema específico: trabajo, viajes, entrevistas o conversaciones cotidianas para practicar lenguaje útil de forma enfocada.",
    tipLabel: "Tip",
    tipText:
      "Elige un tema que realmente necesites en tu día a día para mantener la motivación alta.",
  },
  {
    number: 2,
    title: "Escribe una oración por línea",
    description:
      "Pega tus oraciones en inglés en el editor. Cada línea se convertirá en una unidad de práctica independiente.",
    tipLabel: "Tip",
    tipText:
      "Empieza con 5 a 10 oraciones cortas. Es más efectivo que llenar la isla de frases largas.",
  },
  {
    number: 3,
    title: "Estudia con traducción y audio",
    description:
      "Abre la isla y trabaja oración por oración con traducción in-line y reproducción TTS para mejorar comprensión y pronunciación.",
    tipLabel: "Tip",
    tipText:
      "Repite en voz alta después de escuchar el audio para mejorar tu pronunciación y entonación.",
  },
];

const BENEFITS = [
  {
    icon: "🎯",
    title: "Práctica hiper-contextual",
    description:
      "Estudias exactamente el tipo de frases que quieres usar en tu vida real, no ejemplos genéricos fuera de contexto.",
    bullets: [
      "Frases de situaciones reales",
      "Vocabulario que realmente usarás",
      "Aprendizaje relevante y práctico",
    ],
  },
  {
    icon: "📊",
    title: "Progreso medible por bloques",
    description:
      "Cada oración es una mini tarea. Puedes repasar y detectar rápidamente en qué estructuras necesitas más trabajo.",
    bullets: [
      "Identifica áreas de mejora",
      "Repaso enfocado en debilidades",
      "Seguimiento claro del avance",
    ],
  },
  {
    icon: "🧠",
    title: "Mejor retención de patrones",
    description:
      "Al repetir oraciones completas, interiorizas gramática y colocaciones naturales en lugar de memorizar palabras sueltas.",
    bullets: [
      "Aprendizaje contextual profundo",
      "Gramática incorporada naturalmente",
      "Colocaciones y frases hechas",
    ],
  },
  {
    icon: "⚡",
    title: "Flujo simple y sin fricción",
    description:
      "En una sola pantalla tienes tus oraciones, traducción por clic y TTS. Menos pasos, más tiempo de práctica efectiva.",
    bullets: [
      "Todo en una pantalla",
      "Traducción instantánea",
      "Audio TTS integrado",
    ],
  },
];

const FAQS = [
  {
    question: "¿Qué es exactamente una Language Island?",
    answer:
      "Es un conjunto corto de oraciones relacionadas con un contexto específico. Te permite practicar lenguaje de alto valor comunicativo para situaciones reales.",
  },
  {
    question: "¿Cuántas oraciones debe tener una isla?",
    answer:
      "Puedes empezar con 5 a 15 oraciones. Lo importante es que sean frecuentes, útiles y que puedas repasarlas con constancia.",
  },
  {
    question: "¿Puedo editar una isla después de guardarla?",
    answer:
      "Sí. Puedes editar título y oraciones en cualquier momento desde la biblioteca de islas.",
  },
  {
    question: "¿Se puede estudiar pronunciación con esta sección?",
    answer:
      "Sí. En la ruta individual de cada isla puedes reproducir audio TTS de cada oración para practicar ritmo y entonación.",
  },
];

export default function LanguageIslandsPage() {
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
              Método por micro-contextos
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Language Island: estudia inglés oración por{" "}
              <span className="text-[#0F9EDA]">oración</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
              Crea tus propias islas con frases de situaciones reales y practica
              comprensión, traducción y pronunciación en un flujo concreto que te
              ayuda a hablar con mayor naturalidad.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#agregar-isla-manual"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F9EDA] px-8 py-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0D8EC4] hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Crear mi primera isla
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
                href="#faq-language-island"
                className="inline-flex items-center justify-center rounded-xl border border-[#0F9EDA]/20 bg-white px-8 py-4 text-sm font-semibold text-[#0F9EDA] transition-colors duration-200 hover:border-[#0F9EDA]/40 hover:bg-[#0F9EDA]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Ver preguntas frecuentes
              </a>
            </div>
          </div>

          <div className="relative lg:justify-self-end">
            <div className="relative rounded-3xl border border-gray-200 bg-white p-5 shadow-lg sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Aprende con el método de islas
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Crea, practica y domina
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

      <LanguageIslandsManualManager />

      <section className="relative overflow-hidden border-b border-gray-200 bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
              <span className="mr-2.5 h-2 w-2 rounded-full bg-[#0F9EDA]" />
              Cómo usar Language Island
            </div>
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Rutina de estudio en{" "}
              <span className="text-[#0F9EDA]">3 pasos</span>
            </h2>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
              Diseña un ciclo corto y repetible para convertir oraciones en
              memoria activa y producción real.
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
              Por qué estudiar con language islands{" "}
              <span className="text-[#0F9EDA]">funciona</span>
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
              Estrategia de estudio
            </div>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900">
              Cómo diseñar islas de alta utilidad
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-gray-600">
              <p>
                Crea islas por situación: presentarte, pedir ayuda, negociar,
                explicar un problema o mantener una charla social. Cuando el tema
                es claro, la retención mejora y el vocabulario se vuelve más
                transferible.
              </p>
              <p>
                Mantén tus oraciones cortas y funcionales al inicio. Luego, añade
                variaciones de tiempo verbal, matices de cortesía y conectores.
                Así entrenas flexibilidad sin perder claridad.
              </p>
              <p>
                Repite cada isla en ciclos breves: leer, traducir, escuchar,
                repetir en voz alta y revisar al día siguiente. La consistencia es
                más importante que la cantidad.
              </p>
            </div>

            <div className="mt-8">
              <Link
                to="/aprender-ingles-con-canciones"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/5 px-6 py-3 text-sm font-semibold text-[#0F9EDA] transition-colors duration-200 hover:border-[#0F9EDA]/40 hover:bg-[#0F9EDA]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                También quiero practicar con canciones
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
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="faq-language-island"
        className="relative overflow-hidden border-b border-gray-200 bg-white py-16 sm:py-24"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
              <span className="mr-2.5 h-2 w-2 rounded-full bg-[#0F9EDA]" />
              FAQ
            </div>
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Preguntas frecuentes sobre{" "}
              <span className="text-[#0F9EDA]">language island</span>
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
    </>
  );
}
