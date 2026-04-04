import { Link } from "react-router";
import type { Route } from "./+types/legal-page";
import ProseContent from "~/components/ProseContent";
import { getLegalPageBySlug } from "~/lib/content/runtime";

export async function loader({ params }: Route.LoaderArgs) {
  const legalPage = await getLegalPageBySlug(params.slug ?? "");

  if (!legalPage) {
    throw new Response("Not Found", { status: 404 });
  }

  return { legalPage };
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData?.legalPage) {
    return [{ title: "Página legal no encontrada | LingText" }];
  }

  const { legalPage } = loaderData;
  const url = `https://lingtext.org/legal/${legalPage.slug}`;

  return [
    { title: `${legalPage.title} | LingText` },
    {
      name: "description",
      content: legalPage.metaDescription,
    },
    {
      name: "robots",
      content: "noindex",
    },
    {
      tagName: "link",
      rel: "canonical",
      href: url,
    },
    {
      property: "og:title",
      content: legalPage.title,
    },
    {
      property: "og:description",
      content: legalPage.metaDescription,
    },
    {
      property: "og:type",
      content: "article",
    },
    {
      property: "og:url",
      content: url,
    },
  ];
}

export default function LegalPage({ loaderData }: Route.ComponentProps) {
  const { legalPage } = loaderData;

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <section className="relative overflow-hidden border-b border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-950 sm:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-400/5" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl dark:bg-sky-400/5" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-400 dark:hover:text-indigo-400 dark:focus-visible:ring-offset-gray-950"
            >
              <svg
                className="mr-2 h-4 w-4"
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
            </Link>
          </nav>

          <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            Documentación legal
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl lg:text-6xl">
            {legalPage.mainHeading}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-400 sm:text-xl">
            {legalPage.metaDescription}
          </p>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-gray-950 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-10">
            <ProseContent html={legalPage.html} />
          </div>
        </div>
      </section>
    </main>
  );
}
