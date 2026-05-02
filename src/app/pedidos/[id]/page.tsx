import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPeso, formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EstadoSelector from "@/components/EstadoSelector";
import ExportarPresupuesto from "@/components/ExportarPresupuesto";

export const dynamic = "force-dynamic";

export default async function PedidoDetalle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pedido = await prisma.pedido.findUnique({
    where: { id: Number(id) },
    include: { cliente: true, items: { include: { material: true } } },
  });

  if (!pedido) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <Link href="/pedidos" className="p-2 -ml-2 text-gray-500">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="font-bold text-gray-900">Pedido #{pedido.id}</h1>
          <p className="text-xs text-gray-500">{formatDate(pedido.creadoEn)}</p>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Cliente */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Cliente</p>
          <p className="font-semibold text-gray-900">{pedido.cliente.nombre}</p>
          <a href={`tel:${pedido.cliente.telefono}`} className="text-blue-600 text-sm">
            {pedido.cliente.telefono}
          </a>
          {pedido.cliente.direccion && (
            <p className="text-sm text-gray-500 mt-1">{pedido.cliente.direccion}</p>
          )}
        </div>

        {/* Estado */}
        <EstadoSelector pedidoId={pedido.id} estadoActual={pedido.estado} />

        {/* Fecha instalación */}
        {pedido.fechaInstalacion && (
          <div className="bg-blue-50 rounded-xl border border-blue-100 px-4 py-3">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Fecha de instalación</p>
            <p className="font-medium text-blue-900 mt-1">{formatDate(pedido.fechaInstalacion)}</p>
          </div>
        )}

        {/* Items */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Detalle</p>
          <div className="space-y-2">
            {pedido.items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{item.material.nombre}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.largo} × {item.ancho} m
                      {item.cantBachas > 0 && ` · ${item.cantBachas} bacha${item.cantBachas > 1 ? "s" : ""}`}
                      {item.cantCortes > 0 && ` · ${item.cantCortes} corte${item.cantCortes > 1 ? "s" : ""}`}
                    </p>
                    {item.descripcion && (
                      <p className="text-xs text-gray-400 mt-0.5">{item.descripcion}</p>
                    )}
                  </div>
                  <p className="font-semibold text-gray-800">{formatPeso(item.precioTotal)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="bg-gray-900 rounded-xl p-4 flex justify-between items-center">
          <p className="text-white font-semibold">Total</p>
          <p className="text-white text-xl font-bold">{formatPeso(pedido.total)}</p>
        </div>

        {/* Notas */}
        {pedido.notas && (
          <div className="bg-yellow-50 rounded-xl border border-yellow-100 px-4 py-3">
            <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-1">Notas</p>
            <p className="text-sm text-gray-700">{pedido.notas}</p>
          </div>
        )}

        {/* Acciones */}
        <div className="space-y-3 pb-4">
          <ExportarPresupuesto
            pedidoId={pedido.id}
            clienteNombre={pedido.cliente.nombre}
            clienteTelefono={pedido.cliente.telefono}
            total={pedido.total}
            fechaInstalacion={pedido.fechaInstalacion?.toISOString() ?? null}
          />
          <Link
            href={`/clientes/${pedido.clienteId}`}
            className="block bg-gray-50 text-gray-700 font-medium py-3 rounded-xl text-center text-sm border border-gray-200"
          >
            Ver ficha del cliente
          </Link>
        </div>
      </div>
    </div>
  );
}
