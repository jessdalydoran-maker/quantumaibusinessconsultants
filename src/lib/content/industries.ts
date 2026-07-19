import type { Faq } from "./services";

export type Industry = {
  slug: string;
  name: string;
  dek: string;
  summary: string;
  scenarios: string[];
  faqs: Faq[];
  relatedCaseStudy?: string;
};

export const industries: Industry[] = [
  {
    slug: "trades",
    name: "Trades",
    dek: "Electricians, plumbers, builders, and heating engineers — for whom every unanswered call is a job that went to someone else.",
    summary:
      "When you're up a ladder or under a floor, you can't answer the phone. We build systems that answer it for you, book the callout, and follow up on the quote you sent last week.",
    scenarios: [
      "A caller with a burst pipe gets an answer and a booked emergency slot, even if you're mid-job",
      "Quotes for bigger work get chased automatically instead of going cold",
      "Job reminders go out the day before, cutting the wasted trips to empty properties",
    ],
    faqs: [
      {
        question: "Can it tell the difference between an emergency and a routine enquiry?",
        answer:
          "Yes — this is one of the first things we scope. Emergency call-outs get routed and escalated differently to a routine quote request.",
      },
      {
        question: "I'm often on-site with no signal. Does that break anything?",
        answer:
          "No — the whole point is that the system runs independently of you being reachable in the moment. You catch up on bookings and messages when you're back online.",
      },
    ],
  },
  {
    slug: "home-and-property-services",
    name: "Home & Property Services",
    dek: "Cleaning, landscaping, and property maintenance businesses juggling recurring schedules and one-off jobs at once.",
    summary:
      "Recurring clients need reliable reminders; one-off enquiries need a fast reply. We build systems that handle both without you managing two separate processes by hand.",
    scenarios: [
      "Recurring cleaning or garden visits confirmed and rescheduled automatically",
      "One-off enquiries answered and quoted the same day, not the same week",
      "Automated review requests after a job, building your reputation without extra effort",
    ],
    faqs: [
      {
        question: "We have recurring and one-off customers on completely different schedules — can the system handle both?",
        answer:
          "Yes. This is a standard part of scoping: recurring and one-off work almost always need different rules, and we build to that rather than forcing one flow to fit both.",
      },
    ],
  },
  {
    slug: "salons-and-personal-care",
    name: "Salons & Personal Care",
    dek: "Hair, beauty, and wellness businesses where a missed booking call is a missed chair-hour that can't be recovered.",
    summary:
      "An empty appointment slot is gone the moment it passes. We build booking and reminder systems that keep chairs full and no-shows rare.",
    scenarios: [
      "Online booking that reflects real stylist or therapist availability",
      "Reminder texts that measurably cut no-shows on a tight daily schedule",
      "Waitlist follow-up that fills a last-minute cancellation instead of leaving it empty",
    ],
    faqs: [
      {
        question: "Can different staff have different services and availability?",
        answer:
          "Yes — this is built around your actual team and service menu, not a single shared calendar.",
      },
    ],
  },
  {
    slug: "automotive-services",
    name: "Automotive Services",
    dek: "Garages and MOT centres balancing walk-ins, bookings, and parts logistics with a phone that never stops ringing.",
    summary:
      "Between diagnostics, walk-ins, and the phone ringing, booking calls are the first thing to get delayed. We build systems that take the call while you keep working on the car in front of you.",
    scenarios: [
      "MOT and service bookings taken and confirmed without pulling you off the ramp",
      "Status updates sent automatically so customers stop calling to ask if it's ready",
      "Review requests sent the moment a job's marked collected",
    ],
    faqs: [
      {
        question: "Can it handle bookings that depend on parts availability?",
        answer:
          "We scope this specifically — where a booking depends on a part being in stock, we build the confirmation logic around that rather than promising a slot that can't be kept.",
      },
    ],
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    dek: "Accountants, solicitors, and consultants for whom a slow first reply undermines the professionalism the rest of the business relies on.",
    summary:
      "Clients judge responsiveness as a proxy for competence. We build enquiry handling and follow-up that reflects the standard you hold the rest of your work to.",
    scenarios: [
      "New enquiries acknowledged immediately and routed to the right person",
      "Consultation bookings handled without back-and-forth email threads",
      "Follow-up on proposals sent out, so nothing is left to be forgotten",
    ],
    faqs: [
      {
        question: "Our enquiries often involve sensitive information. How is that handled?",
        answer:
          "Data handling is scoped explicitly for professional services clients, including what's captured, where it's stored, and who can access it. See our privacy approach for the general framework.",
      },
    ],
  },
];

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}
