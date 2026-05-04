"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

const TIPOS = [
  { value: "aceite", label: "Cambio de aceite" },
  { value: "gomas", label: "Gomas / neumáticos" },
  { value: "frenos", label: "Frenos" },
  { value: "service", label: "Service general" },
  { value: "reparacion", label: "Reparación" },
  { value: "revision", label: "Revisión" },
  { value: "otro", label: "Otro" },
];

export default function NuevoRegistroButton({ maquinaId }: { maquinaId: number }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await fetch(`/api/mantenimiento/${maquinaId}/registros`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tipo: fd.get("tipo"),
        descripcion: fd.get("descripcion"),
        costo: Number(fd.get("costo")) || 0,
        fecha: fd.get("fecha") || undefined,
        proximaFecha: fd.get("proximaFecha") || undefined,
        km: fd.get("km") ? Number(fd.get("km")) : undefined,
      }),
    });
    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-3 py-2 rounded-xl">
        <Plus size={14} /> Registrar
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-t-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 pt-6 pb-2 flex items-center justify-between sticky top-0 bg-white border-b border-gray-100">
              <h2 className="font-bold text-lg">Registrar mantenimiento</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 p-1">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-3">
              <select name="tipo" required className="input-field">
                <option value="">Tipo *</option>
                {TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <textarea name="descripcion" required placeholder="Descripción *" rows={2} className="input-field resize-none" />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Fecha</label>
                  <input name="fecha" type="date" defaultValue={new Date().toISOString().split("T")[0]} className="input-field" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Costo ($)</label>
                  <input name="costo" type="number" min="0" step="100" placeholder="0" className="input-field" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Próximo mantenimiento</label>
                <input name="proximaFecha" type="date" className="input-field" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Kilometraje (vehículos)</label>
                <input name="km" type="number" min="0" placeholder="Ej: 85000" className="input-field" />
              </div>
              <div className="flex gap-3 pt-2 pb-4">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium">Cancelar</button>
                <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium disabled:opacity-60">
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
