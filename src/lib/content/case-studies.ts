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
    headline: "A proper website for a coffee shop, no automation involved",
    summary:
      "A straightforward website for an independent coffee shop, built as a smaller add-on alongside another engagement rather than a stand-alone project.",
    context: [
      "Not every independent business needs, or is asking for, an AI-automated system. A lot of small, local businesses, an independent coffee shop among them, run mainly on social media and word of mouth, without a dedicated website at all. That's workable up to a point, but it makes the basics, checking opening hours, finding the location, seeing the menu, harder than they need to be for anyone not already following the business on Instagram.",
      "thirty3coffee is a second business run by the same client behind Feeney Flooring and Blinds. Rather than scoping and pricing a separate project, building its website was included as part of that engagement, which is why the scope here is deliberately small: a real website, and nothing more.",
      "We think it's worth publishing a case study like this alongside the bigger, AI-driven ones elsewhere on this page. Not every engagement is, or should be, the same size, and being upfront about that is part of being honest about what real client work actually looks like.",
    ],
    challenge:
      "thirty3coffee had no dedicated website to point customers to, relying on social media for basics like opening hours, menu, and location, which made the business harder to find for anyone not already following it online.",
    approach: [
      {
        title: "A clean, simple website",
        description:
          "Hours, menu, and location, done properly and built to actually be found, with no chat widget, ordering system, or automation layered on top, because none was part of the brief.",
      },
    ],
    whatThisMeans:
      "Not every business we work with needs, or gets, a fully AI-automated system, and that's fine. Sometimes the right-sized fix is a straightforward, well-built website, and treating that as a legitimate project in its own right, rather than dressing it up as something bigger, is part of scoping things honestly.",
    lessons: [
      "Not every engagement needs to be an AI-automated system to be worth doing properly. Sometimes a straightforward website is the right-sized fix.",
      "A basic web presence still matters for a small, local business that mostly gets found through social media or word of mouth.",
      "Being upfront about scope, that this was a smaller, website-only project bundled alongside another build, is part of being honest about what real client work looks like, not every case study needs to be the biggest example we have.",
    ],
    faqs: [
      {
        question: "Why doesn't this case study mention any AI features?",
        answer:
          "Because there aren't any. This was scoped and built as a straightforward website, not an AI-automated system, and we're not going to dress up a simple project as something bigger than it was.",
      },
      {
        question: "Is thirty3coffee's site live yet?",
        answer:
          "Not yet; it's built and ready, and will go live alongside Feeney Flooring and Blinds. We'll update the status here once it is.",
      },
      {
        question: "Is thirty3coffee connected to Feeney Flooring and Blinds?",
        answer:
          "Yes, they're run by the same client. Building thirty3coffee's website was included as part of that engagement rather than treated as a separate project, which is reflected in the smaller scope here.",
      },
    ],
    relatedServices: [],
    launchNote:
      "This site is built and will go live alongside Feeney Flooring and Blinds. There's no automation in this build to report a result on, it's a straightforward website.",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
