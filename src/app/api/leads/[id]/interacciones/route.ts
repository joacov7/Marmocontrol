import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const interaccion = await prisma.interaccion.create({
    data: {
      leadId: Number(id),
      tipo: body.tipo,
      nota: body.nota,
    },
  });

  // Actualizar estado del lead si se indica
  if (body.nuevoEstado) {
    await prisma.lead.update({
      where: { id: Number(id) },
      data: {
        estado: body.nuevoEstado,
        proximoContacto: body.proximoContacto ? new Date(body.proximoContacto) : undefined,
      },
    });
  }

  return NextResponse.json(interaccion, { status: 201 });
}
