"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { formatPeso } from "@/lib/utils";
import { Plus, Trash2, Info } from "lucide-react";

interface Material {
  id: number;
  nombre: string;
  tipo: string;
  precioPorM2: number;
  porcentajeDesperdicio: number;
  color: string | null;
}

interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
}

interface Item {
  materialId: number;
  descripcion: string;
  largo: number;
  ancho: number;
  cantBachas: number;
  cantCortes: number;
}

const PRECIO_BACHA = 15000;
const PRECIO_CORTE = 8000;

function calcularItem(item: Item, materiales: Material[]) {
  const mat = materiales.find((m) => m.id === item.materialId);
  if (!mat || !item.largo || !item.ancho) return { subtotal: 0, m2Neto: 0, m2ConDesperdicio: 0, desperdicio: 0 };
  const m2Neto = item.largo * item.ancho;
  const factor = 1 + mat.porcentajeDesperdicio / 100;
  const m2ConDesperdicio = m2Neto * factor;
  const desperdicio = m2ConDesperdicio - m2Neto;
  const subtotal = m2ConDesperdicio * mat.precioPorM2
    + item.cantBachas * PRECIO_BACHA
    + item.cantCortes * PRECIO_CORTE;
  return { subtotal, m2Neto, m2ConDesperdicio, desperdicio };
}

const itemVacio = (): Item => ({
  materialId: 0, descripcion: "", largo: 0, ancho: 0, cantBachas: 0, cantCortes: 0,
});

export default function CotizadorForm({
  materiales, clientes, clienteIdInicial,
}: {
  materiales: Material[];
  clientes: Cliente[];
  clienteIdInicial?: number;
}) {
  const router = useRouter();
  const [clienteId, setClienteId] = useState<number>(clienteIdInicial ?? 0);
  const [nuevoCliente, setNuevoCliente] = useState(false);
  const [nombreCliente, setNombreCliente] = useState("");
  const [telefonoCliente, setTelefonoCliente] = useState("");
  const [items, setItems] = useState<Item[]>([itemVacio()]);
  const [notas, setNotas] = useState("");
  const [fechaInstalacion, setFechaInstalacion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [loading, setLoading] = useState(false);

  const updateItem = useCallback((idx: number, field: keyof Item, value: string | number) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
  }, []);

  const total = items.reduce((acc, it) => acc + calcularItem(it, materiales).subtotal, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.some((it) => !it.materialId || !it.largo || !it.ancho)) {
      alert("Completá material, largo y ancho en todos los items");
      return;
    }
    setLoading(true);

    let cid = clienteId;
    if (nuevoCliente) {
      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombreCliente, telefono: telefonoCliente }),
      });
      const c = await res.json();
      cid = c.id;
    }

    if (!cid) { alert("Seleccioná o creá un cliente"); setLoading(false); return; }

    const payload = {
      clienteId: cid,
      total,
      notas: notas || undefined,
      fechaInstalacion: fechaInstalacion || undefined,
      fechaEntrega: fechaEntrega || undefined,
      items: items.map((it) => {
        const mat = materiales.find((m) => m.id === it.materialId)!;
        const { subtotal, desperdicio } = calcularItem(it, materiales);
        return {
          materialId: it.materialId,
          descripcion: it.descripcion || mat.nombre,
          largo: it.largo,
          ancho: it.ancho,
          cantBachas: it.cantBachas,
          cantCortes: it.cantCortes,
          desperdicio,
          precioUnit: mat.precioPorM2,
          precioTotal: subtotal,
        };
      }),
    };

    const res = await fetch("/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const pedido = await res.json();
    router.push(`/pedidos/${pedido.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="px-4 space-y-5 pb-6">
      {/* Cliente */}
      <section className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Cliente</p>
        {!nuevoCliente ? (
          <div className="space-y-2">
            <select value={clienteId || ""} onChange={(e) => setClienteId(Number(e.target.value))} className="input-field" required={!nuevoCliente}>
              <option value="">Seleccionar cliente...</option>
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.nombre} — {c.telefono}</option>)}
            </select>
            <button type="button" onClick={() => setNuevoCliente(true)} className="text-blue-600 text-sm font-medium">+ Crear cliente nuevo</button>
          </div>
        ) : (
          <div className="space-y-2">
            <input value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)} placeholder="Nombre del cliente *" required className="input-field" />
            <input value={telefonoCliente} onChange={(e) => setTelefonoCliente(e.target.value)} placeholder="Teléfono *" type="tel" required className="input-field" />
            <button type="button" onClick={() => setNuevoCliente(false)} className="text-gray-500 text-sm">← Seleccionar existente</button>
          </div>
        )}
      </section>

      {/* Items */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Piezas</p>
          <button type="button" onClick={() => setItems((prev) => [...prev, itemVacio()])} className="flex items-center gap-1 text-blue-600 text-sm font-medium">
            <Plus size={14} /> Agregar pieza
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => {
            const mat = materiales.find((m) => m.id === item.materialId);
            const { subtotal, m2Neto, m2ConDesperdicio, desperdicio } = calcularItem(item, materiales);
            return (
              <div key={idx} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700">Pieza {idx + 1}</p>
                  {items.length > 1 && (
                    <button type="button" onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))} className="text-red-400 p-1">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <select value={item.materialId || ""} onChange={(e) => updateItem(idx, "materialId", Number(e.target.value))} className="input-field" required>
                    <option value="">Material *</option>
                    {materiales.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre} — {formatPeso(m.precioPorM2)}/m² (+{m.porcentajeDesperdicio}% desp.)
                      </option>
                    ))}
                  </select>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Largo (m) *</label>
                      <input type="number" step="0.01" min="0" value={item.largo || ""} onChange={(e) => updateItem(idx, "largo", parseFloat(e.target.value) || 0)} placeholder="Ej: 2.40" className="input-field" required />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Ancho (m) *</label>
                      <input type="number" step="0.01" min="0" value={item.ancho || ""} onChange={(e) => updateItem(idx, "ancho", parseFloat(e.target.value) || 0)} placeholder="Ej: 0.60" className="input-field" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Bachas</label>
                      <input type="number" min="0" value={item.cantBachas || ""} onChange={(e) => updateItem(idx, "cantBachas", parseInt(e.target.value) || 0)} placeholder="0" className="input-field" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Cortes extra</label>
                      <input type="number" min="0" value={item.cantCortes || ""} onChange={(e) => updateItem(idx, "cantCortes", parseInt(e.target.value) || 0)} placeholder="0" className="input-field" />
                    </div>
                  </div>

                  <input value={item.descripcion} onChange={(e) => updateItem(idx, "descripcion", e.target.value)} placeholder="Descripción (opcional)" className="input-field" />

                  {subtotal > 0 && mat && (
                    <div className="bg-blue-50 rounded-xl p-3 space-y-1.5">
                      <div className="flex justify-between text-xs text-blue-700">
                        <span>m² neto</span>
                        <span>{m2Neto.toFixed(2)} m²</span>
                      </div>
                      <div className="flex justify-between text-xs text-orange-600">
                        <span className="flex items-center gap-1">
                          <Info size={10} /> Desperdicio ({mat.porcentajeDesperdicio}%)
                        </span>
                        <span>+{desperdicio.toFixed(2)} m²</span>
                      </div>
                      <div className="flex justify-between text-xs text-blue-700 border-t border-blue-100 pt-1.5">
                        <span>m² a comprar</span>
                        <span className="font-semibold">{m2ConDesperdicio.toFixed(2)} m²</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-blue-800 border-t border-blue-200 pt-1.5">
                        <span>Subtotal</span>
                        <span>{formatPeso(subtotal)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Fechas y notas */}
      <section className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Fechas y notas</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Entrega estimada</label>
            <input type="date" value={fechaEntrega} onChange={(e) => setFechaEntrega(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Instalación</label>
            <input type="date" value={fechaInstalacion} onChange={(e) => setFechaInstalacion(e.target.value)} className="input-field" />
          </div>
        </div>
        <textarea value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Notas del pedido..." rows={2} className="input-field resize-none" />
      </section>

      {/* Total + Submit */}
      <div className="bg-gray-900 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-xs">Total (con desperdicio)</p>
          <p className="text-white text-2xl font-bold">{formatPeso(total)}</p>
        </div>
        <button type="submit" disabled={loading || total === 0} className="bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
