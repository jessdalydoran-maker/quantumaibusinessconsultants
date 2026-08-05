import Image from "next/image";

// Fixed behind the entire marketing site (see SiteChrome) — position: fixed
// means it never moves as the page scrolls, so every section's content,
// including the plain text sections that have no PinnedSection graphic of
// their own, reads as an overlay on top of it rather than sitting on a flat
// solid background. This is what actually gives the Cerebrium-style
// "content scrolls, imagery stays put" feel across the whole page, not just
// within the hero's own scroll-scale trick.
export function PageBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg" aria-hidden>
      <div className="hero-ambient-move absolute inset-0 opacity-[0.14] grayscale">
        <Image src="/hero.png" alt="" fill priority sizes="100vw" className="object-cover" style={{ objectPosition: "70% 40%" }} />
      </div>
      <div className="page-backdrop-stars absolute inset-0 opacity-70" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--color-bg)_88%)]"
      />
    </div>
  );
}
