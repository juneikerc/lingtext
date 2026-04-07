import type { Route } from "./+types/blogPage";
import { Link } from "react-router";
import { allBlogManifests } from "~/lib/content/runtime";
import type { BlogManifestEntry } from "~/lib/content/types";

export function loader() {
  return allBlogManifests;
}

export function meta() {
  return [
    {
      title:
        "Blog sobre aprendizaje de inglés: Estrategias y Recursos | LingText",
    },
    {
      name: "description",
      content:
        "Mejora tu inglés con LingText. Artículos sobre estrategias de aprendizaje, vocabulario en contexto, gramática práctica y consejos para dominar el idioma.",
    },
    {
      tagName: "link",
      rel: "canonical",
      href: `https://lingtext.org/blog`,
    },
  ];
}

export default function Blog({ loaderData }: Route.ComponentProps) {
  const blogs = loaderData;

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden py-16 sm:py-24 border-b border-gray-200">
        {/* Decorative Blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#0F9EDA]/5]/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav className="mb-8">
            <a
              href="/"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-[#0F9EDA]] transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver al inicio
            </a>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-6">
            Blog de Aprendizaje de Inglés
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600">
            Explora estrategias, recursos gratuitos y consejos prácticos para
            mejorar tu comprensión y fluidez en inglés de manera efectiva.
          </p>
        </div>
      </header>

      {/* Articles Grid */}
      <section className="py-16 sm:py-20 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog: BlogManifestEntry) => (
              <article
                key={blog.slug}
                className="group relative flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition duration-200"
              >
                <Link
                  to={`/blog/${blog.slug}`}
                  className="flex flex-col h-full p-6 sm:p-8"
                >
                  <div className="flex-1">
                    <div className="mb-4 flex flex-wrap gap-2">
                      {blog.tags?.map((tag: string) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-[#0F9EDA]/5]/10 text-[#0A7AAB]] rounded-full border border-[#0F9EDA]/20]/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0F9EDA]] transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3 mb-6">
                      {blog.metaDescription}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center text-sm font-medium text-[#0F9EDA]]">
                    Leer más
                    <svg
                      className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Sections */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              ¿Por qué seguir el blog de LingText?
            </h2>
            <div className="space-y-12">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Aprendizaje basado en contenido real
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  En LingText creemos que la mejor forma de aprender inglés es a
                  través de la inmersión en contenido que te interese. Nuestro
                  blog complementa esta filosofía ofreciendo guías sobre cómo
                  aprovechar textos, videos y herramientas de IA para acelerar
                  tu adquisición del lenguaje.
                </p>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Estrategias de Repetición Espaciada
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  No se trata solo de leer, sino de recordar lo que aprendes.
                  Exploramos técnicas avanzadas como el sistema SM-2 y cómo
                  aplicarlo a tu vocabulario diario para que las nuevas palabras
                  se queden en tu memoria a largo plazo.
                </p>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Tecnología y Lingüística
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Te mantenemos al tanto de cómo la tecnología puede ser tu
                  mejor aliada en el camino hacia la fluidez.
                </p>
              </div>
            </div>

            {/* Final CTA-like SEO block */}
            <div className="mt-20 p-8 bg-gray-50 rounded-2xl border border-gray-200 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Lleva tu inglés al siguiente nivel
              </h3>
              <p className="text-gray-600 mb-8">
                LingText no es solo un blog, es una herramienta completa para
                leer, ver y aprender. Únete a cientos de estudiantes que ya
                están mejorando su comprensión lectora y auditiva.
              </p>
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#0F9EDA] text-white font-medium hover:bg-[#0D8EC4] transition-colors duration-200 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Comenzar a aprender gratis
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>
          © {new Date().getFullYear()} LingText. Tu compañero en el aprendizaje
          de idiomas.
        </p>
      </footer>
    </main>
  );
}
