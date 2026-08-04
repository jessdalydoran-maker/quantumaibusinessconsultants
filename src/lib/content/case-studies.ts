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
    slug: "crookedstone-house",
    client: "Crookedstone House",
    industry: "Bed & Breakfast",
    location: "Aldergrove, Co. Antrim",
    status: "live",
    headline: "A real website and a CRM, instead of relying on Booking.com and a personal inbox",
    summary:
      "A new website and CRM for a B&B near Belfast International Airport, so every enquiry is captured and followed up rather than living only inside Booking.com or a personal email account.",
    context: [
      "Independent B&Bs and small guesthouses are unusually dependent on third-party booking platforms. Booking.com and similar sites bring genuine, valuable traffic, but every booking made through them comes with a commission, and the guest relationship, their contact details, their questions, their history, largely stays inside that platform rather than becoming something the business actually owns.",
      "The direct enquiries that do come in outside those platforms, a phone call, a message through social media, an email, usually have nowhere central to land. For a small, owner-run business, that typically means a personal inbox or a phone that's also being used for everything else in the day, which makes it easy for a genuine enquiry to sit unanswered longer than it should, not through any lack of care, but because there's no system making sure it's seen.",
      "None of this requires an AI system to fix. It requires a proper website that gives the business a direct channel of its own, and somewhere central that every enquiry actually lands and can be tracked, so following up isn't dependent on remembering to check three different places.",
      "That's a smaller, more contained problem than the coverage gaps we solve with AI-handled enquiries or bookings elsewhere in our work, and it's worth being upfront about that: not every engagement needs the same scope to be worth doing properly.",
    ],
    challenge:
      "Crookedstone House didn't have a dedicated website of its own to point guests to, and had no central place for direct enquiries, phone, email, or otherwise, to land. Bookings largely flowed through Booking.com, where the business pays a commission and has limited ownership over the guest relationship itself.",
    approach: [
      {
        title: "A proper website",
        description:
          "A dedicated site covering the rooms, breakfast, the grounds, and the property's genuine convenience for Belfast International Airport, with clear, direct ways to get in touch, rather than guests only finding the business through Booking.com.",
      },
      {
        title: "A CRM behind it",
        description:
          "Every enquiry submitted through the site is logged as a contact automatically, so there's one place to see who has reached out, what they asked, and whether they've been followed up with, rather than that living only in a personal inbox.",
      },
    ],
    whatThisMeans:
      "Not every business that comes to us needs a fully AI-automated system to get real value out of working with us. For a business like Crookedstone House, the highest-value fix was simpler: a direct channel of its own, and one real place where every enquiry is visible and tracked, instead of scattered across a booking platform's inbox, a phone, and email. Getting the basics genuinely right is sometimes the whole job.",
    lessons: [
      "Small hospitality businesses often lose the guest relationship, not the booking itself, when everything is routed through a third-party platform.",
      "A CRM does real, useful work even without any AI layered on top of it: simply making sure every enquiry is visible in one place is a genuine improvement over a personal inbox.",
      "A dedicated website gives an independent business a direct channel that doesn't depend on a platform's commission or rules, alongside whatever bookings still come through Booking.com or similar.",
      "Scoping a project honestly, rather than building in AI automation a business doesn't yet need, is part of doing this properly. The right-sized fix is the right fix.",
    ],
    faqs: [
      {
        question: "Does Crookedstone House still take bookings through Booking.com?",
        answer:
          "Yes. Booking.com remains one channel for bookings. Direct enquiries through the new site now have somewhere proper to go too, rather than existing only inside Booking.com's own messaging system.",
      },
      {
        question: "Is there an AI chat or automated booking system on the site?",
        answer:
          "No. This project was scoped as a website and a CRM, not an AI-automated system. What we build depends on what a business actually needs, not a fixed package applied to every client.",
      },
      {
        question: "Could an AI concierge or automated booking be added later?",
        answer:
          "Yes, if it made sense for the business down the line. The current build gives Crookedstone House a solid foundation, a direct site and a CRM, that any future automation would sit on top of rather than replace.",
      },
      {
        question: "How does a CRM actually help if there's no automation involved?",
        answer:
          "It gives one place to see every enquiry, its status, and the contact's history, which is genuinely useful admin work on its own, separate from anything AI-driven.",
      },
    ],
    relatedServices: ["enquiries-and-leads", "admin-and-back-office"],
  },
  {
    slug: "feeney-flooring-and-blinds",
    client: "Feeney Flooring and Blinds",
    industry: "Trades",
    location: "Northern Ireland",
    status: "launching",
    headline: "An AI product specialist that also manages two separate booking calendars",
    summary:
      "A website with an AI flooring and blinds specialist, WhatsApp as a real channel, and two AI-managed booking calendars, backed by a CRM.",
    context: [
      "Trades businesses selling a physical product, flooring and blinds among them, get a specific kind of enquiry before a job is ever booked: genuine product questions. What materials are available, roughly what something costs, how long fitting takes. Answering those well takes real product knowledge, and a generic contact form or a slow reply doesn't give a browsing customer much reason to wait around for one.",
      "Scheduling adds a second layer of complexity on top of that. A business handling more than one type of appointment, for instance needing two genuinely separate diaries rather than one shared calendar, is exactly the kind of thing that's easy to get wrong by hand: a customer booked into the wrong calendar, or two people accidentally double-booking the same slot from different channels.",
      "Customers also increasingly expect to reach a business wherever they already are, which for a lot of trades customers is WhatsApp rather than email or a contact form. A business only offering the channels that suit it, rather than the ones customers actually use, is quietly turning some enquiries away before they even start.",
      "Put together, that's three separate problems, product questions, calendar logic, and channel coverage, that don't have much in common on the surface but all sit in the same gap between a customer's first question and a job actually getting booked.",
    ],
    challenge:
      "Feeney Flooring and Blinds needed to answer real product questions quickly, manage two genuinely separate booking calendars without double-booking across them, and meet customers on WhatsApp as well as more traditional channels, all without it becoming a full-time job on top of the fitting work itself.",
    approach: [
      {
        title: "An AI flooring and blinds specialist",
        description:
          "Trained on the business's actual product range and general trade knowledge, so a website visitor gets a specific, useful answer about materials, options, and rough pricing immediately, rather than a generic contact form and a wait.",
      },
      {
        title: "WhatsApp as a real channel",
        description:
          "Customers who'd rather message on WhatsApp than email or call get the same coverage as any other channel, folded into the same inbox as everything else rather than being a separate, easily-missed thing to check.",
      },
      {
        title: "Two AI-managed booking calendars",
        description:
          "The AI books directly into whichever calendar a given enquiry actually needs, so the two stay genuinely separate without anyone having to manually check both before confirming a slot.",
      },
      {
        title: "A CRM tying it together",
        description:
          "Every enquiry, WhatsApp conversation, and booking is tracked against one contact record, so nothing about a customer's history gets lost between channels.",
      },
    ],
    whatThisMeans:
      "For a trades business selling a physical product, the gap between a customer's first question and a booked job is often wider than it looks: it's not just about answering fast, it's about answering with real product knowledge, on the channel the customer actually prefers, and getting the booking into the right calendar without anyone double-checking by hand. Closing all three at once is what actually removes the admin, not just one piece of it.",
    lessons: [
      "Product-specific AI knowledge matters more in trades than a generic chatbot script. Customers ask specific product questions before they'll seriously consider booking.",
      "WhatsApp is often where trades customers already are. Meeting them there, rather than only offering a contact form, removes real friction.",
      "Two calendars handled by one AI system avoid the classic problem of two people juggling a shared diary and double-booking each other.",
      "A CRM underneath ties every channel, chat, WhatsApp, and calendar bookings, back to one contact record, so a customer's history doesn't fragment across separate tools.",
    ],
    faqs: [
      {
        question: "Why isn't Feeney Flooring and Blinds' site live yet?",
        answer:
          "It's built and working; the domain setup just isn't finished. This case study will be updated with real results once it's had time to run live.",
      },
      {
        question: "How does the AI know about specific flooring and blinds products?",
        answer:
          "It's trained on Feeney Flooring and Blinds' actual product range and general trade knowledge, not a generic chatbot script, so answers about materials, options, and rough pricing are specific to what the business actually offers.",
      },
      {
        question: "What happens if a customer wants to speak to a real person?",
        answer:
          "Anything the AI can't handle, or that a customer specifically asks for, is routed through to the team the same way any other enquiry would be.",
      },
      {
        question: "Does the AI handle both calendars the same way?",
        answer:
          "It knows which calendar a given type of enquiry needs to go into, so bookings land in the right diary without a customer needing to know the difference themselves.",
      },
    ],
    relatedServices: ["enquiries-and-leads", "bookings-and-scheduling", "admin-and-back-office"],
    launchNote: "This system is launching in 2026. Results will be published here once live.",
  },
  {
    slug: "thirty3coffee",
    client: "thirty3coffee",
    industry: "Food & Beverage",
    location: "Nutts Corner",
    status: "launching",
    headline: "Giving an independent coffee shop a proper front door online",
    summary:
      "A fully designed, professionally built website for thirty3coffee, so the brand finally has a home online that matches the quality of what's in the cup.",
    context: [
      "Independent coffee shops live or die on character: the roast, the space, the people behind the counter. Most of that comes through brilliantly on the ground and on Instagram, but it rarely survives the jump to a proper website, because most small, local businesses never get one. That leaves a gap between how good the business actually is and how it's able to present itself to anyone who hasn't already found it on social media.",
      "That gap matters more than it looks. A first-time visitor deciding where to go for coffee, or someone searching for opening hours before they leave the house, forms an impression from whatever they can find in a few seconds. A well-built site closes that gap: it's the first real chance to show the brand properly, on the business's own terms, rather than however an algorithm happens to surface it that day.",
      "For thirty3coffee, that meant a website built the way the brand deserved: designed with real attention to the visuals, fast, easy to navigate on a phone, and structured so people searching locally can actually find it, rather than a generic template standing in for a proper build.",
    ],
    challenge:
      "thirty3coffee didn't have a website that reflected the quality of the business, which meant anyone who hadn't already discovered it on Instagram had no easy way to see the menu, check opening hours, or get a real sense of the place before walking in.",
    approach: [
      {
        title: "A website built to represent the brand properly",
        description:
          "A genuinely designed site, not a template, built around real photography and the character of the business, fast to load and built to work properly on mobile, where most local searches actually happen.",
      },
      {
        title: "A foundation built to grow",
        description:
          "Structured so features like online ordering, table bookings, or loyalty could be layered on in future without a rebuild, whenever the business is ready to take that step.",
      },
    ],
    whatThisMeans:
      "A great product deserves a website that actually looks and feels as good as it is. For thirty3coffee, that meant getting the fundamentals, design, speed, and findability, genuinely right first, giving the brand a proper home online it didn't have before. It's also a foundation built with room to grow: the same site that works well today is ready to take on ordering, bookings, or other automation whenever the business wants to add it.",
    lessons: [
      "A strong website is often the first real signal of quality a new customer sees. It's worth investing in properly, not treating as an afterthought to social media.",
      "Getting the fundamentals right, design, speed, and being findable, is the foundation any future automation gets built on top of.",
      "Independent local businesses benefit from a direct, owned channel that doesn't depend on a social platform's algorithm to be seen.",
      "A well-built site doesn't have to include every feature on day one to be worth doing properly. It just has to be built so those features can be added later without starting over.",
    ],
    faqs: [
      {
        question: "Does thirty3coffee's site include online ordering or bookings?",
        answer:
          "Not yet. This build focused on giving the business a genuinely well-designed, professional web presence first. Online ordering or table bookings can be layered on top of that foundation later, whenever it makes sense for the business.",
      },
      {
        question: "Is thirty3coffee's site live yet?",
        answer:
          "It's built and ready, launching shortly. We'll update this case study with the live site once it's public.",
      },
      {
        question: "Why doesn't this case study include AI features like some of your other work?",
        answer:
          "Because that's what this business needed right now. We scope every project around the business in front of us rather than a fixed package, and here that meant a properly designed, professionally built website.",
      },
    ],
    relatedServices: [],
    launchNote: "thirty3coffee's site is complete and launching shortly. We'll publish the live site here once it's public.",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
