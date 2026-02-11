import { Link } from "react-router";
import type { Route } from "./+types/songs";
import SongsManualManager from "~/components/songs/SongsManualManager";

export function meta({}: Route.MetaArgs) {
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
    title: "1. Agrega una canción en inglés",
    description:
      "Pega el título, la letra y el enlace de YouTube o Spotify para guardar tu práctica personalizada.",
  },
  {
    title: "2. Abre el lector interactivo",
    description:
      "Entra a la canción y reproduce el audio embebido mientras lees la letra completa en paralelo.",
  },
  {
    title: "3. Traduce y guarda vocabulario",
    description:
      "Haz clic en palabras o frases para traducirlas y convertirlas en material de repaso activo.",
  },
];

const BENEFITS = [
  {
    title: "Inglés real y natural",
    description:
      "Las canciones exponen estructuras, vocabulario y pronunciación que sí aparecen en conversaciones reales.",
  },
  {
    title: "Mejor memoria por repetición",
    description:
      "La música facilita recordar frases completas y patrones gramaticales gracias al ritmo y la repetición.",
  },
  {
    title: "Práctica contextual",
    description:
      "No estudias palabras sueltas: entiendes expresiones dentro de una historia y una intención comunicativa.",
  },
  {
    title: "Flujo de estudio simple",
    description:
      "En una sola pantalla tienes letra, audio embebido y traducción instantánea para estudiar sin fricción.",
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
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <section className="relative overflow-hidden py-16 px-4 md:py-24 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[18%] left-[12%] w-72 h-72 bg-indigo-500/10 dark:bg-indigo-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[15%] right-[10%] w-72 h-72 bg-sky-500/10 dark:bg-sky-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-800">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
            Método práctico con música
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 dark:text-gray-100">
            Aprender inglés con canciones: letras, contexto y práctica real
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
            Usa canciones en inglés para mejorar vocabulario, comprensión y
            pronunciación con un flujo simple: agregas la letra, pegas un enlace
            de YouTube o Spotify, y practicas traducción contextual dentro del
            lector de LingText.
          </p>

          <p className="mt-4 text-base text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
            Esta herramienta está diseñada para estudiar inglés con contenido
            que ya te gusta, aprovechar la repetición natural de la música y
            convertir cada canción en una sesión efectiva de aprendizaje.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#agregar-cancion-manual"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
            >
              Agregar mi primera canción
            </a>
            <a
              href="#faq-canciones"
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 dark:border-gray-700 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
            >
              Resolver dudas comunes
            </a>
          </div>
        </div>
      </section>

      <SongsManualManager />

      <section className="relative overflow-hidden py-16 sm:py-20 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-6xl px-6">
          <header className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
              Cómo usar la herramienta
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
              Tu rutina para estudiar inglés con canciones en 3 pasos
            </h2>
            <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
              Sigue este flujo para convertir cualquier canción en una sesión de
              lectura y vocabulario enfocada en progreso real.
            </p>
          </header>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_TO_STEPS.map((step) => (
              <article
                key={step.title}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6"
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

      <section className="relative overflow-hidden py-16 sm:py-20 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-6xl px-6">
          <header className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
              Ventajas clave
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
              Beneficios de aprender inglés con letras de canciones
            </h2>
          </header>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {BENEFITS.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6"
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

      <section className="relative overflow-hidden py-16 sm:py-20 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-5xl px-6">
          <header className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
              Recomendaciones prácticas
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
              Qué canciones elegir para progresar más rápido
            </h2>
          </header>

          <div className="mt-8 space-y-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">
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
      </section>

      <section
        id="faq-canciones"
        className="relative overflow-hidden py-16 sm:py-20 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800"
      >
        <div className="mx-auto max-w-5xl px-6">
          <header className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
              Preguntas frecuentes sobre aprender inglés con canciones
            </h2>
          </header>

          <div className="mt-10 space-y-4">
            {FAQS.map((faq) => (
              <details
                key={faq.question}
                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-5"
              >
                <summary className="cursor-pointer list-none text-base font-semibold text-gray-900 dark:text-gray-100">
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

      <section className="relative overflow-hidden py-16 sm:py-20 bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
            Convierte tu música favorita en una rutina de inglés
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Empieza hoy con una canción que ya conozcas y úsala para practicar
            lectura, comprensión y vocabulario en un solo flujo.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#agregar-cancion-manual"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
            >
              Comenzar ahora
            </a>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 dark:border-gray-700 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
