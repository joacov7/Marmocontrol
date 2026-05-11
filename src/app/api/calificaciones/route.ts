import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { solicitudId, profesionalId, puntuacion, comentario } = body;

    if (!solicitudId || !profesionalId || puntuacion === undefined) {
      return NextResponse.json(
        { error: "solicitudId, profesionalId y puntuacion son requeridos" },
        { status: 400 }
      );
    }

    const solId = parseInt(String(solicitudId), 10);
    const profId = parseInt(String(profesionalId), 10);
    const score = parseInt(String(puntuacion), 10);

    if (score < 1 || score > 5) {
      return NextResponse.json(
        { error: "puntuacion debe ser un valor entre 1 y 5" },
        { status: 400 }
      );
    }

    // Check solicitud exists
    const solicitud = await prisma.solicitud.findUnique({
      where: { id: solId },
      include: { calificacion: true },
    });

    if (!solicitud) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
    }

    if (solicitud.calificacion) {
      return NextResponse.json(
        { error: "La solicitud ya tiene una calificación registrada" },
        { status: 409 }
      );
    }

    // Create the calificacion
    const calificacion = await prisma.calificacion.create({
      data: {
        solicitudId: solId,
        profesionalId: profId,
        puntuacion: score,
        comentario: comentario ?? null,
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
    });

    // Recalculate professional's average rating and increment totalTrabajos
    const allCalificaciones = await prisma.calificacion.findMany({
      where: { profesionalId: profId },
      select: { puntuacion: true },
    });

    const totalTrabajos = allCalificaciones.length;
    const avgCalificacion =
      allCalificaciones.reduce((sum, c) => sum + c.puntuacion, 0) / totalTrabajos;

    // Update solicitud estado and profesional stats in a transaction
    await prisma.$transaction([
      prisma.solicitud.update({
        where: { id: solId },
        data: { estado: "completado" },
      }),
      prisma.profesional.update({
        where: { id: profId },
        data: {
          calificacion: avgCalificacion,
          totalTrabajos,
        },
      }),
    ]);

    return NextResponse.json(calificacion, { status: 201 });
  } catch (error) {
    console.error("POST /api/calificaciones error:", error);
    return NextResponse.json({ error: "Error al crear calificación" }, { status: 500 });
  }
}
