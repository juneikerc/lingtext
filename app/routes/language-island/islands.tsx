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
    title: "1. Crea tu isla con una intención clara",
    description:
      "Define un tema específico: trabajo, viajes, entrevistas o conversaciones cotidianas para practicar lenguaje útil de forma enfocada.",
  },
  {
    title: "2. Escribe una oración por línea",
    description:
      "Pega tus oraciones en inglés en el editor. Cada línea se convertirá en una unidad de práctica independiente.",
  },
  {
    title: "3. Estudia con traducción y audio",
    description:
      "Abre la isla y trabaja oración por oración con traducción in-line y reproducción TTS para mejorar comprensión y pronunciación.",
  },
];

const BENEFITS = [
  {
    title: "Práctica hiper-contextual",
    description:
      "Estudias exactamente el tipo de frases que quieres usar en tu vida real, no ejemplos genéricos fuera de contexto.",
  },
  {
    title: "Progreso medible por bloques",
    description:
      "Cada oración es una mini tarea. Puedes repasar y detectar rápidamente en qué estructuras necesitas más trabajo.",
  },
  {
    title: "Mejor retención de patrones",
    description:
      "Al repetir oraciones completas, interiorizas gramática y colocaciones naturales en lugar de memorizar palabras sueltas.",
  },
  {
    title: "Flujo simple y sin fricción",
    description:
      "En una sola pantalla tienes tus oraciones, traducción por clic y TTS. Menos pasos, más tiempo de práctica efectiva.",
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
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <section className="relative overflow-hidden border-b border-gray-200 bg-white px-4 py-16 dark:border-gray-800 dark:bg-gray-950 md:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-[12%] top-[18%] h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-400/5"></div>
          <div className="absolute bottom-[15%] right-[10%] h-72 w-72 rounded-full bg-sky-500/10 blur-3xl dark:bg-sky-400/5"></div>
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            <span className="mr-2 h-2 w-2 rounded-full bg-indigo-500"></span>
            Método por micro-contextos
          </div>

          <h1 className="text-4xl font-extrabold leading-tight text-gray-900 dark:text-gray-100 md:text-5xl lg:text-6xl">
            Language Island: estudia inglés oración por oración
          </h1>

          <p className="mx-auto mt-6 max-w-4xl text-lg leading-relaxed text-gray-600 dark:text-gray-400 md:text-xl">
            Crea tus propias islas con frases de situaciones reales y practica
            comprensión, traducción y pronunciación en un flujo concreto que te
            ayuda a hablar con mayor naturalidad.
          </p>

          <p className="mx-auto mt-4 max-w-4xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
            Cada oración se convierte en una unidad de práctica independiente,
            ideal para consolidar estructuras frecuentes y acelerar tu progreso
            en inglés funcional.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#agregar-isla-manual"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
            >
              Crear mi primera isla
            </a>
            <a
              href="#faq-language-island"
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-950"
            >
              Ver preguntas frecuentes
            </a>
          </div>
        </div>
      </section>

      <LanguageIslandsManualManager />

      <section className="relative overflow-hidden border-b border-gray-200 bg-gray-50 py-16 dark:border-gray-800 dark:bg-gray-950 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <header className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
              Cómo usar Language Island
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
              Rutina de estudio en 3 pasos
            </h2>
            <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
              Diseña un ciclo corto y repetible para convertir oraciones en
              memoria activa y producción real.
            </p>
          </header>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {HOW_TO_STEPS.map((step) => (
              <article
                key={step.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-950 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <header className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
              Ventajas clave
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
              Por qué estudiar con language islands funciona
            </h2>
          </header>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {BENEFITS.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-gray-200 bg-gray-50 py-16 dark:border-gray-800 dark:bg-gray-950 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <header className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
              Estrategia de estudio
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
              Cómo diseñar islas de alta utilidad
            </h2>
          </header>

          <div className="mt-8 space-y-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">
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
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-950"
            >
              También quiero practicar con canciones
            </Link>
          </div>
        </div>
      </section>

      <section
        id="faq-language-island"
        className="relative overflow-hidden border-b border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-950 sm:py-20"
      >
        <div className="mx-auto max-w-5xl px-6">
          <header className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
              Preguntas frecuentes sobre language island
            </h2>
          </header>

          <div className="mt-10 space-y-4">
            {FAQS.map((faq) => (
              <details
                key={faq.question}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900"
              >
                <summary className="list-none cursor-pointer text-base font-semibold text-gray-900 dark:text-gray-100">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
