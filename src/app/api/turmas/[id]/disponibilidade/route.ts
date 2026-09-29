import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const turmaId = parseInt(id);

  if (isNaN(turmaId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const turmaDB = await prisma.turma.findUnique({ where: { id: turmaId } });
  if (!turmaDB) {
    return NextResponse.json({ error: "Turma não encontrada" }, { status: 404 });
  }

  const diasTurma = JSON.parse(turmaDB.diasSemana) as number[];
  const horariosTurma = JSON.parse(turmaDB.horarios) as string[];

  const agora = new Date();
  const datas: string[] = [];

  for (let i = 0; i <= 14; i++) {
    const d = new Date(agora);
    d.setDate(agora.getDate() + i);
    const diaSemana = d.getDay() === 0 ? 7 : d.getDay();
    if (diasTurma.includes(diaSemana)) {
      datas.push(d.toISOString().split("T")[0]);
    }
  }

  const agendamentosExistentes = await prisma.agendamento.findMany({
    where: {
      turmaId,
      data: { in: datas },
      status: { in: ["pendente", "confirmado"] },
    },
    select: { data: true, horario: true },
  });

  const contagem: Record<string, number> = {};
  for (const ag of agendamentosExistentes) {
    const key = `${ag.data}|${ag.horario}`;
    contagem[key] = (contagem[key] ?? 0) + 1;
  }

  const limiteMs = 60 * 60 * 1000; // 1 hora em ms

  const slots = [];
  for (const data of datas) {
    const d = new Date(data + "T12:00:00");
    const diaSemana = d.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
    });

    for (const horario of horariosTurma) {
      // Monta o datetime do início da aula no fuso de Brasília (UTC-3)
      const inicioAula = new Date(`${data}T${horario}:00-03:00`);

      // Só exibe se faltam mais de 1 hora para o início
      if (inicioAula.getTime() - agora.getTime() < limiteMs) continue;

      const key = `${data}|${horario}`;
      const usados = contagem[key] ?? 0;
      const vagasRestantes = turmaDB.vagasMax - usados;

      if (vagasRestantes > 0) {
        slots.push({ data, diaSemana, horario, vagasRestantes });
      }
    }
  }

  return NextResponse.json(slots);
}
