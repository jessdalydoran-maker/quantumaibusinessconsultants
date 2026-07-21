export type Faq = { question: string; answer: string };

export type CoverItem = { title: string; description: string };
export type ProcessStep = { title: string; body: string };

export type Service = {
  slug: string;
  name: string;
  dek: string;
  summary: string;
  intro: string[];
  signs: string[];
  howItWorks: ProcessStep[];
  whatItCovers: CoverItem[];
  quickWin: { title: string; description: string };
  bespoke: { title: string; description: string };
  relatedIndustries: string[];
  faqs: Faq[];
};

export const services: Service[] = [
  {
    slug: "enquiries-and-leads",
    name: "Enquiries & Leads",
    dek: "Every call, message, and web enquiry answered the moment it arrives, not whenever you next get a free minute.",
    summary:
      "An AI system that picks up the phone, replies to web chat, and responds to messages in real time, so a missed call never becomes a missed job.",
    intro: [
      "Independent businesses lose work not because they're bad at it, but because they're busy doing it. A call goes unanswered mid-job, a web enquiry sits for a day, and the customer books with whoever replied first. It's rarely a competence problem. It's a timing problem, and timing is exactly what an unattended phone or inbox gets wrong.",
      "Think about what actually happens on a normal Tuesday. You're up a ladder, under a sink, or mid-consultation with a customer in front of you, and the phone rings. You can't answer it, not because you don't want the work, but because you're physically doing the work someone else is calling about. That caller doesn't know that. They just hear it ring out, and more often than not, they call the next name on the list.",
      "An enquiries and leads system removes the timing problem entirely. It doesn't get busy, it doesn't clock off, and it doesn't need a break, so the business doesn't lose the enquiry just because the person running it was doing exactly what they should have been doing.",
    ],
    signs: [
      "You regularly notice missed calls on your phone that you never got round to returning",
      "Web enquiries sometimes sit for a day or two before anyone replies",
      "You've lost a job before to someone who \"just got back to me quicker\"",
      "Evenings and weekends are when enquiries pile up unanswered",
      "You or a team member interrupt actual paid work to answer routine questions on the phone",
    ],
    howItWorks: [
      {
        title: "It answers the way your business would",
        body: "The system is trained on your actual services, coverage area, and how you talk to customers, not a generic script. It can explain what you do, roughly how you work, and what happens next, in a way that sounds like your business rather than a call centre.",
      },
      {
        title: "It captures what actually matters",
        body: "Rather than just taking a message, it asks the right follow-up questions for your trade: what the job is, roughly where, how urgent it is, so what lands with you is a usable lead, not a vague voicemail you have to call back to make sense of.",
      },
      {
        title: "It routes and escalates properly",
        body: "Routine enquiries get handled directly. Anything unusual, urgent, or outside what it's confident about gets flagged and handed to you or a team member, with the context already captured, so you're not starting from scratch.",
      },
    ],
    whatItCovers: [
      {
        title: "AI voice receptionist",
        description:
          "24/7 inbound call handling with natural conversation, smart routing, and booking directly into your calendar where appropriate.",
      },
      {
        title: "24/7 AI receptionist",
        description:
          "Trained specifically on your business, it answers by phone or on your website around the clock, capturing and qualifying every enquiry without needing a redesign, not a generic chat widget bolted on top.",
      },
      {
        title: "Missed-call text-back",
        description:
          "Every unanswered call gets an instant, on-brand text reply, so nobody who calls you ever hears silence.",
      },
      {
        title: "Smart routing and escalation",
        description:
          "Clear rules for what gets handled automatically and what gets handed to a real person, agreed with you during scoping.",
      },
    ],
    quickWin: {
      title: "Missed-call text-back",
      description:
        "The simplest version: every missed call gets an instant, on-brand text reply within seconds. No build required beyond connecting your existing number, usually live within days, and the first place most businesses start.",
    },
    bespoke: {
      title: "Full AI voice receptionist",
      description:
        "A phone system that can hold a real conversation, understand what the caller needs, check availability, and book the job. It's built around your specific services and how you actually price and schedule work, and integrated with your calendar and CRM if you have one.",
    },
    relatedIndustries: ["trades", "home-and-property-services", "automotive-services"],
    faqs: [
      {
        question: "Will callers know they're talking to an AI?",
        answer:
          "We're upfront about it where it matters. Most systems introduce themselves clearly, and every caller can ask for a human at any point. We design the handoff rules with you, not around you.",
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
      {
        question: "Can it handle more than one enquiry at once?",
        answer:
          "Yes, unlike a person, it can hold multiple conversations simultaneously, which matters most during your busiest periods, when a human receptionist would otherwise be stacking calls.",
      },
      {
        question: "What if my services are quite technical to explain?",
        answer:
          "That's exactly what the training process during scoping is for. We work through your actual services with you so the system can explain them accurately, rather than giving vague, generic answers.",
      },
      {
        question: "Does it work for both calls and web enquiries, or do I need separate systems?",
        answer:
          "Both can run from the same underlying setup, trained on the same information about your business, so a customer gets a consistent answer whether they call or message.",
      },
      {
        question: "How quickly can this be live?",
        answer:
          "The quick-win version, missed-call text-back, can often be live within days. A full voice receptionist with calendar and CRM integration takes longer, depending on how much needs connecting together.",
      },
      {
        question: "Can it speak to customers in more than one language?",
        answer:
          "This can be scoped where it's genuinely useful for your customer base. During the discovery call we'll ask whether this matters for your business rather than assuming it's needed by default.",
      },
    ],
  },
  {
    slug: "bookings-and-scheduling",
    name: "Bookings & Scheduling",
    dek: "A calendar that fills itself, reminds people to actually turn up, and stops double-bookings before they happen.",
    summary:
      "Automated booking and reminders that sit on top of how you already schedule work, cutting no-shows and the back-and-forth of finding a time that suits everyone.",
    intro: [
      "Booking by phone tag or text thread works fine when things are quiet. The moment you're busy, it's the first thing to slip, a full afternoon of back-and-forth trying to find a time that suits both of you, for a job that might only take an hour once it's actually booked in.",
      "Multiply that friction across every new enquiry in a week, and it's easy to see where hours disappear. Worse, a slow or clunky booking process is often the exact moment a customer decides to try somewhere else, even after you've already done the hard part of winning the enquiry.",
      "A bookings and scheduling system removes the back-and-forth. The customer sees real availability, picks a time, and it's confirmed. No chasing is required from either side, and a reminder is sent automatically so the appointment actually happens.",
      "This matters just as much for the second and third booking as it does for the first. A calendar that fills itself correctly, without double-bookings or gaps caused by miscommunication, compounds over a busy month into hours you'd otherwise have spent untangling scheduling mistakes instead of doing the work itself.",
    ],
    signs: [
      "You spend real time each week just finding a slot that works for both sides",
      "No-shows are a regular, low-level cost of doing business",
      "Bookings sometimes clash because two people wrote them down differently",
      "Customers have to call during work hours to book, which some of them simply don't do",
      "Rescheduling a job means another round of phone tag",
      "You've had two people booked into the same slot at least once",
    ],
    howItWorks: [
      {
        title: "It reflects your real availability",
        body: "Not a generic calendar widget. The system is set up around how you actually work: which days, which services, how long each job realistically takes, and any buffer time you need between them.",
      },
      {
        title: "It confirms and reminds automatically",
        body: "Once booked, confirmation and reminder messages go out without anyone having to remember to send them, timed to measurably reduce no-shows rather than firing off a single generic text.",
      },
      {
        title: "It handles changes without a phone call",
        body: "Customers can reschedule within the rules you set, rather than every change becoming another call you have to take and manually update your diary for.",
      },
    ],
    whatItCovers: [
      {
        title: "Online booking",
        description: "Reflects your real availability, staff, and service durations, not a generic 30-minute-slot template.",
      },
      {
        title: "Automated reminders",
        description: "Confirmation and reminder messages timed to measurably cut no-shows, sent without anyone needing to remember.",
      },
      {
        title: "Self-service rescheduling",
        description: "Customers can move a booking within the rules you set, without it costing you a phone call.",
      },
      {
        title: "Calendar sync",
        description: "Works across however your team already schedules work, rather than asking everyone to adopt something new.",
      },
    ],
    quickWin: {
      title: "Automated reminders",
      description:
        "Confirmation and reminder texts added to your existing booking process, a same-week change that reduces no-shows immediately, without touching how you currently take bookings.",
    },
    bespoke: {
      title: "End-to-end booking system",
      description:
        "A booking flow built around your actual services: different durations, different staff, different locations, with rules that match how the job really works, connected to reminders and rescheduling from day one.",
    },
    relatedIndustries: ["salons-and-personal-care", "automotive-services", "home-and-property-services"],
    faqs: [
      {
        question: "Can it handle different appointment types and durations?",
        answer:
          "Yes, this is exactly what \"bespoke\" means here. We build the logic around your real service list, not a generic 30-minute-slot template.",
      },
      {
        question: "What if I already use a booking tool?",
        answer:
          "We usually work with what you have rather than ripping it out. Automation and reminders can often be layered on top of your existing system.",
      },
      {
        question: "Can different staff members have different availability?",
        answer:
          "Yes. If your business has more than one person taking bookings — different stylists, technicians, or engineers — the system is built around each person's real schedule, not one shared calendar.",
      },
      {
        question: "How much do reminders actually reduce no-shows?",
        answer:
          "It varies by business and how bookings were being confirmed before, so we won't quote you a generic industry statistic. We'll look at your current no-show pattern during scoping and set expectations based on that, not a marketing number.",
      },
      {
        question: "Can customers cancel as well as reschedule?",
        answer:
          "Yes, within whatever cancellation policy you want enforced, including any notice period or fee rules you already apply.",
      },
      {
        question: "Will this work if I take bookings across multiple locations?",
        answer:
          "Yes, this is a normal part of scoping for businesses like The Warren Collection, who use a similar approach across multiple properties. Each location's real availability is reflected separately.",
      },
      {
        question: "What happens if two customers try to book the exact same slot?",
        answer:
          "The system checks real-time availability before confirming, so a slot that's just been taken shows as unavailable immediately. That's the same protection a well-run manual diary gives you, just without depending on someone updating it fast enough by hand.",
      },
      {
        question: "Can customers book on the day, or only in advance?",
        answer:
          "Both, depending on how you want it configured. Same-day availability can be shown if you have capacity, or you can set a minimum notice period. The rules reflect how you actually want to work, not a fixed default.",
      },
      {
        question: "Does it work for both online booking and phone bookings?",
        answer:
          "Yes, the underlying availability is the same whether a customer books through a web form or over the phone via our enquiries and leads service, so the two never conflict with each other.",
      },
    ],
  },
  {
    slug: "follow-ups-and-nurture",
    name: "Follow-Ups & Nurture",
    dek: "The quote that never got chased, the review that was never asked for: handled automatically, every time.",
    summary:
      "Automated follow-up across email, SMS, and WhatsApp that keeps warm enquiries warm and turns finished jobs into reviews, without you having to remember to do it.",
    intro: [
      "Following up takes discipline and time, two things in short supply after a full day of actual work. A quote goes out on Monday, and by Friday it's forgotten, not because the customer wasn't interested, but because nobody circled back before they went with someone who did.",
      "The same pattern shows up after the job's done. A happy customer would gladly leave a review or book again, but the moment passes, nobody asks, and the goodwill from a job well done never turns into anything you can point new customers to.",
      "A follow-ups and nurture system closes that gap. It doesn't forget, it doesn't get busy, and it follows up at sensible, well-timed intervals, so quotes get chased and good jobs get turned into reviews, without it depending on anyone remembering to do it manually.",
      "The value compounds over time in a way that's easy to underestimate month to month. A handful of extra quotes converted and a steady trickle of extra reviews might not feel dramatic in any single week, but across a year they add up to meaningfully more booked work and a stronger reputation than leaving both to chance.",
    ],
    signs: [
      "You've sent a quote and genuinely can't remember if you ever followed it up",
      "You know you should be asking for reviews more consistently, but it never quite happens",
      "Customers who went quiet after a quote sometimes turn up on a competitor's job instead",
      "Following up feels like nagging, so it gets skipped rather than done badly",
      "You have no consistent record of which enquiries are still open and which have gone cold",
      "Your online reviews haven't kept pace with how many happy customers you've actually had",
    ],
    howItWorks: [
      {
        title: "It tracks what's still open",
        body: "Every quote and enquiry that hasn't converted is tracked automatically, so nothing depends on someone remembering to check a notebook or a mental list of who still owes a reply.",
      },
      {
        title: "It follows up at the right moments",
        body: "Timed sequences — not a single generic nudge — reach out across the channels your customers actually use, written in your voice rather than a template that reads like a template. Timing and tone are agreed with you during scoping, not fixed defaults.",
      },
      {
        title: "It asks for reviews when it matters most",
        body: "Post-job requests go out at the moment satisfaction is highest, rather than days later when the memory of the job has faded and the motivation to leave a review has gone with it. Over months, that consistency compounds into a stronger, more current set of reviews than sporadic manual asking ever produces.",
      },
    ],
    whatItCovers: [
      {
        title: "Quote and enquiry follow-up",
        description: "Automatic, sensibly timed follow-up on anything that hasn't converted, so nothing goes cold by accident.",
      },
      {
        title: "Review requests",
        description: "Sent at the moment a job is marked complete, when satisfaction — and the willingness to leave a review — is highest.",
      },
      {
        title: "WhatsApp and SMS automation",
        description: "Follow-up on the channels your customers actually use, not just email that might sit unread.",
      },
      {
        title: "A simple view of what's outstanding",
        description: "See what's been followed up and what hasn't, without digging through old messages to check.",
      },
    ],
    quickWin: {
      title: "Automated review requests",
      description:
        "A single automation triggered when a job's marked complete: a well-timed, personal-feeling request for a Google review. Low effort, compounding return, and usually live within a few days.",
    },
    bespoke: {
      title: "Full nurture sequence",
      description:
        "A tailored sequence across quotes, bookings, and post-job follow-up, written in your voice and matched to how long your sales cycle actually takes — from a same-day callout to a multi-week renovation quote.",
    },
    relatedIndustries: ["professional-services", "home-and-property-services", "trades"],
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
      {
        question: "How many times will it follow up before giving up?",
        answer:
          "That's agreed with you during scoping — enough to genuinely reduce quotes going cold, without tipping into the kind of persistence that puts a customer off. You set the limit, not a default we impose.",
      },
      {
        question: "Can I see which quotes are still being followed up on?",
        answer:
          "Yes, this connects to the same record-keeping covered under admin and back-office, so you have a simple view of what's outstanding rather than having to ask.",
      },
      {
        question: "Will it ask for a review even if the job didn't go perfectly?",
        answer:
          "No, review requests are only ever sent in line with rules you set, and we'll talk through how you want that judged during scoping, rather than firing a request off regardless of outcome.",
      },
      {
        question: "Can follow-up sequences differ between new enquiries and existing customers?",
        answer:
          "Yes, a first-time enquiry chase and a repeat customer's rebooking prompt usually need different tones and timing, and we build separate sequences for each rather than treating every contact the same way.",
      },
      {
        question: "What if a customer replies asking to stop being contacted?",
        answer:
          "That's honoured immediately and automatically — opting out of follow-up is always respected, in line with standard good practice for any automated messaging, and we build that into every sequence from the start.",
      },
    ],
  },
  {
    slug: "admin-and-back-office",
    name: "Admin & Back-Office",
    dek: "The admin you're personally stuck doing for hours can be automated with a custom-built system. That saves considerable time and money, not just tidier records.",
    summary:
      "A system of record that captures every enquiry, call, and booking automatically, plus simple reporting so you can see what's actually happening in the business without digging for it.",
    intro: [
      "The admin that keeps a business running — logging enquiries, updating records, pulling together what happened this month — is exactly the work that gets pushed to \"later\" and then never quite gets done. It's rarely urgent on any given day, which is precisely why it's usually the first thing to slip.",
      "The cost shows up later, not immediately. A customer calls back and nobody can find the notes from their last job. A quiet month arrives and there's no clear picture of where enquiries actually came from, so there's nothing solid to act on. None of this is anyone's fault — it's just what happens when record-keeping depends on someone finding a spare ten minutes that rarely comes.",
      "An admin and back-office system removes the dependency on that spare ten minutes. Enquiries, calls, and bookings get logged as they happen, automatically, so the record exists whether or not anyone had time to write it down.",
      "It's also the foundation the rest of your systems build on. Enquiry handling, bookings, and follow-up all work better with an accurate, up-to-date record behind them — which is why this is often the quiet, unglamorous piece that makes everything else run more smoothly, even though it's rarely the one a business notices first.",
      "Beyond basic logging, a bespoke build can take on the specific admin task that's actually eating your hours — reconciling job sheets, preparing figures for invoicing, compiling the same monthly report by hand, chasing paperwork between systems that don't talk to each other. Once we know exactly what that task involves, we can usually automate it directly, which is where the real time and cost savings come from, not just having tidier records.",
    ],
    signs: [
      "You've had to ask a customer to remind you what was discussed on a previous call",
      "Nobody could tell you, without digging, how many enquiries came in last month",
      "Notes on jobs live in someone's head, a notebook, or three different apps depending on who took the call",
      "Reporting, if it happens at all, means someone spending an evening pulling numbers together manually",
      "You've lost track of a customer's history because the record simply wasn't kept",
      "You genuinely don't know which marketing or referral source brings in the most work",
    ],
    howItWorks: [
      {
        title: "It captures as things happen",
        body: "Every call, enquiry, and booking is logged automatically at the point it happens, rather than depending on someone writing it up afterwards — which is usually the step that gets skipped.",
      },
      {
        title: "It keeps one version of the truth",
        body: "Instead of notes scattered across notebooks, phones, and three different apps, everything lives in one place your team can actually find and trust.",
      },
      {
        title: "It reports without anyone building a spreadsheet",
        body: "Simple monthly reporting on what's coming in and what's converting is generated automatically, so you can see what's happening in the business without losing an evening to pulling it together.",
      },
    ],
    whatItCovers: [
      {
        title: "Automatic enquiry and call logging",
        description: "Every interaction captured and organised automatically, without depending on anyone finding time to write it up.",
      },
      {
        title: "Call summaries and notes",
        description: "Captured without anyone typing them up manually, so a customer's history is there when you need it.",
      },
      {
        title: "Monthly reporting",
        description: "A simple, honest picture of what's coming in and what's converting, generated automatically rather than pulled together by hand.",
      },
      {
        title: "A unified inbox",
        description: "Enquiries from different channels land in one place, instead of living in three different apps depending on who took the call.",
      },
    ],
    quickWin: {
      title: "Automatic call and enquiry logging",
      description:
        "Every interaction captured and organised automatically — the foundation the rest of your systems build on, and useful on its own from day one, even before anything else is connected to it.",
    },
    bespoke: {
      title: "Bespoke admin automation",
      description:
        "Once we understand exactly which admin task is taking up hours of your week, we build a system specifically around automating it — whether that's a full CRM and reporting dashboard or something narrower and more specific to how you work. Done properly, this is where a bespoke build saves considerable time and money, not just a generic template with fields you'll never use.",
    },
    relatedIndustries: ["professional-services", "trades", "salons-and-personal-care"],
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
      {
        question: "Can this replace a spreadsheet I've been using for years?",
        answer:
          "Often, yes — but we won't push you to abandon something that's genuinely working. We'll look at what your spreadsheet does well and either replicate that or explain honestly where a different approach would serve you better.",
      },
      {
        question: "How far back can historical records be brought in?",
        answer:
          "This depends on what format your existing records are in. We'll assess what's realistic to migrate during scoping rather than promising a blanket answer.",
      },
      {
        question: "Is the reporting customisable to what actually matters to my business?",
        answer:
          "Yes, this is the difference between the quick win and the bespoke build. The bespoke version is built around the specific metrics you care about, not a generic dashboard template.",
      },
      {
        question: "Does this integrate with accounting or invoicing software?",
        answer:
          "Where it makes sense, yes — we'll assess your existing tools during scoping and look at what can be connected versus what would need a manual handoff, rather than assuming a blanket integration.",
      },
      {
        question: "Can this generate reports for more than one person, like a business partner or accountant?",
        answer:
          "Yes, reporting can be shared with whoever needs visibility into the business, in whatever format is genuinely useful to them, rather than being locked to a single view only you can see.",
      },
    ],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
