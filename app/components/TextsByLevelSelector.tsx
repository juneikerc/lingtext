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
          className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/5 text-xl font-bold text-[#0F9EDA]]/30]/10]">
                {level.name}
              </span>
            </div>
            <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
              {level.totalTexts} textos
            </span>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">{level.title}</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              {level.description}
            </p>
          </div>
          <div className="space-y-3 mt-6">
            {level.texts.map((text) => (
              <Link
                key={`${level.id}-${text.slug}`}
                to={`/texts/${text.slug}?source=collection`}
                className="group flex items-center justify-between gap-3 rounded-xl border border-white/80 bg-white/90 px-4 py-3 text-sm text-gray-700 transition duration-200 hover:border-[#0F9EDA]/20 hover:text-[#0F9EDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F9EDA]/5]/30]"
                rel="nofollow"
              >
                <span className="font-medium">{text.title}</span>
                <span className="inline-flex items-center gap-2">
                  {text.hasAudio ? (
                    <span className="rounded-full bg-[#0F9EDA]/5 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#0A7AAB]]/10]">
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
              className="mt-4 inline-flex w-full items-center justify-between rounded-xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/5 px-4 py-3 text-sm font-semibold text-[#0A7AAB] transition duration-200 hover:border-[#0F9EDA]/30 hover:bg-[#0F9EDA]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50]/30]/10]]/40]/20"
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
