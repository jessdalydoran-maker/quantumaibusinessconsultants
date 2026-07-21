import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { Container } from "@/components/Container";
import { getAllResources } from "@/lib/content/resources";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Straight answers to the questions independent trades and service business owners actually ask about AI automation.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  const posts = getAllResources();

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Straight answers, not AI trend pieces."
        dek="Written for the questions independent business owners actually ask before adopting AI, updated as our thinking and the field move on."
        breadcrumbs={[{ name: "Resources", href: "/resources" }]}
      />

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <div className="max-w-2xl space-y-5 text-text-muted">
            <p>
              Most &quot;AI trends&quot; content is written for other people in the AI industry,
              not for the business owner actually deciding whether to adopt any of it. This
              section is written for the second group. No listicles of buzzwords, no &quot;10 ways
              AI will transform your industry in 2026&quot;, just direct answers to the specific,
              practical questions that come up before, during, and after adopting AI in an
              independent business.
            </p>
            <p>
              Topics span trust and data handling, how to decide between a small quick win and a
              fuller bespoke build, and what this looks like in specific industries: trades,
              salons, garages, professional services. Each piece opens with a direct answer to the
              question in its title, so you can get the substance in a paragraph even if you
              don&apos;t read the rest.
            </p>
            <p>
              This is a working library, not a one-off content push. We add to it as real
              questions come up in discovery calls and client conversations, and revisit older
              pieces as our own approach develops. The dates on each post reflect when it was
              last substantively written or updated, not just published once and abandoned.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <p className="text-xs uppercase tracking-[0.3em] text-bronze">Browse By Topic</p>
          <h2 className="mt-4 max-w-lg font-display text-3xl text-text md:text-4xl">
            Three things people usually want to know.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="font-display text-lg text-text">Trust &amp; data handling</h3>
              <p className="mt-2 text-sm text-text-muted">
                What happens when the AI gets something wrong, whether it&apos;s GDPR compliant,
                and how much control you actually keep. Start with{" "}
                <Link href="/resources/what-happens-when-ai-receptionist-gets-it-wrong" className="text-gold hover:underline">
                  what happens when your AI receptionist gets something wrong
                </Link>
                .
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg text-text">Getting started</h3>
              <p className="mt-2 text-sm text-text-muted">
                What a quick win actually is, how it differs from a full build, and how to decide
                which fits your business. Start with{" "}
                <Link href="/resources/quick-win-vs-bespoke-build-which-to-start-with" className="text-gold hover:underline">
                  quick win vs bespoke build
                </Link>
                .
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg text-text">Industry specifics</h3>
              <p className="mt-2 text-sm text-text-muted">
                How this applies to trades, salons, garages, and professional services
                specifically, not just in general. Start with{" "}
                <Link href="/resources/why-trades-businesses-lose-jobs-to-slow-response-times" className="text-gold hover:underline">
                  why trades businesses lose jobs to slow response times
                </Link>
                .
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="divide-y divide-border border-t border-border">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/resources/${post.slug}`}
                className="group flex flex-col gap-3 py-10 hover:bg-bg-alt md:flex-row md:items-start md:gap-10 md:px-4"
              >
                <span className="shrink-0 text-xs uppercase tracking-wide text-text-muted md:w-32">
                  {new Date(post.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <div>
                  <h2 className="font-display text-xl text-text group-hover:text-gold md:text-2xl">
                    {post.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-text-muted">{post.excerpt}</p>
                  <p className="mt-2 max-w-2xl text-xs text-text-muted">{post.description}</p>
                  <p className="mt-3 text-xs uppercase tracking-wide text-bronze">
                    {post.author}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-16 md:py-24">
        <Container>
          <p className="text-xs uppercase tracking-[0.3em] text-bronze">Who Writes This</p>
          <h2 className="mt-4 max-w-lg font-display text-3xl text-text md:text-4xl">
            Written by the people doing the work.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {site.founders.map((founder) => (
              <div key={founder.name} className="rounded-sm border border-border bg-bg-alt p-8">
                <span className="font-display text-3xl text-gold">{founder.name}</span>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-bronze">{founder.role}</p>
                <p className="mt-4 text-sm text-text-muted">{founder.bio}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-sm text-text-muted">
            Every post is written by Mark or Jess directly, based on real questions from real
            client conversations, not commissioned from a freelance content mill or generated
            wholesale and lightly edited. See the{" "}
            <a href="/about" className="text-gold hover:underline">
              about page
            </a>{" "}
            for more on who they are.
          </p>
        </Container>
      </section>

      <CtaBand title="Didn't find the answer you were looking for?" dek="Ask our AI receptionist in the chat widget, or book a discovery call and ask us directly." />
    </>
  );
}
