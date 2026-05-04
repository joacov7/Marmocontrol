import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const registros = await prisma.mantenimiento.findMany({
    where: { maquinaId: Number(id) },
    orderBy: { fecha: "desc" },
  });
  return NextResponse.json(registros);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const registro = await prisma.mantenimiento.create({
    data: {
      maquinaId: Number(id),
      tipo: body.tipo,
      descripcion: body.descripcion,
      costo: Number(body.costo) || 0,
      fecha: body.fecha ? new Date(body.fecha) : new Date(),
      proximaFecha: body.proximaFecha ? new Date(body.proximaFecha) : null,
      km: body.km ? Number(body.km) : null,
    },
  });
  return NextResponse.json(registro, { status: 201 });
}
