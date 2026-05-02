export const ESTADOS_LEAD = {
  nuevo:        { label: "Nuevo",        color: "bg-gray-100 text-gray-700",    dot: "bg-gray-400" },
  contactado:   { label: "Contactado",   color: "bg-blue-100 text-blue-700",    dot: "bg-blue-500" },
  interesado:   { label: "Interesado",   color: "bg-yellow-100 text-yellow-800",dot: "bg-yellow-500" },
  presupuestado:{ label: "Presupuestado",color: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
  ganado:       { label: "Ganado",       color: "bg-green-100 text-green-700",   dot: "bg-green-500" },
  perdido:      { label: "Perdido",      color: "bg-red-100 text-red-600",       dot: "bg-red-400" },
} as const;

export type EstadoLead = keyof typeof ESTADOS_LEAD;

export const ORIGENES_LEAD = {
  instagram:   { label: "Instagram",  emoji: "📸" },
  referido:    { label: "Referido",   emoji: "🤝" },
  google:      { label: "Google",     emoji: "🔍" },
  visita:      { label: "Visita",     emoji: "🚪" },
  whatsapp:    { label: "WhatsApp",   emoji: "💬" },
  prospector:  { label: "Buscador",   emoji: "🎯" },
  otro:        { label: "Otro",       emoji: "📌" },
} as const;

export type OrigenLead = keyof typeof ORIGENES_LEAD;

export const TIPOS_INTERACCION = {
  llamada:  { label: "Llamada",  emoji: "📞" },
  whatsapp: { label: "WhatsApp", emoji: "💬" },
  visita:   { label: "Visita",   emoji: "🚪" },
  email:    { label: "Email",    emoji: "📧" },
  otro:     { label: "Otro",     emoji: "📝" },
} as const;

export type TipoInteraccion = keyof typeof TIPOS_INTERACCION;
