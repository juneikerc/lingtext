import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";

const nivelesLinks = [
  { to: "/levels/a1", label: "A1 Principiante" },
  { to: "/levels/a2", label: "A2 Elemental" },
  { to: "/levels/b1", label: "B1 Intermedio" },
  { to: "/levels/b2", label: "B2 Intermedio Alto" },
  { to: "/levels/c1", label: "C1 Avanzado" },
  { to: "/levels/c2", label: "C2 Maestría" },
];

const recursosLinks = [
  { to: "/aprender-ingles-con-canciones", label: "Canciones" },
  { to: "/aprender-con-language-island", label: "Language Island" },
  { to: "/1000-frases-en-ingles", label: "1000 Frases" },
  { to: "/500-palabras-en-ingles", label: "500 Palabras" },
  { to: "/comunidad", label: "Comunidad" },
  { to: "/blog", label: "Blog" },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="m6 9 6 6 6-6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MobileMenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="w-5 h-5"
    >
      {open ? (
        <path
          d="M18 6 6 18M6 6l12 12"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M4 6h16M4 12h16M4 18h16"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function NivelesLevelBadge({ label }: { label: string }) {
  const letter = label.charAt(0);
  const colors: Record<string, string> = {
    A: "bg-emerald-100 text-emerald-700",
    B: "bg-amber-100 text-amber-700",
    C: "bg-rose-100 text-rose-700",
  };
  return (
    <span
      className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-[10px] font-bold ${colors[letter] ?? "bg-gray-100 text-gray-600"}`}
    >
      {label.split(" ")[0]}
    </span>
  );
}

export default function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const nivelesRef = useRef<HTMLDetailsElement>(null);
  const recursosRef = useRef<HTMLDetailsElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (nivelesRef.current && !nivelesRef.current.contains(target)) {
        nivelesRef.current.removeAttribute("open");
      }
      if (recursosRef.current && !recursosRef.current.contains(target)) {
        recursosRef.current.removeAttribute("open");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
          >
            <img
              src="/logo-header.png"
              alt="LingText"
              className="p-2 h-16 w-auto"
              width={62}
              height={32}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Niveles dropdown */}
            <details ref={nivelesRef} className="relative">
              <summary className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2">
                Niveles
                <ChevronIcon open={false} />
              </summary>
              <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl border border-gray-200 shadow-lg shadow-gray-200/50 py-1.5 z-50">
                {nivelesLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors duration-200 ${
                      isActive(link.to)
                        ? "text-[#0F9EDA] bg-[#0F9EDA]/5 font-medium"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#0F9EDA]"
                    }`}
                  >
                    <NivelesLevelBadge label={link.label} />
                    <span>{link.label.split(" ").slice(1).join(" ")}</span>
                  </Link>
                ))}
              </div>
            </details>

            {/* Textos link */}
            <Link
              to="/textos-en-ingles"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActive("/textos-en-ingles")
                  ? "text-[#0F9EDA] bg-[#0F9EDA]/5"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Textos
            </Link>

            {/* Tests link */}
            <Link
              to="/tests"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActive("/tests")
                  ? "text-[#0F9EDA] bg-[#0F9EDA]/5"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Tests
            </Link>

            {/* Recursos dropdown */}
            <details ref={recursosRef} className="relative">
              <summary className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2">
                Recursos
                <ChevronIcon open={false} />
              </summary>
              <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl border border-gray-200 shadow-lg shadow-gray-200/50 py-1.5 z-50">
                {recursosLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`block px-4 py-2.5 text-sm transition-colors duration-200 ${
                      isActive(link.to)
                        ? "text-[#0F9EDA] bg-[#0F9EDA]/5 font-medium"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#0F9EDA]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </details>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/contacto"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
              Contacto
            </Link>
            <Link
              to="/my-library"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F9EDA] text-white text-sm font-semibold hover:bg-[#0D8EC4] transition-colors duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Mi Biblioteca
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <MobileMenuIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="border-t border-gray-100 bg-white px-4 pb-4 pt-2">
          <div className="space-y-1">
            {/* Mobile Niveles */}
            <details className="group">
              <summary className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer list-none">
                Niveles
                <ChevronIcon open={false} />
              </summary>
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-3">
                {nivelesLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 ${
                      isActive(link.to)
                        ? "text-[#0F9EDA] bg-[#0F9EDA]/5 font-medium"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <NivelesLevelBadge label={link.label} />
                    <span>{link.label.split(" ").slice(1).join(" ")}</span>
                  </Link>
                ))}
              </div>
            </details>

            {/* Mobile Textos */}
            <Link
              to="/textos-en-ingles"
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
                isActive("/textos-en-ingles")
                  ? "text-[#0F9EDA] bg-[#0F9EDA]/5"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Textos
            </Link>

            {/* Mobile Tests */}
            <Link
              to="/tests"
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
                isActive("/tests")
                  ? "text-[#0F9EDA] bg-[#0F9EDA]/5"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Tests
            </Link>

            {/* Mobile Recursos */}
            <details className="group">
              <summary className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer list-none">
                Recursos
                <ChevronIcon open={false} />
              </summary>
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-3">
                {recursosLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`block px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 ${
                      isActive(link.to)
                        ? "text-[#0F9EDA] bg-[#0F9EDA]/5 font-medium"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </details>

            <div className="border-t border-gray-100 pt-3 mt-2 space-y-1">
              <Link
                to="/contacto"
                className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Contacto
              </Link>
              <Link
                to="/my-library"
                className="block px-4 py-3 rounded-xl bg-[#0F9EDA] text-white text-sm font-semibold text-center hover:bg-[#0D8EC4] transition-colors duration-200"
              >
                Mi Biblioteca
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
