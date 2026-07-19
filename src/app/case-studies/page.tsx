import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { Container } from "@/components/Container";
import { caseStudies } from "@/lib/content/case-studies";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real results from real independent businesses running on Quantum AI systems — health & wellness, hospitality, and food & beverage.",
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Case Studies"
        title="Businesses already running smarter."
        dek="No invented numbers, no composite examples — every case study here is a real client."
        breadcrumbs={[{ name: "Case Studies", href: "/case-studies" }]}
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {caseStudies.map((study) => (
              <Link
                key={study.slug}
                href={`/case-studies/${study.slug}`}
                className="group flex flex-col justify-between gap-8 rounded-sm border border-border p-8 hover:border-gold"
              >
                <div>
                  <p className="text-xs uppercase tracking-wide text-text-muted">
                    {study.industry} &middot; {study.location}
                  </p>
                  <h2 className="mt-3 font-display text-2xl text-text group-hover:text-gold">
                    {study.client}
                  </h2>
                  <p className="mt-3 text-text-muted">{study.summary}</p>
                </div>
                {study.result ? (
                  <div>
                    <span className="font-display text-4xl text-gold">{study.result.stat}</span>
                    <p className="text-xs uppercase tracking-wide text-text-muted">
                      {study.result.label}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs uppercase tracking-wide text-bronze">Launching 2026</p>
                )}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
