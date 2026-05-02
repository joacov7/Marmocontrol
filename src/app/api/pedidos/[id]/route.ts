import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pedido = await prisma.pedido.findUnique({
    where: { id: Number(id) },
    include: { cliente: true, items: { include: { material: true } } },
  });
  if (!pedido) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(pedido);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const pedido = await prisma.pedido.update({
    where: { id: Number(id) },
    data: {
      estado: body.estado,
      notas: body.notas ?? undefined,
      fechaInstalacion: body.fechaInstalacion ? new Date(body.fechaInstalacion) : undefined,
    },
    include: { cliente: true, items: { include: { material: true } } },
  });
  return NextResponse.json(pedido);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.pedido.delete({ where: { id: Number(id) } });
  return new NextResponse(null, { status: 204 });
}
