"use client";
import { useState } from "react";
import Image from "next/image";

const slides = [
  {
    id: "uniforme",
    tag: "Academia",
    titulo: "Nosso Uniforme",
    descricao:
      "Vista as cores da TMC. O kimono oficial da academia representa identidade, comprometimento e pertencimento a uma comunidade de campeões formados com disciplina e dedicação.",
    cta: { label: "Agendar aula experimental", href: "#agendamento" },
    visual: "kimono",
  },
  {
    id: "compromisso",
    tag: "Nossa Missão",
    titulo: "Compromisso com o Desenvolvimento",
    descricao:
      "Mais do que técnica, a TMC forma caráter. Cada aula é uma oportunidade de evoluir no tatame e na vida. Nossa metodologia atende iniciantes e atletas de alto rendimento com a mesma seriedade.",
    cta: { label: "Conheça a equipe", href: "#professores" },
    visual: "compromisso",
  },
];

export default function Destaques() {
  const [ativo, setAtivo] = useState(0);

  const prev = () => setAtivo((a) => (a === 0 ? slides.length - 1 : a - 1));
  const next = () => setAtivo((a) => (a === slides.length - 1 ? 0 : a + 1));
  const s = slides[ativo];

  return (
    <section className="bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#4A4A4A]">
              Destaques
            </span>
            <h2 className="mt-2 text-4xl lg:text-5xl font-black tracking-tight">
              A Academia
            </h2>
          </div>
          <div className="flex gap-3 mt-1">
            <button
              onClick={prev}
              aria-label="Anterior"
              className="w-10 h-10 border border-[#4A4A4A] flex items-center justify-center hover:border-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Próximo"
              className="w-10 h-10 border border-[#4A4A4A] flex items-center justify-center hover:border-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carrossel */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${ativo * 100}%)` }}
          >
            {slides.map((sl) => (
              <div key={sl.id} className="w-full shrink-0">
                <div className="grid lg:grid-cols-2 min-h-[400px]">
                  {/* Visual */}
                  <div className="bg-[#111111] flex items-center justify-center min-h-[280px] lg:min-h-0">
                    {sl.visual === "kimono" ? (
                      <div className="relative w-full h-full min-h-[280px] lg:min-h-0 flex">
                        <div className="relative flex-1 border-r border-[#1a1a1a]">
                          <Image
                            src="/uniforme-camisa.jpg"
                            alt="Camisa TMC Matriz Blumenau"
                            fill
                            className="object-contain p-5"
                            sizes="(max-width: 1024px) 50vw, 25vw"
                          />
                        </div>
                        <div className="relative flex-1">
                          <Image
                            src="/uniforme-kimono.jpg"
                            alt="Kimono TMC"
                            fill
                            className="object-contain p-5"
                            sizes="(max-width: 1024px) 50vw, 25vw"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#141414] to-[#0A0A0A] flex items-center justify-center p-12 min-h-[280px] lg:min-h-0">
                        <div className="text-center">
                          <div className="w-16 h-px bg-white mx-auto mb-6" />
                          <p className="text-3xl font-black tracking-wider">TMC</p>
                          <p className="text-xs text-[#4A4A4A] tracking-[0.4em] uppercase mt-3">
                            The Match Champ
                          </p>
                          <div className="w-16 h-px bg-white mx-auto mt-6" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Texto */}
                  <div className="bg-[#0A0A0A] p-10 lg:p-14 flex flex-col justify-center border-t border-[#1a1a1a] lg:border-t-0 lg:border-l lg:border-[#1a1a1a]">
                    <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#4A4A4A] mb-4">
                      {sl.tag}
                    </span>
                    <h3 className="text-3xl lg:text-4xl font-black tracking-tight mb-6">
                      {sl.titulo}
                    </h3>
                    <p className="text-[#8A8A8A] leading-relaxed text-lg mb-8">
                      {sl.descricao}
                    </p>
                    <a
                      href={sl.cta.href}
                      className="inline-block w-fit px-6 py-3 border border-white text-white text-sm font-semibold tracking-widest uppercase hover:bg-white hover:text-[#0A0A0A] transition-colors"
                    >
                      {sl.cta.label}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicadores */}
        <div className="flex gap-2 mt-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setAtivo(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-0.5 transition-all duration-300 ${
                i === ativo ? "w-8 bg-white" : "w-4 bg-[#4A4A4A]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
