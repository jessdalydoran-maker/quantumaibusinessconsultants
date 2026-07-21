import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Container } from "@/components/Container";
import { industries } from "@/lib/content/industries";
import { faqSchema, jsonLdScript } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "AI systems built around how trades and independent service businesses actually operate, from callout scheduling to salon bookings.",
  alternates: { canonical: "/industries" },
};

const faqs = [
  {
    question: "My business doesn't fit neatly into one of these five categories. Can you still help?",
    answer:
      "Almost certainly. These five reflect where we've done the most work, not a hard boundary on who we'll work with. If your business shares the underlying problem, enquiries arriving faster than they can be handled by hand, the discovery call is where we figure out how the same approach applies to you.",
  },
  {
    question: "Why these five industries specifically?",
    answer:
      "They're the trades and service businesses where we consistently see the same pattern: high enquiry volume, limited spare capacity to answer it, and a real cost to missing it. That pattern shows up clearly in trades, home and property services, salons, automotive, and professional services, but it isn't exclusive to them.",
  },
  {
    question: "Do you build different systems for each industry, or the same system relabelled?",
    answer:
      "Different systems. The underlying services (enquiries, bookings, follow-up, admin) are the same building blocks, but what's actually built is scoped around your specific business: your services, your booking patterns, your tone, your customers' actual questions.",
  },
  {
    question: "Is there a minimum size of business you work with?",
    answer:
      "No. Some of the businesses we work with are a single tradesperson with a van; others have small teams across multiple sites. The problem this solves, enquiries arriving faster than a busy person can catch them, applies at both ends of that range.",
  },
  {
    question: "Do industries with existing case studies get priority over new industries?",
    answer:
      "No, our published case studies reflect where our earliest client relationships happened to be, not where our current focus is. Trades and independent service businesses are the current priority, regardless of what's in our published portfolio so far.",
  },
];

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Built around how your industry actually works."
        dek="A physio clinic's booking flow isn't a tradesperson's callout flow. We build around the specifics of your industry, not a generic template."
        breadcrumbs={[{ name: "Industries", href: "/industries" }]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqSchema(faqs))} />

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <div className="max-w-2xl space-y-5 text-text-muted">
            <p>
              The same underlying problem, enquiries arriving faster than a busy person can
              catch them, shows up differently depending on what your business actually does. A
              missed call costs a plumber a call-out. An unanswered enquiry costs a salon a
              chair-hour that can&apos;t be resold once the slot has passed. A slow first reply
              costs a solicitor a client&apos;s confidence before the relationship has even
              begun.
            </p>
            <p>
              Because the shape of the problem is different in each case, the shape of the fix
              has to be different too. That&apos;s why we build around industry specifics: how
              your bookings actually work, what your customers actually ask, what &quot;urgent&quot;
              means in your line of work, rather than adapting one generic chatbot across every
              client we take on.
            </p>
            <p>
              Below are the five areas where we&apos;ve done the most work so far. Each page goes
              into what the problem looks like day to day for that type of business, and which of
              our{" "}
              <Link href="/services" className="text-gold hover:underline">
                services
              </Link>{" "}
              tend to matter most.
            </p>
            <p>
              None of this is guesswork on our part. Each industry page below reflects patterns
              we&apos;ve actually seen scoping and building systems for businesses in that space,
              what a typical day looks like, where enquiries are most likely to slip, and which of
              our services tend to get used first versus added later.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-24">
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
                  <p className="mt-3 text-sm text-text-muted">{industry.summary}</p>
                  <p className="mt-3 text-sm text-text-muted">{industry.dayInTheLife}</p>
                </div>
                <span className="text-xs uppercase tracking-wide text-bronze group-hover:text-gold">
                  Explore &rarr;
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <p className="text-xs uppercase tracking-[0.3em] text-bronze">How We Scope By Industry</p>
          <h2 className="mt-4 max-w-lg font-display text-3xl text-text md:text-4xl">
            Industry knowledge, then your specifics.
          </h2>
          <p className="mt-6 max-w-2xl text-text-muted">
            Knowing the common patterns in, say, salon booking or trades call-outs gives us a
            faster starting point on a discovery call. We&apos;re not starting from zero on what
            &quot;urgent&quot; typically means for a plumber, or what usually drives a no-show for
            a hairdresser. But that starting point is exactly that: a starting point. The actual
            system is built around your specific services, your specific customers, and how your
            business specifically runs, not a template with your name added to it. See{" "}
            <Link href="/how-it-works" className="text-gold hover:underline">
              how it works
            </Link>{" "}
            for the full process, from discovery call through to a live system.
          </p>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <h2 className="font-display text-2xl text-text md:text-3xl">Common questions</h2>
          <div className="mt-8 max-w-3xl">
            <FaqAccordion faqs={faqs} />
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
