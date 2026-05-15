import React from "react";
import { Link } from "react-router";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <img
                src="/logo-footer.png"
                alt="LingText"
                className="h-14 w-auto"
                width={134}
                height={69}
              />
            </div>
            <p className="text-gray-300 mb-4 max-w-md leading-relaxed">
              La alternativa gratuita y moderna a LingQ. Aprende inglés leyendo
              textos con traducción instantánea, audio integrado y seguimiento
              de progreso inteligente.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/groups/1199904721807372"
                className="text-gray-400 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                aria-label="Facebook"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.676 0H1.326C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.326 24h11.495v-9.294H9.691V11.41h3.13V8.797c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.918c-1.504 0-1.796.715-1.796 1.764v2.313h3.587l-.467 3.296h-3.12V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.676 0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Niveles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              Textos por nivel
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/levels/a1"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  Nivel A1
                </a>
              </li>
              <li>
                <a
                  href="/levels/a2"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  Nivel A2
                </a>
              </li>
              <li>
                <a
                  href="/levels/b1"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  Nivel B1
                </a>
              </li>
              <li>
                <a
                  href="/levels/b2"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  Nivel B2
                </a>
              </li>
              <li>
                <a
                  href="/levels/c1"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  Nivel C1
                </a>
              </li>
              <li>
                <a
                  href="/levels/c2"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  Nivel C2
                </a>
              </li>
            </ul>
          </div>

          {/* Enlaces útiles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              Producto
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/my-library"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  Construye tú Biblioteca
                </a>
              </li>
              <li>
                <a
                  href="/words"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  Estadísticas
                </a>
              </li>
              <li>
                <a
                  href="/pro"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  LingText PRO
                </a>
              </li>
              <li>
                <a
                  href="/extension"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  LingText for YouTube
                </a>
              </li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              Recursos
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/vocabulario"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  Vocabulario en inglés
                </a>
              </li>
              <li>
                <a
                  href="/tests"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  Tests
                </a>
              </li>

              <li>
                <a
                  href="/comunidad"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  Comunidad
                </a>
              </li>
              <li>
                <a
                  href="/aprender-con-language-island"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  Language Island
                </a>
              </li>
              <li>
                <Link
                  to="/contacto"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <a
                  href="/blog"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} LingText. Todos los derechos reservados.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm md:justify-end md:gap-6">
            <Link
              to="/legal/politica-de-privacidad"
              className="text-gray-400 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
            >
              Privacidad
            </Link>
            <Link
              to="/legal/terminos-y-condiciones"
              className="text-gray-400 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
            >
              Términos
            </Link>
            <Link
              to="/legal/politica-de-cookies"
              className="text-gray-400 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
            >
              Cookies
            </Link>
            <Link
              to="/legal/aviso-legal"
              className="text-gray-400 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
            >
              Aviso legal
            </Link>
          </div>
        </div>

        {/* Feature highlight */}
        <div className="mt-8 p-6 bg-gray-900 rounded-2xl border border-gray-800">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="text-[#0F9EDA] font-semibold mb-2">
                💡 ¿Sabías?
              </div>
              <div className="text-gray-300 text-sm">
                LingText es completamente gratuito y privado. Tus datos de
                aprendizaje se quedan en tu dispositivo.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
