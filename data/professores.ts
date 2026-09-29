// Fonte única de dados de professores

export interface ProfessorConfig {
  id: number;
  nome: string;
  apelido?: string;
  faixa: string;
  grau?: number;
  whatsapp: string; // formato internacional sem +: 5547...
  foto: string;
  fotoPosition?: string; // ex: "top", "center", "50% 20%"
  destaque?: boolean;
  bio?: string;
}

export const PROFESSORES: ProfessorConfig[] = [
  {
    id: 1,
    nome: "Marcos Cunha",
    faixa: "Faixa Preta",
    grau: 5,
    whatsapp: "5547997898775",
    foto: "/professores/marcos-cunha.jpg",
    destaque: true,
    bio: `Marcos Cunha é o criador da marca The Match Champ (TMC). Carioca, radicado em Blumenau por mais de 20 anos e hoje residente fixo nos Estados Unidos, Marcos construiu a TMC como referência em metodologia de ensino de Jiu-Jitsu, hoje com mais de 20 filiais no Brasil e 5 nos Estados Unidos. A marca também é reconhecida no âmbito competitivo, com centenas de atletas formados que conquistaram títulos regionais, nacionais e internacionais.`,
  },
  {
    id: 2,
    nome: "Marcos Wolgher",
    faixa: "Faixa Preta",
    whatsapp: "[WHATSAPP_MARCOS_WOLGHER]",
    foto: "/professores/marcos-wolgher.jpg",
  },
  {
    id: 3,
    nome: "Luiz André",
    faixa: "Faixa Preta",
    whatsapp: "[WHATSAPP_LUIZ_ANDRE]",
    foto: "/professores/luiz-andre.jpg",
  },
  {
    id: 4,
    nome: "Layla",
    faixa: "Faixa Preta",
    whatsapp: "[WHATSAPP_LAYLA]",
    foto: "/professores/layla.jpg",
  },
  {
    id: 5,
    nome: "Bruna Borba",
    faixa: "Faixa Preta",
    whatsapp: "[WHATSAPP_BRUNA]",
    foto: "/professores/bruna-borba.jpg",
  },
  {
    id: 6,
    nome: "Amanda Souza",
    faixa: "Faixa Preta",
    whatsapp: "[WHATSAPP_AMANDA]",
    foto: "/professores/amanda-souza.jpg",
  },
  {
    id: 7,
    nome: "Pablo",
    faixa: "Faixa Preta",
    whatsapp: "[WHATSAPP_PABLO]",
    foto: "/professores/pablo.jpg",
  },
  {
    id: 8,
    nome: "André",
    apelido: "Kibe",
    faixa: "Faixa Preta",
    whatsapp: "[WHATSAPP_KIBE]",
    foto: "/professores/andre-kibe.jpg",
    fotoPosition: "top",
  },
];

// Valores dos planos — substitua com os valores reais
export const PLANOS = {
  matricula: "[VALOR_MATRICULA]",
  mensal: "[VALOR_PLANO_MENSAL]",
  semestral: "[VALOR_PLANO_SEMESTRAL]",
  anual: "[VALOR_PLANO_ANUAL]",
};

// Endereço da academia
export const ACADEMIA = {
  nome: "TMC-MarcosCunha",
  endereco: "Rua 25 de Julho, 1053, sala 1 - Itoupava Norte - Blumenau/SC",
  email: "academiatmcjj@gmail.com",
  whatsapp: "5547997898775",
  whatsappDisplay: "(47) 99789-8775",
  mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.7036033984014!2d-49.0793922236745!3d-26.881156491887705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94df1f1c0894013d%3A0x23ecc4e6eb6b19f3!2sRua%2025%20de%20Julho%2C%201053%20-%20Itoupava%20Norte%2C%20Blumenau%20-%20SC%2C%2089053-000!5e0!3m2!1spt-BR!2sbr!4v1790129066115!5m2!1spt-BR!2sbr",
  instagram: "[INSTAGRAM_URL]",
  facebook: "[FACEBOOK_URL]",
  horarioFuncionamento: "Segunda a Sexta: 06:00–21:30 | Sábado: consulte-nos",
};
