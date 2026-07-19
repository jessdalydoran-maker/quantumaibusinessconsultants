import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { Container } from "@/components/Container";
import { services } from "@/lib/content/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Four bespoke starting points for handling enquiries, bookings, follow-ups, and admin — built around your business, not a fixed package.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Bespoke starting points, not fixed packages."
        dek="Every business's version of missed calls, slow follow-up, and admin overload looks different. These are the four areas we build around — each one tailored to how you actually operate, with a low-cost way in if you're not ready for a full build."
        breadcrumbs={[{ name: "Services", href: "/services" }]}
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="divide-y divide-border border-t border-border">
            {services.map((service, i) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group grid gap-6 py-10 transition-colors hover:bg-bg-alt md:grid-cols-[80px_1fr_auto] md:items-center md:px-4"
              >
                <span className="font-display text-3xl text-text-muted">0{i + 1}</span>
                <div>
                  <h2 className="font-display text-2xl text-text group-hover:text-gold md:text-3xl">
                    {service.name}
                  </h2>
                  <p className="mt-3 max-w-2xl text-text-muted">{service.dek}</p>
                </div>
                <span className="font-display text-gold opacity-0 transition-opacity group-hover:opacity-100 md:text-2xl">
                  &rarr;
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
