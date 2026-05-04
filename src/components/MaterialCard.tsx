"use client";

import { formatPeso } from "@/lib/utils";
import { useState } from "react";
import EditMaterialButton from "./EditMaterialButton";
import { AlertTriangle } from "lucide-react";

interface Material {
  id: number;
  nombre: string;
  tipo: string;
  precioCompra: number;
  precioPorM2: number;
  porcentajeDesperdicio: number;
  largoPlaca: number | null;
  anchoPlaca: number | null;
  proveedor: string | null;
  color: string | null;
  descripcion: string | null;
  activo: boolean;
  stockActual: number;
  stockMinimo: number;
  unidadStock: string;
}

export default function MaterialCard({ material: m }: { material: Material }) {
  const [expanded, setExpanded] = useState(false);
  const margen = m.precioCompra > 0 ? ((m.precioPorM2 - m.precioCompra) / m.precioCompra) * 100 : null;
  const m2Placa = m.largoPlaca && m.anchoPlaca ? m.largoPlaca * m.anchoPlaca : null;
  const stockBajo = m.stockMinimo > 0 && m.stockActual <= m.stockMinimo;
  const unidad = m.unidadStock === "m2" ? "m²" : "u";

  return (
    <div className={`bg-white rounded-xl border shadow-sm overflow-hidden ${stockBajo ? "border-red-200" : "border-gray-100"}`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
        <div className="w-10 h-10 rounded-xl border border-gray-200 shrink-0" style={{ backgroundColor: m.color ?? "#e5e7eb" }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-semibold text-gray-900 truncate">{m.nombre}</p>
            {stockBajo && <AlertTriangle size={13} className="text-red-500 shrink-0" />}
          </div>
          {m.proveedor && <p className="text-xs text-gray-400 truncate">{m.proveedor}</p>}
        </div>
        <div className="text-right shrink-0">
          <p className="font-bold text-gray-900">{formatPeso(m.precioPorM2)}<span className="text-xs text-gray-400 font-normal">/{m.tipo === "bacha" ? "u" : "m²"}</span></p>
          {margen !== null && (
            <p className={`text-xs font-semibold ${margen >= 30 ? "text-green-600" : margen >= 15 ? "text-orange-500" : "text-red-500"}`}>
              {margen.toFixed(0)}% margen
            </p>
          )}
        </div>
        <span className="text-gray-400 ml-1 text-xs">{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 space-y-3">
          {/* Precios */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <p className="text-xs text-gray-400 mb-1">Costo</p>
              <p className="font-bold text-gray-700 text-sm">{formatPeso(m.precioCompra)}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
              <p className="text-xs text-gray-400 mb-1">Venta</p>
              <p className="font-bold text-blue-700 text-sm">{formatPeso(m.precioPorM2)}</p>
            </div>
            <div className={`rounded-xl p-3 border text-center ${margen !== null && margen >= 30 ? "bg-green-50 border-green-100" : margen !== null && margen >= 15 ? "bg-orange-50 border-orange-100" : "bg-red-50 border-red-100"}`}>
              <p className="text-xs text-gray-400 mb-1">Margen</p>
              <p className={`font-bold text-sm ${margen !== null && margen >= 30 ? "text-green-700" : margen !== null && margen >= 15 ? "text-orange-600" : "text-red-600"}`}>
                {margen !== null ? `${margen.toFixed(1)}%` : "—"}
              </p>
            </div>
          </div>

          {/* Stock */}
          <div className={`rounded-xl p-3 border ${stockBajo ? "bg-red-50 border-red-200" : "bg-white border-gray-100"}`}>
            <p className="text-xs text-gray-400 mb-1.5">Stock</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-base font-bold ${stockBajo ? "text-red-700" : "text-gray-800"}`}>
                  {m.stockActual} {unidad}
                </span>
                {stockBajo && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <AlertTriangle size={10} /> Stock bajo
                  </span>
                )}
              </div>
              {m.stockMinimo > 0 && (
                <span className="text-xs text-gray-400">mín: {m.stockMinimo} {unidad}</span>
              )}
            </div>
          </div>

          {/* Placa */}
          {(m.largoPlaca || m.anchoPlaca) && (
            <div className="bg-white rounded-xl p-3 border border-gray-100">
              <p className="text-xs text-gray-400 mb-2">Medidas de la placa</p>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                  <span>{m.largoPlaca ?? "?"} m</span>
                  <span className="text-gray-400">×</span>
                  <span>{m.anchoPlaca ?? "?"} m</span>
                </div>
                {m2Placa && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{m2Placa.toFixed(2)} m²/placa</span>}
                {m2Placa && m.precioCompra > 0 && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{formatPeso(m2Placa * m.precioCompra)} costo/placa</span>}
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {m.tipo !== "bacha" && (
              <span className="text-xs bg-orange-50 text-orange-700 border border-orange-100 px-2.5 py-1 rounded-full">
                {m.porcentajeDesperdicio}% desperdicio
              </span>
            )}
            {m.descripcion && <span className="text-xs text-gray-500">{m.descripcion}</span>}
          </div>

          <EditMaterialButton material={m} />
        </div>
      )}
    </div>
  );
}
