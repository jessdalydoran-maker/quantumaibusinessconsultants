export function HeroBanner() {
  return (
    <div className="w-full overflow-hidden border-b border-border bg-bg">
      <svg
        viewBox="0 0 1600 460"
        className="h-[220px] w-full sm:h-[300px] md:h-[380px]"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Illustration of phone, chat, booking, and admin enquiries flowing into one unified AI system"
      >
        <defs>
          <linearGradient id="heroBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#03170c" />
            <stop offset="55%" stopColor="#051d10" />
            <stop offset="100%" stopColor="#0a2b16" />
          </linearGradient>
          <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e3c878" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#d5b054" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#d5b054" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="heroLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#d5b054" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#d5b054" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        <rect width="1600" height="460" fill="url(#heroBg)" />

        {/* faint oversized orbit ring for depth */}
        <ellipse
          cx="1180"
          cy="230"
          rx="480"
          ry="300"
          fill="none"
          stroke="#d5b054"
          strokeOpacity="0.06"
        />

        {/* skyline silhouette, echoing the mark inside the logo */}
        <g fill="#97623b" fillOpacity="0.16">
          <rect x="0" y="400" width="60" height="60" />
          <rect x="70" y="370" width="46" height="90" />
          <rect x="128" y="410" width="54" height="50" />
          <rect x="1420" y="390" width="50" height="70" />
          <rect x="1478" y="350" width="42" height="110" />
          <rect x="1528" y="405" width="72" height="55" />
        </g>

        {/* convergence glow */}
        <circle cx="1180" cy="230" r="130" fill="url(#heroGlow)" />

        {/* flow lines from each channel into the convergence point */}
        <g fill="none" stroke="url(#heroLine)" strokeWidth="1.5">
          <path d="M 210 95 C 550 95, 780 150, 1170 225" />
          <path d="M 210 190 C 520 190, 780 200, 1170 228" />
          <path d="M 210 290 C 520 290, 780 260, 1170 232" />
          <path d="M 210 385 C 550 385, 780 320, 1170 236" />
        </g>

        {/* orbit ring + dot around convergence point, echoing the wordmark */}
        <ellipse
          cx="1180"
          cy="230"
          rx="150"
          ry="58"
          fill="none"
          stroke="#d5b054"
          strokeOpacity="0.55"
          transform="rotate(-12 1180 230)"
        />
        <circle cx="1318" cy="205" r="5" fill="#d5b054" fillOpacity="0.8" />
        <circle cx="1180" cy="230" r="9" fill="#e3c878" />
        <circle cx="1180" cy="230" r="16" fill="none" stroke="#e3c878" strokeOpacity="0.5" />

        {/* sparkle accent */}
        <g transform="translate(1050,120)" stroke="#e3c878" strokeOpacity="0.85" strokeWidth="1.5">
          <line x1="-14" y1="0" x2="14" y2="0" />
          <line x1="0" y1="-14" x2="0" y2="14" />
          <line x1="-8" y1="-8" x2="8" y2="8" strokeWidth="0.75" />
          <line x1="-8" y1="8" x2="8" y2="-8" strokeWidth="0.75" />
        </g>

        {/* channel 1: call */}
        <g transform="translate(210,95)">
          <circle r="34" fill="#03170c" stroke="#d5b054" strokeOpacity="0.5" />
          <circle r="2.5" fill="#d5b054" />
          <path d="M 5 0 A 9 9 0 0 1 5 0" fill="none" stroke="#d5b054" strokeWidth="1.5" />
          <path d="M 8 -9 A 12.5 12.5 0 0 1 8 9" fill="none" stroke="#d5b054" strokeWidth="1.5" strokeOpacity="0.85" />
          <path d="M 12 -16 A 22 22 0 0 1 12 16" fill="none" stroke="#d5b054" strokeWidth="1.5" strokeOpacity="0.55" />
        </g>

        {/* channel 2: chat */}
        <g transform="translate(210,190)">
          <circle r="34" fill="#03170c" stroke="#d5b054" strokeOpacity="0.5" />
          <path
            d="M -14 -8 Q -14 -14 -8 -14 L 8 -14 Q 14 -14 14 -8 L 14 2 Q 14 8 8 8 L -4 8 L -11 14 L -10 8 L -8 8 Q -14 8 -14 2 Z"
            fill="none"
            stroke="#d5b054"
            strokeWidth="1.5"
          />
          <circle cx="-5" cy="-3" r="1.4" fill="#d5b054" />
          <circle cx="0" cy="-3" r="1.4" fill="#d5b054" />
          <circle cx="5" cy="-3" r="1.4" fill="#d5b054" />
        </g>

        {/* channel 3: booking */}
        <g transform="translate(210,290)">
          <circle r="34" fill="#03170c" stroke="#d5b054" strokeOpacity="0.5" />
          <rect x="-14" y="-11" width="28" height="24" rx="2" fill="none" stroke="#d5b054" strokeWidth="1.5" />
          <line x1="-14" y1="-4" x2="14" y2="-4" stroke="#d5b054" strokeWidth="1.5" />
          <line x1="-7" y1="-15" x2="-7" y2="-8" stroke="#d5b054" strokeWidth="1.5" />
          <line x1="7" y1="-15" x2="7" y2="-8" stroke="#d5b054" strokeWidth="1.5" />
          <path d="M -6 4 L -2 8 L 7 -2" fill="none" stroke="#d5b054" strokeWidth="1.5" />
        </g>

        {/* channel 4: admin */}
        <g transform="translate(210,385)">
          <circle r="34" fill="#03170c" stroke="#d5b054" strokeOpacity="0.5" />
          <path
            d="M -11 -15 L 5 -15 L 13 -7 L 13 15 L -11 15 Z"
            fill="none"
            stroke="#d5b054"
            strokeWidth="1.5"
          />
          <path d="M 5 -15 L 5 -7 L 13 -7" fill="none" stroke="#d5b054" strokeWidth="1.5" />
          <line x1="-5" y1="-1" x2="7" y2="-1" stroke="#d5b054" strokeWidth="1.25" strokeOpacity="0.8" />
          <line x1="-5" y1="4" x2="7" y2="4" stroke="#d5b054" strokeWidth="1.25" strokeOpacity="0.8" />
          <line x1="-5" y1="9" x2="3" y2="9" stroke="#d5b054" strokeWidth="1.25" strokeOpacity="0.8" />
        </g>
      </svg>
    </div>
  );
}
