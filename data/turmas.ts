// Fonte única de dados de turmas — usada no cronograma, agendamento e chat

export type DiaSemana = 1 | 2 | 3 | 4 | 5 | 6; // 1=Seg ... 6=Sab

export const DIAS_LABELS: Record<DiaSemana, string> = {
  1: "Segunda",
  2: "Terça",
  3: "Quarta",
  4: "Quinta",
  5: "Sexta",
  6: "Sábado",
};

export interface TurmaConfig {
  id: number;
  nome: string;
  descricao?: string;
  dias: DiaSemana[];
  horarios: string[];
  professorNome: string;
  professorId: number;
  vagasMax: number;
}

export const TURMAS: TurmaConfig[] = [
  // --- Segundas e Quartas ---
  {
    id: 1,
    nome: "Iniciante a Avançado",
    descricao: "Adultos que nunca praticaram ou já possuem experiência na modalidade",
    dias: [1, 3],
    horarios: ["06:00"],
    professorNome: "Marcos Wolgher",
    professorId: 2,
    vagasMax: 3,
  },
  {
    id: 2,
    nome: "Intermediário e Avançado",
    dias: [1, 3],
    horarios: ["09:00"],
    professorNome: "Marcos Wolgher",
    professorId: 2,
    vagasMax: 3,
  },
  {
    id: 3,
    nome: "Intermediário e Avançado",
    dias: [1, 3],
    horarios: ["12:00", "20:00"],
    professorNome: "Luiz André",
    professorId: 3,
    vagasMax: 3,
  },
  {
    id: 4,
    nome: "Baby",
    descricao: "Crianças de 3 a 6 anos",
    dias: [1, 3],
    horarios: ["18:30"],
    professorNome: "Layla",
    professorId: 4,
    vagasMax: 3,
  },
  {
    id: 5,
    nome: "Kids",
    descricao: "Crianças de 7 a 11 anos",
    dias: [1, 3],
    horarios: ["19:10"],
    professorNome: "Marcos Wolgher",
    professorId: 2,
    vagasMax: 3,
  },
  // --- Terças e Quintas ---
  {
    id: 6,
    nome: "Feminino",
    dias: [2, 4],
    horarios: ["06:45"],
    professorNome: "Bruna Borba e Amanda Souza",
    professorId: 5,
    vagasMax: 3,
  },
  {
    id: 7,
    nome: "No-Gi",
    dias: [2, 4],
    horarios: ["12:00", "21:00"],
    professorNome: "Pablo",
    professorId: 7,
    vagasMax: 3,
  },
  {
    id: 8,
    nome: "No-Gi",
    dias: [2, 4],
    horarios: ["15:00"],
    professorNome: 'André "Kibe"',
    professorId: 8,
    vagasMax: 3,
  },
  {
    id: 9,
    nome: "Teens",
    descricao: "Adolescentes de 12 a 17 anos",
    dias: [2, 4],
    horarios: ["19:00"],
    professorNome: "Pablo",
    professorId: 7,
    vagasMax: 3,
  },
  {
    id: 10,
    nome: "Iniciante",
    descricao: "Adultos que nunca praticaram a modalidade",
    dias: [2, 4],
    horarios: ["20:00"],
    professorNome: "Pablo",
    professorId: 7,
    vagasMax: 3,
  },
  // --- Sexta ---
  {
    id: 11,
    nome: "Open Mat",
    dias: [5],
    horarios: ["12:00"],
    professorNome: "Luiz André",
    professorId: 3,
    vagasMax: 5,
  },
];
