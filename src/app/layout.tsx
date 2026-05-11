import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "ServiYa - Encontrá el profesional que necesitás",
  description: "Marketplace de servicios profesionales: plomería, electricidad, mecánica, computación y más.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 min-h-screen">
        <Navbar />
        <main className="md:ml-56 pb-20 md:pb-6 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
