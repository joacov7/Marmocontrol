import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { prisma } from "@/lib/prisma";
import { PresupuestoPDF } from "@/lib/pdf/PresupuestoPDF";
import type { DocumentProps } from "@react-pdf/renderer";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const pedido = await prisma.pedido.findUnique({
    where: { id: Number(id) },
    include: {
      cliente: true,
      items: { include: { material: true } },
    },
  });

  if (!pedido) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const element = React.createElement(PresupuestoPDF, { pedido }) as React.ReactElement<DocumentProps>;
  const buffer = await renderToBuffer(element);

  const filename = `presupuesto-${String(pedido.id).padStart(4, "0")}-${pedido.cliente.nombre
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": buffer.length.toString(),
    },
  });
}
