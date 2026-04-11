interface NewsletterSidebarProps {
  onClose: () => void;
}

export default function NewsletterSidebar({ onClose }: NewsletterSidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col fixed right-0 top-0 bottom-0 w-80 z-40 border-l border-gray-200 bg-white shadow-lg overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          Newsletter
        </span>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white bg-red-500 transition-colors duration-200 hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          aria-label="Cerrar sidebar"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              d="M18 6 6 18M6 6l12 12"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Cerrar
        </button>
      </div>

      <div className="flex flex-col gap-4 p-5">
        <div className="rounded-2xl border border-[#0F9EDA]/20 bg-[#0F9EDA]/5 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F9EDA]/10 border border-[#0F9EDA]/20 mb-4">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-5 w-5 text-[#0F9EDA]"
              aria-hidden="true"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" strokeWidth="2" />
              <path
                d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-base font-bold text-gray-900">Mantente al día</h3>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">
            Recibe consejos de aprendizaje, nuevas funcionalidades y textos
            curados directamente en tu correo.
          </p>
          <a
            href="https://lingtext.kit.com/247af6aeca"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#0F9EDA] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#0D8EC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2"
          >
            Suscribirme al newsletter
          </a>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-semibold text-gray-900 mb-3">
            ¿Tienes dudas? Únete a la comunidad
          </p>
          <div className="flex flex-col gap-2">
            <a
              href="https://www.facebook.com/groups/1199904721807372/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-[#1877F2]/20 bg-[#1877F2]/5 px-3 py-2.5 text-sm font-medium text-[#1877F2] transition-colors duration-200 hover:bg-[#1877F2]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1877F2] focus-visible:ring-offset-2"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4 shrink-0"
                aria-hidden="true"
              >
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
              Grupo de Facebook
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61579571713917"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-[#1877F2]/20 bg-[#1877F2]/5 px-3 py-2.5 text-sm font-medium text-[#1877F2] transition-colors duration-200 hover:bg-[#1877F2]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1877F2] focus-visible:ring-offset-2"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4 shrink-0"
                aria-hidden="true"
              >
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
              Página de Facebook
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
