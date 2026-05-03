import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { ESTADOS_TALLER, type EstadoTaller } from "@/lib/taller";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import AvanceTallerButton from "@/components/taller/AvanceTallerButton";

export const dynamic = "force-dynamic";

export default async function TallerDetalle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pedido = await prisma.pedido.findUnique({
    where: { id: Number(id) },
    include: {
      cliente: true,
      items: { include: { material: true } },
      avances: { orderBy: { creadoEn: "desc" } },
    },
  });

  if (!pedido) notFound();

  const est = ESTADOS_TALLER[pedido.estadoTaller as EstadoTaller] ?? ESTADOS_TALLER.pendiente;
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const vencido = pedido.fechaEntrega && new Date(pedido.fechaEntrega) < hoy && pedido.estadoTaller !== "terminado";

  return (
    <div>
      {/* Header oscuro estilo taller */}
      <div className="bg-gray-900 text-white px-4 pt-6 pb-5">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/taller" className="p-2 -ml-2 text-gray-400">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <p className="text-gray-400 text-xs">Trabajo #{pedido.id}</p>
            <h1 className="font-bold text-xl">{pedido.cliente.nombre}</h1>
          </div>
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${est.color}`}>
            {est.label}
          </span>
        </div>

        {/* Fechas destacadas */}
        <div className="grid grid-cols-2 gap-2">
          {pedido.fechaEntrega && (
            <div className={`rounded-xl p-3 ${vencido ? "bg-red-900/50 border border-red-700" : "bg-gray-800"}`}>
              <div className="flex items-center gap-1.5 mb-1">
                <Clock size={12} className={vencido ? "text-red-400" : "text-gray-400"} />
                <p className={`text-xs ${vencido ? "text-red-400" : "text-gray-400"}`}>Entrega</p>
              </div>
              <p className={`font-bold text-sm ${vencido ? "text-red-300" : "text-white"}`}>
                {formatDate(pedido.fechaEntrega)}
                {vencido && " ⚠️"}
              </p>
            </div>
          )}
          {pedido.fechaInstalacion && (
            <div className="bg-gray-800 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar size={12} className="text-blue-400" />
                <p className="text-xs text-gray-400">Instalación</p>
              </div>
              <p className="font-bold text-sm text-white">{formatDate(pedido.fechaInstalacion)}</p>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Piezas a fabricar */}
        <section>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Piezas a fabricar
          </p>
          <div className="space-y-2">
            {pedido.items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3">
                  <div
                    className="w-10 h-10 rounded-xl border border-gray-200 shrink-0"
                    style={{ backgroundColor: item.material.color ?? "#e5e7eb" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900">{item.descripcion || item.material.nombre}</p>
                    <p className="text-xs text-gray-500 capitalize">{item.material.tipo} · {item.material.nombre}</p>
                  </div>
                </div>

                {/* Medidas destacadas */}
                <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100">
                  <div className="px-3 py-3 text-center">
                    <p className="text-xs text-gray-400">Largo</p>
                    <p className="text-xl font-black text-gray-900">{item.largo}<span className="text-sm font-normal text-gray-400"> m</span></p>
                  </div>
                  <div className="px-3 py-3 text-center">
                    <p className="text-xs text-gray-400">Ancho</p>
                    <p className="text-xl font-black text-gray-900">{item.ancho}<span className="text-sm font-normal text-gray-400"> m</span></p>
                  </div>
                  <div className="px-3 py-3 text-center">
                    <p className="text-xs text-gray-400">Superficie</p>
                    <p className="text-xl font-black text-gray-900">{(item.largo * item.ancho).toFixed(2)}<span className="text-sm font-normal text-gray-400"> m²</span></p>
                  </div>
                </div>

                {/* Extras */}
                {(item.cantBachas > 0 || item.cantCortes > 0) && (
                  <div className="flex gap-4 px-4 py-2 bg-orange-50 border-t border-orange-100">
                    {item.cantBachas > 0 && (
                      <p className="text-sm font-semibold text-orange-700">
                        {item.cantBachas} bacha{item.cantBachas > 1 ? "s" : ""}
                      </p>
                    )}
                    {item.cantCortes > 0 && (
                      <p className="text-sm font-semibold text-orange-700">
                        {item.cantCortes} corte{item.cantCortes > 1 ? "s" : ""} especial{item.cantCortes > 1 ? "es" : ""}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Notas del pedido */}
        {pedido.notas && (
          <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-1">Notas</p>
            <p className="text-sm text-gray-700">{pedido.notas}</p>
          </div>
        )}

        {/* Botones de avance */}
        {pedido.estadoTaller !== "terminado" && (
          <AvanceTallerButton
            pedidoId={pedido.id}
            estadoActual={pedido.estadoTaller}
          />
        )}

        {pedido.estadoTaller === "terminado" && (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-5 text-center">
            <p className="text-2xl mb-1">✅</p>
            <p className="font-bold text-green-700">Trabajo terminado</p>
            <p className="text-xs text-green-600 mt-1">Listo para instalación</p>
          </div>
        )}

        {/* Historial de avances */}
        {pedido.avances.length > 0 && (
          <section>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Historial
            </p>
            <div className="space-y-2">
              {pedido.avances.map((av) => {
                const cfg = ESTADOS_TALLER[av.estado as EstadoTaller] ?? ESTADOS_TALLER.pendiente;
                return (
                  <div key={av.id} className="flex gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${cfg.dot}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-gray-500">{cfg.label}</p>
                        <p className="text-xs text-gray-400">{formatDate(av.creadoEn)}</p>
                      </div>
                      <p className="text-sm text-gray-700 mt-0.5">{av.nota}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
