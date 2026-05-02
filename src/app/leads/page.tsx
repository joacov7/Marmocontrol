import { prisma } from "@/lib/prisma";
import { ESTADOS_LEAD, ORIGENES_LEAD, type EstadoLead, type OrigenLead } from "@/lib/leads";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import NuevoLeadButton from "@/components/leads/NuevoLeadButton";
import { Phone, Search, ChevronRight, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

const FILTROS = [
  { value: "", label: "Todos" },
  ...Object.entries(ESTADOS_LEAD)
    .filter(([k]) => k !== "ganado" && k !== "perdido")
    .map(([value, { label }]) => ({ value, label })),
  { value: "ganado", label: "Ganados" },
  { value: "perdido", label: "Perdidos" },
];

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;

  const leads = await prisma.lead.findMany({
    where: estado ? { estado } : undefined,
    orderBy: [{ estado: "asc" }, { creadoEn: "desc" }],
    include: { _count: { select: { interacciones: true } } },
  });

  const totales = await prisma.lead.groupBy({
    by: ["estado"],
    _count: { id: true },
  });
  const conteoEstado = Object.fromEntries(totales.map((t) => [t.estado, t._count.id]));
  const activos = leads.filter((l) => l.estado !== "ganado" && l.estado !== "perdido").length;

  return (
    <div>
      <PageHeader
        title="Captación"
        subtitle={`${activos} leads activos`}
        action={
          <div className="flex gap-2">
            <Link
              href="/leads/buscar"
              className="flex items-center gap-1.5 bg-purple-600 text-white text-sm font-medium px-3 py-2 rounded-xl"
            >
              <Search size={14} />
              Buscar
            </Link>
            <NuevoLeadButton />
          </div>
        }
      />

      {/* Resumen del funnel */}
      <div className="px-4 mb-4">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {Object.entries(ESTADOS_LEAD).map(([key, { label, dot }]) => (
            <Link
              key={key}
              href={estado === key ? "/leads" : `/leads?estado=${key}`}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                estado === key
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
              {label}
              {conteoEstado[key] ? (
                <span className={`font-bold ${estado === key ? "text-gray-300" : "text-gray-400"}`}>
                  {conteoEstado[key]}
                </span>
              ) : null}
            </Link>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-2 pb-4">
        {leads.length === 0 && (
          <div className="text-center py-12 space-y-3">
            <p className="text-gray-400 text-sm">No hay leads{estado ? ` en este estado` : ""}</p>
            <Link href="/leads/buscar" className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium">
              <Search size={14} />
              Buscar prospectos
            </Link>
          </div>
        )}

        {leads.map((lead) => {
          const est = ESTADOS_LEAD[lead.estado as EstadoLead] ?? ESTADOS_LEAD.nuevo;
          const origen = ORIGENES_LEAD[lead.origen as OrigenLead];
          return (
            <Link
              key={lead.id}
              href={`/leads/${lead.id}`}
              className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 shadow-sm border border-gray-100 hover:border-purple-200 transition-colors"
            >
              <div className={`w-2 h-2 rounded-full shrink-0 ${est.dot}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 truncate">{lead.nombre}</p>
                  {lead.empresa && (
                    <span className="text-xs text-gray-400 truncate hidden sm:inline">
                      · {lead.empresa}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  {origen && <span className="text-xs">{origen.emoji} {origen.label}</span>}
                  {lead.proximoContacto && (
                    <span className="text-xs text-orange-500">
                      · Avisar {formatDate(lead.proximoContacto)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {lead.telefono && (
                  <a
                    href={`https://wa.me/${lead.telefono.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg bg-green-50 text-green-600"
                  >
                    <MessageCircle size={14} />
                  </a>
                )}
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${est.color}`}>
                  {est.label}
                </span>
                <ChevronRight size={14} className="text-gray-300" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
