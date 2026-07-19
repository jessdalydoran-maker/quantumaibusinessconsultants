import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { Container } from "@/components/Container";
import { industries } from "@/lib/content/industries";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "AI systems built around how trades and independent service businesses actually operate — from callout scheduling to salon bookings.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Built around how your industry actually works."
        dek="A physio clinic's booking flow isn't a tradesperson's callout flow. We build around the specifics of your industry, not a generic template."
        breadcrumbs={[{ name: "Industries", href: "/industries" }]}
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {industries.map((industry) => (
              <Link
                key={industry.slug}
                href={`/industries/${industry.slug}`}
                className="group flex flex-col justify-between gap-8 rounded-sm border border-border p-8 transition-colors hover:border-gold"
              >
                <div>
                  <h2 className="font-display text-2xl text-text group-hover:text-gold">
                    {industry.name}
                  </h2>
                  <p className="mt-3 text-text-muted">{industry.dek}</p>
                </div>
                <span className="text-xs uppercase tracking-wide text-bronze group-hover:text-gold">
                  Explore &rarr;
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
