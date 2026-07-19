import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Container } from "@/components/Container";
import { faqSchema, jsonLdScript } from "@/lib/schema";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "From a first conversation to a system running on autopilot — how we scope, price, and build, without publishing a price list.",
  alternates: { canonical: "/how-it-works" },
};

const steps = [
  {
    n: "01",
    title: "Discovery Call",
    body: "We spend an hour understanding your business — how enquiries actually reach you today, where things slip, and what a good outcome looks like. No jargon, no pitch. Just a conversation.",
  },
  {
    n: "02",
    title: "Bespoke Proposal",
    body: "A written proposal built around what we heard, not a template. It names exactly what we'd build, how it fits your existing tools, and what it would take to get there.",
  },
  {
    n: "03",
    title: "Build & Integration",
    body: "We build and integrate the system into your existing setup — your phone number, your calendar, your CRM if you have one. You stay in control throughout, with regular check-ins, not a black box.",
  },
  {
    n: "04",
    title: "Ongoing Partnership",
    body: "Once live, we monitor, optimise, and evolve the system every month. Businesses change, and the systems we build for you should keep up.",
  },
];

const faqs = [
  {
    question: "Why isn't pricing published on the site?",
    answer:
      "Because a fixed price list would be dishonest about how this work actually happens. What a system costs depends on how many tools it touches, how complex the logic needs to be, and how much ongoing support you want — the same as any bespoke build. We'd rather scope it properly on a call than publish a number that doesn't apply to your business.",
  },
  {
    question: "What actually drives the cost of a project?",
    answer:
      "Mainly three things: the complexity of what you need automated, how many existing systems it needs to integrate with, and the level of ongoing support and iteration you want after launch. A missed-call text-back is a very different scope to a full AI voice receptionist with CRM integration — we'll be specific about which applies to you.",
  },
  {
    question: "How long does a typical build take?",
    answer:
      "It depends entirely on scope — a quick win like automated review requests can be live within days, while a full bespoke system with multiple integrations takes longer. We'll give you a realistic timeline as part of the proposal, not a generic estimate.",
  },
  {
    question: "Do I need to know exactly what I want before the discovery call?",
    answer:
      "No. Most people come to the call knowing what's frustrating them, not what the technical solution is. That's our job to figure out with you.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How It Works"
        title="From first call to running on autopilot."
        dek="No published price list — because no two businesses need the same thing. Here's exactly how we scope, propose, and build instead."
        breadcrumbs={[{ name: "How It Works", href: "/how-it-works" }]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(faqSchema(faqs))}
      />

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            {steps.map((step) => (
              <div key={step.n} className="flex gap-6">
                <span className="font-display text-4xl text-gold">{step.n}</span>
                <div>
                  <h2 className="font-display text-2xl text-text">{step.title}</h2>
                  <p className="mt-3 text-text-muted">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-bronze">How pricing works</p>
            <h2 className="mt-4 font-display text-3xl text-text md:text-4xl">
              Scoped to you. Never a fixed number on a page.
            </h2>
            <p className="mt-6 text-text-muted">
              We don&apos;t publish prices because a price list would only ever describe an
              average business, and you&apos;re not one. What you pay is a function of what
              you&apos;re actually asking us to build: how many systems it needs to talk to,
              how much complexity is in the logic, and how much ongoing support you want after
              launch.
            </p>
            <p className="mt-4 text-text-muted">
              That doesn&apos;t mean it&apos;s vague. Every proposal spells out exactly what
              you&apos;d be paying for and why, in plain terms, before you commit to anything. If
              you&apos;re not ready for a full bespoke build, we&apos;ll usually recommend a quick
              win first — a small, contained piece of automation you can see working before
              deciding on anything bigger.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <h2 className="font-display text-2xl text-text md:text-3xl">Common questions</h2>
          <div className="mt-8 max-w-3xl">
            <FaqAccordion faqs={faqs} />
          </div>
        </Container>
      </section>

      <CtaBand title="Ready to find out what this looks like for your business?" />
    </>
  );
}
