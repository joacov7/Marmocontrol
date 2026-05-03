import { prisma } from "@/lib/prisma";
import { formatPeso } from "@/lib/utils";
import PageHeader from "@/components/PageHeader";
import MaterialCard from "@/components/MaterialCard";
import NuevoMaterialButton from "@/components/NuevoMaterialButton";

export const dynamic = "force-dynamic";

export default async function MaterialesPage() {
  const materiales = await prisma.material.findMany({
    orderBy: [{ tipo: "asc" }, { nombre: "asc" }],
  });

  const activos = materiales.filter((m) => m.activo);
  const inactivos = materiales.filter((m) => !m.activo);

  const totalActivos = activos.length;
  const margenPromedio = activos.length
    ? activos.reduce((acc, m) => {
        const margen = m.precioCompra > 0 ? ((m.precioPorM2 - m.precioCompra) / m.precioCompra) * 100 : 0;
        return acc + margen;
      }, 0) / activos.length
    : 0;

  const porTipo = activos.reduce<Record<string, typeof activos>>((acc, m) => {
    (acc[m.tipo] = acc[m.tipo] || []).push(m);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        title="Materiales"
        subtitle={`${totalActivos} activos · margen prom. ${margenPromedio.toFixed(0)}%`}
        action={<NuevoMaterialButton />}
      />

      <div className="px-4 space-y-5 pb-24">
        {activos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No hay materiales cargados</p>
          </div>
        )}

        {Object.entries(porTipo).map(([tipo, items]) => (
          <section key={tipo}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 capitalize">
              {tipo} <span className="text-gray-400 font-normal">({items.length})</span>
            </p>
            <div className="space-y-2">
              {items.map((m) => (
                <MaterialCard key={m.id} material={m} />
              ))}
            </div>
          </section>
        ))}

        {inactivos.length > 0 && (
          <section>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Inactivos ({inactivos.length})
            </p>
            <div className="space-y-2 opacity-60">
              {inactivos.map((m) => (
                <MaterialCard key={m.id} material={m} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
