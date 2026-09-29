"use client";
import { useState, useEffect } from "react";

interface TurmaOpcao {
  id: number;
  nome: string;
  descricao: string | null;
  dias: number[];
  horarios: string[];
  professorNome: string;
}

interface SlotDisponivel {
  data: string;
  diaSemana: string;
  horario: string;
  vagasRestantes: number;
}

interface FormState {
  nome: string;
  whatsapp: string;
  email: string;
  turmaId: string;
  data: string;
  horario: string;
}

type Status = "idle" | "loading" | "success" | "error";

export default function Agendamento() {
  const [turmas, setTurmas] = useState<TurmaOpcao[]>([]);
  const [form, setForm] = useState<FormState>({
    nome: "",
    whatsapp: "",
    email: "",
    turmaId: "",
    data: "",
    horario: "",
  });
  const [slots, setSlots] = useState<SlotDisponivel[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/turmas")
      .then((r) => r.json())
      .then(setTurmas)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.turmaId) {
      setSlots([]);
      setForm((f) => ({ ...f, data: "", horario: "" }));
      return;
    }
    setLoadingSlots(true);
    setForm((f) => ({ ...f, data: "", horario: "" }));

    fetch(`/api/turmas/${form.turmaId}/disponibilidade`)
      .then((r) => r.json())
      .then((data: SlotDisponivel[]) => setSlots(data))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [form.turmaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.whatsapp || !form.turmaId || !form.data || !form.horario) {
      setErrorMsg("Preencha todos os campos obrigatórios.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/agendamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Erro ao agendar");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erro desconhecido");
    }
  };

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (status !== "idle") setStatus("idle");
  };

  if (status === "success") {
    return (
      <section id="agendamento" className="py-24 bg-[#F2F2F2]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-[#0A0A0A] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-[#0A0A0A] mb-4">Agendamento confirmado!</h2>
          <p className="text-[#4A4A4A] text-lg mb-2">
            Recebemos seu pedido, <strong>{form.nome}</strong>.
          </p>
          <p className="text-[#8A8A8A] mb-8">
            O professor entrará em contato pelo WhatsApp para confirmar sua aula experimental.
          </p>
          <button
            onClick={() => {
              setStatus("idle");
              setForm({ nome: "", whatsapp: "", email: "", turmaId: "", data: "", horario: "" });
            }}
            className="px-6 py-3 border border-[#0A0A0A] text-sm font-semibold tracking-widest uppercase hover:bg-[#0A0A0A] hover:text-white transition-colors"
          >
            Fazer outro agendamento
          </button>
        </div>
      </section>
    );
  }

  const datasUnicas = [...new Map(slots.map((s) => [s.data, s])).values()];
  const horariosParaData = slots.filter((s) => s.data === form.data);
  const turmaSelecionada = turmas.find((t) => String(t.id) === form.turmaId);

  return (
    <section id="agendamento" className="py-24 bg-[#F2F2F2]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="mb-14">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#8A8A8A]">
            Gratuito
          </span>
          <h2 className="mt-2 text-4xl lg:text-5xl font-black tracking-tight text-[#0A0A0A]">
            Agende sua aula experimental
          </h2>
          <p className="mt-4 text-[#4A4A4A]">
            Primeira aula gratuita e sem compromisso. Escolha a turma e o horário ideal para você.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nome */}
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-[#4A4A4A] mb-2">
              Nome completo *
            </label>
            <input
              type="text"
              value={form.nome}
              onChange={set("nome")}
              required
              placeholder="Seu nome"
              className="w-full px-4 py-3 bg-white border border-[#E5E5E5] text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A] transition-colors text-sm"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-[#4A4A4A] mb-2">
              WhatsApp *
            </label>
            <input
              type="tel"
              value={form.whatsapp}
              onChange={set("whatsapp")}
              required
              placeholder="(47) 99999-9999"
              className="w-full px-4 py-3 bg-white border border-[#E5E5E5] text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A] transition-colors text-sm"
            />
          </div>

          {/* E-mail */}
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-[#4A4A4A] mb-2">
              E-mail <span className="text-[#8A8A8A] font-normal normal-case">(opcional)</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 bg-white border border-[#E5E5E5] text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A] transition-colors text-sm"
            />
          </div>

          {/* Turma */}
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-[#4A4A4A] mb-2">
              Turma *
            </label>
            <select
              value={form.turmaId}
              onChange={set("turmaId")}
              required
              className="w-full px-4 py-3 bg-white border border-[#E5E5E5] text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A] transition-colors text-sm appearance-none"
            >
              <option value="">Selecione uma turma</option>
              {turmas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}{t.descricao ? ` — ${t.descricao}` : ""}
                </option>
              ))}
            </select>
            {turmaSelecionada && (
              <p className="mt-1.5 text-xs text-[#8A8A8A]">
                Professor: {turmaSelecionada.professorNome}
              </p>
            )}
          </div>

          {/* Data */}
          {form.turmaId && (
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-[#4A4A4A] mb-2">
                Data *
              </label>
              {loadingSlots ? (
                <p className="text-sm text-[#8A8A8A]">Buscando datas disponíveis...</p>
              ) : datasUnicas.length === 0 ? (
                <p className="text-sm text-[#8A8A8A]">Sem vagas disponíveis nas próximas 2 semanas.</p>
              ) : (
                <select
                  value={form.data}
                  onChange={set("data")}
                  required
                  className="w-full px-4 py-3 bg-white border border-[#E5E5E5] text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A] transition-colors text-sm appearance-none"
                >
                  <option value="">Selecione uma data</option>
                  {datasUnicas.map((s) => (
                    <option key={s.data} value={s.data}>
                      {s.diaSemana} ({s.data.split("-").reverse().join("/")})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Horário */}
          {form.data && (
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-[#4A4A4A] mb-2">
                Horário *
              </label>
              <select
                value={form.horario}
                onChange={set("horario")}
                required
                className="w-full px-4 py-3 bg-white border border-[#E5E5E5] text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A] transition-colors text-sm appearance-none"
              >
                <option value="">Selecione um horário</option>
                {horariosParaData.map((s) => (
                  <option key={s.horario} value={s.horario}>
                    {s.horario} — {s.vagasRestantes} vaga{s.vagasRestantes !== 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Erro */}
          {(status === "error" || errorMsg) && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-3 border border-red-200">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading" || !form.data || !form.horario}
            className="w-full py-4 bg-[#0A0A0A] text-white text-sm font-bold tracking-widest uppercase hover:bg-[#111111] transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "Agendando..." : "Confirmar agendamento"}
          </button>
        </form>
      </div>
    </section>
  );
}
