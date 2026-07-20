import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Container } from "@/components/Container";
import { getService, services } from "@/lib/content/services";
import { getIndustry } from "@/lib/content/industries";
import { site } from "@/lib/site";
import { faqSchema, serviceSchema, jsonLdScript } from "@/lib/schema";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const otherServices = services.filter((s) => s.slug !== service.slug);
  const relatedIndustries = service.relatedIndustries
    .map((s) => getIndustry(s))
    .filter((i): i is NonNullable<typeof i> => Boolean(i));

  return (
    <>
      <PageHero
        eyebrow="Services"
        title={service.name}
        dek={service.dek}
        breadcrumbs={[
          { name: "Services", href: "/services" },
          { name: service.name, href: `/services/${service.slug}` },
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          serviceSchema({
            name: service.name,
            description: service.summary,
            url: `${site.url}/services/${service.slug}`,
            serviceType: service.name,
          })
        )}
      />
      {(() => {
        const schema = faqSchema(service.faqs);
        return schema ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(schema)} />
        ) : null;
      })()}

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <div className="grid gap-16 md:grid-cols-[2fr_1fr]">
            <div className="max-w-2xl space-y-5 text-text-muted">
              {service.intro.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="space-y-6">
              <div className="rounded-sm border border-border bg-bg-alt p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-bronze">Quick win</p>
                <h3 className="mt-3 font-display text-xl text-text">{service.quickWin.title}</h3>
                <p className="mt-3 text-sm text-text-muted">{service.quickWin.description}</p>
              </div>
              <div className="rounded-sm border border-gold/40 bg-bg-alt p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-gold">Bespoke build</p>
                <h3 className="mt-3 font-display text-xl text-text">{service.bespoke.title}</h3>
                <p className="mt-3 text-sm text-text-muted">{service.bespoke.description}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <p className="text-xs uppercase tracking-[0.3em] text-bronze">Signs You Need This</p>
          <h2 className="mt-4 max-w-xl font-display text-2xl text-text md:text-3xl">
            Does this sound like your week?
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {service.signs.map((sign) => (
              <li key={sign} className="flex gap-3 rounded-sm border border-border bg-bg-alt p-5 text-text-muted">
                <span className="text-gold" aria-hidden>
                  &mdash;
                </span>
                {sign}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <p className="text-xs uppercase tracking-[0.3em] text-bronze">How It Works</p>
          <div className="mt-8 grid gap-10 md:grid-cols-3">
            {service.howItWorks.map((step, i) => (
              <div key={step.title}>
                <span className="font-display text-3xl text-gold">0{i + 1}</span>
                <h3 className="mt-3 font-display text-lg text-text">{step.title}</h3>
                <p className="mt-2 text-sm text-text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <p className="text-xs uppercase tracking-[0.3em] text-bronze">What It Covers</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {service.whatItCovers.map((item) => (
              <div key={item.title} className="rounded-sm border border-border p-6">
                <h3 className="font-display text-lg text-text">{item.title}</h3>
                <p className="mt-2 text-sm text-text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <h2 className="font-display text-2xl text-text md:text-3xl">Common questions</h2>
          <div className="mt-8 max-w-3xl">
            <FaqAccordion faqs={service.faqs} />
          </div>
        </Container>
      </section>

      {relatedIndustries.length > 0 && (
        <section className="border-b border-border py-16 md:py-24">
          <Container>
            <h2 className="font-display text-xl text-text">
              Who this works well for
            </h2>
            <p className="mt-3 max-w-xl text-text-muted">
              {service.name} tends to matter most for businesses like:
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              {relatedIndustries.map((i) => (
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
      )}

      <section className="py-16 md:py-24">
        <Container>
          <h2 className="font-display text-xl text-text">Other services</h2>
          <div className="mt-6 flex flex-wrap gap-4">
            {otherServices.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="rounded-sm border border-border px-5 py-3 text-sm text-text-muted hover:border-gold hover:text-gold"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        title={`Want to talk through ${service.name.toLowerCase()} for your business?`}
      />
    </>
  );
}
