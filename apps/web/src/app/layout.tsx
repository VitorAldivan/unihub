import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "UniHub — Plataforma Acadêmica",
  description: "Controle de faltas e frequência para universitários.",
  appleWebApp: { capable: true, statusBarStyle: "black", title: "UniHub" },
};

// Zoom liberado de propósito: bloquear o zoom reprova em acessibilidade (WCAG).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#18181B",
  // Teclado virtual: a área visível encolhe em vez de cobrir os campos do formulário.
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen selection:bg-brand selection:text-brand-on">{children}</body>
    </html>
  );
}
