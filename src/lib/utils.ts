export function formatPeso(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export const ESTADOS = {
  presupuesto: { label: "Presupuesto", color: "bg-yellow-100 text-yellow-800" },
  produccion: { label: "En producción", color: "bg-blue-100 text-blue-800" },
  listo: { label: "Listo", color: "bg-green-100 text-green-800" },
  instalado: { label: "Instalado", color: "bg-gray-100 text-gray-700" },
} as const;

export type EstadoPedido = keyof typeof ESTADOS;
