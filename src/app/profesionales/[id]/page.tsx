import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import { MapPin, Phone, Mail, CheckCircle, XCircle, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProfesionalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const prof = await prisma.profesional.findUnique({
    where: { id: Number(id) },
    include: {
      categorias: { include: { categoria: true } },
      calificaciones: {
        orderBy: { creadoEn: "desc" },
        take: 10,
        include: { solicitud: { include: { categoria: true } } },
      },
    },
  });

  if (!prof) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Perfil */}
      <div className="card p-5">
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 shrink-0">
            {prof.nombre.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-xl font-bold text-slate-800">{prof.nombre}</h1>
              {prof.disponible ? (
                <span className="flex items-center gap-1 text-sm text-green-600 font-semibold">
                  <CheckCircle size={14} />
                  Disponible
                </span>
              ) : (
                <span className="flex items-center gap-1 text-sm text-slate-400">
                  <XCircle size={14} />
                  No disponible
                </span>
              )}
            </div>
            <div className="mt-1">
              <StarRating value={prof.calificacion} count={prof.totalTrabajos} />
            </div>
            <div className="flex items-center gap-1 mt-2 text-slate-500 text-sm">
              <MapPin size={14} />
              <span>{prof.zona}</span>
            </div>
          </div>
        </div>

        {prof.descripcion && (
          <p className="text-slate-600 text-sm mt-4 leading-relaxed">{prof.descripcion}</p>
        )}

        {/* Categorías */}
        <div className="flex flex-wrap gap-2 mt-4">
          {prof.categorias.map((pc) => (
            <span key={pc.categoriaId} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
              {pc.categoria.icono} {pc.categoria.nombre}
            </span>
          ))}
        </div>

        {/* Contacto */}
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
          <a href={`tel:${prof.telefono}`} className="flex items-center gap-2 text-slate-700 text-sm hover:text-blue-600 transition-colors">
            <Phone size={16} className="text-slate-400" />
            {prof.telefono}
          </a>
          {prof.email && (
            <a href={`mailto:${prof.email}`} className="flex items-center gap-2 text-slate-700 text-sm hover:text-blue-600 transition-colors">
              <Mail size={16} className="text-slate-400" />
              {prof.email}
            </a>
          )}
        </div>
      </div>

      {/* CTA Solicitar */}
      {prof.disponible && (
        <Link
          href={`/solicitar?profesionalId=${prof.id}`}
          className="block btn-primary text-center w-full py-3 text-base"
        >
          Solicitar servicio con {prof.nombre.split(" ")[0]}
        </Link>
      )}

      {/* Calificaciones */}
      <section>
        <h2 className="text-base font-bold text-slate-800 mb-3">
          Opiniones ({prof.calificaciones.length})
        </h2>
        {prof.calificaciones.length === 0 ? (
          <div className="card p-6 text-center text-slate-400">
            <Star size={24} className="mx-auto mb-2 text-slate-300" />
            <p className="text-sm">Todavía no tiene calificaciones</p>
          </div>
        ) : (
          <div className="space-y-3">
            {prof.calificaciones.map((cal) => (
              <div key={cal.id} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < cal.puntuacion ? "text-yellow-400 fill-yellow-400" : "text-slate-200 fill-slate-200"}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">
                    {cal.solicitud.categoria.icono} {cal.solicitud.categoria.nombre}
                  </span>
                </div>
                {cal.comentario && (
                  <p className="text-sm text-slate-600">{cal.comentario}</p>
                )}
                <p className="text-xs text-slate-400 mt-2">
                  {new Date(cal.creadoEn).toLocaleDateString("es-AR")}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
