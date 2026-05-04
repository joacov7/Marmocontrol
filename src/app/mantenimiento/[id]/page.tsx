import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Wrench, Truck } from "lucide-react";
import { formatPeso } from "@/lib/utils";
import NuevoRegistroButton from "@/components/mantenimiento/NuevoRegistroButton";

export const dynamic = "force-dynamic";

const TIPO_LABELS: Record<string, string> = {
  aceite: "Cambio de aceite",
  gomas: "Gomas / neumáticos",
  frenos: "Frenos",
  service: "Service general",
  reparacion: "Reparación",
  revision: "Revisión",
  otro: "Otro",
};

export default async function MaquinaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const maquina = await prisma.maquina.findUnique({
    where: { id: Number(id) },
    include: {
      mantenimientos: { orderBy: { fecha: "desc" } },
    },
  });

  if (!maquina) notFound();

  const ultimo = maquina.mantenimientos[0];
  const prox = ultimo?.proximaFecha;
  const dias = prox ? Math.ceil((prox.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
  const costoTotal = maquina.mantenimientos.reduce((acc, r) => acc + r.costo, 0);

  return (
    <div>
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <Link href="/mantenimiento" className="p-2 -ml-2 text-gray-500"><ArrowLeft size={20} /></Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {maquina.tipo === "vehiculo" ? <Truck size={16} className="text-gray-500" /> : <Wrench size={16} className="text-gray-500" />}
            <h1 className="font-bold text-gray-900">{maquina.nombre}</h1>
          </div>
          {maquina.descripcion && <p className="text-xs text-gray-400 mt-0.5">{maquina.descripcion}</p>}
        </div>
        <NuevoRegistroButton maquinaId={maquina.id} />
      </div>

      <div className="px-4 space-y-4 pb-24">
        {/* Resumen */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
            <p className="text-xs text-gray-400 mb-1">Registros</p>
            <p className="font-bold text-gray-800">{maquina.mantenimientos.length}</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
            <p className="text-xs text-gray-400 mb-1">Gasto total</p>
            <p className="font-bold text-gray-800 text-sm">{formatPeso(costoTotal)}</p>
          </div>
          <div className={`rounded-xl p-3 border text-center ${dias !== null && dias < 0 ? "bg-red-50 border-red-200" : dias !== null && dias <= 7 ? "bg-orange-50 border-orange-100" : "bg-white border-gray-100"}`}>
            <p className="text-xs text-gray-400 mb-1">Próximo</p>
            <p className={`font-bold text-sm ${dias !== null && dias < 0 ? "text-red-700" : dias !== null && dias <= 7 ? "text-orange-600" : "text-gray-800"}`}>
              {dias === null ? "—" : dias < 0 ? `Vencido` : `${dias}d`}
            </p>
          </div>
        </div>

        {prox && (
          <div className={`rounded-xl px-4 py-3 border text-sm ${dias! < 0 ? "bg-red-50 border-red-200 text-red-800" : dias! <= 7 ? "bg-orange-50 border-orange-200 text-orange-800" : "bg-blue-50 border-blue-100 text-blue-800"}`}>
            Próximo mantenimiento: <strong>{prox.toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })}</strong>
            {dias! < 0 && " · Vencido"}
          </div>
        )}

        {/* Historial */}
        <section>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Historial</p>
          {maquina.mantenimientos.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">Sin registros aún</p>
          ) : (
            <div className="space-y-2">
              {maquina.mantenimientos.map((r) => (
                <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{TIPO_LABELS[r.tipo] ?? r.tipo}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{r.descripcion}</p>
                      {r.km && <p className="text-xs text-gray-400 mt-0.5">{r.km.toLocaleString()} km</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-400">{new Date(r.fecha).toLocaleDateString("es-AR")}</p>
                      {r.costo > 0 && <p className="text-sm font-semibold text-gray-700 mt-0.5">{formatPeso(r.costo)}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
