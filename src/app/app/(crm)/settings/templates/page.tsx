import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "../../NoAccountSelected";
import { FeatureLocked } from "../../FeatureLocked";
import { accountHasFeature } from "@/lib/features";
import { createTemplateAction, deleteTemplateAction } from "./actions";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { Card, CardBody } from "@/components/crm/ui/Card";
import { Input, Textarea, Select, Label } from "@/components/crm/ui/Field";
import { Button } from "@/components/crm/ui/Button";
import { Table, THead, Th, TBody, Tr, Td } from "@/components/crm/ui/Table";
import { Badge } from "@/components/crm/ui/Badge";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { IconTemplates } from "@/components/crm/ui/icons";

export const metadata = { robots: { index: false, follow: false } };

const STATUS_TONE: Record<string, "green" | "red" | "neutral"> = {
  approved: "green",
  rejected: "red",
  pending: "neutral",
};

export default async function TemplatesPage() {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) return <NoAccountSelected />;

  const supabase = await createClient();
  if (!(await accountHasFeature(supabase, accountId, "sms_whatsapp"))) {
    return <FeatureLocked feature="sms_whatsapp" />;
  }

  const { data: templates } = await supabase
    .from("message_templates")
    .select("id, name, body, approved_status, provider_content_sid, created_at")
    .eq("account_id", accountId)
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        eyebrow="Settings"
        title="WhatsApp Message Templates"
        description="WhatsApp requires a pre-approved template for any business-initiated message sent more than 24 hours after a contact's last message. Submit and approve templates through Meta Business Manager or Twilio's Content Editor first, then record the approved template and its Content SID here so the inbox can send it."
      />

      <div className="mt-6">
        {templates && templates.length > 0 ? (
          <Table>
            <THead>
              <Th>Name</Th>
              <Th>Body</Th>
              <Th>Status</Th>
              <Th>Content SID</Th>
              <Th></Th>
            </THead>
            <TBody>
              {templates.map((t) => (
                <Tr key={t.id}>
                  <Td className="text-text">{t.name}</Td>
                  <Td className="max-w-xs truncate">{t.body}</Td>
                  <Td>
                    <Badge tone={STATUS_TONE[t.approved_status] ?? "neutral"}>{t.approved_status}</Badge>
                  </Td>
                  <Td>{t.provider_content_sid || "—"}</Td>
                  <Td>
                    <form action={deleteTemplateAction}>
                      <input type="hidden" name="templateId" value={t.id} />
                      <button type="submit" className="text-xs text-text-muted hover:text-red-400">
                        Delete
                      </button>
                    </form>
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        ) : (
          <EmptyState icon={<IconTemplates width={20} height={20} />} title="No templates yet" />
        )}
      </div>

      <Card className="mt-8 max-w-lg">
        <CardBody>
          <form action={createTemplateAction} className="grid gap-4">
            <div>
              <Label htmlFor="name">Template Name</Label>
              <Input id="name" name="name" required placeholder="appointment_reminder" />
            </div>
            <div>
              <Label htmlFor="body">Body (for reference — the actual send uses the Content SID)</Label>
              <Textarea id="body" name="body" required rows={3} />
            </div>
            <div>
              <Label htmlFor="approvedStatus">Approval Status</Label>
              <Select id="approvedStatus" name="approvedStatus">
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="providerContentSid">Twilio/Meta Content SID (required to actually send)</Label>
              <Input id="providerContentSid" name="providerContentSid" placeholder="HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
            </div>
            <Button type="submit" className="mt-2 w-fit">
              Add Template
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
