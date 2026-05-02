"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NuevoClienteButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await fetch("/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: fd.get("nombre"),
        telefono: fd.get("telefono"),
        email: fd.get("email") || undefined,
        direccion: fd.get("direccion") || undefined,
        notas: fd.get("notas") || undefined,
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
        + Nuevo
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-t-2xl p-6 shadow-xl">
            <h2 className="font-bold text-lg mb-4">Nuevo cliente</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="nombre" required placeholder="Nombre *" className="input-field" />
              <input name="telefono" required placeholder="Teléfono *" type="tel" className="input-field" />
              <input name="email" placeholder="Email" type="email" className="input-field" />
              <input name="direccion" placeholder="Dirección" className="input-field" />
              <textarea name="notas" placeholder="Notas" rows={2} className="input-field resize-none" />
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
