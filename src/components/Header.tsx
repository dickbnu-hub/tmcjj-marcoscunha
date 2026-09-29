"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Início", href: "#inicio" },
  { label: "Cronograma", href: "#cronograma" },
  { label: "Treinos", href: "#treinos" },
  { label: "Professores", href: "#professores" },
  { label: "Benefícios", href: "#beneficios" },
  { label: "Mídia", href: "#midia" },
  { label: "Contato", href: "#contato" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-3">
          <Image
            src="/logo_tmc.png"
            alt="TMC The Match Champ"
            width={52}
            height={32}
            className={`object-contain transition-all duration-300 ${
              scrolled
                ? "[mix-blend-mode:multiply]"
                : "[filter:invert(1)] [mix-blend-mode:screen]"
            }`}
            priority
          />
          <span className={`w-px h-7 transition-colors duration-300 ${scrolled ? "bg-[#D0D0D0]" : "bg-white/30"}`} />
          <Image
            src="/marcos-cunha-fight-team.png"
            alt="Marcos Cunha Fight Team"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
          <span
            className={`hidden sm:block font-semibold text-sm tracking-widest uppercase transition-colors duration-300 ${
              scrolled ? "text-[#0A0A0A]" : "text-white"
            }`}
          >
            MarcosCunha · Matriz
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors tracking-wide uppercase ${
                scrolled ? "text-[#4A4A4A] hover:text-[#0A0A0A]" : "text-white/80 hover:text-white"
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#agendamento"
            className="ml-4 px-5 py-2.5 bg-[#0A0A0A] text-white text-sm font-semibold tracking-widest uppercase hover:bg-[#111111] transition-colors"
          >
            Aula Grátis
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className={`lg:hidden p-2 ${scrolled ? "text-[#0A0A0A]" : "text-white"}`}
          aria-label="Menu"
        >
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-current transition-transform ${open ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-current transition-transform ${open ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-[#E5E5E5] px-4 py-6 space-y-4">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-[#4A4A4A] uppercase tracking-wide py-2"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#agendamento"
            onClick={() => setOpen(false)}
            className="block mt-4 px-5 py-3 bg-[#0A0A0A] text-white text-sm font-semibold text-center tracking-widest uppercase"
          >
            Agendar Aula Grátis
          </a>
        </div>
      )}
    </header>
  );
}
