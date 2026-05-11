import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, ClipboardList, Layers, CheckCircle, Clock, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [
    totalProfesionales,
    profesDisponibles,
    totalSolicitudes,
    pendientes,
    completadas,
    totalCategorias,
    ultimasSolicitudes,
  ] = await Promise.all([
    prisma.profesional.count(),
    prisma.profesional.count({ where: { disponible: true } }),
    prisma.solicitud.count(),
    prisma.solicitud.count({ where: { estado: "pendiente" } }),
    prisma.solicitud.count({ where: { estado: "completado" } }),
    prisma.categoria.count({ where: { activo: true } }),
    prisma.solicitud.findMany({
      take: 6,
      orderBy: { creadoEn: "desc" },
      include: {
        categoria: true,
        cliente: true,
        asignacion: { include: { profesional: true } },
      },
    }),
  ]);

  const stats = [
    { label: "Profesionales", value: totalProfesionales, sub: `${profesDisponibles} disponibles`, icon: Users, color: "bg-blue-50 text-blue-600", href: "/admin/profesionales" },
    { label: "Solicitudes", value: totalSolicitudes, sub: `${pendientes} pendientes`, icon: ClipboardList, color: "bg-amber-50 text-amber-600", href: "/admin/solicitudes" },
    { label: "Completadas", value: completadas, sub: "trabajos finalizados", icon: CheckCircle, color: "bg-green-50 text-green-600", href: "/admin/solicitudes?estado=completado" },
    { label: "Categorías", value: totalCategorias, sub: "activas", icon: Layers, color: "bg-purple-50 text-purple-600", href: "/admin/categorias" },
  ];

  const estadoColors: Record<string, string> = {
    pendiente: "bg-amber-100 text-amber-700",
    asignado: "bg-blue-100 text-blue-700",
    en_proceso: "bg-purple-100 text-purple-700",
    completado: "bg-green-100 text-green-700",
    cancelado: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Panel Admin</h1>
          <p className="text-slate-500 text-sm">ServiYa — Gestión de la plataforma</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-4 hover:shadow-md transition-shadow">
            <div className={`inline-flex p-2 rounded-lg ${s.color} mb-2`}>
              <s.icon size={18} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            <p className="text-xs font-medium text-slate-700">{s.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
          </Link>
        ))}
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Link href="/admin/solicitudes" className="card p-3 text-center hover:shadow-md transition-shadow">
          <AlertCircle size={20} className="text-amber-500 mx-auto mb-1" />
          <p className="text-xs font-semibold text-slate-700">Ver solicitudes</p>
        </Link>
        <Link href="/admin/profesionales" className="card p-3 text-center hover:shadow-md transition-shadow">
          <Users size={20} className="text-blue-500 mx-auto mb-1" />
          <p className="text-xs font-semibold text-slate-700">Profesionales</p>
        </Link>
        <Link href="/admin/categorias" className="card p-3 text-center hover:shadow-md transition-shadow">
          <Layers size={20} className="text-purple-500 mx-auto mb-1" />
          <p className="text-xs font-semibold text-slate-700">Categorías</p>
        </Link>
      </div>

      {/* Últimas solicitudes */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-slate-800">Últimas solicitudes</h2>
          <Link href="/admin/solicitudes" className="text-blue-600 text-sm hover:underline">Ver todas →</Link>
        </div>
        <div className="space-y-2">
          {ultimasSolicitudes.map((sol) => (
            <Link
              key={sol.id}
              href={`/admin/solicitudes?id=${sol.id}`}
              className="card p-3 flex items-center gap-3 hover:shadow-md transition-shadow"
            >
              <span className="text-2xl shrink-0">{sol.categoria.icono}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{sol.cliente.nombre}</p>
                <p className="text-xs text-slate-500 truncate">{sol.descripcion}</p>
                {sol.asignacion && (
                  <p className="text-xs text-blue-600 mt-0.5">→ {sol.asignacion.profesional.nombre}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${estadoColors[sol.estado] ?? "bg-slate-100 text-slate-600"}`}>
                  {sol.estado}
                </span>
                <p className="text-xs text-slate-400 mt-1">{new Date(sol.creadoEn).toLocaleDateString("es-AR")}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
