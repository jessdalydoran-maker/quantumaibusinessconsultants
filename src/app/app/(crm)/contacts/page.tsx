import Link from "next/link";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "../NoAccountSelected";
import { createTagAction } from "./actions";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { ButtonLink } from "@/components/crm/ui/Button";
import { Input, Select, Label } from "@/components/crm/ui/Field";
import { Table, THead, Th, TBody, Tr, Td } from "@/components/crm/ui/Table";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { IconContacts, IconSearch, IconPlus } from "@/components/crm/ui/icons";

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
    .select("id, first_name, last_name, email, phone, company, website, created_at")
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
      <PageHeader
        eyebrow="CRM"
        title="Contacts"
        description="Every person and business you're in touch with."
        action={
          <>
            <ButtonLink href="/app/contacts/find" variant="outline" icon={<IconSearch width={16} height={16} />}>
              Find Contacts
            </ButtonLink>
            <ButtonLink href="/app/contacts/new" icon={<IconPlus width={16} height={16} />}>
              New Contact
            </ButtonLink>
          </>
        }
      />

      <form method="get" className="mt-6 flex flex-wrap gap-3">
        <Input type="search" name="q" defaultValue={q} placeholder="Search name, email, company…" className="min-w-[16rem] flex-1" />
        <Select name="tag" defaultValue={tag || ""} className="w-auto">
          <option value="">All tags</option>
          {(tags ?? []).map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </Select>
        <button
          type="submit"
          className="rounded-lg border border-border bg-bg-raised px-4 py-2 text-sm text-text hover:border-border-strong"
        >
          Filter
        </button>
      </form>

      <div className="mt-6">
        {contacts && contacts.length > 0 ? (
          <Table>
            <THead>
              <Th>Name</Th>
              <Th>Company</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Website</Th>
            </THead>
            <TBody>
              {contacts.map((contact) => (
                <Tr key={contact.id}>
                  <Td className="text-text">
                    <Link href={`/app/contacts/${contact.id}`} className="font-medium text-text hover:text-gold">
                      {contact.first_name} {contact.last_name || ""}
                    </Link>
                  </Td>
                  <Td>{contact.company || "—"}</Td>
                  <Td>{contact.email || "—"}</Td>
                  <Td>{contact.phone || "—"}</Td>
                  <Td>
                    {contact.website ? (
                      <a
                        href={contact.website.startsWith("http") ? contact.website : `https://${contact.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold hover:underline"
                      >
                        {contact.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      </a>
                    ) : (
                      "—"
                    )}
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        ) : (
          <EmptyState
            icon={<IconContacts width={20} height={20} />}
            title="No contacts yet"
            description="Add one manually, or use Find Contacts to search local businesses."
          />
        )}
      </div>

      <details className="mt-8 rounded-xl border border-border bg-bg-alt/50 p-4">
        <summary className="cursor-pointer text-sm text-text-muted">
          Manage tags · <Link href="/app/contacts/fields" className="text-gold hover:underline">Manage custom fields</Link>
        </summary>
        <form action={createTagAction} className="mt-4 flex flex-wrap items-end gap-3">
          <input type="hidden" name="returnTo" value="/app/contacts" />
          <div>
            <Label htmlFor="tag-name">Tag name</Label>
            <Input id="tag-name" name="name" required className="w-auto" />
          </div>
          <div>
            <Label htmlFor="tag-color">Color</Label>
            <input
              id="tag-color"
              name="color"
              type="color"
              defaultValue="#d5b054"
              className="mt-1 h-10 w-16 rounded-lg border border-border bg-bg"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg border border-border px-4 py-2.5 text-sm text-text-muted hover:border-gold hover:text-gold"
          >
            Add Tag
          </button>
        </form>
        <div className="mt-4 flex flex-wrap gap-2">
          {(tags ?? []).map((t) => (
            <span
              key={t.id}
              className="rounded-full px-3 py-1 text-xs font-medium text-bg"
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
