export function LibraryLoadingSkeleton() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white px-4 py-12 sm:py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-6 h-72 w-72 rounded-full bg-[#0F9EDA]/5 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-[#0F9EDA]/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="mb-6 inline-flex items-center rounded-full border border-[#0F9EDA]/20 bg-[#0F9EDA]/5 px-4 py-2 text-sm font-medium text-[#0F9EDA]">
            <span className="mr-2.5 h-2 w-2 rounded-full bg-[#0F9EDA]" />
            Cargando biblioteca...
          </div>
          <h2 className="mb-5 max-w-3xl text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Crea y organiza tus <span className="text-[#0F9EDA]">lecturas</span>
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
            Preparando tu colección personal...
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="mb-8 flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-gray-200" />
                <div>
                  <div className="mb-2 h-6 w-44 rounded bg-gray-200" />
                  <div className="h-3 w-56 rounded bg-gray-100" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-12 rounded-xl bg-gray-100" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="h-12 rounded-xl bg-gray-100" />
                  <div className="h-12 rounded-xl bg-gray-100" />
                </div>
                <div className="h-28 rounded-xl bg-gray-100" />
                <div className="h-52 rounded-xl bg-gray-100" />
                <div className="flex justify-end">
                  <div className="h-12 w-40 rounded-xl bg-gray-200" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 h-5 w-44 rounded bg-gray-200" />
                  <div className="space-y-3">
                    <div className="h-3 rounded bg-gray-100" />
                    <div className="h-3 w-10/12 rounded bg-gray-100" />
                    <div className="h-3 w-8/12 rounded bg-gray-100" />
                  </div>
                </div>
              ))}
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
