import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("q") ?? "";
  const clientes = await prisma.cliente.findMany({
    where: search
      ? {
          OR: [
            { nombre: { contains: search } },
            { telefono: { contains: search } },
          ],
        }
      : undefined,
    orderBy: { nombre: "asc" },
    include: { _count: { select: { pedidos: true } } },
  });
  return NextResponse.json(clientes);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const cliente = await prisma.cliente.create({
    data: {
      nombre: body.nombre,
      telefono: body.telefono,
      email: body.email ?? null,
      direccion: body.direccion ?? null,
      notas: body.notas ?? null,
    },
  });
  return NextResponse.json(cliente, { status: 201 });
}
