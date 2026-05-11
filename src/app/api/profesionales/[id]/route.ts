import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const profesionalId = parseInt(id, 10);

    if (isNaN(profesionalId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const profesional = await prisma.profesional.findUnique({
      where: { id: profesionalId },
      include: {
        categorias: {
          include: {
            categoria: true,
          },
        },
        calificaciones: {
          include: {
            solicitud: {
              include: {
                categoria: true,
              },
            },
          },
          orderBy: { creadoEn: "desc" },
        },
        asignaciones: {
          include: {
            solicitud: {
              include: {
                cliente: true,
                categoria: true,
              },
            },
          },
          orderBy: { creadoEn: "desc" },
        },
      },
    });

    if (!profesional) {
      return NextResponse.json({ error: "Profesional no encontrado" }, { status: 404 });
    }

    const result = {
      ...profesional,
      categorias: profesional.categorias.map((pc: typeof profesional.categorias[number]) => pc.categoria),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/profesionales/[id] error:", error);
    return NextResponse.json({ error: "Error al obtener profesional" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const profesionalId = parseInt(id, 10);

    if (isNaN(profesionalId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await request.json();
    const { nombre, telefono, email, descripcion, zona, disponible, fotoUrl } = body;

    const profesional = await prisma.profesional.update({
      where: { id: profesionalId },
      data: {
        ...(nombre !== undefined && { nombre }),
        ...(telefono !== undefined && { telefono }),
        ...(email !== undefined && { email }),
        ...(descripcion !== undefined && { descripcion }),
        ...(zona !== undefined && { zona }),
        ...(disponible !== undefined && { disponible }),
        ...(fotoUrl !== undefined && { fotoUrl }),
      },
      include: {
        categorias: {
          include: {
            categoria: true,
          },
        },
      },
    });

    const result = {
      ...profesional,
      categorias: profesional.categorias.map((pc: typeof profesional.categorias[number]) => pc.categoria),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("PATCH /api/profesionales/[id] error:", error);
    return NextResponse.json({ error: "Error al actualizar profesional" }, { status: 500 });
  }
}
