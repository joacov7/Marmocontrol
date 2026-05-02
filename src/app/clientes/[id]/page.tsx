import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPeso, formatDate, ESTADOS, type EstadoPedido } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, MapPin } from "lucide-react";
import NuevoRecordatorioButton from "@/components/NuevoRecordatorioButton";

export const dynamic = "force-dynamic";

export default async function ClienteDetalle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cliente = await prisma.cliente.findUnique({
    where: { id: Number(id) },
    include: {
      pedidos: {
        orderBy: { creadoEn: "desc" },
        include: { items: { include: { material: true } } },
      },
      recordatorios: {
        where: { completado: false },
        orderBy: { fechaAviso: "asc" },
      },
    },
  });

  if (!cliente) notFound();

  const totalGastado = cliente.pedidos
    .filter((p) => p.estado !== "presupuesto")
    .reduce((acc, p) => acc + p.total, 0);

  return (
    <div>
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <Link href="/clientes" className="p-2 -ml-2 text-gray-500">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="font-bold text-gray-900">{cliente.nombre}</h1>
          <p className="text-xs text-gray-500">Cliente desde {formatDate(cliente.creadoEn)}</p>
        </div>
        <NuevoRecordatorioButton clienteId={cliente.id} clienteNombre={cliente.nombre} />
      </div>

      <div className="px-4 space-y-4">
        {/* Datos de contacto */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm space-y-2">
          <a href={`tel:${cliente.telefono}`} className="flex items-center gap-2 text-blue-600 text-sm">
            <Phone size={14} /> {cliente.telefono}
          </a>
          {cliente.email && (
            <a href={`mailto:${cliente.email}`} className="flex items-center gap-2 text-gray-600 text-sm">
              <Mail size={14} /> {cliente.email}
            </a>
          )}
          {cliente.direccion && (
            <p className="flex items-center gap-2 text-gray-600 text-sm">
              <MapPin size={14} /> {cliente.direccion}
            </p>
          )}
          {cliente.notas && (
            <p className="text-sm text-gray-500 pt-1 border-t border-gray-100 mt-2">{cliente.notas}</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-900">{cliente.pedidos.length}</p>
            <p className="text-xs text-gray-500">Pedidos</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
            <p className="text-lg font-bold text-gray-900">{formatPeso(totalGastado)}</p>
            <p className="text-xs text-gray-500">Total facturado</p>
          </div>
        </div>

        {/* Recordatorios */}
        {cliente.recordatorios.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Seguimientos
            </p>
            <div className="space-y-2">
              {cliente.recordatorios.map((r) => (
                <div key={r.id} className="bg-orange-50 rounded-xl border border-orange-100 px-4 py-3">
                  <p className="text-sm text-gray-800">{r.nota}</p>
                  <p className="text-xs text-orange-600 mt-1">{formatDate(r.fechaAviso)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pedidos */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Historial</p>
            <Link
              href={`/cotizador?clienteId=${cliente.id}`}
              className="text-blue-600 text-xs font-medium"
            >
              + Nuevo pedido
            </Link>
          </div>
          <div className="space-y-2">
            {cliente.pedidos.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">Sin pedidos</p>
            )}
            {cliente.pedidos.map((p) => {
              const cfg = ESTADOS[p.estado as EstadoPedido] ?? { label: p.estado, color: "bg-gray-100 text-gray-600" };
              return (
                <Link
                  key={p.id}
                  href={`/pedidos/${p.id}`}
                  className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 hover:border-blue-200"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700">Pedido #{p.id}</p>
                    <p className="text-xs text-gray-400">{formatDate(p.creadoEn)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>
                      {cfg.label}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">{formatPeso(p.total)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
