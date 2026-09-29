"use client";
import { useState, useRef, useEffect } from "react";
import { TURMAS, DIAS_LABELS } from "../../data/turmas";
import { ACADEMIA, PROFESSORES } from "../../data/professores";

// ── Planos por faixa etária ───────────────────────────────────────────────────
const PLANOS_FAIXA = [
  {
    action: "plano_baby",
    label: "Baby (3 a 6 anos)",
    titulo: "Plano Baby",
    idade: "3 a 6 anos",
    mensal: "R$ 179,00",
    semestral: "R$ 149,00/mês",
    beneficio:
      "O Jiu-Jitsu Baby estimula a coordenação motora, o equilíbrio e a socialização de forma lúdica e segura. É a base ideal para o desenvolvimento físico e emocional dos pequenos! 🌟",
  },
  {
    action: "plano_kids",
    label: "Kids (7 a 11 anos)",
    titulo: "Plano Kids",
    idade: "7 a 11 anos",
    mensal: "R$ 179,00",
    semestral: "R$ 149,00/mês",
    beneficio:
      "Para as crianças, o Jiu-Jitsu desenvolve disciplina, foco e autoconfiança — além de ser uma ferramenta poderosa contra o bullying. Aprendem que respeito e esforço levam à vitória! 🥋",
  },
  {
    action: "plano_teens",
    label: "Teens (12 a 15 anos)",
    titulo: "Plano Teens",
    idade: "12 a 15 anos",
    mensal: "R$ 179,00",
    semestral: "R$ 149,00/mês",
    beneficio:
      "Na adolescência, o Jiu-Jitsu canaliza energia, fortalece o caráter e cria laços de amizade verdadeiros. Uma escolha que vai muito além do esporte! 💪",
  },
  {
    action: "plano_adulto",
    label: "A partir de 16 anos",
    titulo: "Plano Adulto",
    idade: "a partir de 16 anos",
    mensal: "R$ 219,00",
    semestral: "R$ 179,00/mês",
    beneficio:
      "Para adultos, o Jiu-Jitsu é condicionamento físico completo, alívio do estresse e uma comunidade incrível. Independente da sua forma física atual, você vai evoluir aula após aula! 🏆",
  },
];

// ── Tipos de mensagem ─────────────────────────────────────────────────────────
interface MsgSimples {
  tipo: "simples";
  from: "bot" | "user";
  text: string;
  options?: { label: string; action: string }[];
}

interface MsgPlano {
  tipo: "plano";
  from: "bot";
  plano: (typeof PLANOS_FAIXA)[0];
}

interface MsgIA {
  tipo: "ia";
  from: "bot" | "user";
  text: string;
  cta?: { label: string; href: string; style?: "green" | "dark" }[];
}

type Msg = MsgSimples | MsgPlano | MsgIA;

const MENU_PRINCIPAL = [
  { label: "Horários e turmas", action: "horarios" },
  { label: "Valores dos planos", action: "valores" },
  { label: "Endereço", action: "endereco" },
  { label: "Professores", action: "professores" },
  { label: "Agendar aula grátis", action: "agendar" },
];

// ── Lógica de resposta ────────────────────────────────────────────────────────
function respostaParaAcao(acao: string): Msg {
  // Planos por faixa
  const planoFaixa = PLANOS_FAIXA.find((p) => p.action === acao);
  if (planoFaixa) {
    return { tipo: "plano", from: "bot", plano: planoFaixa };
  }

  switch (acao) {
    case "horarios": {
      const linhas = TURMAS.map((t) => {
        const dias = t.dias.map((d) => DIAS_LABELS[d]).join(", ");
        const horarios = t.horarios.join(" e ");
        return `• *${t.nome}*: ${dias} — ${horarios}`;
      }).join("\n");
      return {
        tipo: "simples",
        from: "bot",
        text: `🗓 *Cronograma de aulas:*\n\n${linhas}\n\nQuer saber mais alguma coisa?`,
        options: MENU_PRINCIPAL,
      };
    }

    case "valores":
      return {
        tipo: "simples",
        from: "bot",
        text: "Qual faixa etária você quer consultar?",
        options: PLANOS_FAIXA.map((p) => ({ label: p.label, action: p.action })),
      };

    case "endereco":
      return {
        tipo: "simples",
        from: "bot",
        text:
          `📍 *Onde nos encontrar:*\n\n` +
          `${ACADEMIA.endereco}\n\n` +
          `🕐 ${ACADEMIA.horarioFuncionamento}`,
        options: [
          { label: "Abrir no Maps", action: "maps" },
          { label: "Voltar ao menu", action: "menu" },
        ],
      };

    case "professores": {
      const lista = PROFESSORES.map(
        (p) => `• *${p.nome}*${p.apelido ? ` (${p.apelido})` : ""} — ${p.faixa}${p.grau ? ` ${p.grau}º grau` : ""}`
      ).join("\n");
      return {
        tipo: "simples",
        from: "bot",
        text: `🥋 *Nossa equipe:*\n\n${lista}`,
        options: [
          { label: "Ver cronograma", action: "horarios" },
          { label: "Voltar ao menu", action: "menu" },
        ],
      };
    }

    case "agendar":
      return {
        tipo: "simples",
        from: "bot",
        text: "Perfeito! Clique abaixo para agendar sua aula experimental gratuita 👇",
        options: [{ label: "Ir para o formulário", action: "formulario" }],
      };

    case "whatsapp":
      window.open(`https://wa.me/${ACADEMIA.whatsapp}?text=Olá! Quero saber mais sobre os planos da TMC-MarcosCunha.`, "_blank");
      return {
        tipo: "simples",
        from: "bot",
        text: "Abrindo WhatsApp...",
        options: [{ label: "Voltar ao menu", action: "menu" }],
      };

    case "maps":
      window.open(`https://maps.google.com/?q=${encodeURIComponent(ACADEMIA.endereco)}`, "_blank");
      return {
        tipo: "simples",
        from: "bot",
        text: "Abrindo o Google Maps...",
        options: [{ label: "Voltar ao menu", action: "menu" }],
      };

    case "formulario":
      document.getElementById("agendamento")?.scrollIntoView({ behavior: "smooth" });
      return {
        tipo: "simples",
        from: "bot",
        text: "Levando você ao formulário de agendamento! Boa sorte na sua primeira aula 🥋",
        options: [{ label: "Voltar ao menu", action: "menu" }],
      };

    case "menu":
    default:
      return {
        tipo: "simples",
        from: "bot",
        text: "Como posso ajudar?",
        options: MENU_PRINCIPAL,
      };
  }
}

// ── Card de plano ─────────────────────────────────────────────────────────────
function CardPlano({
  plano,
  onAction,
}: {
  plano: (typeof PLANOS_FAIXA)[0];
  onAction: (a: string) => void;
}) {
  return (
    <div className="bg-[#0A0A0A] text-white rounded-none overflow-hidden w-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-white/10">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8A8A8A]">
          {plano.titulo} · {plano.idade}
        </span>
      </div>

      {/* Preços */}
      <div className="px-4 py-4 flex gap-4">
        <div className="flex-1 bg-white/5 p-3 border border-white/10">
          <p className="text-[10px] tracking-widest uppercase text-[#8A8A8A] mb-1">Mensal</p>
          <p className="text-xl font-black">{plano.mensal}</p>
        </div>
        <div className="flex-1 bg-white/5 p-3 border border-white/10 relative">
          <span className="absolute -top-2 left-2 bg-white text-[#0A0A0A] text-[9px] font-bold px-2 py-0.5 tracking-wide uppercase">
            Econômico
          </span>
          <p className="text-[10px] tracking-widest uppercase text-[#8A8A8A] mb-1">Semestral</p>
          <p className="text-xl font-black">{plano.semestral}</p>
        </div>
      </div>

      {/* Matrícula */}
      <div className="px-4 pb-3">
        <p className="text-[11px] text-[#8A8A8A]">
          + Matrícula: <strong className="text-white">R$ 55,00</strong>
        </p>
      </div>

      {/* Benefício */}
      <div className="mx-4 mb-4 p-3 bg-white/5 border-l-2 border-white/30 text-xs text-[#D1D5DB] leading-relaxed">
        {plano.beneficio}
      </div>

      {/* Ações */}
      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={() => onAction("agendar")}
          className="flex-1 py-2 bg-white text-[#0A0A0A] text-[10px] font-bold tracking-widest uppercase hover:bg-[#E5E5E5] transition-colors"
        >
          Aula grátis
        </button>
        <button
          onClick={() => onAction("whatsapp")}
          className="flex-1 py-2 border border-white/30 text-white text-[10px] font-bold tracking-widest uppercase hover:bg-white/10 transition-colors"
        >
          WhatsApp
        </button>
        <button
          onClick={() => onAction("menu")}
          className="px-3 py-2 border border-white/10 text-[#8A8A8A] text-[10px] hover:text-white transition-colors"
        >
          ←
        </button>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
const MENSAGEM_INICIAL: Msg = {
  tipo: "simples",
  from: "bot",
  text: `Olá! Bem-vindo à *TMC-MarcosCunha* 🥋\n\nComo posso ajudar você?`,
  options: MENU_PRINCIPAL,
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([MENSAGEM_INICIAL]);
  const [inputText, setInputText] = useState("");
  const [loadingIA, setLoadingIA] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open, loadingIA]);

  const handleAction = (acao: string) => {
    const labelMap: Record<string, string> = {
      horarios: "Horários e turmas",
      valores: "Valores dos planos",
      endereco: "Endereço",
      professores: "Professores",
      agendar: "Agendar aula grátis",
      menu: "Ver menu",
      formulario: "Ir para o formulário",
      whatsapp: "Falar no WhatsApp",
      maps: "Abrir no Maps",
      plano_baby: "Baby (3 a 6 anos)",
      plano_kids: "Kids (7 a 11 anos)",
      plano_teens: "Teens (12 a 15 anos)",
      plano_adulto: "A partir de 16 anos",
    };
    const userMsg: MsgSimples = { tipo: "simples", from: "user", text: labelMap[acao] ?? acao };
    const botResp = respostaParaAcao(acao);
    setMsgs((m) => [...m, userMsg, botResp]);
  };

  const handleSendIA = async () => {
    const text = inputText.trim();
    if (!text || loadingIA) return;
    setInputText("");
    setLoadingIA(true);

    const userMsg: MsgIA = { tipo: "ia", from: "user", text };
    setMsgs((m) => [...m, userMsg]);

    // Histórico das mensagens IA para contexto
    const history = msgs
      .filter((m): m is MsgIA => m.tipo === "ia")
      .map((m) => ({ role: m.from === "user" ? "user" : "assistant", content: m.text }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();
      const rawReply = data.reply || data.error || "Não consegui responder agora. Tente via WhatsApp.";
      const hasAgendar = rawReply.includes("[AGENDAR]");
      const reply = rawReply.replace(/\[AGENDAR\]/g, "").trim();
      const cta = hasAgendar
        ? [
            { label: "🗓 AGENDE SUA VISITA", href: "#agendamento", style: "dark" as const },
            {
              label: "📱 WhatsApp",
              href: `https://wa.me/${ACADEMIA.whatsapp}?text=Olá! Quero agendar uma aula experimental gratuita.`,
              style: "green" as const,
            },
          ]
        : undefined;
      const botMsg: MsgIA = { tipo: "ia", from: "bot", text: reply, cta };
      setMsgs((m) => [...m, botMsg]);
    } catch {
      const errMsg: MsgIA = {
        tipo: "ia",
        from: "bot",
        text: "Ops, erro de conexão. Tente novamente ou fale via WhatsApp 📱",
      };
      setMsgs((m) => [...m, errMsg]);
    } finally {
      setLoadingIA(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const renderText = (text: string) =>
    text.split("\n").map((line, i) => (
      <span key={i} className="block">
        {line
          .split(/(\*[^*]+\*|https?:\/\/\S+)/g)
          .map((part, j) => {
            if (part.startsWith("*") && part.endsWith("*"))
              return <strong key={j}>{part.slice(1, -1)}</strong>;
            if (part.startsWith("http"))
              return (
                <a
                  key={j}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-600 break-all"
                >
                  {part.includes("wa.me") ? "📱 Agendar pelo WhatsApp" : "🌐 Formulário do site"}
                </a>
              );
            return part;
          })}
      </span>
    ));

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#0A0A0A] text-white rounded-full shadow-xl flex items-center justify-center hover:bg-[#111111] transition-colors"
        aria-label="Chat"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Janela do chat */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white shadow-2xl border border-[#E5E5E5] flex flex-col max-h-[70vh]">
          {/* Header */}
          <div className="bg-[#0A0A0A] text-white px-4 py-3 flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold">
              TMC
            </div>
            <div>
              <p className="text-sm font-semibold">TMC-MarcosCunha</p>
              <p className="text-xs text-[#8A8A8A]">Atendimento online</p>
            </div>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {msgs.map((msg, i) => {
              if (msg.tipo === "plano") {
                return (
                  <div key={i} className="flex justify-start">
                    <div className="w-full">
                      <CardPlano plano={msg.plano} onAction={handleAction} />
                    </div>
                  </div>
                );
              }
              return (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[85%]">
                    <div
                      className={`px-3 py-2.5 text-sm leading-relaxed ${
                        msg.from === "user"
                          ? "bg-[#0A0A0A] text-white"
                          : "bg-[#F2F2F2] text-[#0A0A0A]"
                      }`}
                    >
                      {renderText(msg.text)}
                    </div>
                    {msg.tipo === "ia" && msg.from === "bot" && msg.cta && (
                      <div className="mt-2 flex flex-col gap-1.5">
                        {msg.cta.map((btn) =>
                          btn.href.startsWith("#") ? (
                            <a
                              key={btn.label}
                              href={btn.href}
                              onClick={() => setOpen(false)}
                              className={`block text-center py-2 text-xs font-bold tracking-wide transition-colors ${
                                btn.style === "green"
                                  ? "bg-[#25D366] text-white hover:opacity-90"
                                  : "bg-[#0A0A0A] text-white hover:bg-[#222]"
                              }`}
                            >
                              {btn.label}
                            </a>
                          ) : (
                            <a
                              key={btn.label}
                              href={btn.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`block text-center py-2 text-xs font-bold tracking-wide transition-colors ${
                                btn.style === "green"
                                  ? "bg-[#25D366] text-white hover:opacity-90"
                                  : "bg-[#0A0A0A] text-white hover:bg-[#222]"
                              }`}
                            >
                              {btn.label}
                            </a>
                          )
                        )}
                      </div>
                    )}
                    {msg.tipo === "simples" && msg.options && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {msg.options.map((opt) => (
                          <button
                            key={opt.action}
                            onClick={() => handleAction(opt.action)}
                            className="px-3 py-1.5 border border-[#E5E5E5] text-xs text-[#4A4A4A] hover:border-[#0A0A0A] hover:text-[#0A0A0A] transition-colors"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Indicador de digitação da IA */}
            {loadingIA && (
              <div className="flex justify-start">
                <div className="bg-[#F2F2F2] px-4 py-3 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-[#8A8A8A] rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-[#8A8A8A] rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-[#8A8A8A] rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Campo de texto livre — IA */}
          <div className="shrink-0 border-t border-[#E5E5E5] px-3 py-2 flex gap-2 items-center bg-white">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendIA()}
              placeholder="Pergunte qualquer coisa..."
              className="flex-1 text-sm outline-none text-[#0A0A0A] placeholder-[#AAAAAA] py-1"
              disabled={loadingIA}
            />
            <button
              onClick={handleSendIA}
              disabled={loadingIA || !inputText.trim()}
              className="w-8 h-8 bg-[#0A0A0A] text-white flex items-center justify-center disabled:opacity-30 hover:bg-[#222222] transition-colors shrink-0"
              aria-label="Enviar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
