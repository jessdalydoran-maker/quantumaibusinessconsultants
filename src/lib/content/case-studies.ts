import type { Faq } from "./services";

export type ApproachItem = { title: string; description: string };

export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  location: string;
  status: "live" | "launching";
  headline: string;
  summary: string;
  context: string[];
  challenge: string;
  approach: ApproachItem[];
  whatThisMeans: string;
  lessons: string[];
  faqs: Faq[];
  relatedServices: string[];
  result?: { stat: string; label: string };
  launchNote?: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "pinnacle-health-ni",
    client: "Pinnacle Health NI",
    industry: "Health & Wellness",
    location: "Belfast",
    status: "live",
    headline: "AI booking and follow-up cut missed enquiries by 40%",
    summary:
      "AI booking, automated patient follow-ups, and intelligent enquiry handling for a Belfast health and wellness clinic.",
    context: [
      "Health and wellness clinics face a specific version of the missed-enquiry problem: reception staff are, correctly, prioritising the patients physically in front of them, which means the phone and inbox are often unattended during exactly the hours enquiries are highest. A new patient calling to ask about availability doesn't know that — they just experience a call that isn't answered.",
      "That's a harder problem to solve with \"just hire more reception staff,\" because clinic reception needs are peaky rather than constant — busy at certain hours, quiet at others — which makes a fixed headcount an expensive and imperfect fix for what's really a timing and coverage problem.",
      "It's also a problem with a real cost attached to it in a clinic setting specifically. A missed enquiry from a new patient isn't just a lost booking — for a health and wellness practice, it can mean someone who needed care went without it, or found it somewhere else, simply because nobody was free to pick up the phone at the right moment.",
      "This is why, for clinics generally, the most useful first step is often simply making the gap visible — understanding when enquiries actually arrive relative to when staff have capacity to handle them — before deciding what to build around it.",
    ],
    challenge:
      "Pinnacle Health NI was losing enquiries to slow response times during busy clinic hours, when reception staff were correctly focused on the patients physically in front of them, leaving new enquiries — calls, messages, and booking requests — to queue behind in-person care with no dedicated capacity to catch them in real time.",
    approach: [
      {
        title: "AI-handled enquiry intake",
        description:
          "Every new message is responded to the moment it arrives, rather than queuing behind whatever reception is dealing with in person at that moment.",
      },
      {
        title: "Automated booking against real availability",
        description:
          "Booking reflects actual practitioner availability rather than a generic calendar, so what's offered to a patient is genuinely bookable.",
      },
      {
        title: "Automated patient follow-up",
        description:
          "Follow-up sequences reduced the amount of manual chasing that previously fell to front-of-house staff between patient appointments.",
      },
    ],
    whatThisMeans:
      "For a clinic — or any appointment-led business where staff attention is legitimately split between the person in the room and the phone — the lesson isn't that reception staff were doing a bad job. It's that no fixed number of staff can perfectly cover unpredictable peaks in enquiry volume. An AI system doesn't replace reception; it covers the gaps reception physically can't, at the moments those gaps matter most, and it does so consistently rather than depending on how busy any given hour happens to be.",
    lessons: [
      "Appointment-led businesses lose enquiries at predictable peak moments, not randomly — which makes the problem solvable rather than just unlucky.",
      "Reception staff performing well in person can still mean enquiries go unanswered — the two aren't in conflict, they're competing for the same limited attention.",
      "Automated booking only works if it reflects real, current availability — a system offering slots that aren't genuinely bookable does more harm than good.",
      "Follow-up that used to depend on a quiet moment between patients now happens consistently, which compounds over months into fewer patients falling through the cracks.",
      "Solving a coverage gap doesn't require a bigger team — it requires the right system covering the specific hours and moments the existing team genuinely can't.",
    ],
    faqs: [
      {
        question: "Did this replace Pinnacle Health NI's reception team?",
        answer:
          "No. The system handles enquiries reception can't get to in the moment, and reception continues to manage patients on-site and anything the system escalates. It's additional coverage, not a replacement for the team.",
      },
      {
        question: "How is patient data handled given this is a health setting?",
        answer:
          "Data handling was scoped specifically for a clinical environment, including what's captured and who can access it. See our general privacy approach for the framework this builds on.",
      },
      {
        question: "How long did it take to see the 40% reduction?",
        answer:
          "The figure reflects a sustained period after the system was live and bedded in, not an initial spike — we don't publish early, unrepresentative numbers as if they were the settled result.",
      },
      {
        question: "Could a smaller, single-practitioner clinic see similar results?",
        answer:
          "The specific figure is Pinnacle Health NI's, not a guaranteed outcome for every clinic — but the underlying dynamic, enquiries arriving faster than staff can catch them at peak hours, applies at any clinic size, so the general approach is relevant even if the exact number wouldn't be.",
      },
    ],
    relatedServices: ["enquiries-and-leads", "bookings-and-scheduling", "follow-ups-and-nurture"],
    result: { stat: "40%", label: "reduction in missed enquiries" },
  },
  {
    slug: "the-warren-collection",
    client: "The Warren Collection",
    industry: "Hospitality",
    location: "Northern Ireland",
    status: "live",
    headline: "One AI concierge, multiple properties, enquiries handled around the clock",
    summary: "An AI concierge system covering guest enquiries across multiple hotel properties.",
    context: [
      "Multi-property hospitality groups face a coordination problem on top of the usual missed-enquiry problem: guests expect a consistent standard of response whichever property they're contacting, at whatever hour they're contacting it, but staffing a dedicated, always-on reception desk at every property individually is rarely realistic for an independent group.",
      "Guest enquiries also don't respect office hours. A question about late check-in, local recommendations, or availability can arrive at 11pm just as easily as 11am, and a guest getting no answer until the next morning has already formed an impression of the property before their stay has even started.",
      "There's a reputational dimension too, specific to hospitality: guests increasingly review not just the stay itself but the booking and communication experience around it. A slow or inconsistent reply doesn't just risk losing that individual booking — it risks becoming part of the public record other prospective guests read before choosing where to stay.",
      "For multi-property groups generally, the coordination challenge tends to grow faster than headcount can reasonably follow — each additional property adds enquiry volume and its own local specifics to keep track of, without a proportional increase in staff available to manage it.",
    ],
    challenge:
      "Guest enquiries arrived at all hours, across multiple properties, with no single reception desk able to cover every question at every hour — and with each property having its own specifics that a shared, generic response process couldn't reflect accurately, risking guests receiving inconsistent or inaccurate answers depending on which property, or which hour, they happened to reach out during.",
    approach: [
      {
        title: "A unified concierge, trained per property",
        description:
          "One underlying system trained on each property's specifics — amenities, policies, local recommendations — so guests get accurate, property-specific answers rather than generic hotel-chain responses.",
      },
      {
        title: "Genuine 24/7 coverage",
        description:
          "An enquiry at 11pm gets the same quality of response as one at 11am, rather than guests learning to expect slower replies outside office hours.",
      },
      {
        title: "Clear escalation to real staff",
        description:
          "Anything requiring a human — a complaint, an unusual request, anything sensitive — is routed to a real member of staff rather than handled automatically regardless of complexity.",
      },
    ],
    whatThisMeans:
      "For any hospitality business managing more than one location, the takeaway is that consistency matters as much as speed. A single, well-trained system that knows the specifics of each property can deliver a more uniform guest experience than trying to staff every location to the same standard around the clock — while still handing off to a person the moment a situation genuinely needs one. That combination of breadth and specificity is difficult to achieve with staffing alone, at almost any budget.",
    lessons: [
      "Multi-site businesses don't need a bigger team at every site — they need one system that genuinely knows the specifics of each one.",
      "Guests judge responsiveness at all hours, not just during a property's staffed reception hours, so 24/7 coverage closes a gap that's easy to underestimate.",
      "Escalation rules matter more, not less, at scale — the more properties covered, the more important it is that unusual situations reliably reach a real person.",
      "Consistency across locations is itself a guest-facing quality signal, separate from how good any individual property's amenities are.",
      "A well-trained system scales coordination in a way that hiring more staff at every location generally can't, both practically and financially, particularly for an independent group without chain-level resources.",
    ],
    faqs: [
      {
        question: "How does the system know the difference between the group's properties?",
        answer:
          "Each property's specifics — amenities, policies, local recommendations — are part of its individual training, so an enquiry about one property doesn't get answered with details from another.",
      },
      {
        question: "What happens with a genuine emergency or complaint at 2am?",
        answer:
          "Escalation rules route anything serious to on-call staff rather than the system attempting to resolve it alone — the 24/7 coverage is about response time, not about replacing human judgement for anything that needs it.",
      },
      {
        question: "Could this work for a single-property hotel, not just a group?",
        answer:
          "Yes — the same principle of consistent, always-on coverage applies at any scale. A multi-property group simply makes the coordination problem more visible.",
      },
      {
        question: "How does the system stay up to date as property details change — new amenities, seasonal offers?",
        answer:
          "This is maintained as part of ongoing support, the same as any other client relationship — updates to a property's details are reflected in what the system knows, rather than it working from information that gradually goes stale after launch.",
      },
    ],
    relatedServices: ["enquiries-and-leads", "bookings-and-scheduling", "admin-and-back-office"],
    result: { stat: "24/7", label: "guest enquiries handled automatically" },
  },
  {
    slug: "thirty3coffee",
    client: "thirty3coffee",
    industry: "Food & Beverage",
    location: "Nutts Corner",
    status: "launching",
    headline: "An AI-driven batch ordering platform for wholesale clients",
    summary: "An AI batch ordering platform built for thirty3coffee's wholesale client base.",
    context: [
      "Wholesale relationships in food and beverage are usually built on repetition: the same client ordering broadly the same products on a broadly predictable cycle. That predictability is an advantage most ordering processes don't take advantage of — orders still tend to be handled the same manual way whether they're a first-time order or the fortieth repeat of an identical one.",
      "The cost of that isn't just time. Every manual reorder conversation is time not spent roasting, fulfilling, or growing the wholesale side of the business, and the more the client base grows, the more that repetitive admin scales alongside it — linearly, rather than getting more efficient with size.",
      "There's also a customer-experience angle wholesale businesses sometimes overlook: a client who has to actively remember to place their usual order, on their own initiative, every time, is a client who could just as easily forget, delay, or start comparing other suppliers during that gap. Removing the friction from reordering isn't only about saving the supplier's time — it protects the relationship on the client's side too.",
      "For a growing roaster specifically, this admin load scales with exactly the growth you want — more wholesale clients means more of the same repetitive ordering conversations, which makes automating the pattern early a way of growing without the admin overhead growing at the same rate.",
    ],
    challenge:
      "Wholesale ordering for a growing coffee business meant repetitive back-and-forth for the same recurring orders, taking time away from roasting and fulfilment — admin that scaled up in direct proportion to the wholesale client base growing, rather than becoming more efficient as the business got bigger.",
    approach: [
      {
        title: "A batch-ordering system, not a generic cart",
        description:
          "Built specifically around how wholesale batch ordering actually works, rather than adapting a standard e-commerce checkout not designed for recurring bulk orders.",
      },
      {
        title: "Reordering prompts on each client's real cycle",
        description:
          "Automated prompts timed to each client's typical reorder pattern, rather than a one-size-fits-all reminder schedule.",
      },
    ],
    whatThisMeans:
      "For wholesale and B2B businesses generally, the opportunity is different from a consumer-facing enquiry problem — it's less about catching a call in real time and more about removing recurring admin from a relationship that's already predictable. The more repetitive and pattern-based a business relationship is, the more there usually is to gain from automating the ordering process around it, and the earlier in a business's growth that automation is introduced, the less admin overhead accumulates as the client base expands.",
    lessons: [
      "Predictable, repeat B2B relationships are often the easiest place to find automation value, precisely because the pattern is already known rather than needing to be guessed at.",
      "A generic e-commerce cart usually isn't built for wholesale batch ordering, and forcing one to fit tends to create as much friction as it removes.",
      "Reordering friction is a two-sided cost — it affects the client's convenience as much as the supplier's admin time.",
      "Automation that scales with the client base, rather than adding proportional admin as the business grows, changes the economics of taking on new wholesale relationships.",
      "Being transparent about a project that's still in progress, rather than only ever publishing finished success stories, is itself part of being honest about what real client work looks like.",
    ],
    faqs: [
      {
        question: "Why publish a case study before the system has launched?",
        answer:
          "Because it's a real, currently in-progress engagement, and we'd rather be transparent about work that's underway than only ever show finished results. We'll update this page with genuine outcomes once the system has been live long enough to report on honestly.",
      },
      {
        question: "Is this the same kind of system as the missed-call or booking work described elsewhere?",
        answer:
          "No — this is a good example of how our services extend beyond enquiry handling. Batch ordering sits closer to admin and back-office, applied to a wholesale ordering context rather than customer enquiries.",
      },
      {
        question: "Could a similar system work for other wholesale or B2B businesses?",
        answer:
          "Yes, in principle — any business with a recurring, pattern-based ordering relationship with its clients faces a similar opportunity, though the specifics would be scoped individually.",
      },
      {
        question: "Will thirty3coffee's wholesale clients need to learn a new ordering process?",
        answer:
          "The aim is to make reordering easier than it currently is, not to add a learning curve — the system is being built around how clients already order, automating the repetitive part rather than introducing an unfamiliar new step.",
      },
    ],
    relatedServices: ["admin-and-back-office", "bookings-and-scheduling"],
    launchNote: "This system is launching in 2026 — results will be published here once live.",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
