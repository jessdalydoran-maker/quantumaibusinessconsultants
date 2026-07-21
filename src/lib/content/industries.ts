import type { Faq } from "./services";

export type Scenario = { title: string; description: string };

export type Industry = {
  slug: string;
  name: string;
  dek: string;
  summary: string;
  intro: string[];
  dayInTheLife: string;
  scenarios: Scenario[];
  relatedServices: string[];
  faqs: Faq[];
};

export const industries: Industry[] = [
  {
    slug: "trades",
    name: "Trades",
    dek: "Electricians, plumbers, builders, and heating engineers, for whom every unanswered call is a job that went to someone else.",
    summary:
      "When you cannot answer the phone up a ladder or under a floor, we can. We book the callout and follow up on last week's quote for you.",
    intro: [
      "Trades work doesn't pause for the phone. You're mid-rewire, mid-install, or elbow-deep in a boiler when the call comes in, and by the time you're free to check who rang, they've often already called the next name on the list. It's not a reflection of how good the work is, it's just physics. You can't be on a job and on a call at the same time.",
      "The same pattern shows up around quotes. A customer gets three call-outs for the same kitchen rewire, and the job usually goes to whoever got back to them first and made booking easy, not necessarily whoever would have done the best job. Being genuinely excellent at the trade itself doesn't protect against losing work to slower response times.",
      "We build systems specifically for how trades businesses actually operate: unpredictable days, jobs that run over, emergency call-outs mixed in with planned work, and a phone that needs answering even when both your hands are full.",
      "This applies whether you're a sole trader with a single van or a small team running several jobs a day. The scale changes what's worth automating first, but the underlying pattern, good work undermined by gaps in coverage rather than by the quality of the work itself, shows up at every size of trades business we've worked with.",
    ],
    dayInTheLife: "A typical day for a one- or two-van operation involves being on tools for six, seven, eight hours, with the phone ringing throughout — some calls routine, some urgent, most arriving at exactly the wrong moment to answer properly. Without a system, that means either stopping work to take the call (and the job in front of you slows down) or letting it ring out (and the job on the other end of the phone goes elsewhere). Neither is a good trade-off, and it's one that a well-built AI system removes rather than manages.",
    scenarios: [
      {
        title: "Emergency call-outs handled properly",
        description:
          "A caller with a burst pipe gets an answer and a booked emergency slot, even if you're mid-job, with urgency recognised and routed differently to a routine enquiry.",
      },
      {
        title: "Quotes that don't go cold",
        description:
          "Quotes for bigger work get chased automatically instead of sitting in a sent-items folder until the customer books with someone else.",
      },
      {
        title: "Fewer wasted trips",
        description:
          "Job reminders go out the day before, cutting the wasted trips to properties where nobody's in or the job's been forgotten about.",
      },
      {
        title: "A record of every call",
        description:
          "Every enquiry is logged automatically, so a customer who calls back next month about a different job doesn't have to explain their address and history again from scratch.",
      },
    ],
    relatedServices: ["enquiries-and-leads", "follow-ups-and-nurture", "bookings-and-scheduling"],
    faqs: [
      {
        question: "Can it tell the difference between an emergency and a routine enquiry?",
        answer:
          "Yes, this is one of the first things we scope. Emergency call-outs get routed and escalated differently to a routine quote request.",
      },
      {
        question: "I'm often on-site with no signal. Does that break anything?",
        answer:
          "No, the whole point is that the system runs independently of you being reachable in the moment. You catch up on bookings and messages when you're back online.",
      },
      {
        question: "Can it give out an actual quote over the phone?",
        answer:
          "Only for the kind of standard, well-defined jobs you're comfortable pricing without seeing the site first. Anything that needs a look before pricing gets captured and booked in as a call-out or site visit instead.",
      },
      {
        question: "What if a customer wants to negotiate on price during the call?",
        answer:
          "That's exactly the kind of conversation that gets escalated to you rather than handled automatically. The system is built to recognise when a judgement call is needed, not to negotiate on your behalf.",
      },
      {
        question: "Does this work for a one-person operation, or only bigger trades businesses?",
        answer:
          "It works for both, and arguably matters most for a one- or two-person operation, where there's nobody else to catch the calls you can't take yourself.",
      },
      {
        question: "Can it cover multiple trades if we do a bit of everything?",
        answer:
          "Yes, during scoping we'll map out your actual service list, however broad, so the system can answer accurately across everything you cover rather than just one specialism.",
      },
    ],
  },
  {
    slug: "home-and-property-services",
    name: "Home & Property Services",
    dek: "Cleaning, landscaping, and property maintenance businesses juggling recurring schedules and one-off jobs at once.",
    summary:
      "Recurring clients need reliable reminders; one-off enquiries need a fast reply. We handle both without a second manual process.",
    intro: [
      "Home and property services businesses run two different rhythms at once. There's the recurring side — the same client, the same visit, week after week or month after month — and there's the one-off side: a new enquiry that needs a fast reply before it goes cold. Managing both well, by hand, usually means one of them slips.",
      "Recurring clients are usually the easier half to under-serve, precisely because they feel low-risk. A missed reminder here and there doesn't feel urgent in the moment, but it adds up to rescheduling, awkward doorstep conversations, and the occasional client who quietly stops rebooking because it started to feel unreliable.",
      "One-off enquiries carry the opposite risk: they're time-sensitive and easy to lose entirely if they're not answered quickly. A property owner comparing three cleaning or landscaping companies will often book with whichever one replies first and makes the process easiest, regardless of who does the better job.",
      "The businesses that manage this well tend to have some system in place, formal or not, for keeping the two rhythms separate rather than trying to run them off the same notebook or memory. Our approach is to make that separation explicit and automatic, rather than something that depends on someone staying organised on a busy week.",
    ],
    dayInTheLife: "A property services business with a recurring client base is often juggling a full day of scheduled visits with new enquiries arriving throughout — a mix that makes it genuinely difficult to give both the attention they need without a system doing some of the coordination in the background. Recurring visits need confirming and reminding; new enquiries need answering and quoting, often on the same afternoon they come in, before the moment passes.",
    scenarios: [
      {
        title: "Recurring visits that confirm themselves",
        description: "Recurring cleaning or garden visits confirmed and rescheduled automatically, without a phone call each time.",
      },
      {
        title: "Same-day replies to new enquiries",
        description: "One-off enquiries answered and quoted the same day, not the same week, while the customer is still comparing options.",
      },
      {
        title: "Reviews that build your reputation",
        description: "Automated review requests after a job, building your reputation without it depending on someone remembering to ask.",
      },
      {
        title: "One schedule, not two systems",
        description: "Recurring and one-off work managed from the same system, rather than a diary for regulars and a separate notebook for new enquiries.",
      },
    ],
    relatedServices: ["bookings-and-scheduling", "follow-ups-and-nurture", "enquiries-and-leads"],
    faqs: [
      {
        question: "We have recurring and one-off customers on completely different schedules. Can the system handle both?",
        answer:
          "Yes. This is a standard part of scoping: recurring and one-off work almost always need different rules, and we build to that rather than forcing one flow to fit both.",
      },
      {
        question: "Can it handle a client who wants to skip a week or change their regular time?",
        answer:
          "Yes, recurring bookings can be adjusted within the rules you set, without every change needing to go through a phone call.",
      },
      {
        question: "How does it quote for jobs that vary a lot, like garden size or property condition?",
        answer:
          "For jobs that genuinely need to be seen before pricing, the system captures the details and books a site visit or call-back rather than guessing at a price. Accuracy matters more than speed here.",
      },
      {
        question: "Will regular clients notice a change in how they're contacted?",
        answer:
          "The aim is that it feels like a smoother version of what they already get — clearer reminders, easier rescheduling — written in your business's tone rather than a generic automated feel.",
      },
      {
        question: "Can it manage a team of multiple cleaners or landscapers with different rounds?",
        answer:
          "Yes, this is scoped around your actual team structure and rounds, so the system reflects who's actually doing which job on which day.",
      },
    ],
  },
  {
    slug: "salons-and-personal-care",
    name: "Salons & Personal Care",
    dek: "Hair, beauty, and wellness businesses where a missed booking call is a missed chair-hour that can't be recovered.",
    summary:
      "An empty appointment slot is gone the moment it passes. We build booking and reminder systems that keep chairs full and no-shows rare.",
    intro: [
      "A salon or personal care business sells time in a way most other businesses don't. A 2pm slot that goes unbooked, or a client who doesn't show, isn't lost revenue you can recover later, it's simply gone. There's no way to sell that hour again once it's passed.",
      "That makes two things unusually important: getting the booking in the first place, and making sure the person who booked actually turns up. Both are areas where a phone that isn't always answered, or a reminder that doesn't always get sent, costs real, specific money, not a vague, hard-to-measure opportunity cost.",
      "We build booking systems specifically around this reality: real availability per stylist or therapist, reminders that are actually sent every time rather than when someone remembers, and a waitlist that fills a late cancellation instead of leaving the chair empty.",
      "This matters just as much for a solo practitioner renting a single chair as it does for a multi-stylist salon with a full front-of-house team — the maths of an empty slot is the same either way, and in a smaller operation there's often even less spare capacity to catch what a booking system would catch automatically.",
    ],
    dayInTheLife: "A busy salon day means staff are with clients back-to-back, which is exactly when the phone is hardest to answer — the same problem trades businesses have, just with less flexibility to call back later, because the caller wanted a slot for tonight or tomorrow, not whenever someone gets a free minute. A booking system that runs independently of staff availability removes that conflict entirely.",
    scenarios: [
      {
        title: "Real-time availability, not a generic calendar",
        description: "Online booking that reflects real stylist or therapist availability, not a shared calendar that doesn't match who's actually free.",
      },
      {
        title: "Reminders that actually go out",
        description: "Reminder texts that measurably cut no-shows on a tight daily schedule, sent automatically rather than depending on front desk staff remembering.",
      },
      {
        title: "Waitlists that fill themselves",
        description: "Waitlist follow-up that fills a last-minute cancellation instead of leaving it empty, by reaching out to clients who wanted an earlier slot.",
      },
      {
        title: "Repeat bookings made easy",
        description: "Clients due a repeat visit, a colour top-up or maintenance treatment, can be prompted to rebook automatically rather than relying on them to remember.",
      },
    ],
    relatedServices: ["bookings-and-scheduling", "follow-ups-and-nurture", "enquiries-and-leads"],
    faqs: [
      {
        question: "Can different staff have different services and availability?",
        answer:
          "Yes, this is built around your actual team and service menu, not a single shared calendar.",
      },
      {
        question: "How does it handle deposits for bookings?",
        answer:
          "If you take deposits to reduce no-shows, this can be built into the booking flow, in line with however you currently handle payments and cancellations.",
      },
      {
        question: "Can it recommend the right treatment length automatically?",
        answer:
          "Yes, each service is set up with its real duration, so a colour appointment and a quick trim aren't treated as the same length slot.",
      },
      {
        question: "What happens with a client who repeatedly no-shows?",
        answer:
          "That's a policy decision for you, not something the system decides on its own. We'll build in whatever approach you already take, whether that's a reminder, a deposit requirement, or something else.",
      },
      {
        question: "Will it work alongside the booking software we already use, like Fresha or Treatwell?",
        answer:
          "In many cases, yes. We'll assess your existing setup during scoping and look at what can be layered on top versus what would need to change.",
      },
      {
        question: "Can it help fill gaps in a quiet week, not just prevent no-shows?",
        answer:
          "Yes, the same waitlist and rebooking logic that fills last-minute cancellations can be used to reach out to clients due a repeat visit during a quieter period, turning empty slots into booked ones proactively rather than just reactively.",
      },
    ],
  },
  {
    slug: "automotive-services",
    name: "Automotive Services",
    dek: "Garages and MOT centres balancing walk-ins, bookings, and parts logistics with a phone that never stops ringing.",
    summary:
      "Between diagnostics and walk-ins, booking calls are the first thing to get delayed. We take the call while you work on the car.",
    intro: [
      "A garage phone rings constantly, and answering it usually means stepping away from a car that's up on the ramp or mid-diagnostic — work that doesn't pause cleanly the way a desk job does. Every call answered is a few minutes not spent on the vehicle in front of you; every call missed is a booking that might go to the garage down the road instead.",
      "MOT and service bookings are time-sensitive in a way that adds pressure: a customer whose MOT is due this week isn't going to wait around for a call back, they'll ring the next garage on the list. And once a car's in for one job, customers understandably want updates — is it ready, has the part come in — which means more calls on top of the booking calls.",
      "We build systems that take the booking calls and the status-update calls off your hands, so the ramp stays the priority and the phone stops being a second job on top of the mechanical one.",
      "This isn't about replacing the trust customers place in a good local garage. If anything, it protects it. A customer who gets a clear, prompt update without having to chase one usually comes away with more confidence in the business, not less, regardless of who or what sent the message.",
    ],
    dayInTheLife: "On a normal day, a small garage is running diagnostics, working through booked services, handling walk-in enquiries, and fielding calls from customers wanting updates — often with one or two people covering all of it. Every call taken is time off the tools; every call missed is a booking or a frustrated existing customer. An AI system that handles booking and routine status updates directly removes a genuine daily bottleneck, not a hypothetical one.",
    scenarios: [
      {
        title: "Bookings taken without leaving the ramp",
        description: "MOT and service bookings taken and confirmed without pulling you off the car you're working on.",
      },
      {
        title: "Fewer \"is it ready\" calls",
        description: "Status updates sent automatically so customers stop calling to ask if their car is ready, freeing up the phone for new bookings.",
      },
      {
        title: "Reviews collected at collection",
        description: "Review requests sent the moment a job's marked collected, when the customer's just got their car back and satisfaction is highest.",
      },
      {
        title: "MOT reminders that bring customers back",
        description: "Customers can be reminded automatically when their next MOT or service is due, rather than it depending on them remembering.",
      },
    ],
    relatedServices: ["bookings-and-scheduling", "admin-and-back-office", "follow-ups-and-nurture"],
    faqs: [
      {
        question: "Can it handle bookings that depend on parts availability?",
        answer:
          "We scope this specifically. Where a booking depends on a part being in stock, we build the confirmation logic around that rather than promising a slot that can't be kept.",
      },
      {
        question: "Can it give customers a rough estimate over the phone?",
        answer:
          "For standard, well-defined jobs, yes. Anything that genuinely needs the car looked at first gets booked in as a diagnostic rather than an estimate being guessed at over the phone.",
      },
      {
        question: "Will it reduce the number of \"is it ready\" calls we get?",
        answer:
          "That's usually the point of the automated status update feature: customers who'd otherwise call to check are updated automatically instead, which noticeably cuts that category of call.",
      },
      {
        question: "Can it manage bookings across multiple bays or technicians?",
        answer:
          "Yes, this is built around your actual capacity, so bookings reflect how many vehicles you can genuinely take on a given day, not an arbitrary limit.",
      },
      {
        question: "Does it work for walk-in-heavy garages, or only ones that take bookings?",
        answer:
          "It works for both. For walk-in-heavy operations, the bigger win is often the missed-call and enquiry handling rather than the booking calendar itself, and we'll recommend the right starting point during scoping.",
      },
    ],
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    dek: "Accountants, solicitors, and consultants for whom a slow first reply undermines the professionalism the rest of the business relies on.",
    summary:
      "Clients judge responsiveness as a proxy for competence. We build enquiry handling and follow-up that reflects the standard you hold the rest of your work to.",
    intro: [
      "In professional services, how quickly and clearly you respond to a first enquiry says something to a prospective client about how you'll handle their actual work. A slow, vague first reply undermines trust before the relationship has even started, regardless of how good the work itself would be.",
      "The irony is that professional services firms are often the most careful, detail-oriented businesses out there in the work itself, and the least resourced to handle the volume of routine first-contact enquiries and admin that responsiveness requires. A solicitor or accountant's time is genuinely expensive to spend answering the same three intake questions repeatedly.",
      "We build enquiry handling and follow-up systems that reflect the same standard of care professional services firms apply to client work: accurate, clearly worded, and properly routed to the right person, rather than a generic contact form that goes quiet for days.",
      "This matters at every scale, from a sole practitioner accountant to a multi-partner firm. A smaller practice often has even less spare capacity for intake admin between billable work, which makes the case for automating the repetitive parts of first contact just as strong — sometimes stronger — than it is for a larger firm with dedicated support staff.",
    ],
    dayInTheLife: "A professional services firm's day is usually split between deep, billable client work and the surrounding admin of new enquiries, consultation bookings, and proposal follow-up — work that competes directly with the billable hours it's meant to lead to. Every hour spent on intake admin is an hour not spent on paying client work, which makes automating the repetitive parts of intake a direct efficiency gain, not just a convenience.",
    scenarios: [
      {
        title: "New enquiries acknowledged immediately",
        description: "New enquiries acknowledged immediately and routed to the right person, rather than sitting in a shared inbox until someone has time.",
      },
      {
        title: "Consultation bookings without the email thread",
        description: "Consultation bookings handled without back-and-forth email threads trying to find a mutually free half hour.",
      },
      {
        title: "Proposals that get followed up",
        description: "Follow-up on proposals sent out, so nothing is left to be forgotten while a prospective client quietly decides to go elsewhere.",
      },
      {
        title: "Consistent first-contact information",
        description: "Every enquiry gets the same accurate answer to common questions, regardless of who, or what, picks it up first.",
      },
    ],
    relatedServices: ["enquiries-and-leads", "follow-ups-and-nurture", "admin-and-back-office"],
    faqs: [
      {
        question: "Our enquiries often involve sensitive information. How is that handled?",
        answer:
          "Data handling is scoped explicitly for professional services clients, including what's captured, where it's stored, and who can access it. See our privacy approach for the general framework.",
      },
      {
        question: "Can it screen enquiries so we're not spending time on ones we can't take on?",
        answer:
          "Yes, if there are common reasons an enquiry isn't a fit (conflict of interest, outside your specialism, below a certain scale), the system can be set up to recognise and flag those early, saving a wasted consultation.",
      },
      {
        question: "Will it give legal or financial advice to enquirers?",
        answer:
          "No. It handles intake, routing, scheduling, and general information about your services, never advice specific to a client's situation. That judgement always stays with you.",
      },
      {
        question: "Can it route enquiries to specific partners or specialists within the firm?",
        answer:
          "Yes, based on whatever routing logic makes sense for your firm: by specialism, by existing client relationship, or by availability.",
      },
      {
        question: "How does this affect client confidentiality?",
        answer:
          "Confidentiality requirements are built into the scope from the start, including what information the system is and isn't permitted to capture or discuss before a formal engagement begins.",
      },
      {
        question: "Can it handle enquiries in different practice areas differently?",
        answer:
          "Yes, a firm covering, say, both conveyancing and family law typically needs different intake questions and routing for each, and the system is scoped around each practice area separately rather than treating every enquiry identically.",
      },
    ],
  },
];

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}
