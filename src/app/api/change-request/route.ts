import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/lib/site";

type Attachment = { name: string; url: string };

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const {
    name,
    email,
    company,
    website,
    changeType,
    pageLocation,
    exactSpot,
    contentAction,
    currentContent,
    desiredContent,
    newContent,
    placement,
    urgency,
    notes,
    attachments,
    honeypot,
  } = body as Record<string, string> & { attachments?: Attachment[] };

  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  if (
    !name ||
    !email ||
    !company ||
    !website ||
    !changeType ||
    !pageLocation ||
    !exactSpot ||
    !urgency ||
    (contentAction !== "update" && contentAction !== "add")
  ) {
    return NextResponse.json({ error: "Please fill in all the required fields." }, { status: 400 });
  }

  if (contentAction === "update" && (!currentContent || !desiredContent)) {
    return NextResponse.json(
      { error: "Please tell us what's there now and what it should change to." },
      { status: 400 }
    );
  }

  if (contentAction === "add" && (!newContent || !placement)) {
    return NextResponse.json(
      { error: "Please tell us what to add and exactly where it should go." },
      { status: 400 }
    );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured.");
    return NextResponse.json(
      { error: "The change request form isn't fully configured yet. Please email us directly." },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);

  const attachmentLines =
    Array.isArray(attachments) && attachments.length > 0
      ? ["", "Attachments:", ...attachments.map((a) => `- ${a.name}: ${a.url}`)]
      : [];

  try {
    await resend.emails.send({
      from: `${site.name} Website <enquiries@${site.legacyDomain}>`,
      to: ["jd@quantumbusinessconsultants.com"],
      replyTo: email,
      subject: `Change request from ${name} (${company})`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company}`,
        `Website: ${website}`,
        `Type of change: ${changeType}`,
        `Page: ${pageLocation}`,
        `Location on page: ${exactSpot}`,
        "",
        contentAction === "update" ? "Currently:" : "Add:",
        contentAction === "update" ? currentContent : newContent,
        "",
        contentAction === "update" ? "Change to:" : "Placement:",
        contentAction === "update" ? desiredContent : placement,
        `Urgency: ${urgency}`,
        notes ? `\nNotes:\n${notes}` : null,
        ...attachmentLines,
      ]
        .filter((line) => line !== null)
        .join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send change request email", error);
    return NextResponse.json(
      { error: "Something went wrong sending your request. Please email us directly." },
      { status: 500 }
    );
  }
}
