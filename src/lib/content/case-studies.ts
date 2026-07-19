export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  location: string;
  status: "live" | "launching";
  headline: string;
  summary: string;
  challenge: string;
  approach: string[];
  result?: { stat: string; label: string };
  launchNote?: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "pinnacle-health-ni",
    client: "Pinnacle Health NI",
    industry: "Health & Wellness",
    location: "Belfast",
    status: "live",
    headline: "AI booking and follow-up cut missed enquiries by 40%",
    summary:
      "AI booking, automated patient follow-ups, and intelligent enquiry handling for a Belfast health and wellness clinic.",
    challenge:
      "Pinnacle Health NI was losing enquiries to slow response times during busy clinic hours, when reception staff were occupied with patients on-site.",
    approach: [
      "AI-handled enquiry intake that responds the moment a message comes in",
      "Automated booking that reflects real practitioner availability",
      "Patient follow-up sequences that reduced the manual chasing required from front-of-house staff",
    ],
    result: { stat: "40%", label: "reduction in missed enquiries" },
  },
  {
    slug: "the-warren-collection",
    client: "The Warren Collection",
    industry: "Hospitality",
    location: "Northern Ireland",
    status: "live",
    headline: "One AI concierge, multiple properties, enquiries handled around the clock",
    summary: "An AI concierge system covering guest enquiries across multiple hotel properties.",
    challenge:
      "Guest enquiries arrived at all hours, across multiple properties, with no single reception desk able to cover every question at every hour.",
    approach: [
      "A unified AI concierge trained on each property's specifics — amenities, policies, local recommendations",
      "24/7 coverage so a guest enquiry at 11pm gets the same quality response as one at 11am",
      "Escalation rules for anything requiring a real member of staff",
    ],
    result: { stat: "24/7", label: "guest enquiries handled automatically" },
  },
  {
    slug: "thirty3coffee",
    client: "thirty3coffee",
    industry: "Food & Beverage",
    location: "Nutts Corner",
    status: "launching",
    headline: "An AI-driven batch ordering platform for wholesale clients",
    summary: "An AI batch ordering platform built for thirty3coffee's wholesale client base.",
    challenge:
      "Wholesale ordering for a growing coffee business meant repetitive back-and-forth for the same recurring orders, taking time away from roasting and fulfilment.",
    approach: [
      "An ordering system built specifically around wholesale batch patterns, not a generic e-commerce cart",
      "Automated reordering prompts timed to each client's typical cycle",
    ],
    launchNote: "This system is launching in 2026 — results will be published here once live.",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
