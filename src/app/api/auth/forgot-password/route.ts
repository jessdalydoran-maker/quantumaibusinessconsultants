import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { site } from "@/lib/site";

// Supabase's own auth email sender works but has low deliverability/rate
// limits out of the box. Resend is already the verified sender for every
// other outbound email in this app, so instead of using
// supabase.auth.resetPasswordForEmail() (which sends via Supabase), this
// generates the recovery link server-side with the service-role client and
// sends it ourselves through Resend.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  // Always return the same generic response regardless of whether the email
  // exists, matches a user, or the send failed — don't let this endpoint be
  // used to enumerate valid accounts.
  const genericResponse = NextResponse.json({ ok: true });

  if (!email) return genericResponse;

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: {
      redirectTo: `${site.url}/api/auth/confirm?next=/app/reset-password`,
    },
  });

  if (error || !data?.properties?.action_link) {
    // Most commonly: no user with this email. Log for our own visibility,
    // but the response to the browser stays identical either way.
    if (error) console.error("generateLink failed:", error.message);
    return genericResponse;
  }

  // Deliberately INBOX_RESEND_API_KEY, not RESEND_API_KEY: the latter's
  // Resend account only has a domain verified for a different, unrelated
  // product on the same account — sending from it 403s. INBOX_RESEND_API_KEY
  // has inbound.quantumbusinessconsultants.com verified (used elsewhere for
  // conversation emails), so reuse that for a real, deliverable sender.
  const apiKey = process.env.INBOX_RESEND_API_KEY;
  const inboundDomain = process.env.INBOUND_EMAIL_DOMAIN;
  if (!apiKey || !inboundDomain) {
    console.error("INBOX_RESEND_API_KEY/INBOUND_EMAIL_DOMAIN not configured — could not send password reset email.");
    return genericResponse;
  }

  try {
    const resend = new Resend(apiKey);
    const { error: sendResultError } = await resend.emails.send({
      from: `${site.name} <noreply@${inboundDomain}>`,
      to: [email],
      subject: "Reset your Quantum CRM password",
      text: [
        "We received a request to reset your Quantum CRM password.",
        "",
        `Click this link to choose a new one: ${data.properties.action_link}`,
        "",
        "This link expires soon and can only be used once. If you didn't request this, you can ignore this email.",
      ].join("\n"),
    });
    if (sendResultError) {
      console.error("Resend rejected the password reset email:", sendResultError.message);
    }
  } catch (sendError) {
    console.error("Failed to send password reset email:", sendError);
  }

  return genericResponse;
}
