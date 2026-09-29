const FAIXAS = [
  { cor: "#FFFFFF", nome: "Branca", borda: true },
  { cor: "#3B82F6", nome: "Azul" },
  { cor: "#7C3AED", nome: "Roxa" },
  { cor: "#92400E", nome: "Marrom" },
  { cor: "#111111", nome: "Preta" },
];

export default function Graduacao() {
  return (
    <section id="graduacao" className="py-20 bg-[#F7F7F7] border-t border-[#E5E5E5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
          {/* Texto */}
          <div className="md:max-w-sm">
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#8A8A8A]">
              Progressão
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-[#0A0A0A]">
              Sistema de Graduação
            </h2>
            <p className="mt-4 text-sm text-[#4A4A4A] leading-relaxed">
              O Jiu-Jitsu possui um sistema de graduação por faixas que representa a evolução técnica e o desenvolvimento do praticante dentro e fora do tatame.
            </p>
            <a
              href="https://cbjj.com.br/graduation-system"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#0A0A0A] border-b border-[#0A0A0A] pb-0.5 hover:opacity-60 transition-opacity"
            >
              Clique aqui para conhecer o sistema completo
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Faixas */}
          <div className="flex-1 flex items-center gap-3 md:gap-4 justify-start md:justify-end flex-wrap">
            {FAIXAS.map((f, i) => (
              <div key={f.nome} className="flex flex-col items-center gap-2">
                {/* Faixa */}
                <div
                  className="w-10 h-24 md:w-12 md:h-28 rounded-sm shadow-md"
                  style={{
                    backgroundColor: f.cor,
                    border: f.borda ? "1.5px solid #D1D5DB" : "none",
                  }}
                />
                <span className="text-[10px] font-semibold tracking-wide uppercase text-[#8A8A8A]">
                  {f.nome}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
