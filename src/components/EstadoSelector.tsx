"use client";

import { ESTADOS, type EstadoPedido } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EstadoSelector({
  pedidoId,
  estadoActual,
}: {
  pedidoId: number;
  estadoActual: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function cambiarEstado(nuevoEstado: string) {
    setLoading(true);
    await fetch(`/api/pedidos/${pedidoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Estado</p>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(ESTADOS).map(([key, { label, color }]) => {
          const active = estadoActual === key;
          return (
            <button
              key={key}
              disabled={loading || active}
              onClick={() => cambiarEstado(key)}
              className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                active
                  ? `${color} border-transparent`
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              } disabled:opacity-70`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
