import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Container } from "@/components/Container";
import { caseStudies } from "@/lib/content/case-studies";
import { faqSchema, jsonLdScript } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real results from real independent businesses running on Quantum AI systems: health & wellness, hospitality, and food & beverage.",
  alternates: { canonical: "/case-studies" },
};

const faqs = [
  {
    question: "Are these results typical, or best-case examples?",
    answer:
      "They're the complete list of clients whose systems have been live long enough to report on honestly, not a filtered selection of the best-performing ones. We have three published case studies because we have three engagements we can report on truthfully, not because we've hidden weaker results.",
  },
  {
    question: "Why don't you have case studies in trades or the other industries you list?",
    answer:
      "Our published portfolio reflects where our earliest client relationships happened to be, which skewed toward health & wellness, hospitality, and food & beverage. Our current focus has shifted toward trades and service businesses, and we expect that portfolio gap to close as those engagements mature enough to report on. We won't publish a trades case study until we have a real one.",
  },
  {
    question: "How do you decide what result to publish for a client?",
    answer:
      "Whatever metric the client themselves considers meaningful and can confirm, such as a reduction in missed enquiries or coverage hours, rather than a metric we've chosen because it sounds impressive. If a result can't be measured honestly yet, we don't publish one.",
  },
  {
    question: "Can I speak to a current client as a reference?",
    answer:
      "Ask us directly on a discovery call. Whether a reference conversation is possible depends on the individual client's availability and preference, but we're happy to explore it where it makes sense.",
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Case Studies"
        title="Businesses already running smarter."
        dek="No invented numbers, no composite examples: every case study here is a real client."
        breadcrumbs={[{ name: "Case Studies", href: "/case-studies" }]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqSchema(faqs))} />

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <div className="max-w-2xl space-y-5 text-text-muted">
            <p>
              Most consultancies in this space fill a case studies page with composite examples,
              projected numbers, or clients who agreed to be named but not quoted with any real
              detail. We&apos;d rather have three genuine examples than a dozen padded-out ones,
              so what&apos;s below is a complete list, not a curated highlight reel with the
              underwhelming results left out.
            </p>
            <p>
              Each entry reflects a real engagement: a real business, a real problem, and, where
              the system has been live long enough to measure, a real result. Where a project is
              still in build or too recent to report on honestly, we say so, rather than
              publishing a number that hasn&apos;t actually been earned yet.
            </p>
            <p>
              We work across health &amp; wellness, hospitality, and food &amp; beverage
              already, and we&apos;re actively building out results in trades and other service
              businesses, the current focus of{" "}
              <Link href="/industries" className="text-gold hover:underline">
                the industries we serve
              </Link>
              . If your business isn&apos;t reflected in the list below yet, that&apos;s a gap in
              our published portfolio, not a sign we haven&apos;t thought about how the same
              systems would apply to you. See{" "}
              <Link href="/how-it-works" className="text-gold hover:underline">
                how it works
              </Link>{" "}
              for the process, industry by industry.
            </p>
            <p>
              Each case study below covers the same four things: the context behind the problem,
              the specific challenge this business faced, what we actually built, and what it
              means more broadly for businesses facing a similar gap between demand and capacity.
              We&apos;ve tried to write these so they&apos;re useful even if your business is
              nothing like the ones featured. The underlying pattern usually travels better than
              the specifics do.
            </p>
          </div>
        </Container>
      </section>

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
                  <p className="mt-2 text-sm text-gold">{study.headline}</p>
                  <p className="mt-3 text-text-muted">{study.summary}</p>
                  <p className="mt-3 text-sm text-text-muted">{study.challenge}</p>
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

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <p className="text-xs uppercase tracking-[0.3em] text-bronze">What Ties These Together</p>
          <h2 className="mt-4 max-w-lg font-display text-3xl text-text md:text-4xl">
            Three different industries, one consistent pattern.
          </h2>
          <div className="mt-8 max-w-2xl space-y-4 text-text-muted">
            <p>
              A Belfast health clinic, a multi-property hospitality group, and a growing wholesale
              coffee roaster don&apos;t look like the same kind of business on the surface. But
              the underlying problem in each case was recognisably similar: real demand arriving
              faster, or more repetitively, than a busy team could handle by hand, not because of
              a lack of skill or effort, but because of a structural gap between how much attention
              a task needed and how much was realistically available for it.
            </p>
            <p>
              In each case, the fix wasn&apos;t to add headcount or hope the team would somehow
              find more hours in the day. It was to build a system specifically around where that
              gap actually was: enquiry timing for the clinic, round-the-clock consistency for
              the hospitality group, repetitive ordering admin for the coffee roaster, and let it
              close that gap automatically, every time, rather than depending on someone catching
              it manually.
            </p>
            <p>
              That&apos;s the same underlying approach we&apos;d bring to a trades business, a
              salon, or a professional services firm. See{" "}
              <Link href="/industries" className="text-gold hover:underline">
                industries
              </Link>{" "}
              for how it applies specifically to yours, or{" "}
              <Link href="/how-it-works" className="text-gold hover:underline">
                how it works
              </Link>{" "}
              for the process that gets us from a first conversation to a system like the ones
              above.
            </p>
          </div>
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
