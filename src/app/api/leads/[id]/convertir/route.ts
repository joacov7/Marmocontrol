import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const lead = await prisma.lead.findUnique({ where: { id: Number(id) } });
  if (!lead) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  // Crear cliente a partir del lead
  const cliente = await prisma.cliente.create({
    data: {
      nombre: lead.nombre,
      telefono: lead.telefono ?? "",
      email: lead.email ?? null,
      notas: lead.interes ?? null,
    },
  });

  // Marcar lead como ganado y vincularlo al cliente
  await prisma.lead.update({
    where: { id: Number(id) },
    data: { estado: "ganado", clienteId: cliente.id },
  });

  return NextResponse.json({ clienteId: cliente.id }, { status: 201 });
}
