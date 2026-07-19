import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Container } from "@/components/Container";
import { getService, services } from "@/lib/content/services";
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
          <div className="grid gap-16 md:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl text-text">The problem</h2>
              <p className="mt-4 text-text-muted">{service.problem}</p>

              <h2 className="mt-12 font-display text-2xl text-text">What it covers</h2>
              <ul className="mt-4 space-y-3">
                {service.whatItCovers.map((item) => (
                  <li key={item} className="flex gap-3 text-text-muted">
                    <span className="text-gold" aria-hidden>
                      &mdash;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
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
          <h2 className="font-display text-2xl text-text md:text-3xl">Common questions</h2>
          <div className="mt-8 max-w-3xl">
            <FaqAccordion faqs={service.faqs} />
          </div>
        </Container>
      </section>

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
