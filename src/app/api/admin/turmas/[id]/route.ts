import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

async function checkAuth() {
  const session = await getSession();
  return session.isLoggedIn === true;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const { nome, dias, horarios, vagasMax, professorId, descricao, professorDisplay } = await req.json();

  const update: Record<string, unknown> = {};
  if (nome !== undefined) update.nome = nome;
  if (dias !== undefined) update.diasSemana = JSON.stringify(dias);
  if (horarios !== undefined) update.horarios = JSON.stringify(horarios);
  if (vagasMax !== undefined) update.vagasMax = parseInt(vagasMax);
  if (professorId !== undefined) update.professorId = parseInt(professorId);
  if (descricao !== undefined) update.descricao = descricao || null;
  if (professorDisplay !== undefined) update.professorDisplay = professorDisplay || null;

  const turma = await prisma.turma.update({ where: { id: parseInt(id) }, data: update });
  return NextResponse.json(turma);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  await prisma.agendamento.deleteMany({ where: { turmaId: parseInt(id) } });
  await prisma.turma.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
