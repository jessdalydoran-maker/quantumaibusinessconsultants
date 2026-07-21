# Quantum AI Business Consultants — Website

Next.js (App Router) + TypeScript + Tailwind CSS v4 rebuild of aibusinessconsultants.co.uk.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the keys below
npm run dev
```

## Environment variables

See `.env.example` for the full list. Required before launch:

- `ANTHROPIC_API_KEY` — powers the AI receptionist chat widget (`/api/chat`). Without it, the widget replies with a graceful fallback message instead of chatting.
- `RESEND_API_KEY` — sends contact form submissions and AI-captured leads to `hello@quantumbusinessconsultants.com` (`/api/contact` and the chat widget's lead capture tool).
- `NEXT_PUBLIC_GA_ID` — Google Analytics 4 measurement ID. Leave blank to disable analytics.
- `NEXT_PUBLIC_BOOKING_URL` — discovery call booking link (e.g. Calendly). Falls back to `/contact` until set.

## Content

- Services, industries, and case studies are structured data in `src/lib/content/`.
- Blog posts live as MDX files in `content/resources/` with frontmatter (`title`, `description`, `date`, `author`, `excerpt`).
- The AI receptionist's knowledge comes from `src/lib/chat-knowledge.ts`, which is generated from the same structured content — update the content files and the assistant's knowledge updates with them.

## Structure

- `src/app/` — routes (App Router), one folder per page in the sitemap.
- `src/components/` — shared UI (Header, Footer, PageHero, CtaBand, FaqAccordion, ChatWidget, RoiCalculator, ContactForm).
- `src/lib/` — content data, site constants, JSON-LD schema builders, OG image generator.

## Deployment

Built for Vercel. Set the environment variables above in the Vercel project settings before going live — the site builds and runs without them, but the chat widget and contact form won't send anywhere until they're set.
