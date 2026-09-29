import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Cronograma from "@/components/Cronograma";
import Carrossel from "@/components/Carrossel";
import Destaques from "@/components/Destaques";
import Professores from "@/components/Professores";
import Beneficios from "@/components/Beneficios";
import Graduacao from "@/components/Graduacao";
import Midia from "@/components/Midia";
import Agendamento from "@/components/Agendamento";
import ComunicadoUso from "@/components/ComunicadoUso";
import ChatWidget from "@/components/ChatWidget";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Cronograma />
        <Carrossel />
        <Destaques />
        <Professores />
        <Beneficios />
        <Graduacao />
        <Midia />
        <Agendamento />
        <ComunicadoUso />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
