import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col justify-center bg-[#0A0A0A] text-white overflow-hidden"
    >
      {/* Fundo: gradiente sutil + textura */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#1a1a1a]" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 41px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-3xl">
          {/* Logo */}
          <div className="mb-10">
            <Image
              src="/logo_tmc.png"
              alt="TMC – The Match Champ"
              width={200}
              height={123}
              className="object-contain [filter:invert(1)] [mix-blend-mode:screen]"
              priority
            />
          </div>

          {/* Tag */}
          <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-[#8A8A8A] mb-6">
            Blumenau, SC · Jiu-Jitsu
          </span>

          {/* Título */}
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black leading-none tracking-tight mb-6">
            THE MATCH
            <br />
            <span className="text-[#E5E5E5]">CHAMP</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#8A8A8A] max-w-xl leading-relaxed mb-10">
            Metodologia de ensino desenvolvida por Marcos Cunha, com mais de 20
            filiais no Brasil e 5 nos Estados Unidos. Transforme sua vida no
            tatame.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#agendamento"
              className="px-8 py-4 bg-white text-[#0A0A0A] text-sm font-bold tracking-widest uppercase hover:bg-[#F2F2F2] transition-colors text-center"
            >
              Agende sua aula experimental grátis
            </a>
            <a
              href="#cronograma"
              className="px-8 py-4 border border-[#4A4A4A] text-white text-sm font-semibold tracking-widest uppercase hover:border-white transition-colors text-center"
            >
              Ver cronograma
            </a>
          </div>
        </div>

        {/* Rodapé do hero */}
        <div className="mt-24 pt-8 border-t border-[#1a1a1a] flex flex-col sm:flex-row gap-6 text-xs text-[#4A4A4A] tracking-widest uppercase">
          <span>+20 filiais no Brasil</span>
          <span className="hidden sm:block">·</span>
          <span>5 unidades nos EUA</span>
          <span className="hidden sm:block">·</span>
          <span>Centenas de títulos</span>
        </div>
      </div>

      {/* Seta animada */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-5 h-5 text-[#4A4A4A]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </section>
  );
}
