"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const SLIDES = [
  { src: "/treinos/copa-marcos-cunha.png", alt: "Copa Marcos Cunha - GI e NOGI", color: true },
  { src: "/treinos/treino-01.jpg", alt: "Treino de Jiu-Jitsu TMC", color: false },
  { src: "/treinos/treino-02.jpg", alt: "Sparring na academia", color: false },
  { src: "/treinos/treino-03.jpg", alt: "Aula técnica", color: false },
];

export default function Carrossel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const prev = useCallback(() => {
    setCurrent((c) => (c === 0 ? SLIDES.length - 1 : c - 1));
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c === SLIDES.length - 1 ? 0 : c + 1));
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [next, paused]);

  // Swipe no mobile
  let touchStartX = 0;
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 40) next();
    else if (diff < -40) prev();
  };

  return (
    <section id="treinos" className="py-24 bg-[#F2F2F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#8A8A8A]">
            No tatame
          </span>
          <h2 className="mt-2 text-4xl lg:text-5xl font-black tracking-tight text-[#0A0A0A]">
            Treinos
          </h2>
        </div>

        <div
          className="relative overflow-hidden aspect-[16/9] bg-[#E5E5E5]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {SLIDES.map((slide, i) => (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === current ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className={`object-cover ${slide.color ? "" : "grayscale"}`}
                priority={i === 0}
                sizes="(max-width: 768px) 100vw, 1280px"
              />
            </div>
          ))}

          {/* Overlay escuro sutil */}
          <div className="absolute inset-0 bg-black/10" />

          {/* Setas */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
            aria-label="Anterior"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
            aria-label="Próximo"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? "bg-white w-6" : "bg-white/50"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <p className="mt-4 text-xs text-[#8A8A8A] text-center">
          Substitua as fotos em <code>public/treinos/</code> pelas imagens reais da academia.
        </p>
      </div>
    </section>
  );
}
