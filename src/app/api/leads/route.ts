import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const estado = req.nextUrl.searchParams.get("estado");
  const leads = await prisma.lead.findMany({
    where: estado ? { estado } : undefined,
    orderBy: { creadoEn: "desc" },
    include: {
      _count: { select: { interacciones: true } },
      cliente: { select: { id: true, nombre: true } },
    },
  });
  return NextResponse.json(leads);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const lead = await prisma.lead.create({
    data: {
      nombre: body.nombre,
      telefono: body.telefono ?? null,
      email: body.email ?? null,
      empresa: body.empresa ?? null,
      origen: body.origen ?? "otro",
      estado: "nuevo",
      interes: body.interes ?? null,
      notas: body.notas ?? null,
      proximoContacto: body.proximoContacto ? new Date(body.proximoContacto) : null,
    },
  });
  return NextResponse.json(lead, { status: 201 });
}
