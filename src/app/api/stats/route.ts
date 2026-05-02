import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [
    totalPedidos,
    pedidosHoy,
    enProduccion,
    recordatoriosHoy,
    totalClientes,
    ingresosMes,
  ] = await Promise.all([
    prisma.pedido.count(),
    prisma.pedido.count({ where: { creadoEn: { gte: today, lt: tomorrow } } }),
    prisma.pedido.count({ where: { estado: "produccion" } }),
    prisma.recordatorio.findMany({
      where: {
        completado: false,
        fechaAviso: { lte: tomorrow },
      },
      include: { cliente: true },
      orderBy: { fechaAviso: "asc" },
    }),
    prisma.cliente.count(),
    prisma.pedido.aggregate({
      where: {
        creadoEn: { gte: new Date(today.getFullYear(), today.getMonth(), 1) },
        estado: { not: "presupuesto" },
      },
      _sum: { total: true },
    }),
  ]);

  return NextResponse.json({
    totalPedidos,
    pedidosHoy,
    enProduccion,
    recordatoriosHoy,
    totalClientes,
    ingresosMes: ingresosMes._sum.total ?? 0,
  });
}
