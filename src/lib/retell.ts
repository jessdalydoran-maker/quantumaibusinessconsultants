import "server-only";
import crypto from "node:crypto";
import Retell from "retell-sdk";

// FLAGGED (see docs/build-log.md, Prompt 9): Retell's own docs describe
// verifying webhooks via a bundled `Retell.verify(rawBody, apiKey, signature)`
// SDK helper, but the currently-installed `retell-sdk` (5.48.0) does not
// export any such function — it's a modern auto-generated API client with no
// webhook-verification helper in it. This is a best-effort HMAC-SHA256
// implementation (raw body signed with the API key, hex digest, compared to
// the `x-retell-signature` header) based on their documented description,
// NOT confirmed against a real webhook delivery. Test this against an actual
// Retell account before relying on it, and re-check Retell's current docs —
// this is exactly the kind of integration detail likely to have moved.
export function verifyRetellSignature(rawBody: string, signature: string | null): boolean {
  const apiKey = process.env.RETELL_API_KEY;
  if (!apiKey || !signature) return false;
  const expected = crypto.createHmac("sha256", apiKey).update(rawBody).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

function getClient() {
  const apiKey = process.env.RETELL_API_KEY;
  if (!apiKey) throw new Error("RETELL_API_KEY is not configured.");
  return new Retell({ apiKey });
}

// Creates (or updates, if provider_agent_id already exists) the Retell agent
// for an account: an LLM resource carrying the business context as its
// system prompt plus a custom "book_appointment" tool wired to our function
// webhook, and an Agent resource on top of it. FLAGGED: field names below
// (voice_id, response_engine shape, general_tools shape) are Retell's
// documented conventions at time of writing, not verified against a live
// account in this session — confirm against the Retell dashboard/current API
// reference when actually provisioning a client's agent, and adjust as needed.
export async function createOrUpdateRetellAgent(params: {
  existingAgentId?: string | null;
  existingLlmId?: string | null;
  businessContext: string;
  fallbackPhoneNumber?: string | null;
  functionWebhookUrl: string;
}): Promise<{ agentId: string; llmId: string }> {
  const client = getClient();

  const systemPrompt = `You are the phone receptionist for this business. Answer questions using only the information below — never invent facts, prices, or availability.

## Business information
${params.businessContext || "(no business context configured yet)"}

## What you can do
- Answer questions from the business information above.
- Book an appointment using the book_appointment function once the caller has agreed on a specific date/time — always confirm the details back to them first.
- If you can't help, or the caller asks for something you're not confident about, transfer the call to a human.`;

  const tools = [
    {
      type: "custom" as const,
      name: "book_appointment",
      description: "Book an appointment once the caller has agreed on a specific date and time.",
      url: params.functionWebhookUrl,
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          starts_at: { type: "string", description: "ISO 8601 start time" },
          ends_at: { type: "string", description: "ISO 8601 end time" },
        },
        required: ["title", "starts_at", "ends_at"],
      },
    },
    ...(params.fallbackPhoneNumber
      ? [
          {
            type: "transfer_call" as const,
            name: "transfer_to_human",
            description: "Transfer the call to a human team member when you can't help.",
            transfer_destination: { type: "predefined" as const, number: params.fallbackPhoneNumber },
          },
        ]
      : []),
  ];

  const llm = params.existingLlmId
    ? await client.llm.update(params.existingLlmId, {
        general_prompt: systemPrompt,
        general_tools: tools as never,
      })
    : await client.llm.create({
        general_prompt: systemPrompt,
        general_tools: tools as never,
      });

  const agent = params.existingAgentId
    ? await client.agent.update(params.existingAgentId, { agent_name: "Quantum CRM Receptionist" })
    : await client.agent.create({
        agent_name: "Quantum CRM Receptionist",
        voice_id: "11labs-Adrian",
        response_engine: { type: "retell-llm", llm_id: llm.llm_id },
      });

  return { agentId: agent.agent_id, llmId: llm.llm_id };
}
