import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const recordatorios = await prisma.recordatorio.findMany({
    where: { completado: false },
    orderBy: { fechaAviso: "asc" },
    include: { cliente: true },
  });
  return NextResponse.json(recordatorios);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const r = await prisma.recordatorio.create({
    data: {
      clienteId: body.clienteId,
      nota: body.nota,
      fechaAviso: new Date(body.fechaAviso),
    },
    include: { cliente: true },
  });
  return NextResponse.json(r, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const r = await prisma.recordatorio.update({
    where: { id: body.id },
    data: { completado: true },
  });
  return NextResponse.json(r);
}
