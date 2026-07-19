import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Container } from "@/components/Container";
import { getIndustry, industries } from "@/lib/content/industries";
import { caseStudies } from "@/lib/content/case-studies";
import { site } from "@/lib/site";
import { faqSchema, serviceSchema, jsonLdScript } from "@/lib/schema";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};
  return {
    title: industry.name,
    description: industry.summary,
    alternates: { canonical: `/industries/${industry.slug}` },
  };
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const otherIndustries = industries.filter((i) => i.slug !== industry.slug);
  const relatedCaseStudy = industry.relatedCaseStudy
    ? caseStudies.find((c) => c.slug === industry.relatedCaseStudy)
    : undefined;

  return (
    <>
      <PageHero
        eyebrow="Industries"
        title={industry.name}
        dek={industry.dek}
        breadcrumbs={[
          { name: "Industries", href: "/industries" },
          { name: industry.name, href: `/industries/${industry.slug}` },
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          serviceSchema({
            name: `AI systems for ${industry.name}`,
            description: industry.summary,
            url: `${site.url}/industries/${industry.slug}`,
            serviceType: industry.name,
          })
        )}
      />
      {(() => {
        const schema = faqSchema(industry.faqs);
        return schema ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(schema)} />
        ) : null;
      })()}

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <p className="max-w-2xl text-lg text-text-muted">{industry.summary}</p>

          <h2 className="mt-12 font-display text-2xl text-text">
            What this looks like in practice
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {industry.scenarios.map((scenario) => (
              <li key={scenario} className="rounded-sm border border-border bg-bg-alt p-6 text-text-muted">
                {scenario}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {relatedCaseStudy && (
        <section className="border-b border-border py-16 md:py-24">
          <Container>
            <Link
              href={`/case-studies/${relatedCaseStudy.slug}`}
              className="group block rounded-sm border border-border p-8 hover:border-gold"
            >
              <p className="text-xs uppercase tracking-wide text-bronze">Case Study</p>
              <h3 className="mt-3 font-display text-2xl text-text group-hover:text-gold">
                {relatedCaseStudy.headline}
              </h3>
              <p className="mt-3 text-text-muted">{relatedCaseStudy.summary}</p>
            </Link>
          </Container>
        </section>
      )}

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <h2 className="font-display text-2xl text-text md:text-3xl">Common questions</h2>
          <div className="mt-8 max-w-3xl">
            <FaqAccordion faqs={industry.faqs} />
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <h2 className="font-display text-xl text-text">Other industries</h2>
          <div className="mt-6 flex flex-wrap gap-4">
            {otherIndustries.map((i) => (
              <Link
                key={i.slug}
                href={`/industries/${i.slug}`}
                className="rounded-sm border border-border px-5 py-3 text-sm text-text-muted hover:border-gold hover:text-gold"
              >
                {i.name}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand title={`Want to talk through what this looks like for your ${industry.name.toLowerCase()} business?`} />
    </>
  );
}
