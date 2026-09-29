"use client";
import { useState, useEffect } from "react";

const DIAS_ORDEM = [1, 2, 3, 4, 5, 6];
const DIAS_LABELS: Record<number, string> = {
  1: "Segunda", 2: "Terça", 3: "Quarta", 4: "Quinta", 5: "Sexta", 6: "Sábado",
};

interface Turma {
  id: number;
  nome: string;
  descricao: string | null;
  dias: number[];
  horarios: string[];
  professorNome: string;
}

export default function Cronograma() {
  const [turmas, setTurmas] = useState<Turma[]>([]);

  useEffect(() => {
    fetch("/api/turmas")
      .then((r) => r.json())
      .then(setTurmas)
      .catch(() => {});
  }, []);

  const gradeByDia = DIAS_ORDEM.map((dia) => ({
    dia,
    label: DIAS_LABELS[dia],
    aulas: turmas
      .filter((t) => t.dias.includes(dia))
      .flatMap((t) =>
        t.horarios.map((h) => ({ horario: h, turma: t.nome, descricao: t.descricao, professor: t.professorNome }))
      )
      .sort((a, b) => a.horario.localeCompare(b.horario)),
  }));

  return (
    <section id="cronograma" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#8A8A8A]">
            Semana
          </span>
          <h2 className="mt-2 text-4xl lg:text-5xl font-black tracking-tight text-[#0A0A0A]">
            Cronograma de Aulas
          </h2>
        </div>

        {/* Desktop — tabela */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#E5E5E5]">
                {gradeByDia.map(({ dia, label }) => (
                  <th key={dia} className="py-3 px-4 text-left text-xs font-bold tracking-widest uppercase text-[#4A4A4A]">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="align-top">
                {gradeByDia.map(({ dia, aulas }) => (
                  <td key={dia} className="px-4 py-4 border-r border-[#F2F2F2] last:border-r-0">
                    <div className="space-y-3">
                      {aulas.length === 0 ? (
                        <span className="text-xs text-[#8A8A8A]">—</span>
                      ) : (
                        aulas.map((a, i) => (
                          <div key={i} className="group p-3 bg-[#F2F2F2] hover:bg-[#0A0A0A] transition-colors">
                            <p className="text-xs font-bold text-[#0A0A0A] group-hover:text-white">{a.horario}</p>
                            <p className="text-sm font-semibold mt-1 text-[#0A0A0A] group-hover:text-white">{a.turma}</p>
                            {a.descricao && (
                              <p className="text-xs text-[#555] group-hover:text-[#CCC] mt-0.5 italic">{a.descricao}</p>
                            )}
                            <p className="text-xs text-[#8A8A8A] group-hover:text-[#E5E5E5] mt-0.5">{a.professor}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile — cards por dia */}
        <div className="md:hidden space-y-6">
          {gradeByDia.map(({ dia, label, aulas }) => (
            <div key={dia}>
              <h3 className="text-xs font-bold tracking-widest uppercase text-[#4A4A4A] mb-3 pb-2 border-b border-[#E5E5E5]">
                {label}
              </h3>
              {aulas.length === 0 ? (
                <p className="text-sm text-[#8A8A8A]">Sem aulas</p>
              ) : (
                <div className="space-y-2">
                  {aulas.map((a, i) => (
                    <div key={i} className="flex gap-4 items-start p-3 bg-[#F2F2F2]">
                      <span className="text-sm font-black w-12 shrink-0 pt-0.5">{a.horario}</span>
                      <div>
                        <p className="text-sm font-semibold">{a.turma}</p>
                        {a.descricao && (
                          <p className="text-xs text-[#555] italic mt-0.5">{a.descricao}</p>
                        )}
                        <p className="text-xs text-[#8A8A8A] mt-0.5">{a.professor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a href="#agendamento" className="inline-block px-8 py-3 bg-[#0A0A0A] text-white text-sm font-semibold tracking-widest uppercase hover:bg-[#111111] transition-colors">
            Agendar aula experimental
          </a>
        </div>
      </div>
    </section>
  );
}
