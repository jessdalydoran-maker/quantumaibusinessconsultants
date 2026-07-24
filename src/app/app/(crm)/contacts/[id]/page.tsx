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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/app/contacts" className="text-sm text-text-muted hover:text-gold">
            ← Back to Contacts
          </Link>
          <h1 className="mt-2 font-display text-3xl text-text">
            {contact.first_name} {contact.last_name || ""}
          </h1>
        </div>
        <form action={deleteContactAction}>
          <input type="hidden" name="contactId" value={contact.id} />
          <button
            type="submit"
            className="rounded-sm border border-border px-3 py-1.5 text-xs text-text-muted hover:border-red-400 hover:text-red-400"
          >
            Delete Contact
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-8">
          <section className="rounded-sm border border-border bg-bg-alt p-6">
            <h2 className="font-display text-lg text-text">Details</h2>
            <form action={updateContactAction} className="mt-4 grid gap-4">
              <input type="hidden" name="contactId" value={contact.id} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-text-muted">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    defaultValue={contact.first_name}
                    required
                    className="mt-1 w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-text-muted">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    defaultValue={contact.last_name ?? ""}
                    className="mt-1 w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-text-muted">Email</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={contact.email ?? ""}
                  className="mt-1 w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-text-muted">Phone</label>
                <input
                  name="phone"
                  defaultValue={contact.phone ?? ""}
                  className="mt-1 w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-text-muted">Company</label>
                <input
                  name="company"
                  defaultValue={contact.company ?? ""}
                  className="mt-1 w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-fit rounded-sm bg-gold px-5 py-2 text-sm font-medium text-bg hover:bg-gold-soft"
              >
                Save Changes
              </button>
            </form>
          </section>

          <section className="rounded-sm border border-border bg-bg-alt p-6">
            <h2 className="font-display text-lg text-text">Tags</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {currentTags.map((t) => (
                <form key={t.id} action={removeTagFromContactAction} className="inline">
                  <input type="hidden" name="contactId" value={contact.id} />
                  <input type="hidden" name="tagId" value={t.id} />
                  <button
                    type="submit"
                    className="rounded-full px-3 py-1 text-xs text-bg hover:opacity-80"
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
                <select
                  name="tagId"
                  className="rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
                >
                  {availableTags.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="rounded-sm border border-border px-4 py-2 text-sm text-text-muted hover:border-gold hover:text-gold"
                >
                  Add Tag
                </button>
              </form>
            )}
          </section>

          <section className="rounded-sm border border-border bg-bg-alt p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg text-text">Custom Fields</h2>
              <Link href="/app/contacts/fields" className="text-xs text-gold hover:underline">
                Manage fields
              </Link>
            </div>
            {(customFields ?? []).length === 0 ? (
              <p className="mt-3 text-sm text-text-muted">No custom fields defined yet.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {(customFields ?? []).map((field) => (
                  <form
                    key={field.id}
                    action={setCustomFieldValueAction}
                    className="flex flex-wrap items-end gap-3"
                  >
                    <input type="hidden" name="contactId" value={contact.id} />
                    <input type="hidden" name="customFieldId" value={field.id} />
                    <div className="min-w-0 flex-1">
                      <label className="block text-xs uppercase tracking-wide text-text-muted">
                        {field.field_name}
                      </label>
                      {field.field_type === "select" ? (
                        <select
                          name="value"
                          defaultValue={valueByField.get(field.id) ?? ""}
                          className="mt-1 w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
                        >
                          <option value="">—</option>
                          {(Array.isArray(field.options) ? field.options : []).map((opt: string) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : field.field_type === "boolean" ? (
                        <select
                          name="value"
                          defaultValue={valueByField.get(field.id) ?? ""}
                          className="mt-1 w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
                        >
                          <option value="">—</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      ) : (
                        <input
                          name="value"
                          type={field.field_type === "date" ? "date" : field.field_type === "number" ? "number" : "text"}
                          defaultValue={valueByField.get(field.id) ?? ""}
                          className="mt-1 w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
                        />
                      )}
                    </div>
                    <button
                      type="submit"
                      className="rounded-sm border border-border px-3 py-2 text-xs text-text-muted hover:border-gold hover:text-gold"
                    >
                      Save
                    </button>
                  </form>
                ))}
              </div>
            )}
          </section>

          {deals && deals.length > 0 && (
            <section className="rounded-sm border border-border bg-bg-alt p-6">
              <h2 className="font-display text-lg text-text">Deals</h2>
              <ul className="mt-3 space-y-2">
                {deals.map((deal) => (
                  <li key={deal.id} className="flex items-center justify-between text-sm">
                    <span className="text-text">{deal.title}</span>
                    <span className="text-text-muted">
                      {deal.currency} {Number(deal.value).toLocaleString()} · {deal.status}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <section className="rounded-sm border border-border bg-bg-alt p-6">
          <h2 className="font-display text-lg text-text">Activity Timeline</h2>
          <form action={addNoteAction} className="mt-4 space-y-2">
            <input type="hidden" name="contactId" value={contact.id} />
            <textarea
              name="content"
              required
              rows={3}
              placeholder="Add a note…"
              className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-sm border border-border px-4 py-2 text-xs text-text-muted hover:border-gold hover:text-gold"
            >
              Add Note
            </button>
          </form>

          <div className="mt-6 space-y-3">
            {(activities ?? []).map((activity) => (
              <div key={activity.id} className="rounded-sm border border-border bg-bg p-3 text-sm">
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
        </section>
      </div>
    </div>
  );
}
