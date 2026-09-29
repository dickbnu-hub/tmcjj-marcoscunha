// Camada de envio de mensagens WhatsApp.
// Suporta: Z-API (recomendado Brasil), Meta Cloud API, ou fallback via link wa.me

export interface WhatsAppMessage {
  to: string; // número internacional sem +: 5547...
  text: string;
}

export interface SendResult {
  success: boolean;
  fallbackUrl?: string;
  error?: string;
}

// Limpa número para formato internacional: 5547999999999
export function sanitizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("55") && digits.length >= 12) return digits;
  if (digits.length === 11) return `55${digits}`; // 47999999999 → 5547...
  if (digits.length === 10) return `55${digits}`; // 4799999999 → 5547...
  return digits;
}

// ── Z-API ────────────────────────────────────────────────────────────────────
async function sendViaZApi(msg: WhatsAppMessage): Promise<SendResult> {
  const instanceId = process.env.ZAPI_INSTANCE_ID;
  const token = process.env.ZAPI_TOKEN;
  const clientToken = process.env.ZAPI_CLIENT_TOKEN;

  const url = `https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (clientToken) headers["Client-Token"] = clientToken;

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      phone: sanitizePhone(msg.to),
      message: msg.text,
    }),
  });

  const bodyText = await res.text();
  if (!res.ok) {
    console.error(`[Z-API] HTTP ${res.status}:`, bodyText);
    return { success: false, error: bodyText };
  }
  console.log("[Z-API] Enviado com sucesso:", bodyText);
  return { success: true };
}

// ── Meta Cloud API ────────────────────────────────────────────────────────────
async function sendViaMetaCloudApi(msg: WhatsAppMessage): Promise<SendResult> {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const version = process.env.WHATSAPP_API_VERSION ?? "v20.0";

  const res = await fetch(
    `https://graph.facebook.com/${version}/${phoneId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: sanitizePhone(msg.to),
        type: "text",
        text: { body: msg.text },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    return { success: false, error: err };
  }
  return { success: true };
}

function buildFallbackUrl(msg: WhatsAppMessage): string {
  return `https://wa.me/${sanitizePhone(msg.to)}?text=${encodeURIComponent(msg.text)}`;
}

export async function sendWhatsApp(msg: WhatsAppMessage): Promise<SendResult> {
  // Z-API (preferido)
  if (process.env.ZAPI_INSTANCE_ID && process.env.ZAPI_TOKEN) {
    try {
      const result = await sendViaZApi(msg);
      if (result.success) return result;
      console.error("[WhatsApp Z-API] Falhou:", result.error);
    } catch (e) {
      console.error("[WhatsApp Z-API] Exceção:", e);
    }
  }

  // Meta Cloud API
  if (process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_PHONE_ID) {
    try {
      const result = await sendViaMetaCloudApi(msg);
      if (result.success) return result;
      console.error("[WhatsApp Meta] Falhou:", result.error);
    } catch (e) {
      console.error("[WhatsApp Meta] Exceção:", e);
    }
  }

  // Fallback — link manual
  const fallbackUrl = buildFallbackUrl(msg);
  console.log("[WhatsApp FALLBACK] Envio manual necessário.");
  console.log(`  Para: ${msg.to}`);
  console.log(`  Texto: ${msg.text}`);
  console.log(`  Link: ${fallbackUrl}`);
  return { success: false, fallbackUrl };
}

// ── Mensagens ─────────────────────────────────────────────────────────────────

export function buildMsgProfessor(p: {
  alunoNome: string;
  alunoWhatsapp: string;
  turma: string;
  data: string;
  horario: string;
}): string {
  const dataFmt = p.data.split("-").reverse().join("/");
  return (
    `🥋 *Novo agendamento — TMC-MarcosCunha*\n\n` +
    `Aluno: *${p.alunoNome}*\n` +
    `WhatsApp: ${p.alunoWhatsapp}\n` +
    `Turma: ${p.turma}\n` +
    `Data: ${dataFmt}\n` +
    `Horário: ${p.horario}\n\n` +
    `Acesse o painel admin para confirmar ou cancelar:\n` +
    `http://localhost:3001/admin`
  );
}

export function buildMsgAluno(p: {
  alunoNome: string;
  turma: string;
  data: string;
  horario: string;
  professorNome: string;
}): string {
  const dataFmt = p.data.split("-").reverse().join("/");
  return (
    `🥋 *${p.alunoNome}, que passo incrível você acabou de dar!*\n\n` +
    `Sua aula experimental na *TMC-MarcosCunha* está confirmada. Estamos muito animados em te receber na tatame! A jornada no Jiu-Jitsu começa com esse primeiro passo — e você já deu. 💪\n\n` +
    `📋 *Detalhes da sua aula:*\n` +
    `Turma: ${p.turma}\n` +
    `Data: ${dataFmt}\n` +
    `Horário: ${p.horario}\n` +
    `Professor: ${p.professorNome}\n\n` +
    `📍 *Local:* Rua 25 de Julho, 1053, sala 1 — Itoupava Norte, Blumenau/SC\n\n` +
    `Venha com roupa confortável, água e muita vontade de aprender. Te esperamos! 🤙\n\n` +
    `Qualquer dúvida é só chamar aqui. Até lá! 🏆`
  );
}

// Mantém compatibilidade com chamadas antigas
export function buildAgendamentoMessage(params: {
  alunoNome: string;
  turma: string;
  data: string;
  horario: string;
}): string {
  return buildMsgProfessor({ ...params, alunoWhatsapp: "" });
}
