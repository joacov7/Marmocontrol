"use client";

import { useEffect, useState } from "react";
import { Plus, Users } from "lucide-react";

type Categoria = {
  id: number;
  nombre: string;
  icono: string;
  descripcion: string | null;
  color: string;
  activo: boolean;
  totalProfesionales: number;
};

const EMPTY_FORM = { nombre: "", icono: "🔧", descripcion: "", color: "#2563EB" };

export default function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCategorias = () => {
    fetch("/api/categorias").then((r) => r.json()).then(setCategorias);
  };

  useEffect(fetchCategorias, []);

  const crear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.icono) {
      setError("El nombre e ícono son obligatorios");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm(EMPTY_FORM);
      setShowForm(false);
      fetchCategorias();
    } else {
      setError("Error al crear categoría");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-slate-800">Categorías</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm px-4 py-2">
          <Plus size={16} />
          Nueva
        </button>
      </div>

      {showForm && (
        <div className="card p-4 mb-5">
          <h2 className="font-semibold text-slate-700 mb-3">Nueva categoría</h2>
          <form onSubmit={crear} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Nombre *</label>
                <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="input-field text-sm" placeholder="Plomería" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Emoji / Ícono *</label>
                <input value={form.icono} onChange={(e) => setForm({ ...form, icono: e.target.value })} className="input-field text-sm text-2xl" placeholder="🔧" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Descripción</label>
              <input value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} className="input-field text-sm" placeholder="Descripción breve..." />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200" />
                <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="input-field text-sm flex-1" placeholder="#2563EB" />
              </div>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={loading} className="btn-primary flex-1 py-2.5 text-sm">
                {loading ? "Creando..." : "Crear categoría"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary px-4 text-sm">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {categorias.map((cat) => (
          <div key={cat.id} className={`card p-4 flex flex-col gap-2 ${!cat.activo ? "opacity-50" : ""}`}>
            <div className="flex items-center justify-between">
              <span className="text-3xl">{cat.icono}</span>
              <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: cat.color }} />
            </div>
            <p className="font-semibold text-slate-700 text-sm">{cat.nombre}</p>
            {cat.descripcion && <p className="text-xs text-slate-400 line-clamp-2">{cat.descripcion}</p>}
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-auto">
              <Users size={12} />
              <span>{cat.totalProfesionales} prof.</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
