import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsApp, buildMsgProfessor, buildMsgAluno } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nome, whatsapp, email, turmaId, data, horario } = body;

    if (!nome || !whatsapp || !turmaId || !data || !horario) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
    }

    const turma = await prisma.turma.findUnique({
      where: { id: parseInt(turmaId) },
      include: { professor: true },
    });

    if (!turma) {
      return NextResponse.json({ error: "Turma não encontrada" }, { status: 404 });
    }

    // Verifica disponibilidade de vagas
    const vagasUsadas = await prisma.agendamento.count({
      where: {
        turmaId: turma.id,
        data,
        horario,
        status: { in: ["pendente", "confirmado"] },
      },
    });

    if (vagasUsadas >= turma.vagasMax) {
      return NextResponse.json(
        { error: "Sem vagas disponíveis para este horário." },
        { status: 409 }
      );
    }

    // Cria o agendamento
    const agendamento = await prisma.agendamento.create({
      data: {
        nome,
        whatsapp,
        email: email || null,
        turmaId: turma.id,
        professorId: turma.professorId,
        data,
        horario,
        status: "pendente",
      },
    });

    const professorDisplay = turma.professorDisplay ?? turma.professor.nome;

    // Notifica o professor
    const msgProfessor = buildMsgProfessor({
      alunoNome: nome,
      alunoWhatsapp: whatsapp,
      turma: turma.nome,
      data,
      horario,
    });
    const resultadoProfessor = await sendWhatsApp({
      to: turma.professor.whatsapp,
      text: msgProfessor,
    });

    // Notifica o aluno
    const msgAluno = buildMsgAluno({
      alunoNome: nome,
      turma: turma.nome,
      data,
      horario,
      professorNome: professorDisplay,
    });
    const resultadoAluno = await sendWhatsApp({ to: whatsapp, text: msgAluno });

    return NextResponse.json({
      ok: true,
      id: agendamento.id,
      whatsappProfessorFallback: resultadoProfessor.fallbackUrl,
      whatsappAlunoFallback: resultadoAluno.fallbackUrl,
    });
  } catch (err) {
    console.error("[API /agendamento]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
