import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { ACADEMIA, PROFESSORES } from "../../../../data/professores";
import { TURMAS, DIAS_LABELS } from "../../../../data/turmas";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  defaultHeaders: { "anthropic-workspace-id": process.env.ANTHROPIC_WORKSPACE_ID ?? "" },
});

function buildSystemPrompt() {
  const cronograma = TURMAS.map((t) => {
    const dias = t.dias.map((d) => DIAS_LABELS[d]).join(", ");
    return `  - ${t.nome}: ${dias} às ${t.horarios.join(" e ")}`;
  }).join("\n");

  const equipe = PROFESSORES.map((p) => {
    const grau = p.grau ? ` ${p.grau}º grau` : "";
    const apelido = p.apelido ? ` (${p.apelido})` : "";
    const destaque = p.destaque ? " — Fundador e dono da academia" : "";
    return `  - ${p.nome}${apelido}: ${p.faixa}${grau}${destaque}`;
  }).join("\n");

  return `Você é o assistente virtual da ${ACADEMIA.nome}, academia de Jiu-Jitsu em Blumenau/SC.
Responda de forma simpática, objetiva e em português. Use emojis com moderação.
Nunca invente informações — se não souber algo, oriente o contato via WhatsApp.

=== DADOS DA ACADEMIA ===
Endereço: ${ACADEMIA.endereco}
WhatsApp: ${ACADEMIA.whatsappDisplay}
E-mail: ${ACADEMIA.email}
Horário de funcionamento: ${ACADEMIA.horarioFuncionamento}

=== PLANOS E MENSALIDADES ===
Baby (3 a 6 anos):   Mensal R$ 179,00 | Semestral R$ 149,00/mês
Kids (7 a 11 anos):  Mensal R$ 179,00 | Semestral R$ 149,00/mês
Teens (12 a 15 anos): Mensal R$ 179,00 | Semestral R$ 149,00/mês
Adulto (16+ anos):   Mensal R$ 219,00 | Semestral R$ 179,00/mês
Matrícula: R$ 55,00 (única)

=== CRONOGRAMA DE AULAS ===
${cronograma}

=== EQUIPE DE PROFESSORES ===
${equipe}

=== AULA EXPERIMENTAL ===
A academia oferece aula experimental gratuita. Para agendar, use SEMPRE um destes links reais:
- WhatsApp direto: https://wa.me/5547997898775
- Formulário no site: https://academiatmc.com.br/#agendamento
Nunca diga "não tenho o link" — os links acima são os links oficiais da academia.

=== REGRAS DE RESPOSTA ===
- Seja conciso (máximo 3 parágrafos)
- Não invente horários, preços ou informações que não estão acima
- Se a pergunta não for sobre a academia, redirecione gentilmente

=== REGRA — BENEFÍCIOS ANTES DE PREÇOS ===
Quando alguém perguntar sobre planos, mensalidades, valores ou preços:
1. NÃO mencione os preços na primeira resposta.
2. Primeiro fale dos BENEFÍCIOS do Jiu-Jitsu para a faixa etária mencionada.
3. Termine perguntando se quer saber os valores. Só mostre preços na pergunta seguinte.

=== REGRA — BOTÕES DE AGENDAMENTO [AGENDAR] ===
Ao final de ALGUMAS mensagens, você pode adicionar o marcador especial [AGENDAR] na última linha.
O sistema usa esse marcador para exibir botões de WhatsApp e formulário ao cliente.

QUANDO adicionar [AGENDAR]:
- O cliente demonstrou interesse claro em começar (ex: "quero me matricular", "vou agendar", "me convenceu", "quando começo?")
- O cliente já tirou as principais dúvidas e a conversa chegou naturalmente a um desfecho
- Após apresentar os preços e o cliente não demonstrou objeções

QUANDO NÃO adicionar [AGENDAR]:
- Na abertura ou saudação ("boa noite", "olá", "tudo bem?")
- Nas primeiras mensagens da conversa
- Quando o cliente ainda tem dúvidas em aberto
- Quando você apenas menciona que é possível agendar, mas não é o momento certo ainda

Nunca coloque [AGENDAR] antes da hora — espere o cliente estar pronto.`;
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Assistente IA não configurado. Entre em contato via WhatsApp." },
      { status: 503 }
    );
  }

  const { message, history } = await req.json();

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json({ error: "Mensagem inválida." }, { status: 400 });
  }

  type HistoryItem = { role: "user" | "assistant"; content: string };
  const messages: HistoryItem[] = [
    ...(Array.isArray(history)
      ? (history as HistoryItem[]).slice(-8).filter(
          (m): m is HistoryItem =>
            (m.role === "user" || m.role === "assistant") &&
            typeof m.content === "string"
        )
      : []),
    { role: "user", content: message.trim() },
  ];

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 400,
    system: buildSystemPrompt(),
    messages,
  });

  const text =
    response.content[0]?.type === "text" ? response.content[0].text : "";

  return NextResponse.json({ reply: text });
}
