import React from 'react';

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className = '' }: HeroSectionProps) {
  return (
    <section className={`bg-gradient-to-tr from-indigo-500 to-purple-600 text-white py-16 px-4 text-center rounded-xl mb-8 shadow-xl ${className}`}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight drop-shadow-md">
          LingText - Alternativa gratuita a lingq
        </h1>
        <p className="text-lg md:text-xl leading-relaxed opacity-95 m-0 font-light">
          Aprende inglés de forma gratuita a través de la lectura. Agrega tus propios textos y audios para sumergirte en el idioma a través de la lectura activa.
        </p>
      </div>
    </section>
  );
}
