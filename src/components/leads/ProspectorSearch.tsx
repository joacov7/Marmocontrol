"use client";

import { useState } from "react";
import { Search, MapPin, Star, Phone, Globe, UserPlus, ExternalLink } from "lucide-react";
import type { ProspectorResult } from "@/app/api/prospector/route";
import NuevoLeadButton from "./NuevoLeadButton";

const CATEGORIAS = [
  { value: "arquitectos",  label: "Arquitectos",      emoji: "🏛️" },
  { value: "constructoras",label: "Constructoras",    emoji: "🏗️" },
  { value: "inmobiliarias",label: "Inmobiliarias",    emoji: "🏢" },
  { value: "reformas",     label: "Reformas",         emoji: "🔨" },
  { value: "disenio",      label: "Diseño interior",  emoji: "🎨" },
  { value: "carpinteria",  label: "Carpinterías",     emoji: "🪵" },
];

export default function ProspectorSearch({ tieneApiKey }: { tieneApiKey: boolean }) {
  const [ubicacion, setUbicacion] = useState("Buenos Aires, Argentina");
  const [categoria, setCategoria] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProspectorResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [buscado, setBuscado] = useState(false);
  const [agregados, setAgregados] = useState<Set<string>>(new Set());
  const [leadPreselect, setLeadPreselect] = useState<ProspectorResult | null>(null);

  async function buscar() {
    setLoading(true);
    setError("");
    setBuscado(true);

    const params = new URLSearchParams({ ubicacion });
    if (categoria) params.set("categoria", categoria);
    else if (query) params.set("q", query);

    const res = await fetch(`/api/prospector?${params}`);
    const data = await res.json();

    if (data.error === "no_key") {
      setError("Falta la API key de Google Places.");
    } else if (data.error) {
      setError(`Error: ${data.error}`);
    } else {
      setResults(data.results ?? []);
    }
    setLoading(false);
  }

  function marcarAgregado(placeId: string) {
    setAgregados((prev) => new Set([...prev, placeId]));
    setLeadPreselect(null);
  }

  return (
    <div className="px-4 space-y-4 pb-6">
      {/* Búsqueda */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm space-y-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Zona de búsqueda</label>
          <div className="relative">
            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              placeholder="Ej: Palermo, Buenos Aires"
              className="input-field pl-8"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-2 block">Tipo de negocio</label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIAS.map((c) => (
              <button
                key={c.value}
                onClick={() => { setCategoria(c.value); setQuery(""); }}
                className={`py-2 rounded-xl border text-xs font-medium transition-colors ${
                  categoria === c.value
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-base mb-0.5">{c.emoji}</div>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setCategoria(""); }}
            placeholder="O escribí tu búsqueda libre..."
            className="input-field"
            onKeyDown={(e) => e.key === "Enter" && buscar()}
          />
        </div>

        <button
          onClick={buscar}
          disabled={loading || (!categoria && !query) || !tieneApiKey}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white font-medium py-3 rounded-xl disabled:opacity-50 transition-colors"
        >
          <Search size={16} />
          {loading ? "Buscando..." : "Buscar prospectos"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Resultados */}
      {buscado && !loading && !error && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {results.length > 0
              ? `${results.length} resultados encontrados`
              : "Sin resultados para esta búsqueda"}
          </p>

          <div className="space-y-3">
            {results.map((r) => {
              const yaAgregado = agregados.has(r.place_id);
              return (
                <div
                  key={r.place_id}
                  className={`bg-white rounded-xl border shadow-sm p-4 transition-colors ${
                    yaAgregado ? "border-green-200 bg-green-50" : "border-gray-100"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{r.nombre}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{r.direccion}</p>

                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {r.rating && (
                          <span className="flex items-center gap-1 text-xs text-amber-600">
                            <Star size={10} fill="currentColor" />
                            {r.rating.toFixed(1)}
                            {r.total_ratings && (
                              <span className="text-gray-400">({r.total_ratings})</span>
                            )}
                          </span>
                        )}
                        {r.telefono && (
                          <a
                            href={`tel:${r.telefono}`}
                            className="flex items-center gap-1 text-xs text-blue-600"
                          >
                            <Phone size={10} /> {r.telefono}
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <a
                        href={r.maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-gray-100 text-gray-500"
                      >
                        <ExternalLink size={14} />
                      </a>
                      {r.website && (
                        <a
                          href={r.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-gray-100 text-gray-500"
                        >
                          <Globe size={14} />
                        </a>
                      )}
                    </div>
                  </div>

                  {yaAgregado ? (
                    <div className="mt-3 flex items-center gap-2 text-green-700 text-xs font-medium">
                      <span>✓</span> Agregado como lead
                    </div>
                  ) : (
                    <button
                      onClick={() => setLeadPreselect(r)}
                      className="mt-3 w-full flex items-center justify-center gap-2 bg-gray-900 text-white text-xs font-medium py-2 rounded-xl"
                    >
                      <UserPlus size={13} />
                      Agregar como lead
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal para agregar lead desde resultado */}
      {leadPreselect && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-t-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Agregar como lead</h2>
              <button onClick={() => setLeadPreselect(null)} className="text-gray-400 text-sm">✕</button>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
              <p className="font-semibold text-sm text-gray-900">{leadPreselect.nombre}</p>
              <p className="text-xs text-gray-500 mt-0.5">{leadPreselect.direccion}</p>
              {leadPreselect.telefono && (
                <p className="text-xs text-blue-600 mt-0.5">{leadPreselect.telefono}</p>
              )}
            </div>
            <LeadFormInline
              nombre={leadPreselect.nombre}
              telefono={leadPreselect.telefono ?? ""}
              empresa={leadPreselect.nombre}
              onSuccess={() => marcarAgregado(leadPreselect.place_id)}
              onCancel={() => setLeadPreselect(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function LeadFormInline({
  nombre,
  telefono,
  empresa,
  onSuccess,
  onCancel,
}: {
  nombre: string;
  telefono: string;
  empresa: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [interes, setInteres] = useState("");
  const [tel, setTel] = useState(telefono);

  async function guardar() {
    setLoading(true);
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        telefono: tel || undefined,
        empresa,
        origen: "prospector",
        interes: interes || undefined,
      }),
    });
    setLoading(false);
    onSuccess();
  }

  return (
    <div className="space-y-3">
      <input
        value={tel}
        onChange={(e) => setTel(e.target.value)}
        placeholder="Teléfono (confirmar o corregir)"
        className="input-field"
      />
      <textarea
        value={interes}
        onChange={(e) => setInteres(e.target.value)}
        placeholder="¿Qué tipo de trabajo podría necesitar?"
        rows={2}
        className="input-field resize-none"
      />
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm"
        >
          Cancelar
        </button>
        <button
          onClick={guardar}
          disabled={loading}
          className="flex-1 py-3 rounded-xl bg-gray-900 text-white font-medium text-sm disabled:opacity-60"
        >
          {loading ? "Guardando..." : "Guardar lead"}
        </button>
      </div>
    </div>
  );
}
