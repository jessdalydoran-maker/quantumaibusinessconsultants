// Minimal hand-rolled icon set (no external icon library is installed).
// Every icon is a 24x24 stroke-based glyph so they share weight/style.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export const IconDashboard = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3.5" y="3.5" width="7" height="8" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="5" rx="1.5" />
    <rect x="13.5" y="11.5" width="7" height="9" rx="1.5" />
    <rect x="3.5" y="14.5" width="7" height="6" rx="1.5" />
  </svg>
);

export const IconInbox = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3.5 12.5h4.2l1.6 2.4h5.4l1.6-2.4h4.2" />
    <path d="M5.5 12.5 7 5.8a1.5 1.5 0 0 1 1.46-1.3h7.08A1.5 1.5 0 0 1 17 5.8l1.5 6.7" />
    <rect x="3.5" y="12.5" width="17" height="7" rx="1.5" />
  </svg>
);

export const IconContacts = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="9" cy="8" r="3.25" />
    <path d="M3.75 19c.6-3 2.6-4.75 5.25-4.75S13.65 16 14.25 19" />
    <path d="M16 4.5c1.5.3 2.6 1.6 2.6 3.25S17.5 10.7 16 11" />
    <path d="M15.5 14.5c2.2.4 3.7 2 4.2 4.5" />
  </svg>
);

export const IconDeals = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z" />
    <path d="M4 7.5V16l8 4.5 8-4.5V7.5" />
    <path d="M12 12v8.5" />
  </svg>
);

export const IconCalls = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5.3 4.5h3.1l1.3 4-2 1.4a11 11 0 0 0 5.4 5.4l1.4-2 4 1.3v3.1a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 3.8 6.1a1.5 1.5 0 0 1 1.5-1.6Z" />
  </svg>
);

export const IconCampaigns = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3.5 9.5h4l6-3.5v12l-6-3.5h-4Z" />
    <path d="M13.5 6v12" />
    <path d="M16.75 9a3.5 3.5 0 0 1 0 6" />
    <path d="M19.25 6.75a7 7 0 0 1 0 10.5" />
  </svg>
);

export const IconSettings = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3.5v2.1M12 18.4v2.1M4.6 6.6l1.5 1.5M17.9 15.9l1.5 1.5M3.5 12h2.1M18.4 12h2.1M4.6 17.4l1.5-1.5M17.9 8.1l1.5-1.5" />
  </svg>
);

export const IconSms = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 5.5h16v10H9.5L6 19v-3.5H4Z" />
    <path d="M8 9.5h8M8 12h5" />
  </svg>
);

export const IconAi = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />
    <circle cx="12" cy="12" r="3.25" />
  </svg>
);

export const IconVoice = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="9" y="3.5" width="6" height="11" rx="3" />
    <path d="M6 11.5a6 6 0 0 0 12 0" />
    <path d="M12 17.5v3M9 20.5h6" />
  </svg>
);

export const IconTemplates = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="4" y="3.5" width="16" height="17" rx="1.5" />
    <path d="M7.5 8h9M7.5 11.5h9M7.5 15h5.5" />
  </svg>
);

export const IconAdmin = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3.5 19 6v5.5c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6Z" />
    <path d="m9.25 12 1.9 1.9 3.6-3.9" />
  </svg>
);

export const IconChevronDown = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const IconMenu = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 6.5h16M4 12h16M4 17.5h16" />
  </svg>
);

export const IconClose = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m5 5 14 14M19 5 5 19" />
  </svg>
);

export const IconLogout = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 4.5H6a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 6 19.5h3" />
    <path d="M14 8.5 18 12l-4 3.5M18 12H9" />
  </svg>
);

export const IconSearch = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m19.5 19.5-4.3-4.3" />
  </svg>
);

export const IconPlus = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 4.5v15M4.5 12h15" />
  </svg>
);

export const IconArrowRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4.5 12h15M13 5.5 19.5 12 13 18.5" />
  </svg>
);

export const IconSparkle = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3.5c.6 3 2.1 4.5 5.1 5.1-3 .6-4.5 2.1-5.1 5.1-.6-3-2.1-4.5-5.1-5.1 3-.6 4.5-2.1 5.1-5.1Z" />
    <path d="M18.5 15c.3 1.4 1 2.1 2.4 2.4-1.4.3-2.1 1-2.4 2.4-.3-1.4-1-2.1-2.4-2.4 1.4-.3 2.1-1 2.4-2.4Z" />
  </svg>
);
