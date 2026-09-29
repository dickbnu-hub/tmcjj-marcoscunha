import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "TMC-MarcosCunha | Academia de Jiu-Jitsu em Blumenau/SC",
  description:
    "Academia TMC-MarcosCunha — referência em Jiu-Jitsu em Blumenau. Turmas para adultos, crianças, mulheres e No-Gi. Agende sua aula experimental gratuita.",
  openGraph: {
    title: "TMC-MarcosCunha | Academia de Jiu-Jitsu",
    description: "Referência em ensino de Jiu-Jitsu em Blumenau/SC. Fundada por Marcos Cunha, faixa preta 4º grau.",
    url: "https://tmcmarcoscunha.com.br",
    siteName: "TMC-MarcosCunha",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
