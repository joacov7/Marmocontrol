"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ORIGENES_LEAD } from "@/lib/leads";

export default function NuevoLeadButton({ defaultData }: {
  defaultData?: { nombre?: string; telefono?: string; empresa?: string; origen?: string }
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: fd.get("nombre"),
        telefono: fd.get("telefono") || undefined,
        email: fd.get("email") || undefined,
        empresa: fd.get("empresa") || undefined,
        origen: fd.get("origen"),
        interes: fd.get("interes") || undefined,
        notas: fd.get("notas") || undefined,
      }),
    });
    setLoading(false);
    setOpen(false);
    router.push("/leads");
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-xl"
      >
        + Lead
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-t-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="font-bold text-lg mb-4">Nuevo lead</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="nombre"
                required
                defaultValue={defaultData?.nombre ?? ""}
                placeholder="Nombre *"
                className="input-field"
              />
              <input
                name="empresa"
                defaultValue={defaultData?.empresa ?? ""}
                placeholder="Empresa / estudio"
                className="input-field"
              />
              <input
                name="telefono"
                defaultValue={defaultData?.telefono ?? ""}
                placeholder="Teléfono"
                type="tel"
                className="input-field"
              />
              <input
                name="email"
                placeholder="Email"
                type="email"
                className="input-field"
              />
              <select name="origen" defaultValue={defaultData?.origen ?? "otro"} className="input-field">
                {Object.entries(ORIGENES_LEAD).map(([value, { label, emoji }]) => (
                  <option key={value} value={value}>{emoji} {label}</option>
                ))}
              </select>
              <textarea
                name="interes"
                placeholder="¿Qué está buscando? (tipo de trabajo, materiales...)"
                rows={2}
                className="input-field resize-none"
              />
              <textarea
                name="notas"
                placeholder="Notas internas"
                rows={2}
                className="input-field resize-none"
              />
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
                  className="flex-1 py-3 rounded-xl bg-gray-900 text-white font-medium disabled:opacity-60"
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
