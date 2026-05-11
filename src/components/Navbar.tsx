"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, ClipboardList, LayoutDashboard } from "lucide-react";

const links = [
  { href: "/", icon: Home, label: "Inicio" },
  { href: "/profesionales", icon: Search, label: "Profesionales" },
  { href: "/solicitar", icon: PlusCircle, label: "Solicitar", highlight: true },
  { href: "/solicitudes", icon: ClipboardList, label: "Mis pedidos" },
  { href: "/admin", icon: LayoutDashboard, label: "Admin" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar escritorio */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-56 bg-white border-r border-slate-200 z-50">
        <div className="px-5 py-5 border-b border-slate-100">
          <p className="font-bold text-blue-600 text-xl tracking-tight">ServiYa</p>
          <p className="text-xs text-slate-400 mt-0.5">Encontrá el profesional ideal</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(({ href, icon: Icon, label, highlight }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  highlight
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={18} strokeWidth={active || highlight ? 2.5 : 1.8} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="px-5 py-4 border-t border-slate-100">
          <p className="text-xs text-slate-400">© 2025 ServiYa</p>
        </div>
      </aside>

      {/* Navbar móvil inferior */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {links.map(({ href, icon: Icon, label, highlight }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 flex-1 py-1 transition-colors relative ${
                  highlight ? "" : active ? "text-blue-600" : "text-slate-500"
                }`}
              >
                {highlight ? (
                  <>
                    <div className="absolute -top-6 bg-blue-600 rounded-full p-3 shadow-lg shadow-blue-200">
                      <Icon size={20} className="text-white" />
                    </div>
                    <span className="text-[9px] font-medium text-slate-400 mt-4">{label}</span>
                  </>
                ) : (
                  <>
                    <Icon size={19} strokeWidth={active ? 2.5 : 1.8} />
                    <span className="text-[9px] font-medium">{label}</span>
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
