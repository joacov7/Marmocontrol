export const ESTADOS_TALLER = {
  pendiente:  { label: "Pendiente",   color: "bg-gray-100 text-gray-700",    dot: "bg-gray-400",   bg: "bg-gray-50"   },
  en_proceso: { label: "En proceso",  color: "bg-blue-100 text-blue-700",    dot: "bg-blue-500",   bg: "bg-blue-50"   },
  terminado:  { label: "Terminado",   color: "bg-green-100 text-green-700",  dot: "bg-green-500",  bg: "bg-green-50"  },
} as const;

export type EstadoTaller = keyof typeof ESTADOS_TALLER;
