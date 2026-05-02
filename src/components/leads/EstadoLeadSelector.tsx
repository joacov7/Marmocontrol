"use client";

import { ESTADOS_LEAD, type EstadoLead } from "@/lib/leads";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FLUJO: EstadoLead[] = ["nuevo", "contactado", "interesado", "presupuestado"];

export default function EstadoLeadSelector({
  leadId,
  estadoActual,
}: {
  leadId: number;
  estadoActual: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function cambiar(nuevoEstado: EstadoLead) {
    setLoading(true);
    await fetch(`/api/leads/${leadId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Etapa</p>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {FLUJO.map((key) => {
          const cfg = ESTADOS_LEAD[key];
          const active = estadoActual === key;
          return (
            <button
              key={key}
              disabled={loading || active}
              onClick={() => cambiar(key)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                active ? `${cfg.color} border-transparent` : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              } disabled:opacity-70`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </button>
          );
        })}
        <button
          disabled={loading || estadoActual === "perdido"}
          onClick={() => cambiar("perdido")}
          className={`shrink-0 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
            estadoActual === "perdido"
              ? "bg-red-100 text-red-600 border-transparent"
              : "bg-white text-red-400 border-red-100 hover:border-red-200"
          } disabled:opacity-70`}
        >
          Perdido
        </button>
      </div>
    </div>
  );
}
