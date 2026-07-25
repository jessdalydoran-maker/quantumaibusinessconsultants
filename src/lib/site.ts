export const site = {
  name: "Quantum AI Business Consultants",
  shortName: "Quantum AI",
  legacyDomain: "aibusinessconsultants.co.uk",
  url: "https://www.quantumbusinessconsultants.com",
  description:
    "We build bespoke AI systems that handle enquiries, bookings, follow-ups, and admin for independent trades and service businesses, so owners reclaim their time.",
  founders: [
    {
      name: "Mark",
      role: "Business Strategy",
      bio: "A decade of business strategy experience, ensuring every system we build actually impacts your bottom line.",
    },
    {
      name: "Jess",
      role: "AI Development",
      bio: "Leads AI development, crafting the technical architecture that makes it all work seamlessly.",
    },
  ],
  location: {
    locality: "Belfast",
    region: "Northern Ireland",
    country: "GB",
  },
  founded: "2026",
  emails: ["hello@quantumbusinessconsultants.com"],
  contactEmail: "hello@quantumbusinessconsultants.com",
  responseTime: "within 24 hours",
  bookingUrl:
    process.env.NEXT_PUBLIC_BOOKING_URL || "https://cal.eu/jess-daly-doran-vaqkcv/discovery-call",
  social: {
    // [INSERT: real social profile URLs once confirmed by Jess]
  },
} as const;

export const nav = [
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "About", href: "/about" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
] as const;
