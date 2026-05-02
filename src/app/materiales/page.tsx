import { prisma } from "@/lib/prisma";
import { formatPeso } from "@/lib/utils";
import PageHeader from "@/components/PageHeader";
import NuevoMaterialButton from "@/components/NuevoMaterialButton";

export const dynamic = "force-dynamic";

const TIPO_COLORES: Record<string, string> = {
  granito: "bg-gray-100 text-gray-700",
  marmol: "bg-blue-50 text-blue-700",
  porcelana: "bg-purple-50 text-purple-700",
  cuarcita: "bg-orange-50 text-orange-700",
  silestone: "bg-teal-50 text-teal-700",
  otro: "bg-green-50 text-green-700",
};

export default async function MaterialesPage() {
  const materiales = await prisma.material.findMany({
    where: { activo: true },
    orderBy: [{ tipo: "asc" }, { nombre: "asc" }],
  });

  const porTipo = materiales.reduce<Record<string, typeof materiales>>((acc, m) => {
    (acc[m.tipo] = acc[m.tipo] || []).push(m);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        title="Materiales"
        subtitle={`${materiales.length} materiales activos`}
        action={<NuevoMaterialButton />}
      />

      <div className="px-4 space-y-5">
        {materiales.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No hay materiales cargados</p>
          </div>
        )}
        {Object.entries(porTipo).map(([tipo, items]) => (
          <section key={tipo}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 capitalize">
              {tipo}
            </p>
            <div className="space-y-2">
              {items.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between bg-white rounded-xl px-4 py-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg border border-gray-200"
                      style={{ backgroundColor: m.color ?? "#e5e7eb" }}
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{m.nombre}</p>
                      {m.descripcion && (
                        <p className="text-xs text-gray-400">{m.descripcion}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                        TIPO_COLORES[tipo] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tipo}
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      {formatPeso(m.precioPorM2)}/m²
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
