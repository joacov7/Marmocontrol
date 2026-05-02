"use client";

import { useState } from "react";
import { Download, Share2, MessageCircle } from "lucide-react";

interface Props {
  pedidoId: number;
  clienteNombre: string;
  clienteTelefono: string;
  total: number;
  fechaInstalacion: string | null;
}

function formatPeso(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function ExportarPresupuesto({
  pedidoId,
  clienteNombre,
  clienteTelefono,
  total,
  fechaInstalacion,
}: Props) {
  const [downloading, setDownloading] = useState(false);
  const [open, setOpen] = useState(false);

  async function descargarPDF() {
    setDownloading(true);
    try {
      const res = await fetch(`/api/pedidos/${pedidoId}/pdf`);
      if (!res.ok) throw new Error("Error al generar PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      // Intentar Web Share API (móvil) primero
      if (navigator.share && navigator.canShare({ files: [new File([blob], "presupuesto.pdf", { type: "application/pdf" })] })) {
        const file = new File([blob], `presupuesto-${String(pedidoId).padStart(4, "0")}.pdf`, {
          type: "application/pdf",
        });
        await navigator.share({
          title: `Presupuesto #${String(pedidoId).padStart(4, "0")} — ${clienteNombre}`,
          files: [file],
        });
      } else {
        // Fallback: descarga directa
        const a = document.createElement("a");
        a.href = url;
        a.download = `presupuesto-${String(pedidoId).padStart(4, "0")}.pdf`;
        a.click();
      }
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  const telefono = clienteTelefono.replace(/\D/g, "");
  const instalacion = fechaInstalacion
    ? `\n📅 Instalación: ${new Intl.DateTimeFormat("es-AR").format(new Date(fechaInstalacion))}`
    : "";

  const mensajeWA = encodeURIComponent(
    `Hola ${clienteNombre} 👋\n\nTe enviamos el presupuesto #${String(pedidoId).padStart(4, "0")}:\n\n💰 Total: ${formatPeso(total)}${instalacion}\n\nAdjuntamos el PDF con el detalle completo. Cualquier consulta, estamos a disposición. ✅`
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-blue-600 text-white font-medium px-4 py-3 rounded-xl text-sm w-full justify-center"
      >
        <Share2 size={16} />
        Exportar presupuesto
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-t-2xl p-6 shadow-xl">
            <h2 className="font-bold text-lg mb-1">Exportar presupuesto</h2>
            <p className="text-sm text-gray-500 mb-5">
              #{String(pedidoId).padStart(4, "0")} · {clienteNombre} · {formatPeso(total)}
            </p>

            <div className="space-y-3">
              {/* Descargar / compartir PDF */}
              <button
                onClick={descargarPDF}
                disabled={downloading}
                className="flex items-center gap-3 w-full bg-blue-600 text-white rounded-xl px-4 py-4 font-medium disabled:opacity-60"
              >
                <Download size={20} />
                <div className="text-left">
                  <p className="font-semibold">
                    {downloading ? "Generando PDF..." : "Descargar PDF"}
                  </p>
                  <p className="text-xs text-blue-200">Presupuesto completo con detalle</p>
                </div>
              </button>

              {/* WhatsApp solo texto */}
              <a
                href={`https://wa.me/${telefono}?text=${mensajeWA}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full bg-green-500 text-white rounded-xl px-4 py-4 font-medium"
              >
                <MessageCircle size={20} />
                <div className="text-left">
                  <p className="font-semibold">Enviar por WhatsApp</p>
                  <p className="text-xs text-green-100">Mensaje con el resumen del presupuesto</p>
                </div>
              </a>

              {/* WhatsApp + PDF: primero descargá, luego mandá */}
              <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                <p className="text-xs text-gray-500 font-medium mb-1">Consejo</p>
                <p className="text-xs text-gray-400">
                  Descargá el PDF y adjuntalo manualmente en WhatsApp para enviarle el presupuesto completo al cliente.
                </p>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="w-full mt-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
