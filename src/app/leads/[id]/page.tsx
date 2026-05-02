import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { ESTADOS_LEAD, ORIGENES_LEAD, TIPOS_INTERACCION, type EstadoLead, type OrigenLead } from "@/lib/leads";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, Building2, Target } from "lucide-react";
import EstadoLeadSelector from "@/components/leads/EstadoLeadSelector";
import NuevaInteraccionButton from "@/components/leads/NuevaInteraccionButton";
import ConvertirLeadButton from "@/components/leads/ConvertirLeadButton";

export const dynamic = "force-dynamic";

export default async function LeadDetalle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id: Number(id) },
    include: {
      interacciones: { orderBy: { fecha: "desc" } },
      cliente: { select: { id: true, nombre: true } },
    },
  });

  if (!lead) notFound();

  const est = ESTADOS_LEAD[lead.estado as EstadoLead] ?? ESTADOS_LEAD.nuevo;
  const origen = ORIGENES_LEAD[lead.origen as OrigenLead];
  const convertido = lead.estado === "ganado" && lead.cliente;

  return (
    <div>
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <Link href="/leads" className="p-2 -ml-2 text-gray-500">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-gray-900 truncate">{lead.nombre}</h1>
          {lead.empresa && <p className="text-xs text-gray-500">{lead.empresa}</p>}
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${est.color}`}>
          {est.label}
        </span>
      </div>

      <div className="px-4 space-y-4">
        {/* Convertido notice */}
        {convertido && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center justify-between">
            <p className="text-sm text-green-700 font-medium">✓ Convertido en cliente</p>
            <Link href={`/clientes/${lead.cliente!.id}`} className="text-green-700 text-xs font-semibold underline">
              Ver cliente
            </Link>
          </div>
        )}

        {/* Datos de contacto */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contacto</p>
            {origen && (
              <span className="text-xs text-gray-500">{origen.emoji} {origen.label}</span>
            )}
          </div>
          {lead.telefono && (
            <div className="flex items-center gap-3">
              <a href={`tel:${lead.telefono}`} className="flex items-center gap-2 text-blue-600 text-sm">
                <Phone size={14} /> {lead.telefono}
              </a>
              <a
                href={`https://wa.me/${lead.telefono.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-lg font-medium"
              >
                WhatsApp
              </a>
            </div>
          )}
          {lead.email && (
            <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-gray-600 text-sm">
              <Mail size={14} /> {lead.email}
            </a>
          )}
          {lead.empresa && (
            <p className="flex items-center gap-2 text-gray-600 text-sm">
              <Building2 size={14} /> {lead.empresa}
            </p>
          )}
          {lead.interes && (
            <p className="flex items-start gap-2 text-gray-600 text-sm pt-1 border-t border-gray-100 mt-1">
              <Target size={14} className="mt-0.5 shrink-0 text-purple-500" />
              {lead.interes}
            </p>
          )}
          {lead.notas && (
            <p className="text-sm text-gray-400 italic pt-1 border-t border-gray-100">{lead.notas}</p>
          )}
        </div>

        {/* Próximo contacto */}
        {lead.proximoContacto && lead.estado !== "ganado" && lead.estado !== "perdido" && (
          <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Próximo contacto</p>
            <p className="font-medium text-orange-800 mt-1">{formatDate(lead.proximoContacto)}</p>
          </div>
        )}

        {/* Estado selector */}
        {lead.estado !== "ganado" && lead.estado !== "perdido" && (
          <EstadoLeadSelector leadId={lead.id} estadoActual={lead.estado} />
        )}

        {/* Acciones principales */}
        {lead.estado !== "ganado" && lead.estado !== "perdido" && (
          <div className="flex gap-3">
            <NuevaInteraccionButton leadId={lead.id} />
            <ConvertirLeadButton leadId={lead.id} nombre={lead.nombre} />
          </div>
        )}

        {/* Historial de interacciones */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Historial ({lead.interacciones.length})
          </p>

          {lead.interacciones.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">Sin interacciones registradas</p>
          )}

          <div className="space-y-2">
            {lead.interacciones.map((it) => {
              const tipo = TIPOS_INTERACCION[it.tipo as keyof typeof TIPOS_INTERACCION];
              return (
                <div key={it.id} className="flex gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
                  <span className="text-base shrink-0 mt-0.5">{tipo?.emoji ?? "📝"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-gray-500">{tipo?.label ?? it.tipo}</p>
                      <p className="text-xs text-gray-400">{formatDate(it.fecha)}</p>
                    </div>
                    <p className="text-sm text-gray-700 mt-0.5">{it.nota}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
