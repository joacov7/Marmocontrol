import { ESTADOS, type EstadoPedido } from "@/lib/utils";

export default function EstadoBadge({ estado }: { estado: string }) {
  const config = ESTADOS[estado as EstadoPedido] ?? {
    label: estado,
    color: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}
