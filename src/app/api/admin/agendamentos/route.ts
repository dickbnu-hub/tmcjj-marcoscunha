import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

async function checkAuth() {
  const session = await getSession();
  return session.isLoggedIn === true;
}

export async function GET(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const data = searchParams.get("data");
  const professorId = searchParams.get("professorId");
  const turmaId = searchParams.get("turmaId");
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};
  if (data) where.data = data;
  if (professorId) where.professorId = parseInt(professorId);
  if (turmaId) where.turmaId = parseInt(turmaId);
  if (status) where.status = status;

  const agendamentos = await prisma.agendamento.findMany({
    where,
    include: { turma: true, professor: true },
    orderBy: [{ data: "asc" }, { horario: "asc" }],
  });

  return NextResponse.json(agendamentos);
}
