const configs: Record<string, { label: string; className: string }> = {
  pendiente: { label: "Pendiente", className: "bg-amber-100 text-amber-700" },
  asignado: { label: "Asignado", className: "bg-blue-100 text-blue-700" },
  en_proceso: { label: "En proceso", className: "bg-purple-100 text-purple-700" },
  completado: { label: "Completado", className: "bg-green-100 text-green-700" },
  cancelado: { label: "Cancelado", className: "bg-red-100 text-red-700" },
};

export default function EstadoBadge({ estado }: { estado: string }) {
  const cfg = configs[estado] ?? { label: estado, className: "bg-slate-100 text-slate-600" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
