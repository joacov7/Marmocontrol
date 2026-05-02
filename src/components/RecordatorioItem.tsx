"use client";

import { formatDate } from "@/lib/utils";
import { Check, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

interface Recordatorio {
  id: number;
  nota: string;
  fechaAviso: Date | string;
  cliente: { nombre: string; telefono: string };
}

export default function RecordatorioItem({ recordatorio: r }: { recordatorio: Recordatorio }) {
  const router = useRouter();

  async function completar() {
    await fetch("/api/recordatorios", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: r.id }),
    });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3 bg-orange-50 rounded-xl px-4 py-3 border border-orange-100">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">{r.cliente.nombre}</p>
        <p className="text-xs text-gray-600 truncate">{r.nota}</p>
        <p className="text-xs text-orange-600 mt-0.5">{formatDate(r.fechaAviso)}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <a
          href={`tel:${r.cliente.telefono}`}
          className="p-2 bg-white rounded-lg border border-orange-200 text-orange-600"
        >
          <Phone size={14} />
        </a>
        <button
          onClick={completar}
          className="p-2 bg-white rounded-lg border border-orange-200 text-green-600"
        >
          <Check size={14} />
        </button>
      </div>
    </div>
  );
}
