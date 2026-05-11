import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Search, Star, Shield, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categorias = await prisma.categoria.findMany({
    where: { activo: true },
    include: { _count: { select: { profesionales: true } } },
    orderBy: { nombre: "asc" },
  });

  const [totalProfesionales, totalCompletados, totalCategorias] = await Promise.all([
    prisma.profesional.count(),
    prisma.solicitud.count({ where: { estado: "completado" } }),
    prisma.categoria.count({ where: { activo: true } }),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white px-4 pt-10 pb-14 md:pt-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Encontrá el profesional que necesitás
          </h1>
          <p className="text-blue-100 text-base md:text-lg mb-8">
            Plomeros, electricistas, mecánicos, médicos y más, cerca tuyo
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Link
              href="/solicitar"
              className="flex-1 bg-white text-blue-700 font-bold py-3 px-6 rounded-xl hover:bg-blue-50 transition-colors text-center"
            >
              Solicitar servicio
            </Link>
            <Link
              href="/profesionales"
              className="flex-1 bg-blue-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-400 transition-colors text-center border border-blue-400"
            >
              Ver profesionales
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{totalProfesionales}+</p>
            <p className="text-xs text-slate-500 mt-0.5">Profesionales</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{totalCategorias}</p>
            <p className="text-xs text-slate-500 mt-0.5">Categorías</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{totalCompletados}+</p>
            <p className="text-xs text-slate-500 mt-0.5">Trabajos hechos</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {/* Categorías */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">¿Qué servicio necesitás?</h2>
            <Link href="/profesionales" className="text-blue-600 text-sm font-medium hover:underline">
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {categorias.map((cat) => (
              <Link
                key={cat.id}
                href={`/categorias/${cat.id}`}
                className="card p-3 flex flex-col items-center gap-2 hover:shadow-md transition-shadow text-center group"
              >
                <span className="text-3xl">{cat.icono}</span>
                <p className="text-xs font-semibold text-slate-700 group-hover:text-blue-600 leading-tight">
                  {cat.nombre}
                </p>
                <p className="text-[10px] text-slate-400">
                  {cat._count.profesionales} prof.
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Cómo funciona */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-4">¿Cómo funciona?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card p-4 flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Search size={22} className="text-blue-600" />
              </div>
              <p className="font-semibold text-slate-700">1. Elegís el servicio</p>
              <p className="text-sm text-slate-500">Seleccioná la categoría y describí lo que necesitás</p>
            </div>
            <div className="card p-4 flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Shield size={22} className="text-green-600" />
              </div>
              <p className="font-semibold text-slate-700">2. Asignamos profesional</p>
              <p className="text-sm text-slate-500">Te contactamos con el mejor profesional disponible en tu zona</p>
            </div>
            <div className="card p-4 flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Star size={22} className="text-amber-500" />
              </div>
              <p className="font-semibold text-slate-700">3. Calificás el trabajo</p>
              <p className="text-sm text-slate-500">Una vez finalizado el servicio, dejás tu opinión</p>
            </div>
          </div>
        </section>

        {/* Urgencias */}
        <section className="card p-5 bg-red-50 border-red-200">
          <div className="flex items-start gap-4">
            <span className="text-4xl">🚨</span>
            <div className="flex-1">
              <p className="font-bold text-red-700 text-base">¿Es una urgencia?</p>
              <p className="text-red-600 text-sm mt-1">
                Tenemos profesionales disponibles las 24hs para emergencias de plomería, electricidad y más.
              </p>
              <Link
                href="/solicitar?urgencia=urgente"
                className="mt-3 inline-block bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Solicitud urgente →
              </Link>
            </div>
          </div>
        </section>

        {/* Seguimiento */}
        <section className="card p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            <Clock size={20} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-700">¿Ya hiciste una solicitud?</p>
            <p className="text-sm text-slate-500">Seguí el estado de tu pedido en tiempo real</p>
          </div>
          <Link href="/solicitudes" className="shrink-0 text-blue-600 text-sm font-semibold hover:underline">
            Ver pedidos →
          </Link>
        </section>
      </div>
    </div>
  );
}
