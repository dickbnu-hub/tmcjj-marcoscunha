import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Populando banco de dados...");

  await prisma.agendamento.deleteMany();
  await prisma.turma.deleteMany();
  await prisma.professor.deleteMany();

  // --- Professores ---
  const marcos = await prisma.professor.create({
    data: { nome: "Marcos Cunha", faixa: "Faixa Preta", grau: 4, whatsapp: "5547997898775", foto: "/professores/marcos-cunha.jpg", destaque: true },
  });

  const wolgher = await prisma.professor.create({
    data: { nome: "Marcos Wolgher", faixa: "Faixa Preta", whatsapp: "[WHATSAPP_MARCOS_WOLGHER]", foto: "/professores/placeholder.jpg" },
  });

  const luiz = await prisma.professor.create({
    data: { nome: "Luiz André", faixa: "Faixa Preta", whatsapp: "[WHATSAPP_LUIZ_ANDRE]", foto: "/professores/placeholder.jpg" },
  });

  const layla = await prisma.professor.create({
    data: { nome: "Layla", faixa: "Faixa Azul", whatsapp: "[WHATSAPP_LAYLA]", foto: "/professores/layla.jpg" },
  });

  const bruna = await prisma.professor.create({
    data: { nome: "Bruna Borba", faixa: "Faixa Preta", whatsapp: "[WHATSAPP_BRUNA]", foto: "/professores/placeholder.jpg" },
  });

  const amanda = await prisma.professor.create({
    data: { nome: "Amanda Souza", faixa: "Faixa Preta", whatsapp: "[WHATSAPP_AMANDA]", foto: "/professores/amanda-souza.jpg" },
  });

  const pablo = await prisma.professor.create({
    data: { nome: "Pablo", faixa: "Faixa Marrom", whatsapp: "[WHATSAPP_PABLO]", foto: "/professores/pablo.jpg" },
  });

  const kibe = await prisma.professor.create({
    data: { nome: "André", apelido: "Kibe", faixa: "Faixa Preta", whatsapp: "[WHATSAPP_KIBE]", foto: "/professores/placeholder.jpg" },
  });

  // --- Turmas ---
  // Seg/Qua
  await prisma.turma.create({ data: { nome: "Iniciante a Avançado", diasSemana: JSON.stringify([1,3]), horarios: JSON.stringify(["06:00"]), vagasMax: 3, professorId: wolgher.id } });
  await prisma.turma.create({ data: { nome: "Intermediário e Avançado (Wolgher)", diasSemana: JSON.stringify([1,3]), horarios: JSON.stringify(["09:00"]), vagasMax: 3, professorId: wolgher.id } });
  await prisma.turma.create({ data: { nome: "Intermediário e Avançado", diasSemana: JSON.stringify([1,3]), horarios: JSON.stringify(["12:00","20:00"]), vagasMax: 3, professorId: luiz.id } });
  await prisma.turma.create({ data: { nome: "Baby", diasSemana: JSON.stringify([1,3]), horarios: JSON.stringify(["18:30"]), vagasMax: 3, professorId: layla.id } });
  await prisma.turma.create({ data: { nome: "Kids", diasSemana: JSON.stringify([1,3]), horarios: JSON.stringify(["19:10"]), vagasMax: 3, professorId: wolgher.id } });

  // Ter/Qui
  await prisma.turma.create({ data: { nome: "Feminino", diasSemana: JSON.stringify([2,4]), horarios: JSON.stringify(["06:45"]), vagasMax: 3, professorId: bruna.id, professorDisplay: "Bruna Borba e Amanda Souza" } });
  await prisma.turma.create({ data: { nome: "No-Gi", diasSemana: JSON.stringify([2,4]), horarios: JSON.stringify(["12:00","21:00"]), vagasMax: 3, professorId: pablo.id } });
  await prisma.turma.create({ data: { nome: "No-Gi", diasSemana: JSON.stringify([2,4]), horarios: JSON.stringify(["15:00"]), vagasMax: 3, professorId: kibe.id } });
  await prisma.turma.create({ data: { nome: "Teens", diasSemana: JSON.stringify([2,4]), horarios: JSON.stringify(["19:00"]), vagasMax: 3, professorId: pablo.id } });
  await prisma.turma.create({ data: { nome: "Iniciante", diasSemana: JSON.stringify([2,4]), horarios: JSON.stringify(["20:00"]), vagasMax: 3, professorId: pablo.id } });

  // Sex
  await prisma.turma.create({ data: { nome: "Open Mat", diasSemana: JSON.stringify([5]), horarios: JSON.stringify(["12:00"]), vagasMax: 5, professorId: luiz.id } });

  // --- Agendamento de exemplo ---
  const turmaIniciante = await prisma.turma.findFirst({ where: { nome: "Iniciante" } });
  if (turmaIniciante) {
    await prisma.agendamento.create({
      data: { nome: "João Silva", whatsapp: "47999888777", turmaId: turmaIniciante.id, professorId: pablo.id, data: "2026-09-15", horario: "20:00", status: "confirmado" },
    });
    await prisma.agendamento.create({
      data: { nome: "Maria Oliveira", whatsapp: "47988777666", turmaId: turmaIniciante.id, professorId: pablo.id, data: "2026-09-15", horario: "20:00", status: "pendente" },
    });
  }

  console.log("✅ Seed concluído!");
  console.log(`   ${await prisma.professor.count()} professores`);
  console.log(`   ${await prisma.turma.count()} turmas`);
  console.log(`   ${await prisma.agendamento.count()} agendamentos`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
