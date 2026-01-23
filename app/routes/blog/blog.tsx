import type { Route } from "../+types/blog";
import { getBlogBySlug } from "~/lib/content/runtime";
import ProseContent from "~/components/ProseContent";

export function loader({ params }: Route.LoaderArgs) {
  const blog = getBlogBySlug(params.slug ?? "");
  if (!blog) {
    throw new Response("Not Found", { status: 404 });
  }
  return { blog };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { blog } = loaderData;
  return [
    {
      title: blog.title,
    },
    {
      name: "description",
      content: blog.metaDescription,
    },
    {
      tagName: "link",
      rel: "canonical",
      href: `https://lingtext.org/blog/${blog.slug}`,
    },
  ];
}

export default function Blog({ loaderData }: Route.ComponentProps) {
  const blog = loaderData.blog;

  return (
    <>
      <section className="relative overflow-hidden py-16 sm:py-24 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-indigo-500/10 dark:bg-indigo-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[10%] right-[10%] w-64 h-64 bg-sky-500/10 dark:bg-sky-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-8">
            <a
              href="/blog"
              className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
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
              Volver al blog
            </a>
          </nav>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
            {blog.mainHeading}
          </h1>
          <img
            crossOrigin="anonymous"
            src={blog.image}
            alt={blog.title}
            decoding="async"
            loading="lazy"
          />
        </div>
      </section>

      <section className="relative overflow-hidden py-16 sm:py-24 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProseContent html={blog.html} />
        </div>
      </section>
    </>
  );
}
