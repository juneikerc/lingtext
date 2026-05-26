import type { Route } from "./+types/blogPage";
import { Link } from "react-router";
import { allBlogManifests } from "~/lib/content/runtime";
import type { BlogManifestEntry } from "~/lib/content/types";

const dateFormatter = new Intl.DateTimeFormat("es", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const formatBlogDate = (date: string) =>
  dateFormatter.format(new Date(`${date}T00:00:00`));

export function loader() {
  return [...allBlogManifests].sort(
    (a, b) =>
      new Date(`${b.updatedAt}T00:00:00`).getTime() -
      new Date(`${a.updatedAt}T00:00:00`).getTime()
  );
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
  const [featuredBlog, ...remainingBlogs] = blogs;

  return (
    <main className="min-h-screen bg-gray-50 text-gray-950">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <nav className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center rounded-lg text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver al inicio
            </Link>
          </nav>

          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#0F9EDA]">
              Guías y recursos
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
              Blog de Aprendizaje de Inglés
            </h1>
            <p className="mt-5 text-lg leading-8 text-gray-600">
              Estrategias, recursos gratuitos y consejos prácticos para mejorar
              tu comprensión y fluidez en inglés con contenido real.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {featuredBlog ? (
            <article className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-200 hover:border-gray-300">
              <Link
                to={`/blog/${featuredBlog.slug}`}
                className="grid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 md:grid-cols-[1.05fr_1fr]"
              >
                <div className="aspect-[16/10] overflow-hidden bg-gray-100 md:aspect-auto">
                  <img
                    crossOrigin="anonymous"
                    src={featuredBlog.image}
                    alt={featuredBlog.title}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.01]"
                    decoding="async"
                    loading="eager"
                  />
                </div>
                <div className="flex min-h-[320px] flex-col justify-center p-6 sm:p-10 lg:p-14">
                  <div className="mb-5 flex flex-wrap gap-2">
                    {featuredBlog.tags?.slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full border border-[#0F9EDA]/20 bg-[#0F9EDA]/10 px-2.5 py-1 text-xs font-medium text-[#0A7AAB]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-gray-950 sm:text-4xl">
                    {featuredBlog.title}
                  </h2>
                  <p className="mt-5 line-clamp-3 max-w-2xl text-base leading-7 text-gray-600">
                    {featuredBlog.metaDescription}
                  </p>
                  <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-gray-600">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0F9EDA]/10 text-sm font-bold text-[#0A7AAB]">
                      L
                    </span>
                    <span className="font-medium text-gray-900">LingText</span>
                    <time dateTime={featuredBlog.updatedAt}>
                      {formatBlogDate(featuredBlog.updatedAt)}
                    </time>
                  </div>
                  <span className="mt-8 inline-flex w-fit items-center rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-950 transition-colors duration-200 group-hover:border-[#0F9EDA]/40 group-hover:text-[#0A7AAB]">
                    Leer más
                  </span>
                </div>
              </Link>
            </article>
          ) : null}

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {remainingBlogs.map((blog: BlogManifestEntry) => (
              <BlogCard key={blog.slug} blog={blog} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#0F9EDA]">
              Método LingText
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-gray-950">
              ¿Por qué seguir el blog de LingText?
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <article className="border-t border-gray-200 pt-5">
              <h3 className="text-base font-semibold text-gray-950">
                Contenido real
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Guías para aprovechar textos, videos y herramientas de IA en tu
                proceso de aprendizaje.
              </p>
            </article>
            <article className="border-t border-gray-200 pt-5">
              <h3 className="text-base font-semibold text-gray-950">
                Repetición espaciada
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Estrategias para recordar vocabulario nuevo y consolidarlo a
                largo plazo.
              </p>
            </article>
            <article className="border-t border-gray-200 pt-5">
              <h3 className="text-base font-semibold text-gray-950">
                Tecnología práctica
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Ideas concretas para leer, escuchar y estudiar con mejores
                sistemas.
              </p>
            </article>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 sm:p-8 lg:col-start-2">
            <h3 className="text-2xl font-bold text-gray-950">
              Lleva tu inglés al siguiente nivel
            </h3>
            <p className="mt-3 max-w-2xl text-gray-600">
              LingText no es solo un blog, es una herramienta completa para
              leer, ver y aprender con vocabulario en contexto.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#0F9EDA] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#0D8EC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
            >
              Comenzar a aprender gratis
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-white py-10 text-center text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()} LingText. Tu compañero en el aprendizaje
          de idiomas.
        </p>
      </footer>
    </main>
  );
}

function BlogCard({ blog }: { blog: BlogManifestEntry }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-colors duration-200 hover:border-gray-300">
      <Link
        to={`/blog/${blog.slug}`}
        className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
      >
        <div className="aspect-[16/9] overflow-hidden bg-gray-100">
          <img
            crossOrigin="anonymous"
            src={blog.image}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            decoding="async"
            loading="lazy"
          />
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap gap-2">
            {blog.tags?.slice(0, 2).map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-xl font-bold leading-snug text-gray-950 transition-colors duration-200 group-hover:text-[#0A7AAB]">
            {blog.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
            {blog.metaDescription}
          </p>
          <div className="mt-auto flex items-center gap-3 pt-6 text-sm text-gray-600">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F9EDA]/10 text-xs font-bold text-[#0A7AAB]">
              L
            </span>
            <div className="min-w-0">
              <p className="font-medium text-gray-900">LingText</p>
              <time dateTime={blog.updatedAt}>
                {formatBlogDate(blog.updatedAt)}
              </time>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
