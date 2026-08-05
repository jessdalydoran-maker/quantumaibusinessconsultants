// A CSS-only glowing sphere, used as the pinned "graphic" for content
// sections that don't have their own bespoke photo/render (unlike the hero,
// which uses hero.png). Keeps the Cerebrium-style "pinned object behind
// scrolling copy" language consistent down the page without needing a new
// bespoke asset per section.
export function GlowOrb({ tone = "gold" }: { tone?: "gold" | "green" }) {
  const core =
    tone === "gold"
      ? "radial-gradient(circle at 38% 32%, rgba(245, 227, 180, 0.95), rgba(213, 176, 84, 0.55) 34%, rgba(151, 98, 59, 0.35) 58%, rgba(2, 19, 10, 0) 72%)"
      : "radial-gradient(circle at 38% 32%, rgba(210, 235, 220, 0.7), rgba(31, 122, 74, 0.55) 34%, rgba(7, 31, 17, 0.5) 58%, rgba(2, 19, 10, 0) 72%)";

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
      <div className="hero-ambient-move relative h-[60vmin] w-[60vmin] max-h-[560px] max-w-[560px]">
        {/* orbit rings */}
        <div className="absolute inset-0 rounded-full border border-gold/20" style={{ transform: "scale(1.28) rotate(-8deg)" }} />
        <div className="absolute inset-0 rounded-full border border-gold/10" style={{ transform: "scale(1.55) rotate(12deg)" }} />
        {/* sphere core */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: core,
            boxShadow:
              tone === "gold"
                ? "0 0 120px 20px rgba(213,176,84,0.18), inset -30px -30px 80px rgba(2,19,10,0.6)"
                : "0 0 120px 20px rgba(31,122,74,0.22), inset -30px -30px 80px rgba(2,19,10,0.65)",
          }}
        />
        {/* Clipped to the sphere's own circle so the bolt only ever crosses
            the orb, not the whole section. */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div className="hero-flash-pulse" />
          <div className="hero-light-sweep" />
          <div className="hero-light-sweep-b" />
        </div>
      </div>
    </div>
  );
}
