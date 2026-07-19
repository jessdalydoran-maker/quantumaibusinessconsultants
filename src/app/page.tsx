import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { RoiCalculator } from "@/components/RoiCalculator";
import { services } from "@/lib/content/services";
import { industries } from "@/lib/content/industries";
import { caseStudies } from "@/lib/content/case-studies";
import Link from "next/link";

const capabilityTags = [
  "AI Voice Receptionist",
  "Automated Follow-Up",
  "24/7 Enquiry Handling",
  "Smart Booking Systems",
  "Reputation Management",
  "WhatsApp Automation",
  "Monthly Reporting",
];

export default function Home() {
  return (
    <>
      <section className="border-b border-border pt-20 pb-16 md:pt-28 md:pb-24">
        <Container>
          <p className="text-xs uppercase tracking-[0.3em] text-bronze">
            AI Systems for Trades &amp; Service Businesses
          </p>
          <h1 className="text-balance mt-6 max-w-3xl font-display text-5xl leading-[1.05] text-text md:text-7xl">
            Stop running your business.
            <br />
            <span className="text-gold">Let it run itself.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-text-muted">
            We build bespoke AI systems that handle your enquiries, bookings, follow-ups, and
            admin — so you can focus on the work that actually grows your business.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/contact" variant="primary">
              Book a Discovery Call
            </Button>
            <Button href="/services" variant="secondary">
              See What We Build
            </Button>
          </div>
        </Container>
      </section>

      <div className="overflow-hidden border-b border-border bg-bg-alt py-5">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
          {[...capabilityTags, ...capabilityTags].map((tag, i) => (
            <span key={i} className="flex items-center gap-10 text-sm tracking-wide text-text-muted">
              {tag}
              <span className="text-gold" aria-hidden>
                &middot;
              </span>
            </span>
          ))}
        </div>
      </div>

      <section className="border-b border-border py-20 md:py-28">
        <Container>
          <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-16">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-bronze">Sound familiar?</p>
              <h2 className="mt-4 font-display text-3xl text-text md:text-4xl">
                You&apos;re doing everything. The AI does the rest.
              </h2>
            </div>
            <div className="grid gap-10 sm:grid-cols-3">
              {[
                {
                  n: "01",
                  title: "Missed calls = missed revenue",
                  body: "AI answers every call, 24/7. Never miss a lead because you were busy working.",
                },
                {
                  n: "02",
                  title: "Chasing enquiries manually",
                  body: "Automated follow-up fires instantly across email and SMS, converting interest into bookings.",
                },
                {
                  n: "03",
                  title: "No time to grow",
                  body: "Systems run the admin. You run the business. Reclaim hours of your week.",
                },
              ].map((item) => (
                <div key={item.n}>
                  <span className="font-display text-3xl text-gold">{item.n}</span>
                  <h3 className="mt-4 text-lg text-text">{item.title}</h3>
                  <p className="mt-2 text-sm text-text-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-20 md:py-28">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-bronze">What We Build</p>
              <h2 className="mt-4 max-w-lg font-display text-3xl text-text md:text-4xl">
                Bespoke starting points, not fixed packages.
              </h2>
            </div>
            <Button href="/services" variant="ghost">
              View all services &rarr;
            </Button>
          </div>

          <div className="mt-14 divide-y divide-border border-t border-border">
            {services.map((service, i) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group flex flex-col gap-3 py-8 transition-colors hover:bg-bg-alt md:flex-row md:items-center md:gap-10 md:px-4"
              >
                <span className="font-display text-2xl text-text-muted md:w-16">
                  0{i + 1}
                </span>
                <div className="flex-1">
                  <h3 className="font-display text-xl text-text group-hover:text-gold md:text-2xl">
                    {service.name}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm text-text-muted">{service.dek}</p>
                </div>
                <span className="font-display text-gold opacity-0 transition-opacity group-hover:opacity-100 md:text-2xl">
                  &rarr;
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-20 md:py-28">
        <Container>
          <p className="text-xs uppercase tracking-[0.3em] text-bronze">Who We Work With</p>
          <h2 className="mt-4 max-w-lg font-display text-3xl text-text md:text-4xl">
            Built around how your business actually operates.
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
            {industries.map((industry) => (
              <Link
                key={industry.slug}
                href={`/industries/${industry.slug}`}
                className="group flex flex-col justify-between gap-6 bg-bg-alt p-6 transition-colors hover:bg-bg-raised"
              >
                <h3 className="font-display text-lg text-text group-hover:text-gold">
                  {industry.name}
                </h3>
                <span className="text-xs uppercase tracking-wide text-text-muted group-hover:text-gold">
                  Explore &rarr;
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-20 md:py-28">
        <Container>
          <p className="text-xs uppercase tracking-[0.3em] text-bronze">Our Work</p>
          <h2 className="mt-4 max-w-lg font-display text-3xl text-text md:text-4xl">
            Businesses already running smarter.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {caseStudies.map((study) => (
              <Link
                key={study.slug}
                href={`/case-studies/${study.slug}`}
                className="group flex flex-col justify-between gap-6 rounded-sm border border-border p-8 transition-colors hover:border-gold"
              >
                <div>
                  <p className="text-xs uppercase tracking-wide text-text-muted">
                    {study.industry} &middot; {study.location}
                  </p>
                  <h3 className="mt-3 font-display text-xl text-text group-hover:text-gold">
                    {study.client}
                  </h3>
                  <p className="mt-3 text-sm text-text-muted">{study.summary}</p>
                </div>
                {study.result ? (
                  <div>
                    <span className="font-display text-3xl text-gold">{study.result.stat}</span>
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

      <section className="border-b border-border py-20 md:py-28">
        <Container>
          <p className="text-xs uppercase tracking-[0.3em] text-bronze">Time Is Money</p>
          <h2 className="mt-4 max-w-lg font-display text-3xl text-text md:text-4xl">
            See what admin is actually costing you.
          </h2>
          <div className="mt-12">
            <RoiCalculator />
          </div>
        </Container>
      </section>

      <section className="py-24 md:py-32">
        <Container className="text-center">
          <h2 className="text-balance mx-auto max-w-2xl font-display text-4xl text-text md:text-5xl">
            Ready to reclaim your time?
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-text-muted">
            Book a no-obligation discovery call. We&apos;ll spend an hour understanding your
            business and show you exactly what a bespoke system could look like for you.
          </p>
          <div className="mt-10">
            <Button href="/contact" variant="primary">
              Book Your Discovery Call
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
