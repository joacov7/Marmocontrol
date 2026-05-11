import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { solicitudId, profesionalId } = body;

    if (!solicitudId || !profesionalId) {
      return NextResponse.json(
        { error: "solicitudId y profesionalId son requeridos" },
        { status: 400 }
      );
    }

    const solId = parseInt(String(solicitudId), 10);
    const profId = parseInt(String(profesionalId), 10);

    // Check if the solicitud exists and is not already assigned
    const solicitud = await prisma.solicitud.findUnique({
      where: { id: solId },
      include: { asignacion: true },
    });

    if (!solicitud) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
    }

    if (solicitud.asignacion) {
      return NextResponse.json(
        { error: "La solicitud ya tiene un profesional asignado" },
        { status: 409 }
      );
    }

    // Create assignment and update solicitud estado in a transaction
    const [asignacion] = await prisma.$transaction([
      prisma.asignacion.create({
        data: {
          solicitudId: solId,
          profesionalId: profId,
        },
        include: {
          solicitud: {
            include: {
              cliente: true,
              categoria: true,
            },
          },
          profesional: true,
        },
      }),
      prisma.solicitud.update({
        where: { id: solId },
        data: { estado: "asignado" },
      }),
    ]);

    return NextResponse.json(asignacion, { status: 201 });
  } catch (error) {
    console.error("POST /api/asignaciones error:", error);
    return NextResponse.json({ error: "Error al crear asignación" }, { status: 500 });
  }
}
