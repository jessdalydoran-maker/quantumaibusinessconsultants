import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { executeCampaignSend } from "@/lib/campaigns";

export const runtime = "nodejs";
export const maxDuration = 60;

// Vercel Cron (see vercel.json) hits this on a schedule. Vercel automatically
// sends `Authorization: Bearer ${CRON_SECRET}` on cron-triggered requests
// when CRON_SECRET is set — this is the standard way to keep the route from
// being triggerable by anyone who finds the URL.
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
  }

  const admin = createAdminClient();
  const { data: dueCampaigns } = await admin
    .from("campaigns")
    .select("id, account_id")
    .eq("status", "scheduled")
    .lte("scheduled_for", new Date().toISOString());

  const results: Record<string, unknown> = {};
  for (const campaign of dueCampaigns ?? []) {
    results[campaign.id] = await executeCampaignSend(admin, campaign.account_id, campaign.id);
  }

  return NextResponse.json({ processed: dueCampaigns?.length ?? 0, results });
}
