import Link from "next/link";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "../NoAccountSelected";
import { createTagAction } from "./actions";

export const metadata = { robots: { index: false, follow: false } };

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string }>;
}) {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) return <NoAccountSelected />;

  const { q, tag } = await searchParams;
  const supabase = await createClient();

  const { data: tags } = await supabase
    .from("tags")
    .select("id, name, color")
    .eq("account_id", accountId)
    .order("name");

  let contactIdsForTag: string[] | null = null;
  if (tag) {
    const { data: matches } = await supabase
      .from("contact_tags")
      .select("contact_id")
      .eq("tag_id", tag);
    contactIdsForTag = (matches ?? []).map((m) => m.contact_id);
  }

  let query = supabase
    .from("contacts")
    .select("id, first_name, last_name, email, phone, company, created_at")
    .eq("account_id", accountId)
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(
      `first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%,company.ilike.%${q}%`
    );
  }
  if (contactIdsForTag) {
    query = query.in("id", contactIdsForTag.length > 0 ? contactIdsForTag : ["00000000-0000-0000-0000-000000000000"]);
  }

  const { data: contacts } = await query;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-text">Contacts</h1>
        <div className="flex gap-3">
          <Link
            href="/app/contacts/find"
            className="rounded-sm border border-gold px-4 py-2 text-sm font-medium text-gold hover:bg-gold hover:text-bg"
          >
            Find Contacts
          </Link>
          <Link
            href="/app/contacts/new"
            className="rounded-sm bg-gold px-4 py-2 text-sm font-medium text-bg hover:bg-gold-soft"
          >
            New Contact
          </Link>
        </div>
      </div>

      <form method="get" className="mt-6 flex flex-wrap gap-3">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search name, email, company…"
          className="min-w-[16rem] flex-1 rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
        />
        <select
          name="tag"
          defaultValue={tag || ""}
          className="rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
        >
          <option value="">All tags</option>
          {(tags ?? []).map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-sm border border-border px-4 py-2 text-sm text-text-muted hover:border-gold hover:text-gold"
        >
          Filter
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-sm border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-bg-alt text-text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
            </tr>
          </thead>
          <tbody>
            {(contacts ?? []).map((contact) => (
              <tr key={contact.id} className="border-t border-border hover:bg-bg-alt">
                <td className="px-4 py-3">
                  <Link href={`/app/contacts/${contact.id}`} className="text-text hover:text-gold">
                    {contact.first_name} {contact.last_name || ""}
                  </Link>
                </td>
                <td className="px-4 py-3 text-text-muted">{contact.company || "—"}</td>
                <td className="px-4 py-3 text-text-muted">{contact.email || "—"}</td>
                <td className="px-4 py-3 text-text-muted">{contact.phone || "—"}</td>
              </tr>
            ))}
            {(!contacts || contacts.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-text-muted">
                  No contacts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <details className="mt-8 rounded-sm border border-border bg-bg-alt p-4">
        <summary className="cursor-pointer text-sm text-text-muted">
          Manage tags · <Link href="/app/contacts/fields" className="text-gold hover:underline">Manage custom fields</Link>
        </summary>
        <form action={createTagAction} className="mt-4 flex flex-wrap items-end gap-3">
          <input type="hidden" name="returnTo" value="/app/contacts" />
          <div>
            <label className="block text-xs uppercase tracking-wide text-text-muted">Tag name</label>
            <input
              name="name"
              required
              className="mt-1 rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-text-muted">Color</label>
            <input
              name="color"
              type="color"
              defaultValue="#d5b054"
              className="mt-1 h-9 w-16 rounded-sm border border-border bg-bg"
            />
          </div>
          <button
            type="submit"
            className="rounded-sm border border-border px-4 py-2 text-sm text-text-muted hover:border-gold hover:text-gold"
          >
            Add Tag
          </button>
        </form>
        <div className="mt-4 flex flex-wrap gap-2">
          {(tags ?? []).map((t) => (
            <span
              key={t.id}
              className="rounded-full px-3 py-1 text-xs text-bg"
              style={{ backgroundColor: t.color }}
            >
              {t.name}
            </span>
          ))}
        </div>
      </details>
    </div>
  );
}
