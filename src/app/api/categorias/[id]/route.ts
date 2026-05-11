import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoriaId = parseInt(id, 10);

    if (isNaN(categoriaId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const categoria = await prisma.categoria.findUnique({
      where: { id: categoriaId },
      include: {
        profesionales: {
          include: {
            profesional: {
              include: {
                categorias: {
                  include: {
                    categoria: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!categoria) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
    }

    const result = {
      ...categoria,
      profesionales: categoria.profesionales.map((pc: typeof categoria.profesionales[number]) => ({
        ...pc.profesional,
        categorias: pc.profesional.categorias.map((c: typeof pc.profesional.categorias[number]) => c.categoria),
      })),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/categorias/[id] error:", error);
    return NextResponse.json({ error: "Error al obtener categoría" }, { status: 500 });
  }
}
