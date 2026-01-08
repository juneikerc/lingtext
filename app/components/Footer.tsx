import React from "react";
import { Link } from "react-router";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  //   <a
  //   href="#"
  //   className="text-gray-400 hover:text-white transition-colors duration-200"
  //   aria-label="Twitter"
  // >
  //   <svg
  //     className="w-5 h-5"
  //     fill="currentColor"
  //     viewBox="0 0 24 24"
  //   >
  //     <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  //   </svg>
  // </a>
  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="text-2xl font-bold text-gray-100">
                Ling<span className="text-indigo-400">Text</span>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              La alternativa gratuita y moderna a LingQ. Aprende inglés leyendo
              textos con traducción instantánea, audio integrado y seguimiento
              de progreso inteligente.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/juneikerc/lingtext"
                className="text-gray-400 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                aria-label="GitHub"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
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
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  Nivel A1
                </a>
              </li>
              <li>
                <a
                  href="/levels/a2"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  Nivel A2
                </a>
              </li>
              <li>
                <a
                  href="/levels/b1"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  Nivel B1
                </a>
              </li>
              <li>
                <a
                  href="/levels/b2"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  Nivel B2
                </a>
              </li>
              <li>
                <a
                  href="/levels/c1"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  Nivel C1
                </a>
              </li>
              <li>
                <a
                  href="/levels/c2"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
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
                  href="#"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  Cómo funciona
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  Biblioteca
                </a>
              </li>
              <li>
                <a
                  href="/words"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  Estadísticas
                </a>
              </li>
              <li></li>
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
                  href="#"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  Guía de aprendizaje
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  Comunidad
                </a>
              </li>
              <li>
                <Link
                  to="/contacto"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
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
          <div className="flex space-x-6 text-sm">
            <a
              href="#"
              className="text-gray-400 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
            >
              Privacidad
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
            >
              Términos
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded"
            >
              Cookies
            </a>
          </div>
        </div>

        {/* Feature highlight */}
        <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-800">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="text-indigo-300 font-semibold mb-1">
                💡 ¿Sabías?
              </div>
              <div className="text-gray-300 text-sm">
                LingText es completamente gratuito y open source. ¡Ayúdanos a
                mejorar!
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
