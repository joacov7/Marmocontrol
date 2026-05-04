import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const materiales = await prisma.material.findMany({
    where: { activo: true },
    orderBy: [{ tipo: "asc" }, { nombre: "asc" }],
  });
  return NextResponse.json(materiales);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const material = await prisma.material.create({
    data: {
      nombre: body.nombre,
      tipo: body.tipo,
      precioCompra: Number(body.precioCompra ?? 0),
      precioPorM2: Number(body.precioPorM2),
      porcentajeDesperdicio: Number(body.porcentajeDesperdicio ?? 10),
      largoPlaca: body.largoPlaca ? Number(body.largoPlaca) : null,
      anchoPlaca: body.anchoPlaca ? Number(body.anchoPlaca) : null,
      proveedor: body.proveedor || null,
      color: body.color || null,
      descripcion: body.descripcion || null,
    },
  });
  return NextResponse.json(material, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const material = await prisma.material.update({
    where: { id: body.id },
    data: {
      nombre: body.nombre,
      tipo: body.tipo,
      precioCompra: Number(body.precioCompra ?? 0),
      precioPorM2: Number(body.precioPorM2),
      porcentajeDesperdicio: Number(body.porcentajeDesperdicio ?? 10),
      largoPlaca: body.largoPlaca ? Number(body.largoPlaca) : null,
      anchoPlaca: body.anchoPlaca ? Number(body.anchoPlaca) : null,
      proveedor: body.proveedor || null,
      color: body.color || null,
      descripcion: body.descripcion || null,
      activo: body.activo ?? true,
      stockActual: Number(body.stockActual ?? 0),
      stockMinimo: Number(body.stockMinimo ?? 0),
      unidadStock: body.unidadStock || "m2",
    },
  });
  return NextResponse.json(material);
}
