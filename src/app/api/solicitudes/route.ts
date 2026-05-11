import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const estado = searchParams.get("estado");
    const telefono = searchParams.get("telefono");

    const solicitudes = await prisma.solicitud.findMany({
      where: {
        ...(estado ? { estado } : {}),
        ...(telefono
          ? {
              cliente: {
                telefono: { contains: telefono, mode: "insensitive" },
              },
            }
          : {}),
      },
      include: {
        cliente: true,
        categoria: true,
        asignacion: {
          include: {
            profesional: true,
          },
        },
      },
      orderBy: { creadoEn: "desc" },
    });

    return NextResponse.json(solicitudes);
  } catch (error) {
    console.error("GET /api/solicitudes error:", error);
    return NextResponse.json({ error: "Error al obtener solicitudes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, telefono, categoriaId, descripcion, direccion, urgencia } = body;

    if (!nombre || !telefono || !categoriaId || !descripcion || !direccion) {
      return NextResponse.json(
        { error: "nombre, telefono, categoriaId, descripcion y direccion son requeridos" },
        { status: 400 }
      );
    }

    // Find or create client by phone number
    let cliente = await prisma.cliente.findFirst({
      where: { telefono },
    });

    if (!cliente) {
      cliente = await prisma.cliente.create({
        data: {
          nombre,
          telefono,
        },
      });
    }

    const solicitud = await prisma.solicitud.create({
      data: {
        clienteId: cliente.id,
        categoriaId: parseInt(String(categoriaId), 10),
        descripcion,
        direccion,
        urgencia: urgencia ?? "normal",
      },
      include: {
        cliente: true,
        categoria: true,
        asignacion: {
          include: {
            profesional: true,
          },
        },
      },
    });

    return NextResponse.json(solicitud, { status: 201 });
  } catch (error) {
    console.error("POST /api/solicitudes error:", error);
    return NextResponse.json({ error: "Error al crear solicitud" }, { status: 500 });
  }
}
