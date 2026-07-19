import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";
import { buildSystemPrompt } from "@/lib/chat-knowledge";
import { site } from "@/lib/site";

export const runtime = "nodejs";

const MODEL = process.env.CHAT_MODEL || "claude-sonnet-5";
const MAX_HISTORY_MESSAGES = 20;

type ChatMessage = { role: "user" | "assistant"; content: string };

const saveLeadTool: Anthropic.Tool = {
  name: "save_lead",
  description:
    "Pass a visitor's contact details and enquiry summary to the team when they've asked to be contacted or seem ready to talk further.",
  input_schema: {
    type: "object",
    properties: {
      name: { type: "string", description: "The visitor's name" },
      email: { type: "string", description: "The visitor's email address" },
      business: { type: "string", description: "The visitor's business name, if given" },
      summary: {
        type: "string",
        description: "A short summary of what the visitor is interested in",
      },
    },
    required: ["name", "email", "summary"],
  },
};

async function saveLead(input: { name: string; email: string; business?: string; summary: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY not configured; lead not emailed:", input);
    return { ok: false };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: `${site.name} AI Receptionist <enquiries@${site.legacyDomain}>`,
      to: [...site.emails],
      replyTo: input.email,
      subject: `New chat lead: ${input.name}${input.business ? ` (${input.business})` : ""}`,
      text: `Captured by the AI receptionist widget.\n\nName: ${input.name}\nEmail: ${input.email}\n${
        input.business ? `Business: ${input.business}\n` : ""
      }\nSummary: ${input.summary}`,
    });
    return { ok: true };
  } catch (error) {
    console.error("Failed to email captured lead", error);
    return { ok: false };
  }
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      reply:
        "The AI receptionist isn't fully connected yet — please email us directly and we'll get right back to you.",
    });
  }

  const body = await req.json().catch(() => null);
  const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages : [];

  if (!messages.length) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  const trimmed = messages.slice(-MAX_HISTORY_MESSAGES);
  const anthropic = new Anthropic({ apiKey });

  try {
    let response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 600,
      system: buildSystemPrompt(),
      tools: [saveLeadTool],
      messages: trimmed.map((m) => ({ role: m.role, content: m.content })),
    });

    let leadCaptured = false;
    const conversation: Anthropic.MessageParam[] = trimmed.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    let guard = 0;
    while (response.stop_reason === "tool_use" && guard < 3) {
      guard += 1;
      conversation.push({ role: "assistant", content: response.content });

      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const block of response.content) {
        if (block.type === "tool_use" && block.name === "save_lead") {
          const result = await saveLead(block.input as never);
          leadCaptured = leadCaptured || result.ok;
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: result.ok
              ? "Lead saved and emailed to the team."
              : "Could not save the lead automatically — ask the visitor to email directly instead.",
          });
        }
      }

      conversation.push({ role: "user", content: toolResults });

      response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 600,
        system: buildSystemPrompt(),
        tools: [saveLeadTool],
        messages: conversation,
      });
    }

    const textBlock = response.content.find((b) => b.type === "text");
    const reply = textBlock && textBlock.type === "text" ? textBlock.text : "";

    return NextResponse.json({ reply, leadCaptured });
  } catch (error) {
    console.error("Chat API error", error);
    return NextResponse.json(
      {
        reply:
          "Something went wrong on our end. Please try again, or email us directly and we'll get right back to you.",
      },
      { status: 200 }
    );
  }
}
