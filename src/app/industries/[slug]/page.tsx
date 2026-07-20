import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Container } from "@/components/Container";
import { getIndustry, industries } from "@/lib/content/industries";
import { getService } from "@/lib/content/services";
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
  const relatedServices = industry.relatedServices
    .map((s) => getService(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

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
          <div className="max-w-2xl space-y-5 text-text-muted">
            {industry.intro.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <p className="text-xs uppercase tracking-[0.3em] text-bronze">A Typical Day</p>
          <p className="mt-4 max-w-2xl text-text-muted">{industry.dayInTheLife}</p>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <p className="text-xs uppercase tracking-[0.3em] text-bronze">In Practice</p>
          <h2 className="mt-4 max-w-xl font-display text-2xl text-text md:text-3xl">
            What this looks like day to day
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {industry.scenarios.map((scenario) => (
              <div key={scenario.title} className="rounded-sm border border-border bg-bg-alt p-6">
                <h3 className="font-display text-lg text-text">{scenario.title}</h3>
                <p className="mt-2 text-sm text-text-muted">{scenario.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <p className="text-xs uppercase tracking-[0.3em] text-bronze">Why Industry-Specific</p>
          <h2 className="mt-4 max-w-xl font-display text-2xl text-text md:text-3xl">
            Why we don&apos;t use one system for every business
          </h2>
          <div className="mt-6 max-w-2xl space-y-4 text-text-muted">
            <p>
              It would be simpler, and cheaper for us, to build one generic AI receptionist and
              sell a slightly different colour scheme to every industry. We don&apos;t, because it
              wouldn&apos;t actually work well for anyone. What counts as an urgent enquiry, how
              bookings are actually structured, what a customer is likely to ask first — all of
              that differs meaningfully between a {industry.name.toLowerCase()} business and, say,
              a solicitor&apos;s office or a hotel front desk.
            </p>
            <p>
              Scoping around your specific industry means the system asks the right follow-up
              questions, recognises genuine urgency correctly, and represents your business in a
              way that feels accurate rather than generic — the difference between a customer
              feeling like they&apos;re talking to your business, and feeling like they&apos;re
              talking to a chatbot that happens to mention your business&apos;s name.
            </p>
            <p>
              This is also why our{" "}
              <Link href="/how-it-works" className="text-gold hover:underline">
                discovery call
              </Link>{" "}
              always starts with your actual business rather than a template for your industry —
              even within {industry.name.toLowerCase()}, no two businesses run identically, and
              the system should reflect yours specifically, not just the sector average.
            </p>
          </div>
        </Container>
      </section>

      {relatedServices.length > 0 && (
        <section className="border-b border-border py-16 md:py-24">
          <Container>
            <h2 className="font-display text-xl text-text">Relevant services</h2>
            <p className="mt-3 max-w-xl text-text-muted">
              For {industry.name.toLowerCase()} businesses, these tend to matter most:
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {relatedServices.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group block rounded-sm border border-border p-6 hover:border-gold"
                >
                  <h3 className="font-display text-lg text-text group-hover:text-gold">{s.name}</h3>
                  <p className="mt-2 text-sm text-text-muted">{s.dek}</p>
                </Link>
              ))}
            </div>
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

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <Link
            href="/case-studies"
            className="group block rounded-sm border border-gold/40 bg-bg-alt p-8 hover:border-gold"
          >
            <p className="text-xs uppercase tracking-wide text-gold">Real Results</p>
            <h3 className="mt-3 font-display text-2xl text-text group-hover:text-gold">
              See what this looks like for other independent businesses
            </h3>
            <p className="mt-3 max-w-xl text-text-muted">
              Our published case studies aren&apos;t in the {industry.name.toLowerCase()} space
              yet, but the systems and principles are the same ones we&apos;d apply to your
              business — take a look at what&apos;s live and launching.
            </p>
          </Link>
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
