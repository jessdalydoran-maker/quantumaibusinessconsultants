export type Faq = { question: string; answer: string };

export type Service = {
  slug: string;
  name: string;
  dek: string;
  summary: string;
  problem: string;
  whatItCovers: string[];
  quickWin: { title: string; description: string };
  bespoke: { title: string; description: string };
  faqs: Faq[];
};

export const services: Service[] = [
  {
    slug: "enquiries-and-leads",
    name: "Enquiries & Leads",
    dek: "Every call, message, and web enquiry answered the moment it arrives — not whenever you next get a free minute.",
    summary:
      "An AI system that picks up the phone, replies to web chat, and responds to messages in real time, so a missed call never becomes a missed job.",
    problem:
      "Independent businesses lose work not because they're bad at it, but because they're busy doing it. A call goes unanswered mid-job, a web enquiry sits for a day, and the customer books with whoever replied first.",
    whatItCovers: [
      "AI voice receptionist answering inbound calls 24/7, in your business's own tone",
      "Website chat that qualifies enquiries and books straight into your calendar",
      "Missed-call text-back so nobody who calls you ever hears silence",
      "Smart routing and escalation to a real person for anything the system shouldn't handle alone",
    ],
    quickWin: {
      title: "Missed-call text-back",
      description:
        "The simplest version: every missed call gets an instant, on-brand text reply within seconds. No build required beyond connecting your existing number.",
    },
    bespoke: {
      title: "Full AI voice receptionist",
      description:
        "A phone system that can hold a real conversation, understand what the caller needs, check availability, and book the job — built around your specific services and how you actually price and schedule work.",
    },
    faqs: [
      {
        question: "Will callers know they're talking to an AI?",
        answer:
          "We're upfront about it where it matters — most systems introduce themselves clearly, and every caller can ask for a human at any point. We design the handoff rules with you, not around you.",
      },
      {
        question: "What happens if the AI can't answer a question?",
        answer:
          "It escalates. Every system we build has clear rules for when to hand off to you or a team member, rather than guessing or making something up.",
      },
      {
        question: "Do I need new phone hardware?",
        answer:
          "Usually not. Most systems integrate with the number you already have. If a dedicated line makes sense for your setup, we'll talk you through it during scoping.",
      },
    ],
  },
  {
    slug: "bookings-and-scheduling",
    name: "Bookings & Scheduling",
    dek: "A calendar that fills itself, reminds people to actually turn up, and stops double-bookings before they happen.",
    summary:
      "Automated booking and reminders that sit on top of how you already schedule work, cutting no-shows and the back-and-forth of finding a time that suits everyone.",
    problem:
      "Booking by phone tag or text thread works until you're busy — then it's the first thing to slip, and a full afternoon of back-and-forth costs more than the job is worth.",
    whatItCovers: [
      "Online booking that reflects your real availability, not a generic calendar widget",
      "Automated confirmation and reminder messages that measurably cut no-shows",
      "Rescheduling handled without a phone call, on your terms",
      "Calendar sync across however your team already works",
    ],
    quickWin: {
      title: "Automated reminders",
      description:
        "Confirmation and reminder texts added to your existing booking process — a same-week change that reduces no-shows immediately.",
    },
    bespoke: {
      title: "End-to-end booking system",
      description:
        "A booking flow built around your actual services — different durations, different staff, different locations — with rules that match how the job really works, not a one-size-fits-all form.",
    },
    faqs: [
      {
        question: "Can it handle different appointment types and durations?",
        answer:
          "Yes — this is exactly what 'bespoke' means here. We build the logic around your real service list, not a generic 30-minute-slot template.",
      },
      {
        question: "What if I already use a booking tool?",
        answer:
          "We usually work with what you have rather than ripping it out. Automation and reminders can often be layered on top of your existing system.",
      },
    ],
  },
  {
    slug: "follow-ups-and-nurture",
    name: "Follow-Ups & Nurture",
    dek: "The quote that never got chased, the review that was never asked for — handled automatically, every time.",
    summary:
      "Automated follow-up across email, SMS, and WhatsApp that keeps warm enquiries warm and turns finished jobs into reviews, without you having to remember to do it.",
    problem:
      "Following up takes discipline and time — two things in short supply after a full day of actual work. Quotes go cold, and happy customers who'd gladly leave a review are never asked.",
    whatItCovers: [
      "Automatic follow-up on open quotes and enquiries, timed sensibly, not spammy",
      "Post-job review requests sent at the moment satisfaction is highest",
      "WhatsApp and SMS automation for the channels your customers actually use",
      "A simple view of what's been followed up and what hasn't",
    ],
    quickWin: {
      title: "Automated review requests",
      description:
        "A single automation triggered when a job's marked complete: a well-timed, personal-feeling request for a Google review. Low effort, compounding return.",
    },
    bespoke: {
      title: "Full nurture sequence",
      description:
        "A tailored sequence across quotes, bookings, and post-job follow-up, written in your voice and matched to how long your sales cycle actually takes.",
    },
    faqs: [
      {
        question: "Won't automated messages feel impersonal?",
        answer:
          "Only if they're written badly. We write every sequence in your business's actual voice, and set sensible limits on frequency so it never feels like spam.",
      },
      {
        question: "Can it integrate with WhatsApp?",
        answer:
          "Yes, where relevant to your customers — we'll assess during scoping whether WhatsApp, SMS, email, or a mix makes sense for your audience.",
      },
    ],
  },
  {
    slug: "admin-and-back-office",
    name: "Admin & Back-Office",
    dek: "Notes, records, and reporting that keep themselves up to date, so nothing depends on remembering to write it down later.",
    summary:
      "A system of record that captures every enquiry, call, and booking automatically, plus simple reporting so you can see what's actually happening in the business without digging for it.",
    problem:
      "The admin that keeps a business running — logging enquiries, updating records, pulling together what happened this month — is exactly the work that gets pushed to 'later' and then never quite gets done.",
    whatItCovers: [
      "Every enquiry, call, and booking logged automatically in one place",
      "Call summaries and notes captured without anyone typing them up",
      "Simple monthly reporting on what's coming in and what's converting",
      "A unified inbox so nothing lives in three different apps",
    ],
    quickWin: {
      title: "Automatic call and enquiry logging",
      description:
        "Every interaction captured and organised automatically — the foundation the rest of your systems build on, and useful on its own from day one.",
    },
    bespoke: {
      title: "Full CRM and reporting build",
      description:
        "A client record system and monthly reporting dashboard built around the fields and metrics that actually matter to your business, not a generic CRM template.",
    },
    faqs: [
      {
        question: "Do I need to learn a new piece of software?",
        answer:
          "We aim to minimise this. Where possible, we work with tools you already use; where a new system genuinely serves you better, we keep the interface as simple as the job requires — no unnecessary complexity.",
      },
      {
        question: "Who can see the data that's collected?",
        answer:
          "You control access. We set this up during scoping and document it clearly — see our privacy approach for more on how customer data is handled.",
      },
    ],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
