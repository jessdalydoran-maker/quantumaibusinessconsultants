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
      <div className="hero-ambient-move absolute inset-0 opacity-[0.26] grayscale">
        <Image src="/hero.png" alt="" fill priority sizes="100vw" className="object-cover" style={{ objectPosition: "70% 40%" }} />
      </div>
      <div className="page-backdrop-stars absolute inset-0 opacity-70" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--color-bg)_88%)]"
      />
      {/* Thin lights drifting across the whole fixed backdrop, not tied to
          any one object's silhouette — ambient rather than object-specific,
          since this layer sits behind every section, not just the hero.
          Full viewport width (not split into halves — that created a hard
          vertical seam at the 50% boundary where the diagonal bolt got cut
          off mid-screen) so each sweep's `left` keyframes (0-150%) resolve
          against the real full width, with the outer PageBackdrop's own
          overflow-hidden as the only clip, at the actual screen edge. */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="hero-light-sweep" />
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="hero-light-sweep-b" style={{ animationDelay: "-5.2s" }} />
      </div>
    </div>
  );
}
