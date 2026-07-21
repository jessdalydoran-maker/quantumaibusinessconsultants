import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";
import { faqSchema, jsonLdScript } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About",
  description:
    "Mark and Jess, Belfast based, building bespoke AI systems for independent trades and service businesses.",
  alternates: { canonical: "/about" },
};

const faqs = [
  {
    question: "Are you a big agency or a small team?",
    answer:
      `We're a small, Belfast-based team, not a large agency. That's a deliberate choice: every project we take on gets direct involvement from the people who actually understand the technical build, rather than being handed off through account managers.`,
  },
  {
    question: "Do you only work with businesses in Belfast or Northern Ireland?",
    answer:
      "We're based in Belfast and our client base so far is concentrated in Northern Ireland, but the systems we build aren't location-dependent. An AI receptionist or booking system works the same way regardless of where the business is based.",
  },
  {
    question: "Why did you start Quantum AI Business Consultants?",
    answer:
      "We kept seeing the same pattern in independent businesses we knew and worked with: genuinely good businesses losing genuinely winnable work because there simply wasn't time to answer every enquiry, chase every quote, and keep every record up to date on top of doing the actual job. That gap, between doing excellent work and having the admin capacity to capture everything that work should be winning, is what we built the business to close.",
  },
  {
    question: "Do you work with businesses outside trades and services?",
    answer:
      "Our focus is independent trades and service businesses, because that's where we've built the deepest understanding of the specific problems: callout scheduling, no-show reduction, intake for professional services. If your business sits outside that but shares the same underlying problem, we're happy to have the conversation.",
  },
  {
    question: "How do Mark and Jess divide the work?",
    answer:
      "Mark leads on understanding the business side of every engagement: what's actually costing a client time or leads, and whether a proposed system genuinely addresses it. Jess leads the technical build, turning that understanding into a working system. Both are involved from the first discovery call through to launch, rather than working in separate silos that only meet at handoff points.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Belfast based. Globally minded."
        dek="We don't sell generic software. We build bespoke systems for independent businesses that want to scale without losing their personal touch."
        breadcrumbs={[{ name: "About", href: "/about" }]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqSchema(faqs))} />

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <div className="grid gap-12 md:grid-cols-2">
            {site.founders.map((founder) => (
              <div key={founder.name} className="rounded-sm border border-border bg-bg-alt p-10">
                <span className="font-display text-4xl text-gold">{founder.name}</span>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-bronze">
                  {founder.role}
                </p>
                <p className="mt-5 text-text-muted">{founder.bio}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-bronze">Why this exists</p>
            <h2 className="mt-4 font-display text-3xl text-text md:text-4xl">
              We&apos;ve watched good businesses lose good customers to bad timing.
            </h2>
            <p className="mt-6 text-text-muted">
              Not because the work wasn&apos;t good enough, but because the phone rang while someone
              was on a ladder, or a quote sat unanswered for a week while the job went to
              whoever replied first. Mark brings a decade of business strategy experience,
              ensuring every system actually impacts the bottom line rather than just looking
              clever. Jess leads AI development, building the technical architecture that makes
              it work seamlessly, without needing you to become technical yourself.
            </p>
            <p className="mt-4 text-text-muted">
              We&apos;re based in {site.location.locality}, {site.location.region}, working with
              independent businesses who want the benefits of AI without losing what makes their
              business theirs.
            </p>
            <div className="mt-8 flex flex-wrap gap-8 text-sm text-text-muted">
              <span>
                <span className="text-gold">{site.location.locality}</span> &middot; Est.{" "}
                {site.founded}
              </span>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <p className="text-xs uppercase tracking-[0.3em] text-bronze">How We Work</p>
          <h2 className="mt-4 max-w-lg font-display text-3xl text-text md:text-4xl">
            Two people, not a call centre of account managers.
          </h2>
          <p className="mt-4 max-w-2xl text-text-muted">
            Staying small was a deliberate choice, not a stage we&apos;re passing through on the
            way to something bigger. It&apos;s what lets both of us stay genuinely involved in
            every project, rather than the business growing past the point where that&apos;s
            possible.
          </p>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="font-display text-lg text-text">Business first, technology second</h3>
              <p className="mt-2 text-sm text-text-muted">
                Every project starts with a genuine question: what&apos;s actually costing you
                time or leads, rather than starting from what AI can technically do and looking
                for somewhere to apply it. Mark&apos;s background is business strategy, not sales,
                and it shapes how every proposal is written.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg text-text">Built properly, not bolted on</h3>
              <p className="mt-2 text-sm text-text-muted">
                Jess leads the technical build on every system personally. That means what you get
                is engineered around your business specifically, not a white-labelled tool with
                your logo added on top.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg text-text">Small enough to stay involved</h3>
              <p className="mt-2 text-sm text-text-muted">
                We&apos;ve deliberately kept the business small. That means every client works
                directly with the people building their system, from the first discovery call
                through to ongoing support, not handed off to whoever&apos;s free.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-bronze">Why Independent Businesses</p>
            <h2 className="mt-4 font-display text-3xl text-text md:text-4xl">
              The businesses with the least spare capacity have the most to gain.
            </h2>
            <p className="mt-6 text-text-muted">
              Large companies solve the missed-enquiry problem with headcount: bigger reception
              teams, dedicated call centres, shift cover around the clock. Independent and
              small businesses don&apos;t have that option, and shouldn&apos;t need to hire their
              way to a solution just to stop losing enquiries outside a narrow window of
              availability. That gap between what large companies can afford and what independent
              businesses need is exactly where we focus.
            </p>
            <p className="mt-4 text-text-muted">
              It also means we&apos;re building for owners who are directly affected by every
              decision, not a procurement team several layers removed from the actual work. Every
              proposal is written for the person who&apos;ll actually use the system day to day.
              See{" "}
              <Link href="/how-it-works" className="text-gold hover:underline">
                how it works
              </Link>{" "}
              for exactly what that process looks like.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-bronze">What We Don&apos;t Do</p>
            <h2 className="mt-4 font-display text-3xl text-text md:text-4xl">
              A shorter list, deliberately.
            </h2>
            <p className="mt-6 text-text-muted">
              We don&apos;t publish prices, because a price list can&apos;t reflect the real
              difference between a small quick win and a fully integrated system. See{" "}
              <Link href="/how-it-works" className="text-gold hover:underline">
                how pricing actually works
              </Link>
              . We don&apos;t sell every client the same package regardless of what they actually
              need. Some businesses need one small piece of automation and nothing more, and
              we&apos;ll say so rather than upselling. And we don&apos;t build systems we
              can&apos;t explain in plain terms. If we can&apos;t describe what something does
              and why in a way that makes sense to you, we don&apos;t think it belongs in your
              business. That&apos;s a slower way to grow than saying yes to everything, and
              we&apos;re fine with that trade-off.
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

      <CtaBand title="Want to see if this is a fit for your business?" />
    </>
  );
}
