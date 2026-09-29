import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const professores = await prisma.professor.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json(professores);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { nome, apelido, faixa, grau, whatsapp } = await req.json();
  const prof = await prisma.professor.create({
    data: { nome, apelido: apelido || null, faixa, grau: grau ? parseInt(grau) : null, whatsapp, foto: "/professores/placeholder.jpg" },
  });
  return NextResponse.json(prof);
}
