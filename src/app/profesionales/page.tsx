"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import { MapPin, Search, CheckCircle, Filter } from "lucide-react";

type Categoria = { id: number; nombre: string; icono: string };
type Profesional = {
  id: number;
  nombre: string;
  telefono: string;
  descripcion: string | null;
  zona: string;
  disponible: boolean;
  calificacion: number;
  totalTrabajos: number;
  categorias: { categoria: Categoria }[];
};

export default function ProfesionalesPage() {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [query, setQuery] = useState("");
  const [catFiltro, setCatFiltro] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categorias")
      .then((r) => r.json())
      .then(setCategorias);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (catFiltro) params.set("categoriaId", catFiltro);
    fetch(`/api/profesionales?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setProfesionales(d);
        setLoading(false);
      });
  }, [query, catFiltro]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Profesionales</h1>

      {/* Búsqueda */}
      <div className="relative mb-3">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por nombre, zona o servicio..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-field pl-9"
        />
      </div>

      {/* Filtro categorías */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
        <button
          onClick={() => setCatFiltro("")}
          className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            catFiltro === "" ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          Todos
        </button>
        {categorias.map((c) => (
          <button
            key={c.id}
            onClick={() => setCatFiltro(catFiltro === String(c.id) ? "" : String(c.id))}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              catFiltro === String(c.id)
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            <span>{c.icono}</span>
            {c.nombre}
          </button>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">Cargando...</div>
      ) : profesionales.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">No se encontraron profesionales</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-slate-500">{profesionales.length} resultado{profesionales.length !== 1 ? "s" : ""}</p>
          {profesionales.map((prof) => (
            <Link
              key={prof.id}
              href={`/profesionales/${prof.id}`}
              className="card p-4 flex gap-4 hover:shadow-md transition-shadow block"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center shrink-0 text-2xl font-bold text-blue-600">
                {prof.nombre.charAt(0)}
              </div>
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
                    <span key={pc.categoria.id} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
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
