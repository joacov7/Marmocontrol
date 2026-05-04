"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

const TIPOS = ["granito", "marmol", "porcelana", "cuarcita", "silestone", "bacha", "otro"];

interface Material {
  id: number;
  nombre: string;
  tipo: string;
  precioCompra: number;
  precioPorM2: number;
  porcentajeDesperdicio: number;
  largoPlaca: number | null;
  anchoPlaca: number | null;
  proveedor: string | null;
  color: string | null;
  descripcion: string | null;
  activo: boolean;
}

export default function EditMaterialButton({ material: m }: { material: Material }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await fetch("/api/materiales", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: m.id,
        nombre: fd.get("nombre"),
        tipo: fd.get("tipo"),
        precioCompra: Number(fd.get("precioCompra")) || 0,
        precioPorM2: Number(fd.get("precioPorM2")),
        porcentajeDesperdicio: Number(fd.get("porcentajeDesperdicio")) || 10,
        largoPlaca: Number(fd.get("largoPlaca")) || null,
        anchoPlaca: Number(fd.get("anchoPlaca")) || null,
        proveedor: fd.get("proveedor") || null,
        color: fd.get("color") || null,
        descripcion: fd.get("descripcion") || null,
        activo: fd.get("activo") === "true",
      }),
    });
    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl text-sm hover:border-gray-300 transition-colors"
      >
        <Pencil size={14} />
        Editar material
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-t-2xl shadow-xl max-h-[92vh] overflow-y-auto">
            <div className="px-6 pt-6 pb-2 flex items-center justify-between sticky top-0 bg-white border-b border-gray-100">
              <h2 className="font-bold text-lg">Editar material</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 p-1">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              {/* Identificación */}
              <section className="space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Identificación</p>
                <input name="nombre" required defaultValue={m.nombre} placeholder="Nombre *" className="input-field" />
                <select name="tipo" required defaultValue={m.tipo} className="input-field">
                  {TIPOS.map((t) => (
                    <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
                <input name="proveedor" defaultValue={m.proveedor ?? ""} placeholder="Proveedor" className="input-field" />
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Color</label>
                  <input name="color" type="color" defaultValue={m.color ?? "#a0a0a0"} className="h-10 w-full rounded-lg border border-gray-200 p-1" />
                </div>
              </section>

              {/* Precios */}
              <section className="space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Precios por m²</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Precio de costo *</label>
                    <input
                      name="precioCompra"
                      type="number"
                      min="0"
                      step="100"
                      required
                      defaultValue={m.precioCompra}
                      placeholder="Ej: 45000"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Precio de venta *</label>
                    <input
                      name="precioPorM2"
                      type="number"
                      min="0"
                      step="100"
                      required
                      defaultValue={m.precioPorM2}
                      placeholder="Ej: 85000"
                      className="input-field"
                    />
                  </div>
                </div>
              </section>

              {/* Medidas de placa */}
              <section className="space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Medidas de la placa</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Largo (m)</label>
                    <input
                      name="largoPlaca"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={m.largoPlaca ?? ""}
                      placeholder="Ej: 3.00"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Ancho (m)</label>
                    <input
                      name="anchoPlaca"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={m.anchoPlaca ?? ""}
                      placeholder="Ej: 1.80"
                      className="input-field"
                    />
                  </div>
                </div>
              </section>

              {/* Otros */}
              <section className="space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Otros</p>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">% Desperdicio</label>
                  <input
                    name="porcentajeDesperdicio"
                    type="number"
                    min="0"
                    max="50"
                    step="1"
                    defaultValue={m.porcentajeDesperdicio}
                    className="input-field"
                  />
                </div>
                <textarea name="descripcion" defaultValue={m.descripcion ?? ""} placeholder="Descripción" rows={2} className="input-field resize-none" />
                <select name="activo" defaultValue={String(m.activo)} className="input-field">
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </section>

              <div className="flex gap-3 pt-2 pb-4">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium">
                  Cancelar
                </button>
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
