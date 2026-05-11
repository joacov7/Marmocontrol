import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany({
      where: { activo: true },
      include: {
        _count: {
          select: { profesionales: true },
        },
      },
      orderBy: { nombre: "asc" },
    });

    const result = categorias.map((c: typeof categorias[number]) => ({
      ...c,
      totalProfesionales: c._count.profesionales,
      _count: undefined,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/categorias error:", error);
    return NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, icono, descripcion, color } = body;

    if (!nombre || !icono) {
      return NextResponse.json({ error: "nombre e icono son requeridos" }, { status: 400 });
    }

    const categoria = await prisma.categoria.create({
      data: {
        nombre,
        icono,
        descripcion: descripcion ?? null,
        color: color ?? "#2563EB",
      },
    });

    return NextResponse.json(categoria, { status: 201 });
  } catch (error) {
    console.error("POST /api/categorias error:", error);
    return NextResponse.json({ error: "Error al crear categoría" }, { status: 500 });
  }
}
