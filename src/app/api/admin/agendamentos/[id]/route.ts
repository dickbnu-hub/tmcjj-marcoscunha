import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

async function checkAuth() {
  const session = await getSession();
  return session.isLoggedIn === true;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status, data, horario, turmaId, professorId } = body;

  const update: Record<string, unknown> = {};
  if (status) update.status = status;
  if (data) update.data = data;
  if (horario) update.horario = horario;
  if (turmaId) update.turmaId = parseInt(turmaId);
  if (professorId) update.professorId = parseInt(professorId);

  const agendamento = await prisma.agendamento.update({
    where: { id: parseInt(id) },
    data: update,
  });

  return NextResponse.json(agendamento);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.agendamento.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
