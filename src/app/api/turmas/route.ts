import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const turmas = await prisma.turma.findMany({
    include: { professor: { select: { id: true, nome: true, apelido: true } } },
    orderBy: { id: "asc" },
  });

  return NextResponse.json(
    turmas.map((t) => ({
      id: t.id,
      nome: t.nome,
      descricao: t.descricao ?? null,
      dias: JSON.parse(t.diasSemana) as number[],
      horarios: JSON.parse(t.horarios) as string[],
      vagasMax: t.vagasMax,
      professorId: t.professorId,
      professorNome: t.professorDisplay
        ?? (t.professor.nome + (t.professor.apelido ? ` "${t.professor.apelido}"` : "")),
    }))
  );
}
