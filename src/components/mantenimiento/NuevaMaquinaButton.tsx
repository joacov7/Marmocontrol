"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NuevaMaquinaButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await fetch("/api/mantenimiento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: fd.get("nombre"),
        tipo: fd.get("tipo"),
        descripcion: fd.get("descripcion") || null,
      }),
    });
    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl">
        + Agregar
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-t-2xl shadow-xl">
            <div className="px-6 pt-6 pb-2 flex items-center justify-between border-b border-gray-100">
              <h2 className="font-bold text-lg">Nuevo equipo</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 p-1">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-3">
              <input name="nombre" required placeholder="Nombre *" className="input-field" />
              <select name="tipo" required className="input-field">
                <option value="">Tipo *</option>
                <option value="maquina">Máquina</option>
                <option value="vehiculo">Vehículo</option>
              </select>
              <textarea name="descripcion" placeholder="Descripción (marca, modelo, patente...)" rows={2} className="input-field resize-none" />
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
