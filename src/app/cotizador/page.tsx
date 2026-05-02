import { prisma } from "@/lib/prisma";
import CotizadorForm from "@/components/CotizadorForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CotizadorPage({
  searchParams,
}: {
  searchParams: Promise<{ clienteId?: string }>;
}) {
  const { clienteId } = await searchParams;

  const [materiales, clientes] = await Promise.all([
    prisma.material.findMany({ where: { activo: true }, orderBy: { nombre: "asc" } }),
    prisma.cliente.findMany({ orderBy: { nombre: "asc" } }),
  ]);

  return (
    <div>
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <Link href="/" className="p-2 -ml-2 text-gray-500">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-bold text-gray-900">Nuevo presupuesto</h1>
          <p className="text-xs text-gray-500">Calculá y guardá en segundos</p>
        </div>
      </div>
      <CotizadorForm
        materiales={materiales}
        clientes={clientes}
        clienteIdInicial={clienteId ? Number(clienteId) : undefined}
      />
    </div>
  );
}
