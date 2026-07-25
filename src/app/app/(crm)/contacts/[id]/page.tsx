import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "../../NoAccountSelected";
import {
  updateContactAction,
  deleteContactAction,
  addTagToContactAction,
  removeTagFromContactAction,
  setCustomFieldValueAction,
  addNoteAction,
} from "../actions";
import { Card, CardHeader, CardBody } from "@/components/crm/ui/Card";
import { Button } from "@/components/crm/ui/Button";
import { Input, Textarea, Select, Label } from "@/components/crm/ui/Field";

export const metadata = { robots: { index: false, follow: false } };

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) return <NoAccountSelected />;

  const supabase = await createClient();

  const { data: contact } = await supabase
    .from("contacts")
    .select("*")
    .eq("id", id)
    .eq("account_id", accountId)
    .single();

  if (!contact) notFound();

  const [{ data: allTags }, { data: contactTagRows }, { data: customFields }, { data: values }, { data: deals }, { data: activities }] =
    await Promise.all([
      supabase.from("tags").select("id, name, color").eq("account_id", accountId).order("name"),
      supabase.from("contact_tags").select("tag_id").eq("contact_id", id),
      supabase
        .from("custom_fields")
        .select("id, field_name, field_type, options")
        .eq("account_id", accountId)
        .order("field_name"),
      supabase.from("custom_field_values").select("custom_field_id, value").eq("contact_id", id),
      supabase
        .from("deals")
        .select("id, title, value, currency, status")
        .eq("contact_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("activities")
        .select("id, type, content, created_at")
        .eq("contact_id", id)
        .order("created_at", { ascending: false }),
    ]);

  const contactTagIds = new Set((contactTagRows ?? []).map((r) => r.tag_id));
  const currentTags = (allTags ?? []).filter((t) => contactTagIds.has(t.id));
  const availableTags = (allTags ?? []).filter((t) => !contactTagIds.has(t.id));
  const valueByField = new Map((values ?? []).map((v) => [v.custom_field_id, v.value]));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <Link href="/app/contacts" className="text-sm text-text-muted hover:text-gold">
            ← Back to Contacts
          </Link>
          <h1 className="mt-2 font-display text-2xl text-text sm:text-3xl">
            {contact.first_name} {contact.last_name || ""}
          </h1>
        </div>
        <form action={deleteContactAction}>
          <input type="hidden" name="contactId" value={contact.id} />
          <Button type="submit" variant="danger" size="sm">
            Delete Contact
          </Button>
        </form>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Details" />
            <CardBody>
              <form action={updateContactAction} className="grid gap-4">
                <input type="hidden" name="contactId" value={contact.id} />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" defaultValue={contact.first_name} required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" defaultValue={contact.last_name ?? ""} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" defaultValue={contact.email ?? ""} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" defaultValue={contact.phone ?? ""} />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" name="company" defaultValue={contact.company ?? ""} />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" name="website" defaultValue={contact.website ?? ""} placeholder="https://example.com" />
                </div>
                <Button type="submit" className="w-fit">
                  Save Changes
                </Button>
              </form>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Tags" />
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {currentTags.map((t) => (
                  <form key={t.id} action={removeTagFromContactAction} className="inline">
                    <input type="hidden" name="contactId" value={contact.id} />
                    <input type="hidden" name="tagId" value={t.id} />
                    <button
                      type="submit"
                      className="rounded-full px-3 py-1 text-xs font-medium text-bg hover:opacity-80"
                      style={{ backgroundColor: t.color }}
                      title="Remove tag"
                    >
                      {t.name} ×
                    </button>
                  </form>
                ))}
                {currentTags.length === 0 && <p className="text-sm text-text-muted">No tags yet.</p>}
              </div>
              {availableTags.length > 0 && (
                <form action={addTagToContactAction} className="mt-4 flex gap-2">
                  <input type="hidden" name="contactId" value={contact.id} />
                  <Select name="tagId" className="w-auto">
                    {availableTags.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </Select>
                  <Button type="submit" variant="secondary" size="sm">
                    Add Tag
                  </Button>
                </form>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Custom Fields"
              action={
                <Link href="/app/contacts/fields" className="text-xs text-gold hover:underline">
                  Manage fields
                </Link>
              }
            />
            <CardBody>
              {(customFields ?? []).length === 0 ? (
                <p className="text-sm text-text-muted">No custom fields defined yet.</p>
              ) : (
                <div className="space-y-4">
                  {(customFields ?? []).map((field) => (
                    <form
                      key={field.id}
                      action={setCustomFieldValueAction}
                      className="flex flex-wrap items-end gap-3"
                    >
                      <input type="hidden" name="contactId" value={contact.id} />
                      <input type="hidden" name="customFieldId" value={field.id} />
                      <div className="min-w-0 flex-1">
                        <Label>{field.field_name}</Label>
                        {field.field_type === "select" ? (
                          <Select name="value" defaultValue={valueByField.get(field.id) ?? ""}>
                            <option value="">—</option>
                            {(Array.isArray(field.options) ? field.options : []).map((opt: string) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </Select>
                        ) : field.field_type === "boolean" ? (
                          <Select name="value" defaultValue={valueByField.get(field.id) ?? ""}>
                            <option value="">—</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </Select>
                        ) : (
                          <Input
                            name="value"
                            type={field.field_type === "date" ? "date" : field.field_type === "number" ? "number" : "text"}
                            defaultValue={valueByField.get(field.id) ?? ""}
                          />
                        )}
                      </div>
                      <Button type="submit" variant="secondary" size="sm">
                        Save
                      </Button>
                    </form>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {deals && deals.length > 0 && (
            <Card>
              <CardHeader title="Deals" />
              <CardBody>
                <ul className="space-y-2">
                  {deals.map((deal) => (
                    <li key={deal.id} className="flex items-center justify-between text-sm">
                      <span className="text-text">{deal.title}</span>
                      <span className="text-text-muted">
                        {deal.currency} {Number(deal.value).toLocaleString()} · {deal.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}
        </div>

        <Card className="h-fit">
          <CardHeader title="Activity Timeline" />
          <CardBody>
            <form action={addNoteAction} className="space-y-2">
              <input type="hidden" name="contactId" value={contact.id} />
              <Textarea name="content" required rows={3} placeholder="Add a note…" />
              <Button type="submit" variant="secondary" size="sm">
                Add Note
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              {(activities ?? []).map((activity) => (
                <div key={activity.id} className="rounded-lg border border-border bg-bg/60 p-3 text-sm">
                  <p className="text-text">{activity.content}</p>
                  <p className="mt-1 text-xs text-text-muted">
                    {activity.type} · {new Date(activity.created_at).toLocaleString("en-GB")}
                  </p>
                </div>
              ))}
              {(!activities || activities.length === 0) && (
                <p className="text-sm text-text-muted">No activity yet.</p>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
