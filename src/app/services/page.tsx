import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Container } from "@/components/Container";
import { services } from "@/lib/content/services";
import { faqSchema, jsonLdScript } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Four bespoke starting points for handling enquiries, bookings, follow-ups, and admin, built around your business, not a fixed package.",
  alternates: { canonical: "/services" },
};

const faqs = [
  {
    question: "Do I have to choose just one of these services?",
    answer:
      "No, most businesses end up with a combination, because the four areas connect naturally. An enquiries system feeds a bookings system, which feeds follow-up, which feeds the record-keeping in admin and back-office. We'll recommend where to start based on where you're losing the most time or leads right now, not sell you all four regardless of need.",
  },
  {
    question: "What's the difference between a \"quick win\" and a \"bespoke build\"?",
    answer:
      "A quick win is a small, contained piece of automation, like missed-call text-back or automated review requests, that connects to what you already have and is usually live within days. A bespoke build is a fuller system, integrated with your calendar, CRM, or phone line, scoped specifically around how your business operates. Every service page below explains both options for that area.",
  },
  {
    question: "How do you decide which service is the right starting point?",
    answer:
      "On the discovery call. We ask about your typical week, where enquiries currently come from, and where things slip. The answer to \"where should we start\" is usually obvious once we've actually talked it through, rather than something we'd guess at from a form.",
  },
  {
    question: "Can these services work together as one connected system?",
    answer:
      "Yes, and for most established businesses that's the eventual goal: an enquiry gets captured, booked, followed up on, and logged automatically, as one flow rather than four separate tools. We can build toward that over time rather than requiring it all at once.",
  },
  {
    question: "Is any of this suitable if I've never used AI tools in my business before?",
    answer:
      "Yes, most of the businesses we work with haven't. You don't need any technical background; the system is built and managed by us, and every proposal is written in plain terms so you know exactly what you're getting before you commit to anything.",
  },
  {
    question: "Do these services replace tools I'm already paying for?",
    answer:
      "Sometimes, but not by default. We look at what you already use during scoping and generally prefer to integrate with tools that are working rather than replace them for the sake of it. Replacement only happens where it genuinely serves the system better.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Bespoke starting points, not fixed packages."
        dek="Every business's version of missed calls, slow follow-up, and admin overload looks different. These are the four areas we build around, each one tailored to how you actually operate, with a low-cost way in if you're not ready for a full build."
        breadcrumbs={[{ name: "Services", href: "/services" }]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqSchema(faqs))} />

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <div className="max-w-2xl space-y-5 text-text-muted">
            <p>
              Most &quot;AI for business&quot; offers are really one product wearing different
              branding, a chatbot widget or a booking calendar, sold as if every
              business&apos;s biggest
              problem is the same one. It usually isn&apos;t. A roofer&apos;s biggest problem is
              missed calls during a job. A salon&apos;s is no-shows on a fully booked day. A
              solicitor&apos;s is a slow first reply undermining trust before a client
              relationship has even started.
            </p>
            <p>
              We organise what we build into four areas rather than four rigid packages, because
              in practice most businesses need some blend of them, not exactly one. Enquiries and
              leads is about catching the moment someone tries to reach you. Bookings and
              scheduling is about turning that enquiry into a confirmed appointment without
              friction. Follow-ups and nurture is about not letting a warm lead or a happy
              customer go quiet. Admin and back-office is about making sure none of it depends on
              someone remembering to write it down.
            </p>
            <p>
              Each area below has a low-cost quick win you can see working within days, and a
              fuller bespoke build for when you&apos;re ready to go further. See{" "}
              <Link href="/how-it-works" className="text-gold hover:underline">
                how it works
              </Link>{" "}
              for how we figure out which is right for you, and{" "}
              <Link href="/industries" className="text-gold hover:underline">
                industries
              </Link>{" "}
              for how these apply to your specific type of business.
            </p>
            <p>
              None of these four are sold as an all-or-nothing package. A business might start
              with automated review requests from{" "}
              <Link href="/services/follow-ups-and-nurture" className="text-gold hover:underline">
                follow-ups and nurture
              </Link>{" "}
              and stop there, happily, because that was the one specific thing costing them the
              most. Another might eventually connect all four into a single system, once each
              piece has proven itself. Both are legitimate outcomes of the same honest scoping
              conversation, not a funnel we&apos;re steering every client through.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <div className="divide-y divide-border border-t border-border">
            {services.map((service, i) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group grid gap-6 py-10 transition-colors hover:bg-bg-alt md:grid-cols-[80px_1fr_auto] md:items-center md:px-4"
              >
                <span className="font-display text-3xl text-text-muted">0{i + 1}</span>
                <div>
                  <h2 className="font-display text-2xl text-text group-hover:text-gold md:text-3xl">
                    {service.name}
                  </h2>
                  <p className="mt-3 max-w-2xl text-text-muted">{service.dek}</p>
                  <p className="mt-2 max-w-2xl text-sm text-text-muted">{service.summary}</p>
                  <p className="mt-3 text-xs uppercase tracking-wide text-bronze">
                    Quick win: {service.quickWin.title} &middot; Bespoke: {service.bespoke.title}
                  </p>
                </div>
                <span className="font-display text-gold opacity-0 transition-opacity group-hover:opacity-100 md:text-2xl">
                  &rarr;
                </span>
              </Link>
            ))}
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
