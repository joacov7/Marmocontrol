import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const estado = req.nextUrl.searchParams.get("estado");
  const pedidos = await prisma.pedido.findMany({
    where: estado ? { estado } : undefined,
    orderBy: { creadoEn: "desc" },
    include: {
      cliente: true,
      items: { include: { material: true } },
    },
  });
  return NextResponse.json(pedidos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const pedido = await prisma.pedido.create({
    data: {
      clienteId: body.clienteId,
      estado: "presupuesto",
      total: body.total,
      notas: body.notas ?? null,
      fechaInstalacion: body.fechaInstalacion ? new Date(body.fechaInstalacion) : null,
      fechaEntrega: body.fechaEntrega ? new Date(body.fechaEntrega) : null,
      items: {
        create: body.items.map((item: {
          materialId: number;
          descripcion?: string;
          largo: number;
          ancho: number;
          cantBachas: number;
          cantCortes: number;
          desperdicio?: number;
          precioUnit: number;
          precioTotal: number;
          bachaTipo?: string | null;
          bachaId?: number | null;
          bachaLargo?: number | null;
          bachaAncho?: number | null;
        }) => ({
          materialId: item.materialId,
          descripcion: item.descripcion ?? null,
          largo: item.largo,
          ancho: item.ancho,
          cantBachas: item.cantBachas,
          cantCortes: item.cantCortes,
          desperdicio: item.desperdicio ?? 0,
          precioUnit: item.precioUnit,
          precioTotal: item.precioTotal,
          bachaTipo: item.bachaTipo ?? null,
          bachaId: item.bachaId ?? null,
          bachaLargo: item.bachaLargo ?? null,
          bachaAncho: item.bachaAncho ?? null,
        })),
      },
    },
    include: { cliente: true, items: { include: { material: true } } },
  });
  return NextResponse.json(pedido, { status: 201 });
}
