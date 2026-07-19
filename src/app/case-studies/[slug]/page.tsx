import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { Container } from "@/components/Container";
import { getCaseStudy, caseStudies } from "@/lib/content/case-studies";
import { site } from "@/lib/site";
import { articleSchema, jsonLdScript } from "@/lib/schema";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: study.client,
    description: study.summary,
    alternates: { canonical: `/case-studies/${study.slug}` },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <>
      <PageHero
        eyebrow={`${study.industry} · ${study.location}`}
        title={study.client}
        dek={study.headline}
        breadcrumbs={[
          { name: "Case Studies", href: "/case-studies" },
          { name: study.client, href: `/case-studies/${study.slug}` },
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          articleSchema({
            headline: study.headline,
            description: study.summary,
            url: `${site.url}/case-studies/${study.slug}`,
            datePublished: "2026-01-01",
            authorName: site.name,
          })
        )}
      />

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <div className="grid gap-16 md:grid-cols-[2fr_1fr]">
            <div>
              <h2 className="font-display text-2xl text-text">The challenge</h2>
              <p className="mt-4 text-text-muted">{study.challenge}</p>

              <h2 className="mt-12 font-display text-2xl text-text">What we built</h2>
              <ul className="mt-4 space-y-3">
                {study.approach.map((item) => (
                  <li key={item} className="flex gap-3 text-text-muted">
                    <span className="text-gold" aria-hidden>
                      &mdash;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              {study.launchNote && (
                <p className="mt-8 rounded-sm border border-bronze/40 bg-bg-alt p-6 text-sm text-text-muted">
                  {study.launchNote}
                </p>
              )}
            </div>

            {study.result && (
              <div className="h-fit rounded-sm border border-gold/40 bg-bg-alt p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-gold">Result</p>
                <p className="mt-4 font-display text-5xl text-gold">{study.result.stat}</p>
                <p className="mt-2 text-text-muted">{study.result.label}</p>
              </div>
            )}
          </div>
        </Container>
      </section>

      <CtaBand title="Want results like this for your business?" />
    </>
  );
}
