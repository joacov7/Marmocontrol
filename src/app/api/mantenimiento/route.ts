import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const maquinas = await prisma.maquina.findMany({
    where: { activo: true },
    orderBy: { nombre: "asc" },
    include: {
      mantenimientos: {
        orderBy: { fecha: "desc" },
        take: 1,
      },
    },
  });
  return NextResponse.json(maquinas);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const maquina = await prisma.maquina.create({
    data: {
      nombre: body.nombre,
      tipo: body.tipo,
      descripcion: body.descripcion || null,
    },
  });
  return NextResponse.json(maquina, { status: 201 });
}
