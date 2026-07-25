import Link from "next/link";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "../../NoAccountSelected";
import { FeatureLocked } from "../../FeatureLocked";
import { accountHasFeature } from "@/lib/features";
import { updateTwilioNumberAction } from "./actions";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { Card, CardBody } from "@/components/crm/ui/Card";
import { Input, Label } from "@/components/crm/ui/Field";
import { Button } from "@/components/crm/ui/Button";

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
      <PageHeader
        eyebrow="Settings"
        title="SMS + WhatsApp Number"
        description={
          <>
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
          </>
        }
      />

      <Card className="mt-6 max-w-md">
        <CardBody>
          <p className="text-sm text-text-muted">
            Current number: <span className="text-text">{account?.twilio_phone_number || "Not configured yet"}</span>
          </p>
          <form action={updateTwilioNumberAction} className="mt-4 flex items-end gap-3">
            <div className="flex-1">
              <Label htmlFor="twilioPhoneNumber">Twilio Phone Number</Label>
              <Input id="twilioPhoneNumber" name="twilioPhoneNumber" required placeholder="+15551234567" defaultValue={account?.twilio_phone_number ?? ""} />
            </div>
            <Button type="submit">Save</Button>
          </form>
        </CardBody>
      </Card>

      <p className="mt-6 text-sm text-text-muted">
        Manage WhatsApp message templates at{" "}
        <Link href="/app/settings/templates" className="text-gold hover:underline">
          Settings → Templates
        </Link>
        .
      </p>
    </div>
  );
}
