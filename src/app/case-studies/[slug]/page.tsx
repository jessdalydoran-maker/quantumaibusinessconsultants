import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Container } from "@/components/Container";
import { getCaseStudy, caseStudies } from "@/lib/content/case-studies";
import { getService } from "@/lib/content/services";
import { site } from "@/lib/site";
import { articleSchema, faqSchema, jsonLdScript } from "@/lib/schema";

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

  const otherStudies = caseStudies.filter((c) => c.slug !== study.slug);
  const relatedServices = study.relatedServices
    .map((s) => getService(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

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
      {(() => {
        const schema = faqSchema(study.faqs);
        return schema ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(schema)} />
        ) : null;
      })()}

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <div className="grid gap-16 md:grid-cols-[2fr_1fr]">
            <div className="space-y-12">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-bronze">The Context</p>
                <div className="mt-4 space-y-4 text-text-muted">
                  {study.context.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-display text-2xl text-text">The challenge</h2>
                <p className="mt-4 text-text-muted">{study.challenge}</p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-text">What we built</h2>
                <div className="mt-4 space-y-5">
                  {study.approach.map((item) => (
                    <div key={item.title}>
                      <h3 className="font-display text-lg text-text">{item.title}</h3>
                      <p className="mt-1 text-text-muted">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {study.launchNote && (
                <p className="rounded-sm border border-bronze/40 bg-bg-alt p-6 text-sm text-text-muted">
                  {study.launchNote}
                </p>
              )}

              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-bronze">What This Means</p>
                <p className="mt-4 text-text-muted">{study.whatThisMeans}</p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-text">
                  What this case study teaches, more broadly
                </h2>
                <ul className="mt-4 space-y-3">
                  {study.lessons.map((lesson) => (
                    <li key={lesson} className="flex gap-3 text-text-muted">
                      <span className="text-gold" aria-hidden>
                        &mdash;
                      </span>
                      {lesson}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              {study.result && (
                <div className="h-fit rounded-sm border border-gold/40 bg-bg-alt p-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-gold">Result</p>
                  <p className="mt-4 font-display text-5xl text-gold">{study.result.stat}</p>
                  <p className="mt-2 text-text-muted">{study.result.label}</p>
                </div>
              )}

              {relatedServices.length > 0 && (
                <div className="rounded-sm border border-border bg-bg-alt p-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-bronze">
                    Related services
                  </p>
                  <div className="mt-4 space-y-3">
                    {relatedServices.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className="block text-sm text-text-muted hover:text-gold"
                      >
                        {s.name} &rarr;
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <h2 className="font-display text-2xl text-text md:text-3xl">Questions about this project</h2>
          <div className="mt-8 max-w-3xl">
            <FaqAccordion faqs={study.faqs} />
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <p className="text-xs uppercase tracking-[0.3em] text-bronze">How We Publish Results</p>
          <h2 className="mt-4 max-w-xl font-display text-2xl text-text md:text-3xl">
            This is a real engagement, reported honestly
          </h2>
          <div className="mt-6 max-w-2xl space-y-4 text-text-muted">
            <p>
              Everything above reflects an actual project we scoped and built — the challenge is
              the real problem the client came to us with, and the approach is what we actually
              built, not a simplified or idealised version of it. Where a result is quoted, it&apos;s
              a genuine outcome the client has confirmed, not a projection or an industry average
              presented as if it were specific to them.
            </p>
            <p>
              We follow the same process for every client, documented in full on{" "}
              <Link href="/how-it-works" className="text-gold hover:underline">
                how it works
              </Link>
              : a discovery call to understand the real problem, a bespoke proposal built around
              what we heard, a build that integrates with what the business already has, and
              ongoing support once it&apos;s live. Nothing above happened by accident or as an
              off-the-shelf configuration — it was scoped specifically for this business, the same
              way we&apos;d scope a system for yours.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <h2 className="font-display text-xl text-text">Other case studies</h2>
          <div className="mt-6 flex flex-wrap gap-4">
            {otherStudies.map((c) => (
              <Link
                key={c.slug}
                href={`/case-studies/${c.slug}`}
                className="rounded-sm border border-border px-5 py-3 text-sm text-text-muted hover:border-gold hover:text-gold"
              >
                {c.client}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand title="Want results like this for your business?" />
    </>
  );
}
