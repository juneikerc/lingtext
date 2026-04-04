export function LibraryLoadingSkeleton() {
  return (
    <section className="relative overflow-hidden border-b border-gray-200 bg-white px-4 py-12 dark:border-gray-800 dark:bg-gray-950">
      <div className="absolute inset-0">
        <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-400/5"></div>
        <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl dark:bg-sky-400/5"></div>
      </div>

      <div className="relative mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            <span className="mr-2 h-2 w-2 rounded-full bg-indigo-500"></span>
            Cargando biblioteca...
          </div>
          <h2 className="mb-4 text-4xl font-extrabold text-gray-900 dark:text-gray-100 md:text-5xl">
            Tus <span className="text-indigo-600 dark:text-indigo-400">Textos</span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-400">
            Preparando tu colección personal...
          </p>
        </div>

        <div className="space-y-6">
          <div className="animate-pulse rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center">
              <div className="mr-4 h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-800"></div>
              <div className="flex-1">
                <div className="mb-2 h-4 w-32 rounded bg-gray-200 dark:bg-gray-800"></div>
                <div className="h-3 w-48 rounded bg-gray-100 dark:bg-gray-800/60"></div>
              </div>
            </div>
          </div>

          <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-6 h-6 w-48 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="space-y-4">
              <div className="h-12 rounded-xl bg-gray-100 dark:bg-gray-800"></div>
              <div className="h-32 rounded-xl bg-gray-100 dark:bg-gray-800"></div>
              <div className="h-12 w-32 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>

          <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-6 h-6 w-40 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="space-y-4">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div className="mb-3 h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div className="mb-2 h-3 w-1/2 rounded bg-gray-100 dark:bg-gray-800"></div>
                  <div className="h-3 w-1/3 rounded bg-gray-100 dark:bg-gray-800"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
