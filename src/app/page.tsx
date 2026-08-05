import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { RoiCalculator } from "@/components/RoiCalculator";
import { FaqAccordion } from "@/components/FaqAccordion";
import { HeroBanner } from "@/components/HeroBanner";
import { PinnedSection } from "@/components/PinnedSection";
import { GlowOrb } from "@/components/GlowOrb";
import { Reveal } from "@/components/Reveal";
import { services } from "@/lib/content/services";
import { industries } from "@/lib/content/industries";
import { caseStudies } from "@/lib/content/case-studies";
import { site } from "@/lib/site";
import { faqSchema, jsonLdScript } from "@/lib/schema";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const homeFaqs = [
  {
    question: "What does an AI business consultancy actually build?",
    answer:
      `${site.name} designs and builds custom-built AI systems that handle enquiries, bookings, follow-ups, and back-office admin for independent trades and service businesses. Systems are trained on each client's specific services, tone, and existing tools, not sold as an off-the-shelf chatbot plugin.`,
  },
  {
    question: "Is this only for big companies, or does it work for a one- or two-person business?",
    answer:
      "It's built primarily for independent and small businesses: sole traders, small teams, and independent clinics, salons, and trades firms, where there's nobody spare to catch every enquiry. Larger operations benefit too, but the core problem this solves (a busy person who can't always answer the phone) is most acute for small, independent businesses.",
  },
  {
    question: "How much does it cost?",
    answer:
      "We don't publish prices, because a fixed price list can't reflect the difference between a simple missed-call text-back and a full AI voice receptionist with CRM integration. Pricing is scoped individually based on complexity, integrations, and ongoing support. See how it works for the full explanation.",
  },
  {
    question: "How long does it take to get a system live?",
    answer:
      "It depends on scope. Simple quick wins, like automated review requests or missed-call text-back, are often live within days. Fuller tailored systems with multiple integrations take longer, and we'll give you a realistic timeline as part of your proposal.",
  },
  {
    question: "Will my customers know they're talking to AI?",
    answer:
      "Where it matters, systems introduce themselves clearly, and a customer can always ask for a real person. Every system is written in your business's own tone rather than a generic corporate voice, so most customers simply experience a fast, helpful answer.",
  },
  {
    question: "What happens after the system goes live?",
    answer:
      "It doesn't end at launch. Every system is monitored and refined on an ongoing basis as real conversations come in and your business changes. See our ongoing partnership approach on the how it works page.",
  },
];

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
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqSchema(homeFaqs))} />

      <HeroBanner />

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
          <Reveal className="max-w-3xl space-y-5 text-text-muted">
            <p>
              {site.name} designs and builds AI systems built around your business for
              independent trades and service businesses across Northern Ireland. We handle the
              enquiries, bookings, follow-ups, and admin that eat into evenings and weekends,
              using AI trained specifically on your business, not a generic script bolted onto
              your website.
            </p>
            <p>
              Every business we work with is doing genuinely good work and losing some of it
              anyway, not because the work is lacking but because the timing is. A call rings out
              mid-job, a web enquiry sits unanswered overnight, a quote goes cold because nobody
              circled back. None of that reflects on the quality of the trade or service. It
              reflects on how much of a busy day is realistically left over for admin once the
              actual work is done.
            </p>
          </Reveal>
        </Container>
      </section>

      <PinnedSection
        eyebrow="Sound familiar?"
        title="You're doing everything. The AI does the rest."
        graphic={<GlowOrb tone="green" />}
      >
        <p>
          Three patterns show up again and again in the businesses we talk to. See if any of them
          sound like your week.
        </p>
        <div className="mt-8 space-y-6">
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
            <div key={item.n} className="flex gap-4">
              <span className="font-display text-2xl text-gold">{item.n}</span>
              <div>
                <h3 className="text-lg text-text">{item.title}</h3>
                <p className="mt-1 text-sm text-text-muted">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </PinnedSection>

      <section className="border-b border-border py-20 md:py-28">
        <Container>
          <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-bronze">What We Build</p>
              <h2 className="mt-4 max-w-lg font-display text-3xl text-text md:text-4xl">
                Tailored starting points, not fixed packages.
              </h2>
            </div>
            <Button href="/services" variant="ghost">
              View all services &rarr;
            </Button>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-text-muted">
              Every business&apos;s version of missed calls, slow follow-up, and admin overload
              looks different, so we don&apos;t sell a fixed package and try to make your
              business fit it. Each of the four areas below has a low-cost quick win to start
              with, and a fuller custom-built option for when you&apos;re ready for more. See{" "}
              <Link href="/how-it-works" className="text-gold hover:underline">
                how it works
              </Link>{" "}
              for the difference between the two.
            </p>
          </Reveal>

          <div className="mt-14 divide-y divide-border border-t border-border">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={i * 0.08}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex flex-col gap-3 py-8 transition-all duration-300 hover:bg-bg-alt hover:pl-2 md:flex-row md:items-center md:gap-10 md:px-4"
                >
                  <span className="font-display text-2xl text-text-muted transition-colors group-hover:text-gold md:w-16">
                    0{i + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display text-xl text-text group-hover:text-gold md:text-2xl">
                      {service.name}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm text-text-muted">{service.dek}</p>
                  </div>
                  <span className="font-display text-gold opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 md:text-2xl">
                    &rarr;
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <PinnedSection
        eyebrow="Real Results"
        title="Built for businesses like yours."
        graphic={<GlowOrb tone="gold" />}
        align="right"
      >
        <p>
          We recently built a full booking, follow-up, and review system for a flooring and
          blinds retailer in Northern Ireland — calendars that fill themselves, quotes that get
          chased automatically, and reviews requested after every job, without anyone lifting a
          phone.
        </p>
      </PinnedSection>

      <section className="border-b border-border py-20 md:py-28">
        <Container>
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-bronze">Who We Work With</p>
            <h2 className="mt-4 max-w-lg font-display text-3xl text-text md:text-4xl">
              Built around how your business actually operates.
            </h2>
            <p className="mt-4 max-w-2xl text-text-muted">
              A physio clinic&apos;s booking flow isn&apos;t a tradesperson&apos;s callout flow,
              and a salon&apos;s no-show problem isn&apos;t a solicitor&apos;s intake problem. We
              build around the specifics of your industry rather than adapting one generic
              template across every client.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
            {industries.map((industry, i) => (
              <Reveal key={industry.slug} delay={i * 0.06}>
                <Link
                  href={`/industries/${industry.slug}`}
                  className="group flex h-full flex-col justify-between gap-6 bg-bg-alt p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-bg-raised"
                >
                  <h3 className="font-display text-lg text-text group-hover:text-gold">
                    {industry.name}
                  </h3>
                  <span className="text-xs uppercase tracking-wide text-text-muted group-hover:text-gold">
                    Explore &rarr;
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-20 md:py-28">
        <Container>
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-bronze">Our Work</p>
            <h2 className="mt-4 max-w-lg font-display text-3xl text-text md:text-4xl">
              Businesses already running smarter.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {caseStudies.map((study, i) => (
              <Reveal key={study.slug} delay={i * 0.1}>
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="group flex h-full flex-col justify-between gap-6 rounded-sm border border-border p-8 transition-all duration-300 hover:-translate-y-1 hover:border-gold"
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
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-20 md:py-28">
        <Container>
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-bronze">Time Is Money</p>
            <h2 className="mt-4 max-w-lg font-display text-3xl text-text md:text-4xl">
              See what admin is actually costing you.
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="mt-12">
            <RoiCalculator />
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-border py-20 md:py-28">
        <Container>
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-bronze">Common Questions</p>
            <h2 className="mt-4 max-w-lg font-display text-3xl text-text md:text-4xl">
              Before you book a call.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 max-w-3xl">
            <FaqAccordion faqs={homeFaqs} />
          </Reveal>
        </Container>
      </section>

      <PinnedSection
        eyebrow="Let's Talk"
        title="Ready to reclaim your time?"
        graphic={<GlowOrb tone="gold" />}
        align="center"
      >
        <p className="mx-auto max-w-lg">
          Book a no-obligation discovery call. We&apos;ll spend an hour understanding your
          business and show you exactly what a custom-built system could look like for you.
        </p>
        <div className="mt-8">
          <Button href={site.bookingUrl} variant="primary">
            Book Your Discovery Call
          </Button>
        </div>
      </PinnedSection>
    </>
  );
}
