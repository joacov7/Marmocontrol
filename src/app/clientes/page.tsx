import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { Phone, ChevronRight } from "lucide-react";
import NuevoClienteButton from "@/components/NuevoClienteButton";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const clientes = await prisma.cliente.findMany({
    orderBy: { nombre: "asc" },
    include: { _count: { select: { pedidos: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Clientes"
        subtitle={`${clientes.length} cliente${clientes.length !== 1 ? "s" : ""}`}
        action={<NuevoClienteButton />}
      />

      <div className="px-4 space-y-2">
        {clientes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No hay clientes todavía</p>
          </div>
        )}
        {clientes.map((c) => (
          <Link
            key={c.id}
            href={`/clientes/${c.id}`}
            className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 shadow-sm border border-gray-100 hover:border-blue-200 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-blue-700 font-bold text-sm">
                {c.nombre.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{c.nombre}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <Phone size={10} />
                {c.telefono}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {c._count.pedidos > 0 && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {c._count.pedidos} pedido{c._count.pedidos !== 1 ? "s" : ""}
                </span>
              )}
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
