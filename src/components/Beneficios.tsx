import Image from "next/image";

const BENEFICIOS = [
  {
    id: "adultos",
    titulo: "Adultos e Melhor Idade",
    foto: "/beneficios/adulto.jpg",
    icone: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    texto: `O Jiu-Jitsu é muito mais do que defesa pessoal: é uma escola de vida. Para adultos e para a melhor idade, a arte suave oferece condicionamento físico completo, desenvolvimento da flexibilidade e da força funcional, e uma redução comprovada do estresse do dia a dia. Nas aulas, você vai encontrar uma comunidade acolhedora, criar laços reais e descobrir que o tatame é o lugar onde a disciplina e a superação se transformam em qualidade de vida — independente da sua idade ou condicionamento atual.`,
  },
  {
    id: "criancas",
    titulo: "Crianças",
    foto: "/beneficios/crianca.jpg",
    icone: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    texto: `O Jiu-Jitsu é uma das melhores atividades que os pais podem oferecer aos filhos. Muito além de um esporte, ele ensina disciplina, respeito, foco e concentração de forma natural e divertida. As crianças aprendem a lidar com desafios, a perder e a crescer com isso — uma ferramenta poderosa no combate ao bullying e no fortalecimento da autoconfiança. Na TMC, os professores são capacitados para criar um ambiente seguro, lúdico e estimulante, onde cada criança evolui no seu tempo e descobre o prazer de se superar.`,
  },
  {
    id: "mulheres",
    titulo: "Mulheres",
    foto: "/beneficios/mulher.jpg",
    icone: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    texto: `Para as mulheres, o Jiu-Jitsu é uma experiência de empoderamento genuíno. A arte suave ensina técnicas eficazes de autodefesa que funcionam independentemente do tamanho ou da força — porque no Jiu-Jitsu, a alavanca e a técnica vencem a força bruta. Além da segurança pessoal, você ganha condicionamento físico, flexibilidade, e entra para uma comunidade feminina vibrante e acolhedora. Na TMC, a turma feminina é um espaço de apoio mútuo, respeito e crescimento, onde toda conquista é celebrada.`,
  },
];

export default function Beneficios() {
  return (
    <section id="beneficios" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#8A8A8A]">
            Por que praticar
          </span>
          <h2 className="mt-2 text-4xl lg:text-5xl font-black tracking-tight text-[#0A0A0A]">
            Benefícios do Jiu-Jitsu
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {BENEFICIOS.map((b, i) => (
            <div
              key={b.id}
              className="group relative p-8 border border-[#E5E5E5] hover:border-[#0A0A0A] transition-colors overflow-hidden"
            >
              {/* Imagem de fundo bem sutil */}
              <div className="absolute inset-0 opacity-[0.18] group-hover:opacity-[0.28] transition-opacity duration-500">
                <Image
                  src={b.foto}
                  alt={b.titulo}
                  fill
                  className="object-cover object-center grayscale"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Conteúdo sobre a imagem */}
              <div className="relative z-10">
                <div className="mb-6 text-[#0A0A0A] group-hover:scale-110 transition-transform inline-block">
                  {b.icone}
                </div>
                <span className="text-xs font-bold tracking-widest uppercase text-[#8A8A8A]">
                  0{i + 1}
                </span>
                <h3 className="mt-2 mb-4 text-xl font-black text-[#0A0A0A]">
                  {b.titulo}
                </h3>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">{b.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
