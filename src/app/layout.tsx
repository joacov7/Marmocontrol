import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "MarmoControl",
  description: "Gestión de marmolerías",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 min-h-screen">
        <Navbar />
        {/* En escritorio: margen izquierdo para el sidebar. En móvil: padding inferior para el navbar */}
        <main className="md:ml-52 pb-20 md:pb-6 min-h-screen">
          <div className="max-w-3xl mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
