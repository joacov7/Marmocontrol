"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";

export default function NuevoRecordatorioButton({
  clienteId,
  clienteNombre,
}: {
  clienteId: number;
  clienteNombre: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await fetch("/api/recordatorios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clienteId,
        nota: fd.get("nota"),
        fechaAviso: fd.get("fechaAviso"),
      }),
    });
    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split("T")[0];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 bg-orange-50 text-orange-600 border border-orange-200 text-sm font-medium px-3 py-2 rounded-xl"
      >
        <Bell size={14} />
        Recordatorio
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-t-2xl p-6 shadow-xl">
            <h2 className="font-bold text-lg mb-1">Nuevo recordatorio</h2>
            <p className="text-sm text-gray-500 mb-4">{clienteNombre}</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="nota"
                required
                placeholder="Ej: Llamar para confirmar instalación"
                className="input-field"
              />
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Recordarme el día</label>
                <input
                  name="fechaAviso"
                  required
                  type="date"
                  defaultValue={defaultDate}
                  className="input-field"
                />
              </div>
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
                  className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-medium disabled:opacity-60"
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
