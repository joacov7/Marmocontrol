import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cliente = await prisma.cliente.findUnique({
    where: { id: Number(id) },
    include: {
      pedidos: {
        orderBy: { creadoEn: "desc" },
        include: { items: { include: { material: true } } },
      },
      recordatorios: { where: { completado: false }, orderBy: { fechaAviso: "asc" } },
    },
  });
  if (!cliente) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(cliente);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const cliente = await prisma.cliente.update({
    where: { id: Number(id) },
    data: {
      nombre: body.nombre,
      telefono: body.telefono,
      email: body.email ?? null,
      direccion: body.direccion ?? null,
      notas: body.notas ?? null,
    },
  });
  return NextResponse.json(cliente);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.cliente.delete({ where: { id: Number(id) } });
  return new NextResponse(null, { status: 204 });
}
