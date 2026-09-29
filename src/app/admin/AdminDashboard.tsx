"use client";
import { useState, useEffect, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Agendamento {
  id: number;
  nome: string;
  whatsapp: string;
  email: string | null;
  data: string;
  horario: string;
  status: string;
  turma: { nome: string };
  professor: { nome: string };
}

interface TurmaAdmin {
  id: number;
  nome: string;
  dias: number[];
  horarios: string[];
  vagasMax: number;
  professorId: number;
  professorNome: string;
}

interface ProfessorAdmin {
  id: number;
  nome: string;
  apelido: string | null;
  faixa: string;
  grau: number | null;
  whatsapp: string;
  destaque: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  cancelado: "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  pendente: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmado: "bg-green-50 text-green-700 border-green-200",
  cancelado: "bg-red-50 text-red-700 border-red-200",
};

const DIAS_LABELS: Record<number, string> = {
  1: "Seg", 2: "Ter", 3: "Qua", 4: "Qui", 5: "Sex", 6: "Sáb",
};

function dataHoje() {
  return new Date().toISOString().split("T")[0];
}

// ─── Tab: Agendamentos ────────────────────────────────────────────────────────

function TabAgendamentos({ turmas, professores }: { turmas: TurmaAdmin[]; professores: ProfessorAdmin[] }) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroData, setFiltroData] = useState(dataHoje());
  const [filtroTurmaId, setFiltroTurmaId] = useState("");
  const [filtroProfId, setFiltroProfId] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [novoStatus, setNovoStatus] = useState("");

  const carregar = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filtroData) params.set("data", filtroData);
    if (filtroTurmaId) params.set("turmaId", filtroTurmaId);
    if (filtroProfId) params.set("professorId", filtroProfId);
    if (filtroStatus) params.set("status", filtroStatus);
    const res = await fetch(`/api/admin/agendamentos?${params}`);
    if (res.ok) setAgendamentos(await res.json());
    setLoading(false);
  }, [filtroData, filtroTurmaId, filtroProfId, filtroStatus]);

  useEffect(() => { carregar(); }, [carregar]);

  const atualizarStatus = async (id: number, status: string) => {
    await fetch(`/api/admin/agendamentos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setEditandoId(null);
    carregar();
  };

  const excluir = async (id: number) => {
    if (!confirm("Excluir este agendamento?")) return;
    await fetch(`/api/admin/agendamentos/${id}`, { method: "DELETE" });
    carregar();
  };

  const total = agendamentos.length;
  const confirmados = agendamentos.filter((a) => a.status === "confirmado").length;
  const pendentes = agendamentos.filter((a) => a.status === "pendente").length;

  return (
    <div>
      {/* Resumo */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[{ label: "Total", value: total }, { label: "Confirmados", value: confirmados }, { label: "Pendentes", value: pendentes }].map((s) => (
          <div key={s.label} className="bg-white p-5 border border-[#E5E5E5]">
            <p className="text-xs font-bold tracking-widest uppercase text-[#8A8A8A]">{s.label}</p>
            <p className="text-3xl font-black mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-white border border-[#E5E5E5] p-5 mb-6">
        <p className="text-xs font-bold tracking-widest uppercase text-[#8A8A8A] mb-4">Filtros</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-[#4A4A4A] mb-1 block">Data</label>
            <input type="date" value={filtroData} onChange={(e) => setFiltroData(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#0A0A0A]" />
          </div>
          <div>
            <label className="text-xs text-[#4A4A4A] mb-1 block">Turma</label>
            <select value={filtroTurmaId} onChange={(e) => setFiltroTurmaId(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#0A0A0A] appearance-none">
              <option value="">Todas</option>
              {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#4A4A4A] mb-1 block">Professor</label>
            <select value={filtroProfId} onChange={(e) => setFiltroProfId(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#0A0A0A] appearance-none">
              <option value="">Todos</option>
              {professores.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#4A4A4A] mb-1 block">Status</label>
            <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#0A0A0A] appearance-none">
              <option value="">Todos</option>
              <option value="pendente">Pendente</option>
              <option value="confirmado">Confirmado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white border border-[#E5E5E5] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#8A8A8A] text-sm">Carregando...</div>
        ) : agendamentos.length === 0 ? (
          <div className="p-12 text-center text-[#8A8A8A] text-sm">Nenhum agendamento encontrado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#E5E5E5] bg-[#F2F2F2]">
                <tr>
                  {["Nome", "Contato", "Turma", "Professor", "Data", "Horário", "Status", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold tracking-widest uppercase text-[#4A4A4A]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {agendamentos.map((ag) => (
                  <tr key={ag.id} className="border-b border-[#F2F2F2] hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-4 py-3 font-medium">{ag.nome}</td>
                    <td className="px-4 py-3 text-[#4A4A4A]">
                      <a href={`https://wa.me/${ag.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {ag.whatsapp}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-[#4A4A4A]">{ag.turma.nome}</td>
                    <td className="px-4 py-3 text-[#4A4A4A]">{ag.professor.nome}</td>
                    <td className="px-4 py-3 text-[#4A4A4A]">{ag.data.split("-").reverse().join("/")}</td>
                    <td className="px-4 py-3 font-medium">{ag.horario}</td>
                    <td className="px-4 py-3">
                      {editandoId === ag.id ? (
                        <div className="flex gap-2">
                          <select defaultValue={ag.status} onChange={(e) => setNovoStatus(e.target.value)}
                            className="px-2 py-1 border border-[#E5E5E5] text-xs">
                            <option value="pendente">Pendente</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                          <button onClick={() => atualizarStatus(ag.id, novoStatus || ag.status)}
                            className="px-2 py-1 bg-[#0A0A0A] text-white text-xs">Ok</button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditandoId(ag.id); setNovoStatus(ag.status); }}
                          className={`px-2 py-1 border text-xs rounded-sm ${STATUS_COLORS[ag.status] ?? ""}`}>
                          {STATUS_LABELS[ag.status] ?? ag.status}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => excluir(ag.id)}
                        className="text-[#8A8A8A] hover:text-red-600 transition-colors text-xs uppercase tracking-widest">
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tab: Cronograma ──────────────────────────────────────────────────────────

function TabCronograma({ professores }: { professores: ProfessorAdmin[] }) {
  const [turmas, setTurmas] = useState<TurmaAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Partial<TurmaAdmin>>({});
  const [novaForm, setNovaForm] = useState(false);
  const [novaTurma, setNovaTurma] = useState({ nome: "", dias: [] as number[], horarios: "", vagasMax: 3, professorId: 0 });
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState("");

  const carregar = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/turmas");
    if (res.ok) setTurmas(await res.json());
    setLoading(false);
  };

  useEffect(() => { carregar(); }, []);

  const iniciarEdicao = (t: TurmaAdmin) => {
    setEditandoId(t.id);
    setDraft({ nome: t.nome, dias: [...t.dias], horarios: [...t.horarios], vagasMax: t.vagasMax, professorId: t.professorId });
  };

  const salvar = async (id: number) => {
    setSalvando(true);
    const body = {
      nome: draft.nome,
      dias: draft.dias,
      horarios: typeof draft.horarios === "string"
        ? (draft.horarios as string).split(",").map((h) => h.trim()).filter(Boolean)
        : draft.horarios,
      vagasMax: draft.vagasMax,
      professorId: draft.professorId,
    };
    const res = await fetch(`/api/admin/turmas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSalvando(false);
    if (res.ok) { setEditandoId(null); setMsg("Salvo!"); setTimeout(() => setMsg(""), 2000); carregar(); }
  };

  const excluir = async (id: number) => {
    if (!confirm("Excluir turma e todos os agendamentos dela?")) return;
    await fetch(`/api/admin/turmas/${id}`, { method: "DELETE" });
    carregar();
  };

  const criarTurma = async () => {
    if (!novaTurma.nome || !novaTurma.professorId) return;
    setSalvando(true);
    const body = {
      nome: novaTurma.nome,
      dias: novaTurma.dias,
      horarios: novaTurma.horarios.split(",").map((h) => h.trim()).filter(Boolean),
      vagasMax: novaTurma.vagasMax,
      professorId: novaTurma.professorId,
    };
    const res = await fetch("/api/admin/turmas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSalvando(false);
    if (res.ok) { setNovaForm(false); setNovaTurma({ nome: "", dias: [], horarios: "", vagasMax: 3, professorId: 0 }); setMsg("Turma criada!"); setTimeout(() => setMsg(""), 2000); carregar(); }
  };

  const toggleDia = (dias: number[], dia: number, set: (d: number[]) => void) => {
    set(dias.includes(dia) ? dias.filter((d) => d !== dia) : [...dias, dia].sort());
  };

  if (loading) return <div className="p-12 text-center text-[#8A8A8A] text-sm">Carregando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs text-[#8A8A8A]">{turmas.length} turmas cadastradas</p>
        <div className="flex items-center gap-4">
          {msg && <span className="text-xs text-green-600 font-medium">{msg}</span>}
          <button onClick={() => setNovaForm(!novaForm)}
            className="px-4 py-2 bg-[#0A0A0A] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#333]">
            + Nova turma
          </button>
        </div>
      </div>

      {/* Form nova turma */}
      {novaForm && (
        <div className="bg-white border border-[#0A0A0A] p-5 mb-6">
          <p className="text-xs font-bold tracking-widest uppercase text-[#8A8A8A] mb-4">Nova turma</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs text-[#4A4A4A] mb-1 block">Nome</label>
              <input value={novaTurma.nome} onChange={(e) => setNovaTurma({ ...novaTurma, nome: e.target.value })}
                className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#0A0A0A]" placeholder="ex: Iniciante" />
            </div>
            <div>
              <label className="text-xs text-[#4A4A4A] mb-1 block">Horários (vírgula)</label>
              <input value={novaTurma.horarios} onChange={(e) => setNovaTurma({ ...novaTurma, horarios: e.target.value })}
                className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#0A0A0A]" placeholder="06:00, 20:00" />
            </div>
            <div>
              <label className="text-xs text-[#4A4A4A] mb-1 block">Professor</label>
              <select value={novaTurma.professorId} onChange={(e) => setNovaTurma({ ...novaTurma, professorId: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#0A0A0A] appearance-none">
                <option value={0}>Selecionar...</option>
                {professores.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-[#4A4A4A] mb-1 block">Vagas máx.</label>
              <input type="number" value={novaTurma.vagasMax} onChange={(e) => setNovaTurma({ ...novaTurma, vagasMax: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#0A0A0A]" min={1} />
            </div>
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="text-xs text-[#4A4A4A] mb-2 block">Dias da semana</label>
              <div className="flex flex-wrap gap-2">
                {[1,2,3,4,5,6].map((d) => (
                  <button key={d} type="button"
                    onClick={() => toggleDia(novaTurma.dias, d, (dias) => setNovaTurma({ ...novaTurma, dias }))}
                    className={`px-3 py-1 text-xs font-bold border transition-colors ${novaTurma.dias.includes(d) ? "bg-[#0A0A0A] text-white border-[#0A0A0A]" : "bg-white text-[#4A4A4A] border-[#E5E5E5]"}`}>
                    {DIAS_LABELS[d]}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={criarTurma} disabled={salvando}
              className="px-4 py-2 bg-[#0A0A0A] text-white text-xs font-bold tracking-widest uppercase disabled:opacity-50">
              {salvando ? "Salvando..." : "Criar"}
            </button>
            <button onClick={() => setNovaForm(false)}
              className="px-4 py-2 border border-[#E5E5E5] text-xs text-[#4A4A4A] tracking-widest uppercase hover:border-[#0A0A0A]">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de turmas */}
      <div className="space-y-3">
        {turmas.map((t) => (
          <div key={t.id} className="bg-white border border-[#E5E5E5]">
            {editandoId === t.id ? (
              <div className="p-5">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-[#4A4A4A] mb-1 block">Nome</label>
                    <input value={draft.nome ?? ""} onChange={(e) => setDraft({ ...draft, nome: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#0A0A0A]" />
                  </div>
                  <div>
                    <label className="text-xs text-[#4A4A4A] mb-1 block">Horários (vírgula)</label>
                    <input
                      value={Array.isArray(draft.horarios) ? (draft.horarios as string[]).join(", ") : draft.horarios ?? ""}
                      onChange={(e) => setDraft({ ...draft, horarios: e.target.value as unknown as string[] })}
                      className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#0A0A0A]" />
                  </div>
                  <div>
                    <label className="text-xs text-[#4A4A4A] mb-1 block">Professor</label>
                    <select value={draft.professorId ?? ""} onChange={(e) => setDraft({ ...draft, professorId: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#0A0A0A] appearance-none">
                      {professores.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#4A4A4A] mb-1 block">Vagas máx.</label>
                    <input type="number" value={draft.vagasMax ?? 3} onChange={(e) => setDraft({ ...draft, vagasMax: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#0A0A0A]" min={1} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-[#4A4A4A] mb-2 block">Dias da semana</label>
                    <div className="flex flex-wrap gap-2">
                      {[1,2,3,4,5,6].map((d) => (
                        <button key={d} type="button"
                          onClick={() => toggleDia(draft.dias ?? [], d, (dias) => setDraft({ ...draft, dias }))}
                          className={`px-3 py-1 text-xs font-bold border transition-colors ${(draft.dias ?? []).includes(d) ? "bg-[#0A0A0A] text-white border-[#0A0A0A]" : "bg-white text-[#4A4A4A] border-[#E5E5E5]"}`}>
                          {DIAS_LABELS[d]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => salvar(t.id)} disabled={salvando}
                    className="px-4 py-2 bg-[#0A0A0A] text-white text-xs font-bold tracking-widest uppercase disabled:opacity-50">
                    {salvando ? "Salvando..." : "Salvar"}
                  </button>
                  <button onClick={() => setEditandoId(null)}
                    className="px-4 py-2 border border-[#E5E5E5] text-xs text-[#4A4A4A] tracking-widest uppercase hover:border-[#0A0A0A]">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-6 min-w-0">
                  <div className="min-w-0">
                    <p className="font-bold text-sm">{t.nome}</p>
                    <p className="text-xs text-[#8A8A8A] mt-0.5">{t.professorNome}</p>
                  </div>
                  <div className="hidden sm:flex flex-wrap gap-1">
                    {t.dias.map((d) => (
                      <span key={d} className="px-2 py-0.5 bg-[#F2F2F2] text-xs font-bold">{DIAS_LABELS[d]}</span>
                    ))}
                  </div>
                  <div className="hidden lg:flex flex-wrap gap-1">
                    {t.horarios.map((h) => (
                      <span key={h} className="px-2 py-0.5 border border-[#E5E5E5] text-xs">{h}</span>
                    ))}
                  </div>
                  <span className="text-xs text-[#8A8A8A] shrink-0">{t.vagasMax} vagas</span>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button onClick={() => iniciarEdicao(t)}
                    className="text-xs font-bold uppercase tracking-widest text-[#0A0A0A] hover:text-[#555]">
                    Editar
                  </button>
                  <button onClick={() => excluir(t.id)}
                    className="text-xs uppercase tracking-widest text-[#8A8A8A] hover:text-red-600">
                    Excluir
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Professores ─────────────────────────────────────────────────────────

function TabProfessores({ onRefresh }: { onRefresh: () => void }) {
  const [professores, setProfessores] = useState<ProfessorAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Partial<ProfessorAdmin>>({});
  const [novaForm, setNovaForm] = useState(false);
  const [novoProf, setNovoProf] = useState({ nome: "", apelido: "", faixa: "Branca", grau: "", whatsapp: "" });
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState("");

  const carregar = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/professores");
    if (res.ok) setProfessores(await res.json());
    setLoading(false);
  };

  useEffect(() => { carregar(); }, []);

  const salvar = async (id: number) => {
    setSalvando(true);
    const res = await fetch(`/api/admin/professores/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setSalvando(false);
    if (res.ok) { setEditandoId(null); setMsg("Salvo!"); setTimeout(() => setMsg(""), 2000); carregar(); onRefresh(); }
  };

  const excluir = async (id: number) => {
    if (!confirm("Excluir professor? Turmas vinculadas perderão a referência.")) return;
    await fetch(`/api/admin/professores/${id}`, { method: "DELETE" });
    carregar();
    onRefresh();
  };

  const criar = async () => {
    if (!novoProf.nome) return;
    setSalvando(true);
    const res = await fetch("/api/admin/professores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoProf),
    });
    setSalvando(false);
    if (res.ok) { setNovaForm(false); setNovoProf({ nome: "", apelido: "", faixa: "Branca", grau: "", whatsapp: "" }); setMsg("Professor criado!"); setTimeout(() => setMsg(""), 2000); carregar(); onRefresh(); }
  };

  if (loading) return <div className="p-12 text-center text-[#8A8A8A] text-sm">Carregando...</div>;

  const faixas = ["Branca", "Cinza", "Amarela", "Laranja", "Verde", "Azul", "Roxa", "Marrom", "Preta", "Coral", "Vermelha"];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs text-[#8A8A8A]">{professores.length} professores</p>
        <div className="flex items-center gap-4">
          {msg && <span className="text-xs text-green-600 font-medium">{msg}</span>}
          <button onClick={() => setNovaForm(!novaForm)}
            className="px-4 py-2 bg-[#0A0A0A] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#333]">
            + Novo professor
          </button>
        </div>
      </div>

      {/* Form novo professor */}
      {novaForm && (
        <div className="bg-white border border-[#0A0A0A] p-5 mb-6">
          <p className="text-xs font-bold tracking-widest uppercase text-[#8A8A8A] mb-4">Novo professor</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs text-[#4A4A4A] mb-1 block">Nome *</label>
              <input value={novoProf.nome} onChange={(e) => setNovoProf({ ...novoProf, nome: e.target.value })}
                className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#0A0A0A]" placeholder="Nome completo" />
            </div>
            <div>
              <label className="text-xs text-[#4A4A4A] mb-1 block">Apelido</label>
              <input value={novoProf.apelido} onChange={(e) => setNovoProf({ ...novoProf, apelido: e.target.value })}
                className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#0A0A0A]" placeholder='ex: "Kibe"' />
            </div>
            <div>
              <label className="text-xs text-[#4A4A4A] mb-1 block">WhatsApp</label>
              <input value={novoProf.whatsapp} onChange={(e) => setNovoProf({ ...novoProf, whatsapp: e.target.value })}
                className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#0A0A0A]" placeholder="5547999999999" />
            </div>
            <div>
              <label className="text-xs text-[#4A4A4A] mb-1 block">Faixa</label>
              <select value={novoProf.faixa} onChange={(e) => setNovoProf({ ...novoProf, faixa: e.target.value })}
                className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#0A0A0A] appearance-none">
                {faixas.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-[#4A4A4A] mb-1 block">Grau (1–4)</label>
              <input type="number" min={1} max={4} value={novoProf.grau} onChange={(e) => setNovoProf({ ...novoProf, grau: e.target.value })}
                className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#0A0A0A]" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={criar} disabled={salvando}
              className="px-4 py-2 bg-[#0A0A0A] text-white text-xs font-bold tracking-widest uppercase disabled:opacity-50">
              {salvando ? "Salvando..." : "Criar"}
            </button>
            <button onClick={() => setNovaForm(false)}
              className="px-4 py-2 border border-[#E5E5E5] text-xs text-[#4A4A4A] tracking-widest uppercase hover:border-[#0A0A0A]">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      <div className="space-y-3">
        {professores.map((p) => (
          <div key={p.id} className="bg-white border border-[#E5E5E5]">
            {editandoId === p.id ? (
              <div className="p-5">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-[#4A4A4A] mb-1 block">Nome</label>
                    <input value={draft.nome ?? ""} onChange={(e) => setDraft({ ...draft, nome: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#0A0A0A]" />
                  </div>
                  <div>
                    <label className="text-xs text-[#4A4A4A] mb-1 block">Apelido</label>
                    <input value={draft.apelido ?? ""} onChange={(e) => setDraft({ ...draft, apelido: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#0A0A0A]" />
                  </div>
                  <div>
                    <label className="text-xs text-[#4A4A4A] mb-1 block">WhatsApp</label>
                    <input value={draft.whatsapp ?? ""} onChange={(e) => setDraft({ ...draft, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#0A0A0A]" />
                  </div>
                  <div>
                    <label className="text-xs text-[#4A4A4A] mb-1 block">Faixa</label>
                    <select value={draft.faixa ?? ""} onChange={(e) => setDraft({ ...draft, faixa: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#0A0A0A] appearance-none">
                      {faixas.map((f) => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#4A4A4A] mb-1 block">Grau (1–4)</label>
                    <input type="number" min={1} max={4} value={draft.grau ?? ""} onChange={(e) => setDraft({ ...draft, grau: parseInt(e.target.value) || undefined })}
                      className="w-full px-3 py-2 border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#0A0A0A]" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => salvar(p.id)} disabled={salvando}
                    className="px-4 py-2 bg-[#0A0A0A] text-white text-xs font-bold tracking-widest uppercase disabled:opacity-50">
                    {salvando ? "Salvando..." : "Salvar"}
                  </button>
                  <button onClick={() => setEditandoId(null)}
                    className="px-4 py-2 border border-[#E5E5E5] text-xs text-[#4A4A4A] tracking-widest uppercase hover:border-[#0A0A0A]">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-6 min-w-0">
                  <div className="min-w-0">
                    <p className="font-bold text-sm">{p.nome}{p.apelido ? <span className="text-[#8A8A8A] font-normal"> &quot;{p.apelido}&quot;</span> : null}</p>
                    <p className="text-xs text-[#8A8A8A] mt-0.5">
                      Faixa {p.faixa}{p.grau ? ` ${p.grau}° grau` : ""} {p.destaque ? "· Fundador" : ""}
                    </p>
                  </div>
                  <p className="hidden sm:block text-xs text-[#4A4A4A]">{p.whatsapp || <span className="text-[#E5E5E5]">Sem WhatsApp</span>}</p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button onClick={() => { setEditandoId(p.id); setDraft({ nome: p.nome, apelido: p.apelido ?? "", faixa: p.faixa, grau: p.grau ?? undefined, whatsapp: p.whatsapp }); }}
                    className="text-xs font-bold uppercase tracking-widest text-[#0A0A0A] hover:text-[#555]">
                    Editar
                  </button>
                  <button onClick={() => excluir(p.id)}
                    className="text-xs uppercase tracking-widest text-[#8A8A8A] hover:text-red-600">
                    Excluir
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

type Tab = "agendamentos" | "cronograma" | "professores";

export default function AdminDashboard() {
  const [aba, setAba] = useState<Tab>("agendamentos");
  const [turmas, setTurmas] = useState<TurmaAdmin[]>([]);
  const [professores, setProfessores] = useState<ProfessorAdmin[]>([]);

  const carregarBase = async () => {
    const [rt, rp] = await Promise.all([
      fetch("/api/admin/turmas"),
      fetch("/api/admin/professores"),
    ]);
    if (rt.ok) setTurmas(await rt.json());
    if (rp.ok) setProfessores(await rp.json());
  };

  useEffect(() => { carregarBase(); }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: "agendamentos", label: "Agendamentos" },
    { id: "cronograma", label: "Cronograma" },
    { id: "professores", label: "Professores" },
  ];

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      {/* Topbar */}
      <div className="bg-[#0A0A0A] text-white px-6 py-4 flex items-center justify-between">
        <span className="font-black tracking-widest uppercase text-sm">TMC — Painel Admin</span>
        <button onClick={logout} className="text-xs text-[#8A8A8A] hover:text-white transition-colors uppercase tracking-widest">
          Sair
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-[#E5E5E5] px-6">
        <div className="max-w-7xl mx-auto flex gap-0">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setAba(t.id)}
              className={`px-5 py-4 text-xs font-bold tracking-widest uppercase border-b-2 transition-colors ${
                aba === t.id
                  ? "border-[#0A0A0A] text-[#0A0A0A]"
                  : "border-transparent text-[#8A8A8A] hover:text-[#0A0A0A]"
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {aba === "agendamentos" && <TabAgendamentos turmas={turmas} professores={professores} />}
        {aba === "cronograma" && <TabCronograma professores={professores} />}
        {aba === "professores" && <TabProfessores onRefresh={carregarBase} />}
      </div>
    </div>
  );
}
