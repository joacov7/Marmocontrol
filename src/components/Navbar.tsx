"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, PlusCircle, Target, Wrench, Layers, Settings } from "lucide-react";

const links = [
  { href: "/", icon: Home, label: "Inicio" },
  { href: "/pedidos", icon: FileText, label: "Pedidos" },
  { href: "/cotizador", icon: PlusCircle, label: "Cotizar" },
  { href: "/materiales", icon: Layers, label: "Materiales" },
  { href: "/taller", icon: Wrench, label: "Taller" },
  { href: "/leads", icon: Target, label: "Captación" },
  { href: "/mantenimiento", icon: Settings, label: "Mantenimiento" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar escritorio */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-52 bg-white border-r border-gray-200 z-50">
        <div className="px-5 py-5 border-b border-gray-100">
          <p className="font-bold text-gray-900 text-base">MarmoControl</p>
          <p className="text-xs text-gray-400 mt-0.5">Gestión de marmolerías</p>
        </div>
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {links.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Navbar móvil */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around h-16 max-w-md mx-auto">
          {links.filter(l => l.href !== "/leads").map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            const highlight = href === "/cotizador";
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 flex-1 py-2 transition-colors relative ${
                  highlight ? "" : active ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {highlight ? (
                  <>
                    <div className="absolute -top-5 bg-blue-600 rounded-full p-3 shadow-lg">
                      <Icon size={22} className="text-white" />
                    </div>
                    <span className="text-[10px] font-medium text-gray-500 mt-3">{label}</span>
                  </>
                ) : (
                  <>
                    <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                    <span className="text-[10px] font-medium">{label}</span>
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
