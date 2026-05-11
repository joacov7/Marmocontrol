import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const solicitudId = parseInt(id, 10);

    if (isNaN(solicitudId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const solicitud = await prisma.solicitud.findUnique({
      where: { id: solicitudId },
      include: {
        cliente: true,
        categoria: true,
        asignacion: {
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
        calificacion: true,
      },
    });

    if (!solicitud) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
    }

    return NextResponse.json(solicitud);
  } catch (error) {
    console.error("GET /api/solicitudes/[id] error:", error);
    return NextResponse.json({ error: "Error al obtener solicitud" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const solicitudId = parseInt(id, 10);

    if (isNaN(solicitudId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await request.json();
    const { estado, presupuesto, notas } = body;

    const solicitud = await prisma.solicitud.update({
      where: { id: solicitudId },
      data: {
        ...(estado !== undefined && { estado }),
        ...(presupuesto !== undefined && { presupuesto: parseFloat(String(presupuesto)) }),
        ...(notas !== undefined && { notas }),
      },
      include: {
        cliente: true,
        categoria: true,
        asignacion: {
          include: {
            profesional: true,
          },
        },
        calificacion: true,
      },
    });

    return NextResponse.json(solicitud);
  } catch (error) {
    console.error("PATCH /api/solicitudes/[id] error:", error);
    return NextResponse.json({ error: "Error al actualizar solicitud" }, { status: 500 });
  }
}
