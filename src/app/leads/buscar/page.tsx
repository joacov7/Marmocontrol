import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProspectorSearch from "@/components/leads/ProspectorSearch";

export default function BuscarProspectosPage() {
  const tieneApiKey = !!process.env.GOOGLE_PLACES_API_KEY;

  return (
    <div>
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <Link href="/leads" className="p-2 -ml-2 text-gray-500">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-bold text-gray-900">Buscar prospectos</h1>
          <p className="text-xs text-gray-500">Encontrá potenciales clientes en tu zona</p>
        </div>
      </div>

      {!tieneApiKey && (
        <div className="mx-4 mb-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-yellow-800 mb-1">Configuración requerida</p>
          <p className="text-xs text-yellow-700">
            Agregá tu clave de Google Places API en el archivo <code className="bg-yellow-100 px-1 rounded">.env</code>:
          </p>
          <code className="block text-xs bg-yellow-100 rounded-lg p-2 mt-2 text-yellow-900 font-mono">
            GOOGLE_PLACES_API_KEY=tu_clave_aquí
          </code>
          <p className="text-xs text-yellow-600 mt-2">
            Podés obtener una clave gratis en Google Cloud Console con $200 de crédito mensual.
          </p>
        </div>
      )}

      <ProspectorSearch tieneApiKey={tieneApiKey} />
    </div>
  );
}
