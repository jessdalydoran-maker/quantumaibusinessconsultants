import Link from "next/link";
import { site } from "@/lib/site";

export function AuthorByline({ authorName }: { authorName: string }) {
  const founder = site.founders.find((f) => f.name === authorName);
  if (!founder) return null;

  return (
    <Link
      href="/about"
      className="group mt-16 flex items-start gap-4 rounded-sm border border-border bg-bg-alt p-6 hover:border-gold"
    >
      <span className="font-display text-3xl text-gold">{founder.name}</span>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-bronze">{founder.role}</p>
        <p className="mt-2 text-sm text-text-muted">{founder.bio}</p>
        <p className="mt-2 text-xs text-gold opacity-0 transition-opacity group-hover:opacity-100">
          More about the team &rarr;
        </p>
      </div>
    </Link>
  );
}
