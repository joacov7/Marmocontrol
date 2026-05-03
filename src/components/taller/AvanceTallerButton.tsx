"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, CheckCheck } from "lucide-react";

export default function AvanceTallerButton({
  pedidoId,
  estadoActual,
}: {
  pedidoId: number;
  estadoActual: string;
}) {
  const [open, setOpen] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState<"en_proceso" | "terminado">(
    estadoActual === "pendiente" ? "en_proceso" : "terminado"
  );
  const [nota, setNota] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function registrar() {
    if (!nota.trim()) return;
    setLoading(true);
    await fetch(`/api/pedidos/${pedidoId}/avances`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nota, estado: nuevoEstado }),
    });
    setLoading(false);
    setOpen(false);
    setNota("");
    router.refresh();
  }

  const esTerminar = nuevoEstado === "terminado";

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {estadoActual === "pendiente" && (
          <button
            onClick={() => { setNuevoEstado("en_proceso"); setOpen(true); }}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 rounded-2xl text-sm"
          >
            <Play size={16} />
            Iniciar trabajo
          </button>
        )}
        <button
          onClick={() => { setNuevoEstado("terminado"); setOpen(true); }}
          className={`flex items-center justify-center gap-2 font-bold py-4 rounded-2xl text-sm ${
            estadoActual === "pendiente"
              ? "bg-green-600 text-white"
              : "col-span-2 bg-green-600 text-white"
          }`}
        >
          <CheckCheck size={16} />
          {estadoActual === "en_proceso" ? "Marcar terminado" : "Finalizar directo"}
        </button>
      </div>

      {/* También un botón para registrar nota de avance sin cambiar estado */}
      {estadoActual === "en_proceso" && (
        <button
          onClick={() => { setNuevoEstado("en_proceso"); setOpen(true); }}
          className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-medium py-3 rounded-2xl text-sm"
        >
          Registrar avance parcial
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-6 shadow-2xl">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${esTerminar ? "bg-green-100" : "bg-blue-100"}`}>
              {esTerminar ? <CheckCheck size={28} className="text-green-600" /> : <Play size={28} className="text-blue-600" />}
            </div>
            <h2 className="font-bold text-xl text-center mb-1">
              {esTerminar ? "Marcar como terminado" : "Iniciar trabajo"}
            </h2>
            <p className="text-gray-500 text-sm text-center mb-5">
              {esTerminar ? "Dejá una nota de cómo quedó" : "¿Por dónde arrancás?"}
            </p>
            <textarea
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder={esTerminar ? "Ej: Mesada terminada, pulida y lista para retirar" : "Ej: Arrancamos con el corte de la mesada principal"}
              rows={3}
              autoFocus
              className="input-field resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-4 rounded-2xl border border-gray-200 text-gray-600 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={registrar}
                disabled={loading || !nota.trim()}
                className={`flex-1 py-4 rounded-2xl font-bold text-white disabled:opacity-50 ${esTerminar ? "bg-green-600" : "bg-blue-600"}`}
              >
                {loading ? "Guardando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
