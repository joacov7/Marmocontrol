import { prisma } from "@/lib/prisma";
import { ESTADOS_TALLER, type EstadoTaller } from "@/lib/taller";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Clock, CheckCircle2, Wrench, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TallerPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;

  const pedidos = await prisma.pedido.findMany({
    where: {
      estado: { not: "presupuesto" },
      ...(estado ? { estadoTaller: estado } : { estadoTaller: { not: "terminado" } }),
    },
    orderBy: [{ fechaEntrega: "asc" }, { creadoEn: "asc" }],
    include: {
      cliente: true,
      items: { include: { material: true } },
      avances: { orderBy: { creadoEn: "desc" }, take: 1 },
    },
  });

  const conteos = await prisma.pedido.groupBy({
    by: ["estadoTaller"],
    where: { estado: { not: "presupuesto" } },
    _count: { id: true },
  });
  const porEstado = Object.fromEntries(conteos.map((c) => [c.estadoTaller, c._count.id]));

  return (
    <div>
      {/* Header especial para taller */}
      <div className="px-4 pt-8 pb-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Wrench size={18} className="text-gray-400" />
          <p className="text-gray-400 text-sm">Vista de taller</p>
        </div>
        <h1 className="text-2xl font-bold">Trabajos</h1>
        <p className="text-gray-400 text-sm mt-1">{new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide bg-gray-900">
        {[
          { value: "", label: "Activos", count: (porEstado.pendiente ?? 0) + (porEstado.en_proceso ?? 0) },
          ...Object.entries(ESTADOS_TALLER).map(([value, { label }]) => ({ value, label, count: porEstado[value] ?? 0 })),
        ].map(({ value, label, count }) => (
          <Link
            key={value}
            href={value ? `/taller?estado=${value}` : "/taller"}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              (estado ?? "") === value
                ? "bg-white text-gray-900 border-white"
                : "bg-transparent text-gray-400 border-gray-700"
            }`}
          >
            {label} {count > 0 && <span className="ml-1 font-bold">{count}</span>}
          </Link>
        ))}
      </div>

      <div className="px-4 py-4 space-y-3">
        {pedidos.length === 0 && (
          <div className="text-center py-16">
            <CheckCircle2 size={40} className="text-green-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">¡Todo al día!</p>
            <p className="text-gray-400 text-sm mt-1">No hay trabajos pendientes</p>
          </div>
        )}

        {pedidos.map((p) => {
          const est = ESTADOS_TALLER[p.estadoTaller as EstadoTaller] ?? ESTADOS_TALLER.pendiente;
          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);
          const vencido = p.fechaEntrega && new Date(p.fechaEntrega) < hoy && p.estadoTaller !== "terminado";
          const hoyEntrega = p.fechaEntrega && new Date(p.fechaEntrega).toDateString() === hoy.toDateString();

          return (
            <Link
              key={p.id}
              href={`/taller/${p.id}`}
              className={`block rounded-2xl border-2 shadow-sm overflow-hidden transition-all active:scale-98 ${
                p.estadoTaller === "en_proceso"
                  ? "border-blue-400"
                  : vencido
                  ? "border-red-300"
                  : "border-gray-200"
              }`}
            >
              {/* Estado bar */}
              <div className={`px-4 py-2 flex items-center justify-between ${est.bg}`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${est.dot}`} />
                  <span className={`text-xs font-semibold ${est.color.split(" ")[1]}`}>{est.label}</span>
                </div>
                <span className="text-xs text-gray-500">#{p.id}</span>
              </div>

              {/* Contenido */}
              <div className="bg-white px-4 py-3">
                <p className="font-bold text-gray-900 text-lg">{p.cliente.nombre}</p>

                {/* Items resumidos */}
                <div className="mt-2 space-y-1">
                  {p.items.map((it) => (
                    <div key={it.id} className="flex items-center gap-2 text-sm text-gray-600">
                      <div
                        className="w-3 h-3 rounded-sm border border-gray-200 shrink-0"
                        style={{ backgroundColor: it.material.color ?? "#e5e7eb" }}
                      />
                      <span>{it.descripcion || it.material.nombre}</span>
                      <span className="text-gray-400">—</span>
                      <span className="font-medium">{it.largo} × {it.ancho} m</span>
                      {it.cantBachas > 0 && <span className="text-gray-400">· {it.cantBachas} bacha{it.cantBachas > 1 ? "s" : ""}</span>}
                    </div>
                  ))}
                </div>

                {/* Fechas */}
                <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-gray-100">
                  {p.fechaEntrega && (
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${vencido ? "text-red-600" : hoyEntrega ? "text-orange-600" : "text-gray-500"}`}>
                      <Clock size={12} />
                      Entrega: {formatDate(p.fechaEntrega)}
                      {vencido && " ⚠️"}
                      {hoyEntrega && " — HOY"}
                    </div>
                  )}
                  {p.fechaInstalacion && (
                    <div className="flex items-center gap-1.5 text-xs text-blue-600">
                      <Calendar size={12} />
                      Instalación: {formatDate(p.fechaInstalacion)}
                    </div>
                  )}
                </div>

                {/* Último avance */}
                {p.avances[0] && (
                  <div className="mt-2 bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-500">Último registro:</p>
                    <p className="text-xs text-gray-700 mt-0.5">{p.avances[0].nota}</p>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
