"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TIPOS = ["granito", "marmol", "porcelana", "cuarcita", "silestone", "otro"];

export default function NuevoMaterialButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await fetch("/api/materiales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: fd.get("nombre"),
        tipo: fd.get("tipo"),
        precioPorM2: Number(fd.get("precioPorM2")),
        color: fd.get("color") || undefined,
        descripcion: fd.get("descripcion") || undefined,
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
        className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl"
      >
        + Agregar
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-t-2xl p-6 shadow-xl">
            <h2 className="font-bold text-lg mb-4">Nuevo material</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="nombre" required placeholder="Nombre del material *" className="input-field" />
              <select name="tipo" required className="input-field">
                <option value="">Tipo *</option>
                {TIPOS.map((t) => (
                  <option key={t} value={t} className="capitalize">
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
              <input
                name="precioPorM2"
                required
                type="number"
                min="0"
                step="100"
                placeholder="Precio por m² (ARS) *"
                className="input-field"
              />
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Color de referencia</label>
                <input name="color" type="color" defaultValue="#a0a0a0" className="h-10 w-full rounded-lg border border-gray-200 p-1" />
              </div>
              <textarea name="descripcion" placeholder="Descripción (opcional)" rows={2} className="input-field resize-none" />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium disabled:opacity-60"
                >
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
