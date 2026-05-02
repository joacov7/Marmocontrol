"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TIPOS_INTERACCION, ESTADOS_LEAD, type EstadoLead } from "@/lib/leads";
import { MessageSquarePlus } from "lucide-react";

export default function NuevaInteraccionButton({ leadId }: { leadId: number }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await fetch(`/api/leads/${leadId}/interacciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tipo: fd.get("tipo"),
        nota: fd.get("nota"),
        nuevoEstado: fd.get("nuevoEstado") || undefined,
        proximoContacto: fd.get("proximoContacto") || undefined,
      }),
    });
    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 3);
  const defaultDate = tomorrow.toISOString().split("T")[0];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white font-medium py-3 rounded-xl text-sm"
      >
        <MessageSquarePlus size={16} />
        Registrar contacto
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-t-2xl p-6 shadow-xl">
            <h2 className="font-bold text-lg mb-4">Registrar contacto</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(TIPOS_INTERACCION).map(([value, { label, emoji }]) => (
                  <label key={value} className="cursor-pointer">
                    <input type="radio" name="tipo" value={value} className="sr-only peer" defaultChecked={value === "llamada"} />
                    <div className="text-center py-2.5 rounded-xl border border-gray-200 text-sm peer-checked:border-gray-900 peer-checked:bg-gray-900 peer-checked:text-white transition-colors">
                      <div>{emoji}</div>
                      <div className="text-xs mt-0.5">{label}</div>
                    </div>
                  </label>
                ))}
              </div>

              <textarea
                name="nota"
                required
                placeholder="¿Cómo fue el contacto? ¿Qué dijo? *"
                rows={3}
                className="input-field resize-none"
              />

              <select name="nuevoEstado" className="input-field">
                <option value="">Sin cambio de estado</option>
                {Object.entries(ESTADOS_LEAD)
                  .filter(([k]) => k !== "nuevo")
                  .map(([value, { label }]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
              </select>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Próximo contacto</label>
                <input
                  name="proximoContacto"
                  type="date"
                  defaultValue={defaultDate}
                  className="input-field"
                />
              </div>

              <div className="flex gap-3 pt-1">
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
