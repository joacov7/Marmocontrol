"use client";

import { useEffect, useState } from "react";
import EstadoBadge from "@/components/EstadoBadge";
import { MapPin, Phone, User, CheckCircle } from "lucide-react";

type Profesional = { id: number; nombre: string; telefono: string; zona: string };
type Solicitud = {
  id: number;
  descripcion: string;
  direccion: string;
  urgencia: string;
  estado: string;
  presupuesto: number | null;
  creadoEn: string;
  categoria: { nombre: string; icono: string };
  cliente: { nombre: string; telefono: string };
  asignacion: { profesional: Profesional } | null;
};

const ESTADOS = ["pendiente", "asignado", "en_proceso", "completado", "cancelado"];

export default function AdminSolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [selected, setSelected] = useState<Solicitud | null>(null);
  const [profId, setProfId] = useState("");
  const [presupuesto, setPresupuesto] = useState("");
  const [notas, setNotas] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSolicitudes = () => {
    const params = new URLSearchParams();
    if (filtroEstado) params.set("estado", filtroEstado);
    fetch(`/api/solicitudes?${params}`)
      .then((r) => r.json())
      .then(setSolicitudes);
  };

  useEffect(fetchSolicitudes, [filtroEstado]);

  useEffect(() => {
    fetch("/api/profesionales").then((r) => r.json()).then(setProfesionales);
  }, []);

  useEffect(() => {
    if (selected) {
      setProfId(String(selected.asignacion?.profesional.id ?? ""));
      setPresupuesto(String(selected.presupuesto ?? ""));
      setNotas(selected.estado || "");
    }
  }, [selected]);

  const asignar = async () => {
    if (!selected || !profId) return;
    setLoading(true);
    await fetch("/api/asignaciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ solicitudId: selected.id, profesionalId: Number(profId) }),
    });
    fetchSolicitudes();
    setSelected(null);
    setLoading(false);
  };

  const actualizarEstado = async (estado: string) => {
    if (!selected) return;
    setLoading(true);
    await fetch(`/api/solicitudes/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        estado,
        presupuesto: presupuesto ? Number(presupuesto) : undefined,
        notas: notas || undefined,
      }),
    });
    fetchSolicitudes();
    setSelected(null);
    setLoading(false);
  };

  const urgenciaLabel: Record<string, string> = { urgente: "🚨", normal: "📅", programado: "🗓️" };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Solicitudes</h1>

      {/* Filtro */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
        <button
          onClick={() => setFiltroEstado("")}
          className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filtroEstado === "" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600"}`}
        >
          Todas
        </button>
        {ESTADOS.map((e) => (
          <button
            key={e}
            onClick={() => setFiltroEstado(e)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filtroEstado === e ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600"}`}
          >
            {e}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-2 mb-6">
        {solicitudes.length === 0 && (
          <p className="text-center text-slate-400 py-8">No hay solicitudes</p>
        )}
        {solicitudes.map((sol) => (
          <button
            key={sol.id}
            onClick={() => setSelected(sol)}
            className={`w-full card p-3 flex items-center gap-3 hover:shadow-md transition-shadow text-left ${selected?.id === sol.id ? "ring-2 ring-blue-500" : ""}`}
          >
            <span className="text-2xl shrink-0">{urgenciaLabel[sol.urgencia] ?? ""}{sol.categoria.icono}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{sol.cliente.nombre} — {sol.categoria.nombre}</p>
              <p className="text-xs text-slate-500 truncate">{sol.descripcion}</p>
              <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                <MapPin size={10} />
                <span className="truncate">{sol.direccion}</span>
              </div>
              {sol.asignacion && (
                <p className="text-xs text-blue-600 mt-0.5 flex items-center gap-1">
                  <CheckCircle size={10} />
                  {sol.asignacion.profesional.nombre}
                </p>
              )}
            </div>
            <div className="shrink-0 text-right">
              <EstadoBadge estado={sol.estado} />
              <p className="text-xs text-slate-400 mt-1">{new Date(sol.creadoEn).toLocaleDateString("es-AR")}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Panel lateral / detalle */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="card w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 space-y-4">
              <div className="flex items-start justify-between">
                <h2 className="font-bold text-slate-800">Solicitud #{selected.id}</h2>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
              </div>

              <div className="space-y-1 text-sm">
                <p className="font-medium text-slate-700 flex items-center gap-1.5"><User size={14} />{selected.cliente.nombre}</p>
                <p className="text-slate-500 flex items-center gap-1.5"><Phone size={14} />{selected.cliente.telefono}</p>
                <p className="text-slate-500 flex items-center gap-1.5"><MapPin size={14} />{selected.direccion}</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-1">Descripción</p>
                <p className="text-sm text-slate-700">{selected.descripcion}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600 block mb-1">Asignar profesional</label>
                <select
                  value={profId}
                  onChange={(e) => setProfId(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="">Seleccioná un profesional</option>
                  {profesionales.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre} — {p.zona}</option>
                  ))}
                </select>
                <button
                  onClick={asignar}
                  disabled={!profId || loading}
                  className="btn-primary w-full mt-2 py-2 text-sm"
                >
                  {loading ? "Asignando..." : "Asignar profesional"}
                </button>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600 block mb-1">Presupuesto ($)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={presupuesto}
                  onChange={(e) => setPresupuesto(e.target.value)}
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600 block mb-1">Notas internas</label>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="input-field text-sm resize-none"
                  rows={2}
                  placeholder="Observaciones..."
                />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Cambiar estado</p>
                <div className="grid grid-cols-2 gap-2">
                  {ESTADOS.map((e) => (
                    <button
                      key={e}
                      onClick={() => actualizarEstado(e)}
                      disabled={loading || selected.estado === e}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize transition-colors ${
                        selected.estado === e
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
