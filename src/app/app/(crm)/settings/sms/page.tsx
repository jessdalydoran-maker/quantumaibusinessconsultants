import Link from "next/link";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "../../NoAccountSelected";
import { FeatureLocked } from "../../FeatureLocked";
import { accountHasFeature } from "@/lib/features";
import { updateTwilioNumberAction } from "./actions";

export const metadata = { robots: { index: false, follow: false } };

export default async function SmsSettingsPage() {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) return <NoAccountSelected />;

  const supabase = await createClient();
  if (!(await accountHasFeature(supabase, accountId, "sms_whatsapp"))) {
    return <FeatureLocked feature="sms_whatsapp" />;
  }

  const { data: account } = await supabase
    .from("accounts")
    .select("twilio_phone_number")
    .eq("id", accountId)
    .single();

  return (
    <div>
      <h1 className="font-display text-3xl text-text">SMS + WhatsApp Number</h1>
      <p className="mt-2 max-w-2xl text-sm text-text-muted">
        This account uses one dedicated Twilio number for both SMS and WhatsApp. Buy/reserve the
        number in the{" "}
        <a
          href="https://console.twilio.com/us1/develop/phone-numbers/manage/incoming"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold hover:underline"
        >
          Twilio Console
        </a>{" "}
        first, then paste it here in E.164 format (e.g. <code>+15551234567</code>).
      </p>

      <div className="mt-4 rounded-sm border border-border bg-bg-alt p-4 text-sm text-text-muted">
        Current number:{" "}
        <span className="text-text">{account?.twilio_phone_number || "Not configured yet"}</span>
      </div>

      <form action={updateTwilioNumberAction} className="mt-6 flex max-w-md items-end gap-3">
        <div className="flex-1">
          <label className="block text-xs uppercase tracking-wide text-text-muted">
            Twilio Phone Number
          </label>
          <input
            name="twilioPhoneNumber"
            required
            placeholder="+15551234567"
            defaultValue={account?.twilio_phone_number ?? ""}
            className="mt-1 w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded-sm bg-gold px-4 py-2 text-sm font-medium text-bg hover:bg-gold-soft"
        >
          Save
        </button>
      </form>

      <p className="mt-8 text-sm text-text-muted">
        Manage WhatsApp message templates at{" "}
        <Link href="/app/settings/templates" className="text-gold hover:underline">
          Settings → Templates
        </Link>
        .
      </p>
    </div>
  );
}
