import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const avance = await prisma.avanceTaller.create({
    data: {
      pedidoId: Number(id),
      nota: body.nota,
      estado: body.estado,
    },
  });

  await prisma.pedido.update({
    where: { id: Number(id) },
    data: {
      estadoTaller: body.estado,
      ...(body.estado === "en_proceso" && { estado: "produccion" }),
      ...(body.estado === "terminado" && { estado: "listo" }),
    },
  });

  return NextResponse.json(avance, { status: 201 });
}
