import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import NuevaMaquinaButton from "@/components/mantenimiento/NuevaMaquinaButton";
import { Wrench, Truck, AlertTriangle, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

function diasHasta(fecha: Date) {
  return Math.ceil((fecha.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export default async function MantenimientoPage() {
  const maquinas = await prisma.maquina.findMany({
    where: { activo: true },
    orderBy: { nombre: "asc" },
    include: {
      mantenimientos: { orderBy: { fecha: "desc" }, take: 1 },
    },
  });

  const alertas = maquinas.filter((m) => {
    const prox = m.mantenimientos[0]?.proximaFecha;
    if (!prox) return false;
    return diasHasta(prox) <= 7;
  });

  const vehiculos = maquinas.filter((m) => m.tipo === "vehiculo");
  const maquinaria = maquinas.filter((m) => m.tipo === "maquina");

  return (
    <div>
      <PageHeader title="Mantenimiento" subtitle={`${maquinas.length} equipos registrados`} action={<NuevaMaquinaButton />} />

      <div className="px-4 space-y-5 pb-24">
        {/* Alertas */}
        {alertas.length > 0 && (
          <section className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-red-700 uppercase tracking-wide flex items-center gap-1">
              <AlertTriangle size={12} /> Mantenimientos próximos o vencidos
            </p>
            {alertas.map((m) => {
              const prox = m.mantenimientos[0]?.proximaFecha!;
              const dias = diasHasta(prox);
              return (
                <Link key={m.id} href={`/mantenimiento/${m.id}`} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-red-100">
                  <span className="text-sm font-medium text-gray-800">{m.nombre}</span>
                  <span className={`text-xs font-semibold ${dias < 0 ? "text-red-600" : "text-orange-600"}`}>
                    {dias < 0 ? `Vencido hace ${Math.abs(dias)}d` : `En ${dias}d`}
                  </span>
                </Link>
              );
            })}
          </section>
        )}

        {maquinas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No hay equipos registrados</p>
          </div>
        )}

        {/* Vehículos */}
        {vehiculos.length > 0 && (
          <section>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Truck size={12} /> Vehículos ({vehiculos.length})
            </p>
            <div className="space-y-2">
              {vehiculos.map((m) => <MaquinaCard key={m.id} maquina={m} />)}
            </div>
          </section>
        )}

        {/* Maquinaria */}
        {maquinaria.length > 0 && (
          <section>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Wrench size={12} /> Maquinaria ({maquinaria.length})
            </p>
            <div className="space-y-2">
              {maquinaria.map((m) => <MaquinaCard key={m.id} maquina={m} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function MaquinaCard({ maquina: m }: { maquina: { id: number; nombre: string; tipo: string; descripcion: string | null; mantenimientos: { tipo: string; fecha: Date; proximaFecha: Date | null }[] } }) {
  const ultimo = m.mantenimientos[0];
  const prox = ultimo?.proximaFecha;
  const dias = prox ? Math.ceil((prox.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
  const vencido = dias !== null && dias < 0;
  const proximo = dias !== null && dias >= 0 && dias <= 7;

  return (
    <Link href={`/mantenimiento/${m.id}`} className="block bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3.5 hover:border-gray-200 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900">{m.nombre}</p>
          {m.descripcion && <p className="text-xs text-gray-400 truncate">{m.descripcion}</p>}
        </div>
        <div className="text-right shrink-0 ml-3">
          {prox ? (
            <div className={`flex items-center gap-1 text-xs font-medium ${vencido ? "text-red-600" : proximo ? "text-orange-600" : "text-gray-500"}`}>
              {(vencido || proximo) && <AlertTriangle size={11} />}
              {!vencido && !proximo && <Clock size={11} />}
              {vencido ? `Vencido ${Math.abs(dias!)}d` : proximo ? `En ${dias}d` : `Próximo: ${prox.toLocaleDateString("es-AR")}`}
            </div>
          ) : ultimo ? (
            <p className="text-xs text-gray-400">{ultimo.tipo} · {new Date(ultimo.fecha).toLocaleDateString("es-AR")}</p>
          ) : (
            <p className="text-xs text-gray-400">Sin registros</p>
          )}
        </div>
      </div>
    </Link>
  );
}
