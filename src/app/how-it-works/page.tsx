import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Container } from "@/components/Container";
import { faqSchema, jsonLdScript } from "@/lib/schema";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "From a first conversation to a system running quietly in the background of your day — exactly how we scope, build, and look after AI systems for trades and service businesses.",
  alternates: { canonical: "/how-it-works" },
};

const steps = [
  {
    n: "01",
    title: "Discovery Call",
    body: "We spend around an hour understanding your business properly: how enquiries reach you today, where they slip through the cracks, what a typical week looks like, and what a good outcome would actually mean for you. This isn't a sales pitch dressed up as a chat — it's a genuine look at where time and enquiries are being lost, so anything we propose afterwards is grounded in reality rather than guesswork. Most business owners come to this call knowing what's frustrating them day to day, not what the technical fix should be. That's fine — figuring out the right system is our job, not yours.",
  },
  {
    n: "02",
    title: "Bespoke Proposal",
    body: "You'll receive a written proposal built entirely around what came up on the call — never a template with your name dropped in. It sets out exactly what we'd build, how it fits around your existing website, phone number, and calendar, and what the build process would involve from your side (usually very little). If a smaller \"quick win\" makes more sense as a starting point than a full system, we'll say so — the goal is the right fit for where your business is now, not the biggest possible build.",
  },
  {
    n: "03",
    title: "Build & Integration",
    body: "Once you're happy to proceed, we build the system and integrate it into what you're already using — your existing website, your phone line, your calendar, your CRM if you have one. Nothing gets ripped out and replaced for the sake of it. You'll get regular check-ins as it comes together, so you always know what's happening and why — this is never a black box you hand over and hope for the best with. Most builds are live within days to a few weeks depending on scope and how much integration is involved.",
  },
  {
    n: "04",
    title: "Ongoing Partnership",
    body: "Once your system is live, the work doesn't stop there. We monitor how it's performing, refine the responses and logic as real conversations come in, and adjust as your business changes — new services, new seasons, new busy periods. An AI system that's left untouched after launch drifts out of date fast; ours are actively looked after, so they keep getting better rather than going stale.",
  },
];

const differentiators = [
  {
    title: "It's built around your business, not a template",
    body: "Generic chatbot plugins and website widgets are built to be generic — that's the whole point of them, and it's exactly why they read like generic chatbot plugins. They don't know your services, your coverage area, your booking process, or the specific questions your actual customers ask. What we build is trained specifically on your business from day one: your services, your tone, your policies, your team. A customer talking to your system should feel like they're talking to your business, not a piece of software bolted onto it.",
  },
  {
    title: "It works with what you've already got",
    body: "You don't need to rebuild your website, switch phone providers, or migrate your calendar to work with us. Systems are built to sit inside your existing setup — plugging into your current website, phone number, booking calendar, and CRM rather than asking you to replace any of it. If you're not using a CRM or booking system yet, we can set one up as part of the build, but it's never a requirement to get started.",
  },
  {
    title: "It's actively managed, not \"set and forget\"",
    body: "A lot of automation tools are sold as a one-time setup: configure it once, walk away. We don't build things that way. Every system we deliver is monitored and refined on an ongoing basis, because the way customers ask questions changes, your services change, and a system that isn't maintained gradually becomes less useful rather than more.",
  },
  {
    title: "You stay in control throughout",
    body: "You'll never be locked out of understanding how your own system works. Every proposal is written in plain terms, every build includes check-ins along the way, and you'll always know what the system can and can't do — including exactly when it hands a conversation over to a real person.",
  },
];

const faqs = [
  {
    question: "How does an AI receptionist actually work for a small business?",
    answer:
      "It sits on your website, WhatsApp, or phone line and answers enquiries the moment they come in — day or night — using information trained specifically on your business. It can answer common questions, capture a customer's details and the job they need done, and either book them directly into your calendar or pass their information straight to you, depending on how the system is set up.",
  },
  {
    question: "Will it sound robotic or obviously automated to my customers?",
    answer:
      "No — this is one of the most common worries and one of the easiest to put right. Every system is written in your business's actual tone, not a generic corporate voice, and it's tested on real questions before it ever goes live. Most customers simply experience it as getting a fast, helpful answer rather than clocking that they're talking to AI at all.",
  },
  {
    question: "What happens if the system can't answer a question?",
    answer:
      "It's built to recognise the limits of what it knows rather than guess. If a question falls outside what it's been trained on, it captures the enquiry and hands it straight to you or your team, rather than making something up. Accuracy matters more to us than the system appearing to know everything.",
  },
  {
    question: "Do I need to be technical or good with computers to use this?",
    answer:
      "No. The whole point is that it runs in the background without you needing to manage it day to day. Any changes or updates go through us, not through you learning a new piece of software.",
  },
  {
    question: "Will this replace my existing website?",
    answer: "No — it's built to work alongside your existing website, not replace it. The system integrates into the site you already have.",
  },
  {
    question: "What if I already use a CRM or booking software?",
    answer:
      "Even better — we integrate with what's already working for you rather than asking you to switch to something new. If you don't have one in place yet, we can set one up as part of the build, but it's never a requirement.",
  },
  {
    question: "Does it work outside normal business hours?",
    answer:
      "Yes — that's usually the biggest single source of missed opportunity we see. Evening and weekend enquiries are answered the moment they come in, rather than sitting unanswered until you're next at your desk.",
  },
  {
    question: "Can it handle bookings directly, or does it just take messages?",
    answer:
      "Both are possible, and which one's right depends on your business. Some systems capture the enquiry and send you the details to follow up on; others can check availability and book a customer directly into your calendar. We'll recommend the right approach for how you currently manage bookings.",
  },
  {
    question: "Is my customers' data handled securely?",
    answer:
      "Yes. Systems are built with data handling in line with UK data protection requirements, and customer information is only ever used to serve your business — never sold on or shared with third parties.",
  },
  {
    question: "How is this different from a chatbot plugin I could add myself?",
    answer:
      "Off-the-shelf chatbot plugins are generic by design — they don't know your services, your coverage area, or how your business actually operates, and getting them to sound right usually means hours of manual configuration on your end. What we build is scoped to your business from the first conversation and integrated by us, not configured by you.",
  },
  {
    question: "Can I pause or turn off the system if I need to?",
    answer: "Yes, at any time. It's your system running for your business — you're never locked into something you can't step back from.",
  },
  {
    question: "Do I need to know exactly what I want before the discovery call?",
    answer:
      "No. Most people arrive at the call knowing what's frustrating about how enquiries are currently handled, not what the technical solution should look like — figuring that part out is exactly what the call is for.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How It Works"
        title="From first call to running on autopilot."
        dek="We build the systems that answer, book, and follow up — so no enquiry to your business ever goes quiet again. Here's exactly how it works, from the first conversation to a system running in the background of your day."
        breadcrumbs={[{ name: "How It Works", href: "/how-it-works" }]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqSchema(faqs))} />

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <div className="max-w-3xl space-y-5 text-text-muted">
            <p>
              Most independent trades and service businesses lose work not because of bad reviews
              or bad pricing, but because of silence. A call rings out during a job. A website
              enquiry sits in an inbox until Thursday. A customer messages on WhatsApp at 9pm and
              gets an answer three days later, by which point they&apos;ve booked someone else.
              None of that is a people problem — it&apos;s a systems problem, and it&apos;s
              exactly what we build to fix.
            </p>
            <p>
              Quantum AI Business Consultants designs and builds AI-powered systems for
              independent trades and service businesses across Northern Ireland — plumbers,
              electricians, roofers, salons, garages, and professional services who are busy
              doing the actual work and don&apos;t have the time, or the desire, to sit answering
              the same questions over and over. We handle the{" "}
              <Link href="/services/enquiries-and-leads" className="text-gold hover:underline">
                enquiries
              </Link>
              , the{" "}
              <Link href="/services/bookings-and-scheduling" className="text-gold hover:underline">
                bookings
              </Link>
              , the{" "}
              <Link href="/services/follow-ups-and-nurture" className="text-gold hover:underline">
                follow-ups
              </Link>
              , and the{" "}
              <Link href="/services/admin-and-back-office" className="text-gold hover:underline">
                admin
              </Link>{" "}
              that eat into evenings and weekends, using AI that&apos;s trained specifically on
              your business — not a generic script.
            </p>
            <p>
              This isn&apos;t off-the-shelf chatbot software you configure yourself. Every system
              we build is scoped, written, and integrated around how your business actually runs:
              your services, your areas, your tone, your existing tools. The process below is how
              we get from a first conversation to a system that&apos;s quietly doing the work in
              the background of your day.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <p className="text-xs uppercase tracking-[0.3em] text-bronze">The Process</p>
          <div className="mt-8 grid gap-12 md:grid-cols-2 md:gap-16">
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
          <p className="text-xs uppercase tracking-[0.3em] text-bronze">What Makes This Different</p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl text-text md:text-4xl">
            Not a chatbot plugin. A system built around your business.
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-2">
            {differentiators.map((item) => (
              <div key={item.title} className="bg-bg-alt p-8">
                <h3 className="font-display text-xl text-text">{item.title}</h3>
                <p className="mt-3 text-text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-bronze">Who This Is For</p>
            <h2 className="mt-4 font-display text-3xl text-text md:text-4xl">
              Built for busy independent businesses, not enterprise call centres.
            </h2>
            <p className="mt-6 text-text-muted">
              We work primarily with independent trades and service businesses across Northern
              Ireland —{" "}
              <Link href="/industries/trades" className="text-gold hover:underline">
                roofers, plumbers, electricians, joiners, and other tradespeople
              </Link>
              , along with{" "}
              <Link href="/industries/salons-and-personal-care" className="text-gold hover:underline">
                salons
              </Link>
              ,{" "}
              <Link href="/industries/automotive-services" className="text-gold hover:underline">
                garages
              </Link>
              ,{" "}
              <Link href="/industries/home-and-property-services" className="text-gold hover:underline">
                home and property services
              </Link>
              , and{" "}
              <Link href="/industries/professional-services" className="text-gold hover:underline">
                professional services
              </Link>{" "}
              firms. What connects these businesses isn&apos;t size, it&apos;s a shared problem:
              enquiries come in at all hours, through multiple channels — phone, website,
              WhatsApp, social media — and no single busy owner or small team can realistically
              catch every one of them in time. If that sounds familiar, this is built for you.
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
