"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Users, Package, PlusCircle } from "lucide-react";

const links = [
  { href: "/", icon: Home, label: "Inicio" },
  { href: "/pedidos", icon: FileText, label: "Pedidos" },
  { href: "/cotizador", icon: PlusCircle, label: "Cotizar", highlight: true },
  { href: "/clientes", icon: Users, label: "Clientes" },
  { href: "/materiales", icon: Package, label: "Materiales" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around h-16">
        {links.map(({ href, icon: Icon, label, highlight }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 flex-1 py-2 transition-colors ${
                highlight
                  ? "relative"
                  : active
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {highlight ? (
                <div className="absolute -top-5 bg-blue-600 rounded-full p-3 shadow-lg">
                  <Icon size={22} className="text-white" />
                </div>
              ) : (
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              )}
              {!highlight && (
                <span className="text-[10px] font-medium">{label}</span>
              )}
              {highlight && <span className="text-[10px] font-medium text-gray-500 mt-3">{label}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
