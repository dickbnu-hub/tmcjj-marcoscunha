import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const turmas = await prisma.turma.findMany({
    include: { professor: { select: { id: true, nome: true } } },
    orderBy: { id: "asc" },
  });

  return NextResponse.json(
    turmas.map((t) => ({
      id: t.id,
      nome: t.nome,
      descricao: t.descricao ?? null,
      professorDisplay: t.professorDisplay ?? null,
      dias: JSON.parse(t.diasSemana) as number[],
      horarios: JSON.parse(t.horarios) as string[],
      vagasMax: t.vagasMax,
      professorId: t.professorId,
      professorNome: t.professorDisplay ?? t.professor.nome,
    }))
  );
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { nome, dias, horarios, vagasMax, professorId } = await req.json();

  const turma = await prisma.turma.create({
    data: {
      nome,
      diasSemana: JSON.stringify(dias),
      horarios: JSON.stringify(horarios),
      vagasMax: parseInt(vagasMax) || 3,
      professorId: parseInt(professorId),
    },
  });

  return NextResponse.json(turma);
}
