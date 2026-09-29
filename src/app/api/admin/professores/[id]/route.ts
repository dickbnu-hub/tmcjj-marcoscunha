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
  const { nome, apelido, faixa, grau, whatsapp } = await req.json();

  const update: Record<string, unknown> = {};
  if (nome !== undefined) update.nome = nome;
  if (apelido !== undefined) update.apelido = apelido || null;
  if (faixa !== undefined) update.faixa = faixa;
  if (grau !== undefined) update.grau = grau ? parseInt(grau) : null;
  if (whatsapp !== undefined) update.whatsapp = whatsapp;

  const prof = await prisma.professor.update({ where: { id: parseInt(id) }, data: update });
  return NextResponse.json(prof);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  await prisma.professor.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
