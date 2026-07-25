import "server-only";
import { extractEmailFromWebsite } from "@/lib/site-contact-extractor";

export type PlaceResult = {
  placeId: string;
  name: string;
  address: string;
  phone: string | null;
  website: string | null;
  rating: number | null;
  email: string | null;
};

type SearchTextResponse = {
  places?: {
    id: string;
    displayName?: { text?: string };
    formattedAddress?: string;
    nationalPhoneNumber?: string;
    websiteUri?: string;
    rating?: number;
  }[];
};

// Places API (New) — Text Search. Server-side only; the API key is never
// sent to the browser. Requesting phone/website fields moves this onto
// Google's higher "Enterprise" SKU pricing tier (confirmed from Google's own
// docs) — flagged clearly to the user since it's a real cost difference from
// a basic name/address-only search.
export async function searchPlaces(query: string, locationBias?: string): Promise<PlaceResult[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_PLACES_API_KEY is not configured.");

  const fullQuery = locationBias ? `${query} in ${locationBias}` : query;

  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating",
    },
    body: JSON.stringify({ textQuery: fullQuery, maxResultCount: 20 }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Google Places search failed (${res.status}): ${body}`);
  }

  const data = (await res.json()) as SearchTextResponse;

  const results: PlaceResult[] = (data.places ?? []).map((p) => ({
    placeId: p.id,
    name: p.displayName?.text ?? "Unnamed business",
    address: p.formattedAddress ?? "",
    phone: p.nationalPhoneNumber ?? null,
    website: p.websiteUri ?? null,
    rating: p.rating ?? null,
    email: null,
  }));

  // Places never returns an email address at all — best-effort enrich from
  // each result's own website (mailto:/regex, homepage only). Run in
  // parallel; a slow or email-less site just comes back null, it doesn't
  // hold up the rest of the search.
  await Promise.all(
    results.map(async (r) => {
      if (!r.website) return;
      r.email = await extractEmailFromWebsite(r.website).catch(() => null);
    })
  );

  return results;
}
