import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "../../NoAccountSelected";
import { FeatureLocked } from "../../FeatureLocked";
import { accountHasFeature } from "@/lib/features";
import { createTemplateAction, deleteTemplateAction } from "./actions";

export const metadata = { robots: { index: false, follow: false } };

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
      <h1 className="font-display text-3xl text-text">WhatsApp Message Templates</h1>
      <p className="mt-2 max-w-2xl text-sm text-text-muted">
        WhatsApp requires a pre-approved template for any business-initiated message sent more
        than 24 hours after a contact&apos;s last message. Submit and approve templates through
        Meta Business Manager or Twilio&apos;s Content Editor first, then record the approved
        template and its Content SID here so the inbox can send it.
      </p>

      <div className="mt-6 overflow-x-auto rounded-sm border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-alt text-text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Body</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Content SID</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {(templates ?? []).map((t) => (
              <tr key={t.id} className="border-t border-border">
                <td className="px-4 py-3 text-text">{t.name}</td>
                <td className="max-w-xs truncate px-4 py-3 text-text-muted">{t.body}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      t.approved_status === "approved"
                        ? "bg-green-500/20 text-green-400"
                        : t.approved_status === "rejected"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-bg-alt text-text-muted"
                    }`}
                  >
                    {t.approved_status}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-muted">{t.provider_content_sid || "—"}</td>
                <td className="px-4 py-3">
                  <form action={deleteTemplateAction}>
                    <input type="hidden" name="templateId" value={t.id} />
                    <button
                      type="submit"
                      className="text-xs text-text-muted hover:text-red-400"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {(!templates || templates.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-text-muted">
                  No templates yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form action={createTemplateAction} className="mt-8 grid max-w-lg gap-4">
        <div>
          <label className="block text-xs uppercase tracking-wide text-text-muted">
            Template Name
          </label>
          <input
            name="name"
            required
            placeholder="appointment_reminder"
            className="mt-1 w-full rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-text-muted">
            Body (for reference — the actual send uses the Content SID)
          </label>
          <textarea
            name="body"
            required
            rows={3}
            className="mt-1 w-full rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-text-muted">
            Approval Status
          </label>
          <select
            name="approvedStatus"
            className="mt-1 w-full rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-text-muted">
            Twilio/Meta Content SID (required to actually send)
          </label>
          <input
            name="providerContentSid"
            placeholder="HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            className="mt-1 w-full rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="mt-2 w-fit rounded-sm bg-gold px-5 py-2 text-sm font-medium text-bg hover:bg-gold-soft"
        >
          Add Template
        </button>
      </form>
    </div>
  );
}
