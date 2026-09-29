"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { PROFESSORES } from "../../data/professores";

const DIAS: Record<number, string> = {
  1: "Seg", 2: "Ter", 3: "Qua", 4: "Qui", 5: "Sex", 6: "Sáb", 7: "Dom",
};

interface TurmaAPI {
  id: number;
  nome: string;
  dias: number[];
  horarios: string[];
  professorId: number;
  professorNome: string;
}

interface ProfessorCard {
  id: number;
  nome: string;
  apelido?: string;
  faixa: string;
  grau?: number | null;
  foto: string;
  fotoPosition?: string;
  destaque?: boolean;
  bio?: string;
}

function graduacaoLabel(faixa: string, grau?: number | null) {
  if (grau != null) return `${faixa} ${grau}º grau`;
  return faixa;
}

function turmasDoProfessor(prof: ProfessorCard, turmas: TurmaAPI[]) {
  if (prof.destaque) return [];
  const partes = prof.nome.toLowerCase().split(" ");
  return turmas.filter((t) => {
    const nome = t.professorNome.toLowerCase();
    return partes.every((p) => nome.includes(p));
  });
}

// ── Overlay que aparece no hover (desktop) ────────────────────────────────────
function HoverCard({ prof, turmas, visible }: { prof: ProfessorCard; turmas: TurmaAPI[]; visible: boolean }) {
  const minhasTurmas = turmasDoProfessor(prof, turmas);

  return (
    <div
      className="absolute inset-0 flex flex-col justify-end p-5 bg-gradient-to-t from-black/95 via-black/70 to-black/10 pointer-events-none"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.28s ease, transform 0.28s ease",
      }}
    >
      <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8A8A] mb-1">
        {graduacaoLabel(prof.faixa, prof.grau)}
      </p>
      <h3 className="text-lg font-black text-white mb-3">
        {prof.nome}
        {prof.apelido && (
          <span className="ml-2 text-sm font-light text-[#8A8A8A]">&ldquo;{prof.apelido}&rdquo;</span>
        )}
      </h3>

      {minhasTurmas.length > 0 && (
        <div className="space-y-2">
          {minhasTurmas.map((t) => (
            <div key={t.id} className="flex gap-3 items-start">
              <div className="flex flex-wrap gap-0.5 pt-0.5">
                {t.dias.map((d) => (
                  <span key={d} className="text-[9px] font-bold bg-white/10 text-white px-1.5 py-0.5">
                    {DIAS[d]}
                  </span>
                ))}
              </div>
              <div>
                <p className="text-white text-xs font-semibold leading-tight">{t.nome}</p>
                <p className="text-[#8A8A8A] text-[10px]">{t.horarios.join(" • ")}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {minhasTurmas.length === 0 && (
        <p className="text-[#8A8A8A] text-xs">Coordenador da academia</p>
      )}
    </div>
  );
}

// ── Modal bottom-sheet (mobile) ───────────────────────────────────────────────
function Modal({ prof, turmas, onClose }: { prof: ProfessorCard; turmas: TurmaAPI[]; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  const minhasTurmas = turmasDoProfessor(prof, turmas);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 280);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={handleClose}>
      <div
        className="absolute inset-0 bg-black transition-opacity duration-280"
        style={{ opacity: visible ? 0.8 : 0 }}
      />
      <div
        className="relative w-full bg-[#0A0A0A] overflow-hidden"
        style={{
          transform: visible ? "translateY(0)" : "translateY(50px)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.32s cubic-bezier(0.34,1.3,0.64,1), opacity 0.25s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-52 overflow-hidden">
          <Image src={prof.foto} alt={prof.nome} fill className="object-cover grayscale" style={{ objectPosition: prof.fotoPosition ?? "center" }} sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" />
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute bottom-0 left-0 p-5">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8A8A] mb-1">
              {graduacaoLabel(prof.faixa, prof.grau)}
            </p>
            <h3 className="text-2xl font-black text-white">
              {prof.nome}
              {prof.apelido && (
                <span className="ml-2 text-lg font-light text-[#8A8A8A]">&ldquo;{prof.apelido}&rdquo;</span>
              )}
            </h3>
          </div>
        </div>

        <div className="p-5">
          {minhasTurmas.length === 0 ? (
            <p className="text-[#4A4A4A] text-sm">Coordenador da academia.</p>
          ) : (
            <>
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#4A4A4A] mb-3">Aulas</p>
              <div className="space-y-3">
                {minhasTurmas.map((t) => (
                  <div key={t.id} className="flex items-start gap-4 py-3 border-b border-[#1a1a1a] last:border-0">
                    <div className="flex flex-wrap gap-1 min-w-[90px]">
                      {t.dias.map((d) => (
                        <span key={d} className="px-2 py-0.5 text-[10px] font-bold bg-white/5 text-[#8A8A8A] border border-[#1a1a1a]">
                          {DIAS[d]}
                        </span>
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{t.nome}</p>
                      <p className="text-[#8A8A8A] text-xs mt-0.5">{t.horarios.join("  •  ")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!prof.destaque && minhasTurmas.length > 0 && (
            <a
              href="#agendamento"
              onClick={handleClose}
              className="mt-5 flex items-center justify-center w-full py-3 bg-white text-[#0A0A0A] text-xs font-bold tracking-widest uppercase"
            >
              Agendar aula experimental
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Card clicável ─────────────────────────────────────────────────────────────
function ProfCard({
  prof,
  turmas,
  onSelect,
  aspect,
  sizes,
}: {
  prof: ProfessorCard;
  turmas: TurmaAPI[];
  onSelect: () => void;
  aspect: string;
  sizes: string;
}) {
  const [hovered, setHovered] = useState(false);
  const isTouch = useRef(false);

  return (
    <button
      className="group text-left w-full"
      onMouseEnter={() => { if (!isTouch.current) setHovered(true); }}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => { isTouch.current = true; }}
      onClick={() => {
        if (isTouch.current) {
          onSelect();
          isTouch.current = false;
        }
      }}
    >
      <div className={`relative ${aspect} bg-[#111111] overflow-hidden`}>
        <Image
          src={prof.foto}
          alt={prof.nome}
          fill
          className="object-cover grayscale transition-transform duration-500 group-hover:scale-105"
          style={{ objectPosition: prof.fotoPosition ?? "center" }}
          sizes={sizes}
        />
        {/* Desktop: hover overlay com info */}
        <HoverCard prof={prof} turmas={turmas} visible={hovered} />
      </div>
      {/* Nome abaixo (visível só quando não está em hover no desktop) */}
      <div className="mt-4 sm:hidden">
        <p className="text-xs tracking-widest uppercase text-[#4A4A4A]">
          {graduacaoLabel(prof.faixa, prof.grau)}
        </p>
        <h3 className="mt-1 text-xl font-black text-white">
          {prof.nome}
          {prof.apelido && (
            <span className="ml-2 text-base font-light text-[#8A8A8A]">&ldquo;{prof.apelido}&rdquo;</span>
          )}
        </h3>
      </div>
      <div className="mt-4 hidden sm:block" style={{ opacity: hovered ? 0 : 1, transition: "opacity 0.2s ease" }}>
        <p className="text-xs tracking-widest uppercase text-[#4A4A4A]">
          {graduacaoLabel(prof.faixa, prof.grau)}
        </p>
        <h3 className="mt-1 text-xl font-black text-white">
          {prof.nome}
          {prof.apelido && (
            <span className="ml-2 text-base font-light text-[#8A8A8A]">&ldquo;{prof.apelido}&rdquo;</span>
          )}
        </h3>
      </div>
    </button>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function Professores() {
  const [turmas, setTurmas] = useState<TurmaAPI[]>([]);
  const [selecionado, setSelecionado] = useState<ProfessorCard | null>(null);

  useEffect(() => {
    fetch("/api/turmas")
      .then((r) => r.json())
      .then(setTurmas)
      .catch(() => {});
  }, []);

  const fundador = PROFESSORES.find((p) => p.destaque);
  const demais = PROFESSORES.filter((p) => !p.destaque);

  return (
    <>
      <section id="professores" className="py-24 bg-[#0A0A0A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cabeçalho */}
          <div className="mb-16">
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#4A4A4A]">Equipe</span>
            <h2 className="mt-2 text-4xl lg:text-5xl font-black tracking-tight">Professores</h2>
            <p className="mt-3 text-sm text-[#4A4A4A]">
              Passe o mouse na foto para ver os horários. No celular, toque para abrir.
            </p>
          </div>

          {/* Fundador */}
          {fundador && (
            <div className="mb-20 grid lg:grid-cols-2 gap-12 items-center pb-20 border-b border-[#1a1a1a]">
              <ProfCard
                prof={fundador}
                turmas={turmas}
                onSelect={() => setSelecionado(fundador)}
                aspect="aspect-[4/5]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div>
                <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#4A4A4A]">Fundador</span>
                <h3 className="mt-3 text-3xl lg:text-4xl font-black tracking-tight">{fundador.nome}</h3>
                <p className="mt-1 text-sm font-medium tracking-widest uppercase text-[#8A8A8A]">
                  {graduacaoLabel(fundador.faixa, fundador.grau)}
                </p>
                <div className="mt-6 mb-6 flex items-center gap-4">
                  <Image
                    src="/marcos-cunha-fight-team.png"
                    alt="Marcos Cunha Fight Team"
                    width={72}
                    height={72}
                    className="object-contain shrink-0"
                  />
                  <div className="w-px h-12 bg-[#2a2a2a]" />
                  <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#4A4A4A] leading-relaxed">
                    Marcos Cunha<br />Fight Team
                  </p>
                </div>
                <p className="text-[#8A8A8A] leading-relaxed text-lg">{fundador.bio}</p>
                <a
                  href="#agendamento"
                  className="mt-8 inline-block px-6 py-3 border border-white text-white text-sm font-semibold tracking-widest uppercase hover:bg-white hover:text-[#0A0A0A] transition-colors"
                >
                  Treinar com a equipe
                </a>
              </div>
            </div>
          )}

          {/* Grade */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {demais.map((prof) => (
              <ProfCard
                key={prof.id}
                prof={prof}
                turmas={turmas}
                onSelect={() => setSelecionado(prof)}
                aspect="aspect-[3/4]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ))}
          </div>
        </div>
      </section>

      {selecionado && (
        <Modal prof={selecionado} turmas={turmas} onClose={() => setSelecionado(null)} />
      )}
    </>
  );
}
