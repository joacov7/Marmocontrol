import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const categoriaId = searchParams.get("categoriaId");
    const q = searchParams.get("q");

    const profesionales = await prisma.profesional.findMany({
      where: {
        ...(categoriaId
          ? {
              categorias: {
                some: { categoriaId: parseInt(categoriaId, 10) },
              },
            }
          : {}),
        ...(q
          ? {
              OR: [
                { nombre: { contains: q, mode: "insensitive" } },
                { zona: { contains: q, mode: "insensitive" } },
                { descripcion: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        categorias: {
          include: {
            categoria: true,
          },
        },
      },
      orderBy: { calificacion: "desc" },
    });

    const result = profesionales.map((p: typeof profesionales[number]) => ({
      ...p,
      categorias: p.categorias.map((pc: typeof p.categorias[number]) => pc.categoria),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/profesionales error:", error);
    return NextResponse.json({ error: "Error al obtener profesionales" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, telefono, email, descripcion, zona, categoriaIds } = body;

    if (!nombre || !telefono || !zona) {
      return NextResponse.json(
        { error: "nombre, telefono y zona son requeridos" },
        { status: 400 }
      );
    }

    if (!Array.isArray(categoriaIds) || categoriaIds.length === 0) {
      return NextResponse.json(
        { error: "categoriaIds debe ser un arreglo con al menos una categoría" },
        { status: 400 }
      );
    }

    const profesional = await prisma.profesional.create({
      data: {
        nombre,
        telefono,
        email: email ?? null,
        descripcion: descripcion ?? null,
        zona,
        categorias: {
          create: (categoriaIds as number[]).map((catId) => ({
            categoriaId: catId,
          })),
        },
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

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST /api/profesionales error:", error);
    return NextResponse.json({ error: "Error al crear profesional" }, { status: 500 });
  }
}
