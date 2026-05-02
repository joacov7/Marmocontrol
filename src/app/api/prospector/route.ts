import { NextRequest, NextResponse } from "next/server";

export interface ProspectorResult {
  place_id: string;
  nombre: string;
  direccion: string;
  telefono: string | null;
  tipo: string;
  rating: number | null;
  total_ratings: number | null;
  maps_url: string;
  website: string | null;
}

const CATEGORIAS: Record<string, string> = {
  arquitectos: "arquitecto OR estudio de arquitectura",
  constructoras: "constructora OR empresa de construcción",
  inmobiliarias: "inmobiliaria OR desarrolladora inmobiliaria",
  reformas: "empresa de reformas OR refacción de departamentos",
  disenio: "diseñador de interiores OR interiorismo",
  carpinteria: "carpintería OR muebles a medida",
  ceramica: "cerámicos OR revestimientos",
};

export async function GET(req: NextRequest) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const query = req.nextUrl.searchParams.get("q") ?? "";
  const ubicacion = req.nextUrl.searchParams.get("ubicacion") ?? "Buenos Aires, Argentina";
  const categoria = req.nextUrl.searchParams.get("categoria") ?? "";

  if (!apiKey) {
    return NextResponse.json({ error: "no_key", results: [] });
  }

  const searchQuery = categoria
    ? `${CATEGORIAS[categoria] ?? categoria} en ${ubicacion}`
    : `${query} en ${ubicacion}`;

  try {
    // Text Search
    const textSearchUrl = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
    textSearchUrl.searchParams.set("query", searchQuery);
    textSearchUrl.searchParams.set("language", "es");
    textSearchUrl.searchParams.set("region", "ar");
    textSearchUrl.searchParams.set("key", apiKey);

    const textRes = await fetch(textSearchUrl.toString());
    const textData = await textRes.json();

    if (textData.status !== "OK" && textData.status !== "ZERO_RESULTS") {
      return NextResponse.json({ error: textData.status, results: [] }, { status: 502 });
    }

    const places = (textData.results ?? []).slice(0, 15);

    // Enrich top 10 with phone via Place Details
    const enriched = await Promise.all(
      places.map(async (place: {
        place_id: string;
        name: string;
        formatted_address: string;
        types: string[];
        rating?: number;
        user_ratings_total?: number;
      }) => {
        let telefono: string | null = null;
        let website: string | null = null;

        try {
          const detailUrl = new URL("https://maps.googleapis.com/maps/api/place/details/json");
          detailUrl.searchParams.set("place_id", place.place_id);
          detailUrl.searchParams.set("fields", "formatted_phone_number,website");
          detailUrl.searchParams.set("language", "es");
          detailUrl.searchParams.set("key", apiKey);

          const detailRes = await fetch(detailUrl.toString());
          const detailData = await detailRes.json();
          telefono = detailData.result?.formatted_phone_number ?? null;
          website = detailData.result?.website ?? null;
        } catch {
          // silently skip detail enrichment
        }

        const tipoLegible = (place.types?.[0] ?? "negocio")
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c: string) => c.toUpperCase());

        return {
          place_id: place.place_id,
          nombre: place.name,
          direccion: place.formatted_address,
          telefono,
          tipo: tipoLegible,
          rating: place.rating ?? null,
          total_ratings: place.user_ratings_total ?? null,
          maps_url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
          website,
        } satisfies ProspectorResult;
      })
    );

    return NextResponse.json({ results: enriched });
  } catch (err) {
    console.error("Prospector error:", err);
    return NextResponse.json({ error: "fetch_error", results: [] }, { status: 500 });
  }
}
