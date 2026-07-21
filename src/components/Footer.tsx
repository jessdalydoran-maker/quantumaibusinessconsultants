import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";
import { nav, site } from "@/lib/site";
import { services } from "@/lib/content/services";
import { industries } from "@/lib/content/industries";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-alt">
      <Container className="grid gap-12 py-16 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Image
              src="/logo-mark.png"
              alt="Quantum AI Business Consultants logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="font-display text-lg text-gold">Quantum AI</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-text-muted">{site.description}</p>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-text-muted">
            {site.location.locality}, {site.location.region} &middot; Est. {site.founded}
          </p>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.2em] text-text-muted">Services</h3>
          <ul className="mt-4 space-y-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="text-sm text-text-muted hover:text-gold">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.2em] text-text-muted">Industries</h3>
          <ul className="mt-4 space-y-2">
            {industries.map((i) => (
              <li key={i.slug}>
                <Link href={`/industries/${i.slug}`} className="text-sm text-text-muted hover:text-gold">
                  {i.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.2em] text-text-muted">Company</h3>
          <ul className="mt-4 space-y-2">
            {nav
              .filter((n) => !["Services", "Industries"].includes(n.label))
              .map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-text-muted hover:text-gold">
                    {item.label}
                  </Link>
                </li>
              ))}
            <li>
              <Link href="/legal/privacy" className="text-sm text-text-muted hover:text-gold">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/legal/terms" className="text-sm text-text-muted hover:text-gold">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col gap-2 pb-20 pt-6 text-xs text-text-muted sm:pb-6 md:flex-row md:items-center md:justify-between">
          <span>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </span>
          <span>
            <a href={`mailto:${site.contactEmail}`} className="hover:text-gold">
              {site.contactEmail}
            </a>
            {" · "}Response {site.responseTime}
          </span>
        </Container>
      </div>
    </footer>
  );
}
