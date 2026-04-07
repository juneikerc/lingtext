export function LibraryLoadingSkeleton() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white px-4 py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#0F9EDA]/5 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#0F9EDA]/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
            <span className="mr-2.5 h-2 w-2 rounded-full bg-[#0F9EDA]" />
            Cargando biblioteca...
          </div>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Tus <span className="text-[#0F9EDA]">Textos</span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-600">
            Preparando tu colección personal...
          </p>
        </div>

        <div className="space-y-6">
          <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="mr-4 h-10 w-10 rounded-xl bg-gray-200" />
              <div className="flex-1">
                <div className="mb-2 h-4 w-32 rounded bg-gray-200" />
                <div className="h-3 w-48 rounded bg-gray-100" />
              </div>
            </div>
          </div>

          <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gray-200" />
              <div className="h-6 w-48 rounded bg-gray-200" />
            </div>
            <div className="space-y-4">
              <div className="h-12 rounded-xl bg-gray-100" />
              <div className="h-12 rounded-xl bg-gray-100" />
              <div className="h-32 rounded-xl bg-gray-100" />
              <div className="flex justify-end">
                <div className="h-12 w-32 rounded-xl bg-gray-200" />
              </div>
            </div>
          </div>

          <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6 h-6 w-40 rounded bg-gray-200" />
            <div className="space-y-4">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-gray-200 p-5"
                >
                  <div className="mb-3 h-5 w-3/4 rounded bg-gray-200" />
                  <div className="mb-2 h-3 w-1/2 rounded bg-gray-100" />
                  <div className="h-3 w-1/3 rounded bg-gray-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
