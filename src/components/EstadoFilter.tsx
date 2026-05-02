"use client";

import Link from "next/link";
import { ESTADOS } from "@/lib/utils";

const filtros = [
  { value: "", label: "Todos" },
  ...Object.entries(ESTADOS).map(([value, { label }]) => ({ value, label })),
];

export default function EstadoFilter({ estadoActivo }: { estadoActivo: string }) {
  return (
    <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
      {filtros.map(({ value, label }) => {
        const active = estadoActivo === value;
        return (
          <Link
            key={value}
            href={value ? `/pedidos?estado=${value}` : "/pedidos"}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              active
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
