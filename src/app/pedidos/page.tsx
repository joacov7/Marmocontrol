import { prisma } from "@/lib/prisma";
import { formatPeso, formatDate, ESTADOS, type EstadoPedido } from "@/lib/utils";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import EstadoFilter from "@/components/EstadoFilter";

export const dynamic = "force-dynamic";

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;

  const pedidos = await prisma.pedido.findMany({
    where: estado ? { estado } : undefined,
    orderBy: { creadoEn: "desc" },
    include: { cliente: true },
  });

  return (
    <div>
      <PageHeader
        title="Pedidos"
        subtitle={`${pedidos.length} pedido${pedidos.length !== 1 ? "s" : ""}`}
        action={
          <Link
            href="/cotizador"
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl"
          >
            + Nuevo
          </Link>
        }
      />

      <EstadoFilter estadoActivo={estado ?? ""} />

      <div className="px-4 space-y-2 pb-4">
        {pedidos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No hay pedidos</p>
            <Link href="/cotizador" className="text-blue-600 text-sm mt-2 inline-block">
              Crear el primero
            </Link>
          </div>
        )}
        {pedidos.map((p) => {
          const cfg = ESTADOS[p.estado as EstadoPedido] ?? { label: p.estado, color: "bg-gray-100 text-gray-600" };
          return (
            <Link
              key={p.id}
              href={`/pedidos/${p.id}`}
              className="flex items-center justify-between bg-white rounded-xl px-4 py-4 shadow-sm border border-gray-100 hover:border-blue-200 transition-colors"
            >
              <div className="min-w-0">
                <p className="font-semibold text-gray-900">{p.cliente.nombre}</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(p.creadoEn)}</p>
                {p.fechaInstalacion && (
                  <p className="text-xs text-blue-600 mt-0.5">
                    Instalación: {formatDate(p.fechaInstalacion)}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1.5 ml-3 shrink-0">
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${cfg.color}`}>
                  {cfg.label}
                </span>
                <span className="text-base font-bold text-gray-800">{formatPeso(p.total)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
