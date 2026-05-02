import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id: Number(id) },
    include: {
      interacciones: { orderBy: { fecha: "desc" } },
      cliente: { select: { id: true, nombre: true } },
    },
  });
  if (!lead) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const lead = await prisma.lead.update({
    where: { id: Number(id) },
    data: {
      nombre: body.nombre,
      telefono: body.telefono ?? null,
      email: body.email ?? null,
      empresa: body.empresa ?? null,
      origen: body.origen,
      estado: body.estado,
      interes: body.interes ?? null,
      notas: body.notas ?? null,
      proximoContacto: body.proximoContacto ? new Date(body.proximoContacto) : null,
    },
  });
  return NextResponse.json(lead);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.lead.delete({ where: { id: Number(id) } });
  return new NextResponse(null, { status: 204 });
}
