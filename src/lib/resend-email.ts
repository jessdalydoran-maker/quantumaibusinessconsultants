import "server-only";
import { Resend } from "resend";
import { site } from "@/lib/site";

// One shared subdomain handles inbound+outbound for every account. The
// per-conversation reply-to address is what actually disambiguates which
// conversation (and therefore which account) a reply belongs to — see
// docs/inbox-setup.md for the trade-offs of this vs. a dedicated domain per client.
const INBOUND_DOMAIN = process.env.INBOUND_EMAIL_DOMAIN;

export function conversationReplyAddress(conversationId: string): string {
  if (!INBOUND_DOMAIN) {
    throw new Error("INBOUND_EMAIL_DOMAIN is not configured.");
  }
  return `reply+${conversationId}@${INBOUND_DOMAIN}`;
}

export async function sendCallSummaryEmail(params: {
  to: string[];
  accountName: string;
  callerName: string | null;
  fromNumber: string | null;
  durationSeconds: number | null;
  summary: string | null;
  transcript: string | null;
  resolved: boolean | null;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const resend = new Resend(apiKey);
  const needsFollowUp = params.resolved === false;
  const caller = params.callerName || params.fromNumber || "Unknown caller";
  const minutes = params.durationSeconds ? Math.round(params.durationSeconds / 60) : null;

  const subject = `${needsFollowUp ? "[Needs follow-up] " : ""}Call summary — ${caller}`;

  const text = [
    `Account: ${params.accountName}`,
    `Caller: ${caller}`,
    params.fromNumber ? `From: ${params.fromNumber}` : null,
    minutes !== null ? `Duration: ${minutes} min` : null,
    `Resolved by AI: ${params.resolved === null ? "unknown" : params.resolved ? "yes" : "no — needs follow-up"}`,
    "",
    "Summary:",
    params.summary || "(no summary available)",
    "",
    "Transcript:",
    params.transcript || "(no transcript available)",
  ]
    .filter((line) => line !== null)
    .join("\n");

  const { error } = await resend.emails.send({
    from: `${site.name} Voice AI <voice@${site.legacyDomain}>`,
    to: params.to,
    subject,
    text,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function sendConversationEmail(params: {
  conversationId: string;
  to: string;
  subject: string;
  text: string;
}) {
  // Deliberately a separate key/account from RESEND_API_KEY (used by the AI
  // receptionist and contact form) — the inbound domain lives on a different
  // Resend account, and there was no reason to force consolidating them onto
  // one paid account just for this.
  const apiKey = process.env.INBOX_RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("INBOX_RESEND_API_KEY is not configured.");
  }

  const replyAddress = conversationReplyAddress(params.conversationId);
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: `${site.name} <${replyAddress}>`,
    to: [params.to],
    replyTo: replyAddress,
    subject: params.subject,
    text: params.text,
  });

  if (error) {
    throw new Error(error.message);
  }
}
