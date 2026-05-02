import { prisma } from "@/lib/prisma";
import { formatPeso, formatDate, ESTADOS, type EstadoPedido } from "@/lib/utils";
import { Bell, TrendingUp, Package, Users, ClipboardList } from "lucide-react";
import Link from "next/link";
import RecordatorioItem from "@/components/RecordatorioItem";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [totalPedidos, enProduccion, totalClientes, recordatorios, ingresosMes, ultimosPedidos] =
    await Promise.all([
      prisma.pedido.count(),
      prisma.pedido.count({ where: { estado: "produccion" } }),
      prisma.cliente.count(),
      prisma.recordatorio.findMany({
        where: { completado: false, fechaAviso: { lte: tomorrow } },
        include: { cliente: true },
        orderBy: { fechaAviso: "asc" },
        take: 5,
      }),
      prisma.pedido.aggregate({
        where: {
          creadoEn: { gte: new Date(today.getFullYear(), today.getMonth(), 1) },
          estado: { not: "presupuesto" },
        },
        _sum: { total: true },
      }),
      prisma.pedido.findMany({
        take: 5,
        orderBy: { creadoEn: "desc" },
        include: { cliente: true },
      }),
    ]);

  const stats = [
    { label: "Pedidos totales", value: totalPedidos, icon: ClipboardList, color: "bg-blue-50 text-blue-600" },
    { label: "En producción", value: enProduccion, icon: Package, color: "bg-orange-50 text-orange-600" },
    { label: "Clientes", value: totalClientes, icon: Users, color: "bg-purple-50 text-purple-600" },
    { label: "Ingresos mes", value: formatPeso(ingresosMes._sum.total ?? 0), icon: TrendingUp, color: "bg-green-50 text-green-600" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="px-4 pt-8 pb-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <p className="text-blue-200 text-sm">Bienvenido</p>
        <h1 className="text-2xl font-bold">MarmoControl</h1>
        <p className="text-blue-200 text-sm mt-1">{formatDate(new Date())}</p>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className={`inline-flex p-2 rounded-lg ${s.color} mb-2`}>
                <s.icon size={18} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Recordatorios */}
        {recordatorios.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Bell size={16} className="text-orange-500" />
              <h2 className="font-semibold text-gray-800 text-sm">Seguimientos pendientes</h2>
            </div>
            <div className="space-y-2">
              {recordatorios.map((r) => (
                <RecordatorioItem key={r.id} recordatorio={r} />
              ))}
            </div>
          </section>
        )}

        {/* Últimos pedidos */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800 text-sm">Últimos pedidos</h2>
            <Link href="/pedidos" className="text-blue-600 text-xs font-medium">Ver todos</Link>
          </div>
          <div className="space-y-2">
            {ultimosPedidos.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">Todavía no hay pedidos</p>
            )}
            {ultimosPedidos.map((p) => {
              const cfg = ESTADOS[p.estado as EstadoPedido] ?? { label: p.estado, color: "bg-gray-100 text-gray-600" };
              return (
                <Link
                  key={p.id}
                  href={`/pedidos/${p.id}`}
                  className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 hover:border-blue-200 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{p.cliente.nombre}</p>
                    <p className="text-xs text-gray-400">{formatDate(p.creadoEn)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                    <span className="text-sm font-semibold text-gray-700">{formatPeso(p.total)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
