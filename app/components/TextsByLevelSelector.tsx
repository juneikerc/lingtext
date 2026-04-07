import { Link } from "react-router";

type FeaturedText = {
  title: string;
  slug: string;
  hasAudio: boolean;
};

export type LevelTextsCard = {
  id: string;
  name: string;
  title: string;
  description: string;
  totalTexts: number;
  texts: FeaturedText[];
};

type TextsByLevelSelectorProps = {
  items: LevelTextsCard[];
};

export default function TextsByLevelSelector({
  items,
}: TextsByLevelSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {items.map((level) => (
        <article
          key={level.id}
          className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-xl font-bold text-indigo-600 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                {level.name}
              </span>
            </div>
            <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
              {level.totalTexts} textos
            </span>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {level.title}
            </h3>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {level.description}
            </p>
          </div>
            <div className="space-y-3 mt-6">
              {level.texts.map((text) => (
                <Link
                  key={`${level.id}-${text.slug}`}
                  to={`/texts/${text.slug}?source=collection`}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-white/80 bg-white/90 px-4 py-3 text-sm text-gray-700 transition duration-200 hover:border-indigo-200 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-50 dark:border-gray-800 dark:bg-gray-900/80 dark:text-gray-300 dark:hover:border-indigo-800 dark:hover:text-indigo-400 dark:focus-visible:ring-offset-gray-900"
                  rel="nofollow"
                >
                  <span className="font-medium">{text.title}</span>
                  <span className="inline-flex items-center gap-2">
                    {text.hasAudio ? (
                      <span className="rounded-full bg-indigo-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                        Audio
                      </span>
                    ) : null}
                    <svg
                      className="h-4 w-4 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          

          <div className="mt-auto pt-6">
            
              <Link
                to={`/levels/${level.id}`}
                className="mt-4 inline-flex w-full items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 transition duration-200 hover:border-indigo-300 hover:bg-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/70 dark:focus-visible:ring-offset-gray-900"
              >
                <span>Ver más lecturas en inglés {level.name}</span>
                <svg
                  className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            
          </div>
        </article>
      ))}
    </div>
  );
}
