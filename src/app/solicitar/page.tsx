"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Categoria = { id: number; nombre: string; icono: string };

function SolicitarForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCatId = searchParams.get("categoriaId") || "";
  const initialUrgencia = searchParams.get("urgencia") || "normal";

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    categoriaId: initialCatId,
    descripcion: "",
    direccion: "",
    urgencia: initialUrgencia,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/categorias").then((r) => r.json()).then(setCategorias);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.telefono || !form.categoriaId || !form.descripcion || !form.direccion) {
      setError("Completá todos los campos obligatorios");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, categoriaId: Number(form.categoriaId) }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      router.push(`/solicitudes/${data.id}?nueva=1`);
    } catch {
      setError("Error al crear la solicitud. Intentá de nuevo.");
      setLoading(false);
    }
  };

  const urgencias = [
    { value: "urgente", label: "🚨 Urgente", desc: "Lo antes posible" },
    { value: "normal", label: "📅 Normal", desc: "En las próximas horas" },
    { value: "programado", label: "🗓️ Programado", desc: "Lo planifico con tiempo" },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Solicitar servicio</h1>
      <p className="text-slate-500 text-sm mb-6">Completá el formulario y te contactamos enseguida</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tus datos */}
        <div className="card p-4 space-y-3">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Tus datos</h2>
          <div>
            <label className="text-sm font-medium text-slate-600 block mb-1">Nombre *</label>
            <input
              type="text"
              placeholder="Tu nombre completo"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 block mb-1">Teléfono *</label>
            <input
              type="tel"
              placeholder="11-1234-5678"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        {/* Servicio */}
        <div className="card p-4 space-y-3">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">El servicio</h2>
          <div>
            <label className="text-sm font-medium text-slate-600 block mb-1">Categoría *</label>
            <select
              value={form.categoriaId}
              onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}
              className="input-field"
            >
              <option value="">Seleccioná una categoría</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icono} {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 block mb-1">Descripción del problema *</label>
            <textarea
              placeholder="Describí qué necesitás. Cuanto más detalle, mejor podemos ayudarte."
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              className="input-field min-h-[100px] resize-none"
              rows={4}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 block mb-1">Dirección *</label>
            <input
              type="text"
              placeholder="Calle, número, barrio"
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        {/* Urgencia */}
        <div className="card p-4">
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide mb-3">Urgencia</h2>
          <div className="space-y-2">
            {urgencias.map((u) => (
              <label
                key={u.value}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                  form.urgencia === u.value ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="urgencia"
                  value={u.value}
                  checked={form.urgencia === u.value}
                  onChange={(e) => setForm({ ...form, urgencia: e.target.value })}
                  className="text-blue-600"
                />
                <div>
                  <p className="font-medium text-slate-700 text-sm">{u.label}</p>
                  <p className="text-xs text-slate-500">{u.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3.5 text-base disabled:opacity-60"
        >
          {loading ? "Enviando solicitud..." : "Enviar solicitud"}
        </button>

        <p className="text-center text-xs text-slate-400">
          Al enviar aceptás nuestros términos y política de privacidad
        </p>
      </form>
    </div>
  );
}

export default function SolicitarPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-slate-400">Cargando...</div>}>
      <SolicitarForm />
    </Suspense>
  );
}
