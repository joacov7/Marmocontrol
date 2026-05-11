import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import StarRating from "@/components/StarRating";
import { MapPin, Phone, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CategoriaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const categoria = await prisma.categoria.findUnique({
    where: { id: Number(id) },
    include: {
      profesionales: {
        include: {
          profesional: {
            include: {
              categorias: { include: { categoria: true } },
            },
          },
        },
      },
    },
  });

  if (!categoria) notFound();

  const profesionales = categoria.profesionales.map((pc) => pc.profesional);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-5xl">{categoria.icono}</span>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{categoria.nombre}</h1>
            <p className="text-slate-500 text-sm">{categoria.descripcion}</p>
          </div>
        </div>
        <p className="text-slate-500 text-sm mt-2">
          {profesionales.length} profesional{profesionales.length !== 1 ? "es" : ""} disponible{profesionales.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* CTA Solicitar */}
      <Link
        href={`/solicitar?categoriaId=${categoria.id}`}
        className="block w-full btn-primary text-center py-3 mb-6 text-base"
      >
        Solicitar {categoria.nombre}
      </Link>

      {/* Lista de profesionales */}
      {profesionales.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p className="text-4xl mb-3">😔</p>
          <p className="font-medium">No hay profesionales en esta categoría aún</p>
        </div>
      ) : (
        <div className="space-y-3">
          {profesionales.map((prof) => (
            <Link
              key={prof.id}
              href={`/profesionales/${prof.id}`}
              className="card p-4 flex gap-4 hover:shadow-md transition-shadow block"
            >
              {/* Avatar */}
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center shrink-0 text-2xl font-bold text-blue-600">
                {prof.nombre.charAt(0)}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-slate-800 truncate">{prof.nombre}</p>
                  {prof.disponible ? (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-medium shrink-0">
                      <CheckCircle size={12} />
                      Disponible
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 shrink-0">No disponible</span>
                  )}
                </div>
                <div className="mt-1">
                  <StarRating value={prof.calificacion} count={prof.totalTrabajos} />
                </div>
                <div className="flex items-center gap-1 mt-1.5 text-slate-500 text-xs">
                  <MapPin size={12} />
                  <span className="truncate">{prof.zona}</span>
                </div>
                {prof.descripcion && (
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">{prof.descripcion}</p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {prof.categorias.map((pc) => (
                    <span key={pc.categoriaId} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {pc.categoria.icono} {pc.categoria.nombre}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
