import Image from "next/image";

export default function ComunicadoUso() {
  return (
    <section className="py-16 bg-[#F2F2F2]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#8A8A8A]">
            Regras
          </span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-[#0A0A0A]">
            Comunicado de Uso
          </h2>
          <p className="mt-3 text-sm text-[#4A4A4A]">
            Para manter o CT sempre organizado e acolhedor para todos.
          </p>
        </div>

        <div className="relative w-full shadow-sm">
          <Image
            src="/comunicado-uso.png"
            alt="Comunicado de Uso TMC Jiu-Jitsu"
            width={900}
            height={1200}
            className="w-full h-auto"
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
