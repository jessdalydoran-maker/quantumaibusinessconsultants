import "server-only";

export type ExtractedContact = {
  businessName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  sourceUrl: string;
};

const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_PATTERN = /(\+?\d[\d\s().-]{7,}\d)/;
// Best-effort UK postcode pattern — this is a heuristic, not a validator.
const UK_POSTCODE_PATTERN = /\b[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}\b/i;

async function fetchPageText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; QuantumCRMLeadFinder/1.0)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function extractFromHtml(html: string): Partial<ExtractedContact> {
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const businessName = titleMatch ? titleMatch[1].trim().split(/[|\-–]/)[0].trim() : null;

  // Structured intent links (mailto:/tel:) are far more reliable than free
  // text regex — prefer them, fall back to scanning visible text.
  const mailtoMatch = html.match(/href=["']mailto:([^"'?]+)/i);
  const telMatch = html.match(/href=["']tel:([^"']+)/i);

  const visibleText = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");

  const email = mailtoMatch?.[1] || visibleText.match(EMAIL_PATTERN)?.[0] || null;
  const phone = telMatch?.[1] || visibleText.match(PHONE_PATTERN)?.[0]?.trim() || null;
  const address = visibleText.match(UK_POSTCODE_PATTERN)?.[0] || null;

  return { businessName, email, phone, address };
}

// Fetches a single specified page (and, if reachable, an obvious /contact
// page) and extracts publicly visible contact info via pattern matching —
// deliberately not a general-purpose crawler, per the brief.
export async function extractContactFromWebsite(url: string): Promise<ExtractedContact> {
  const normalized = url.startsWith("http") ? url : `https://${url}`;
  const result: ExtractedContact = { businessName: null, email: null, phone: null, address: null, sourceUrl: normalized };

  const mainHtml = await fetchPageText(normalized);
  if (mainHtml) {
    Object.assign(result, extractFromHtml(mainHtml));
  }

  if (!result.email || !result.phone) {
    try {
      const base = new URL(normalized);
      const contactUrl = new URL("/contact", base).toString();
      const contactHtml = await fetchPageText(contactUrl);
      if (contactHtml) {
        const extra = extractFromHtml(contactHtml);
        result.email = result.email || extra.email || null;
        result.phone = result.phone || extra.phone || null;
        result.address = result.address || extra.address || null;
      }
    } catch {
      // Invalid URL or /contact unreachable — fine, main page result stands.
    }
  }

  return result;
}
