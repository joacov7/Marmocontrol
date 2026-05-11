"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import EstadoBadge from "@/components/EstadoBadge";
import StarRating from "@/components/StarRating";
import { MapPin, Phone, CheckCircle, Star } from "lucide-react";

type Solicitud = {
  id: number;
  descripcion: string;
  direccion: string;
  urgencia: string;
  estado: string;
  presupuesto: number | null;
  notas: string | null;
  creadoEn: string;
  categoria: { id: number; nombre: string; icono: string };
  cliente: { nombre: string; telefono: string; email: string | null };
  asignacion: {
    profesional: {
      id: number;
      nombre: string;
      telefono: string;
      calificacion: number;
      totalTrabajos: number;
      zona: string;
    };
  } | null;
  calificacion: { puntuacion: number; comentario: string | null } | null;
};

export default function SolicitudDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [loading, setLoading] = useState(true);
  const [calForm, setCalForm] = useState({ puntuacion: 5, comentario: "" });
  const [calLoading, setCalLoading] = useState(false);
  const [calOk, setCalOk] = useState(false);

  const fetchSolicitud = () => {
    fetch(`/api/solicitudes/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setSolicitud(d);
        setLoading(false);
      });
  };

  useEffect(fetchSolicitud, [id]);

  const calificar = async () => {
    if (!solicitud?.asignacion) return;
    setCalLoading(true);
    await fetch("/api/calificaciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        solicitudId: solicitud.id,
        profesionalId: solicitud.asignacion.profesional.id,
        ...calForm,
      }),
    });
    setCalOk(true);
    setCalLoading(false);
    fetchSolicitud();
  };

  const urgenciaLabel: Record<string, string> = {
    urgente: "🚨 Urgente",
    normal: "📅 Normal",
    programado: "🗓️ Programado",
  };

  if (loading) return <div className="p-6 text-center text-slate-400">Cargando...</div>;
  if (!solicitud) return <div className="p-6 text-center text-slate-400">Solicitud no encontrada</div>;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/solicitudes" className="text-blue-600 text-sm hover:underline">← Mis pedidos</Link>
        <EstadoBadge estado={solicitud.estado} />
      </div>

      {/* Info solicitud */}
      <div className="card p-4 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{solicitud.categoria.icono}</span>
          <div>
            <h1 className="font-bold text-slate-800 text-lg">{solicitud.categoria.nombre}</h1>
            <p className="text-xs text-slate-400">
              {urgenciaLabel[solicitud.urgencia]} · {new Date(solicitud.creadoEn).toLocaleDateString("es-AR")}
            </p>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-100">
          <p className="text-sm font-medium text-slate-600 mb-1">Descripción</p>
          <p className="text-sm text-slate-700">{solicitud.descripcion}</p>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
          <MapPin size={14} />
          <span>{solicitud.direccion}</span>
        </div>
        {solicitud.presupuesto && (
          <div className="bg-green-50 rounded-xl px-3 py-2 text-green-700 text-sm font-semibold">
            💰 Presupuesto: ${solicitud.presupuesto.toLocaleString("es-AR")}
          </div>
        )}
        {solicitud.notas && (
          <p className="text-sm text-slate-500 italic">{solicitud.notas}</p>
        )}
      </div>

      {/* Profesional asignado */}
      {solicitud.asignacion ? (
        <div className="card p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <CheckCircle size={13} className="text-green-500" />
            Profesional asignado
          </p>
          <div className="flex gap-3 items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600 shrink-0">
              {solicitud.asignacion.profesional.nombre.charAt(0)}
            </div>
            <div className="flex-1">
              <Link
                href={`/profesionales/${solicitud.asignacion.profesional.id}`}
                className="font-semibold text-slate-800 hover:text-blue-600"
              >
                {solicitud.asignacion.profesional.nombre}
              </Link>
              <div className="mt-0.5">
                <StarRating
                  value={solicitud.asignacion.profesional.calificacion}
                  count={solicitud.asignacion.profesional.totalTrabajos}
                />
              </div>
              <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                <MapPin size={11} />
                {solicitud.asignacion.profesional.zona}
              </div>
            </div>
            <a
              href={`tel:${solicitud.asignacion.profesional.telefono}`}
              className="btn-primary px-3 py-2 text-sm shrink-0"
            >
              <Phone size={14} />
              Llamar
            </a>
          </div>
        </div>
      ) : (
        <div className="card p-4 text-center text-slate-500 text-sm">
          <p className="text-2xl mb-2">⏳</p>
          <p className="font-medium">En búsqueda de profesional</p>
          <p className="text-xs mt-1 text-slate-400">Te avisamos cuando alguien acepte tu solicitud</p>
        </div>
      )}

      {/* Calificación */}
      {solicitud.asignacion && solicitud.estado !== "cancelado" && (
        <div className="card p-4">
          {solicitud.calificacion ? (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Tu calificación</p>
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < solicitud.calificacion!.puntuacion ? "text-yellow-400 fill-yellow-400" : "text-slate-200 fill-slate-200"}
                  />
                ))}
              </div>
              {solicitud.calificacion.comentario && (
                <p className="text-sm text-slate-600">{solicitud.calificacion.comentario}</p>
              )}
            </div>
          ) : calOk ? (
            <div className="text-center text-green-600 font-medium text-sm">
              ✅ ¡Gracias por tu calificación!
            </div>
          ) : (
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3">¿Cómo fue el servicio?</p>
              <div className="flex gap-2 mb-3 justify-center">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setCalForm({ ...calForm, puntuacion: n })}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={28}
                      className={n <= calForm.puntuacion ? "text-yellow-400 fill-yellow-400" : "text-slate-300 fill-slate-200"}
                    />
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Dejá un comentario (opcional)"
                value={calForm.comentario}
                onChange={(e) => setCalForm({ ...calForm, comentario: e.target.value })}
                className="input-field text-sm resize-none"
                rows={2}
              />
              <button
                onClick={calificar}
                disabled={calLoading}
                className="btn-primary w-full mt-3 py-2.5 text-sm"
              >
                {calLoading ? "Enviando..." : "Enviar calificación"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
