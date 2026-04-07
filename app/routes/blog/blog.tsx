import type { Route } from "./+types/blog";
import { getBlogBySlug } from "~/lib/content/runtime";
import ProseContent from "~/components/ProseContent";

export async function loader({ params }: Route.LoaderArgs) {
  const blog = await getBlogBySlug(params.slug ?? "");
  if (!blog) {
    throw new Response("Not Found", { status: 404 });
  }
  return { blog };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { blog } = loaderData;
  const url = `https://lingtext.org/blog/${blog.slug}`;

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
      href: url,
    },
    // Open Graph
    {
      property: "og:title",
      content: blog.title,
    },
    {
      property: "og:description",
      content: blog.metaDescription,
    },
    {
      property: "og:type",
      content: "article",
    },
    {
      property: "og:url",
      content: url,
    },
    {
      property: "og:image",
      content: blog.image,
    },
    {
      property: "og:site_name",
      content: "LingText",
    },
    // Twitter Card
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: blog.title,
    },
    {
      name: "twitter:description",
      content: blog.metaDescription,
    },
    {
      name: "twitter:image",
      content: blog.image,
    },
  ];
}

export default function Blog({ loaderData }: Route.ComponentProps) {
  const blog = loaderData.blog;

  return (
    <>
      <section className="relative overflow-hidden py-16 sm:py-24 bg-white border-b border-gray-200">
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-[#0F9EDA]/5]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[10%] right-[10%] w-64 h-64 bg-sky-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-8">
            <a
              href="/blog"
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
              Volver al blog
            </a>
          </nav>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
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

      <section className="relative overflow-hidden py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProseContent html={blog.html} />
        </div>
      </section>
    </>
  );
}
