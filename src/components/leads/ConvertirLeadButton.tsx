"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCheck } from "lucide-react";

export default function ConvertirLeadButton({ leadId, nombre }: { leadId: number; nombre: string }) {
  const [confirmar, setConfirmar] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function convertir() {
    setLoading(true);
    const res = await fetch(`/api/leads/${leadId}/convertir`, { method: "POST" });
    const data = await res.json();
    setLoading(false);
    setConfirmar(false);
    router.push(`/cotizador?clienteId=${data.clienteId}`);
  }

  return (
    <>
      <button
        onClick={() => setConfirmar(true)}
        className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white font-medium py-3 rounded-xl text-sm"
      >
        <UserCheck size={16} />
        Convertir
      </button>

      {confirmar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl">
            <div className="text-center mb-4">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserCheck size={24} className="text-green-600" />
              </div>
              <h2 className="font-bold text-lg">¿Convertir en cliente?</h2>
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-semibold text-gray-700">{nombre}</span> pasará a ser cliente
                y te llevará al cotizador para crear su primer pedido.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmar(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={convertir}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-green-600 text-white font-medium disabled:opacity-60"
              >
                {loading ? "Convirtiendo..." : "Convertir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
