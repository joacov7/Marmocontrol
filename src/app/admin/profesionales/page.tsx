"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import { MapPin, Plus, CheckCircle, XCircle } from "lucide-react";

type Categoria = { id: number; nombre: string; icono: string };
type Profesional = {
  id: number;
  nombre: string;
  telefono: string;
  email: string | null;
  descripcion: string | null;
  zona: string;
  disponible: boolean;
  calificacion: number;
  totalTrabajos: number;
  categorias: { categoria: Categoria }[];
};

const EMPTY_FORM = {
  nombre: "", telefono: "", email: "", descripcion: "", zona: "", categoriaIds: [] as number[],
};

export default function AdminProfesionalesPage() {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProfesionales = () => {
    fetch("/api/profesionales").then((r) => r.json()).then(setProfesionales);
  };

  useEffect(() => {
    fetchProfesionales();
    fetch("/api/categorias").then((r) => r.json()).then(setCategorias);
  }, []);

  const toggleDisponible = async (prof: Profesional) => {
    await fetch(`/api/profesionales/${prof.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disponible: !prof.disponible }),
    });
    fetchProfesionales();
  };

  const crearProfesional = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.telefono || !form.zona || form.categoriaIds.length === 0) {
      setError("Completá todos los campos obligatorios y elegí al menos una categoría");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/profesionales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm(EMPTY_FORM);
      setShowForm(false);
      fetchProfesionales();
    } else {
      setError("Error al crear profesional");
    }
    setLoading(false);
  };

  const toggleCategoria = (id: number) => {
    setForm((f) => ({
      ...f,
      categoriaIds: f.categoriaIds.includes(id)
        ? f.categoriaIds.filter((c) => c !== id)
        : [...f.categoriaIds, id],
    }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-slate-800">Profesionales</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary text-sm px-4 py-2"
        >
          <Plus size={16} />
          Agregar
        </button>
      </div>

      {/* Formulario nuevo */}
      {showForm && (
        <div className="card p-4 mb-5">
          <h2 className="font-semibold text-slate-700 mb-4">Nuevo profesional</h2>
          <form onSubmit={crearProfesional} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Nombre *</label>
                <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="input-field text-sm" placeholder="Nombre completo" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Teléfono *</label>
                <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} className="input-field text-sm" placeholder="11-1234-5678" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Email</label>
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field text-sm" placeholder="email@ejemplo.com" type="email" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Zona *</label>
                <input value={form.zona} onChange={(e) => setForm({ ...form, zona: e.target.value })} className="input-field text-sm" placeholder="CABA - Palermo" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Descripción</label>
              <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} className="input-field text-sm resize-none" rows={2} placeholder="Descripción profesional..." />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-2">Categorías * (seleccioná al menos una)</label>
              <div className="flex flex-wrap gap-2">
                {categorias.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCategoria(c.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                      form.categoriaIds.includes(c.id)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-slate-200 text-slate-600 hover:border-blue-300"
                    }`}
                  >
                    {c.icono} {c.nombre}
                  </button>
                ))}
              </div>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={loading} className="btn-primary flex-1 py-2.5 text-sm">
                {loading ? "Guardando..." : "Crear profesional"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary px-4 text-sm">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista */}
      <div className="space-y-3">
        {profesionales.map((prof) => (
          <div key={prof.id} className="card p-4 flex gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600 shrink-0">
              {prof.nombre.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <Link href={`/profesionales/${prof.id}`} className="font-semibold text-slate-800 hover:text-blue-600 truncate">
                  {prof.nombre}
                </Link>
                <button onClick={() => toggleDisponible(prof)} className="shrink-0">
                  {prof.disponible ? (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                      <CheckCircle size={14} /> Disponible
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <XCircle size={14} /> No disp.
                    </span>
                  )}
                </button>
              </div>
              <StarRating value={prof.calificacion} count={prof.totalTrabajos} />
              <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                <MapPin size={11} />
                <span className="truncate">{prof.zona}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {prof.categorias.map((pc) => (
                  <span key={pc.categoria.id} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {pc.categoria.icono} {pc.categoria.nombre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
