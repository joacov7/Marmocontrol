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
        <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col shadow-sm">
          <main className="flex-1 pb-20">{children}</main>
          <Navbar />
        </div>
      </body>
    </html>
  );
}
