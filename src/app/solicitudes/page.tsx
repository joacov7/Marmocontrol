"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EstadoBadge from "@/components/EstadoBadge";
import { Search, ClipboardList } from "lucide-react";

type Solicitud = {
  id: number;
  descripcion: string;
  urgencia: string;
  estado: string;
  creadoEn: string;
  categoria: { nombre: string; icono: string };
  cliente: { nombre: string; telefono: string };
};

export default function SolicitudesPage() {
  const [telefono, setTelefono] = useState("");
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(false);
  const [buscado, setBuscado] = useState(false);

  const buscar = async () => {
    if (!telefono.trim()) return;
    setLoading(true);
    setBuscado(true);
    const res = await fetch(`/api/solicitudes?telefono=${encodeURIComponent(telefono)}`);
    const data = await res.json();
    setSolicitudes(data);
    setLoading(false);
  };

  const urgenciaLabel: Record<string, string> = {
    urgente: "🚨 Urgente",
    normal: "📅 Normal",
    programado: "🗓️ Programado",
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Mis pedidos</h1>
      <p className="text-slate-500 text-sm mb-5">Ingresá tu teléfono para ver el estado de tus solicitudes</p>

      {/* Búsqueda por teléfono */}
      <div className="flex gap-2 mb-6">
        <input
          type="tel"
          placeholder="Tu teléfono (ej: 11-1234-5678)"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && buscar()}
          className="input-field flex-1"
        />
        <button
          onClick={buscar}
          disabled={loading}
          className="btn-primary px-4 shrink-0"
        >
          <Search size={16} />
        </button>
      </div>

      {/* Resultados */}
      {!buscado && (
        <div className="text-center py-12 text-slate-400">
          <ClipboardList size={40} className="mx-auto mb-3 text-slate-300" />
          <p className="font-medium">Ingresá tu teléfono para buscar</p>
          <p className="text-sm mt-1">
            ¿Todavía no solicitaste ningún servicio?{" "}
            <Link href="/solicitar" className="text-blue-600 font-medium hover:underline">
              Hacé tu primera solicitud
            </Link>
          </p>
        </div>
      )}

      {buscado && loading && (
        <div className="text-center py-12 text-slate-400">Buscando...</div>
      )}

      {buscado && !loading && solicitudes.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="font-medium">No encontramos solicitudes con ese teléfono</p>
          <Link href="/solicitar" className="text-blue-600 text-sm font-medium hover:underline mt-2 block">
            Crear nueva solicitud →
          </Link>
        </div>
      )}

      {solicitudes.length > 0 && (
        <div className="space-y-3">
          {solicitudes.map((sol) => (
            <Link
              key={sol.id}
              href={`/solicitudes/${sol.id}`}
              className="card p-4 block hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{sol.categoria.icono}</span>
                  <span className="font-semibold text-slate-800 text-sm">{sol.categoria.nombre}</span>
                </div>
                <EstadoBadge estado={sol.estado} />
              </div>
              <p className="text-sm text-slate-600 line-clamp-2">{sol.descripcion}</p>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-400">
                  {urgenciaLabel[sol.urgencia] || sol.urgencia}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(sol.creadoEn).toLocaleDateString("es-AR")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
