import Image from "next/image";

export function HeroBanner() {
  return (
    <div className="relative h-[220px] w-full overflow-hidden border-b border-border bg-bg sm:h-[300px] md:h-[420px]">
      <Image
        src="/hero.png"
        alt="Quantum AI Business Consultants — clarity, strategy, and exponential growth for ambitious businesses, powered by data-driven AI systems."
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
    </div>
  );
}
