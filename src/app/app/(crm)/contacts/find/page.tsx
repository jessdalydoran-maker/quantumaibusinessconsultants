import Link from "next/link";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "../../NoAccountSelected";
import { FeatureLocked } from "../../FeatureLocked";
import { accountHasFeature } from "@/lib/features";
import { searchPlaces } from "@/lib/google-places";
import { extractContactFromWebsite } from "@/lib/site-contact-extractor";
import { importPlacesAction, createContactFromExtractionAction } from "./actions";
import { SelectAllCheckbox } from "./SelectAllCheckbox";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { Input, Label } from "@/components/crm/ui/Field";
import { Button } from "@/components/crm/ui/Button";
import { Table, THead, Th, TBody, Tr, Td } from "@/components/crm/ui/Table";
import { Card, CardBody } from "@/components/crm/ui/Card";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { IconSearch } from "@/components/crm/ui/icons";

export const metadata = { robots: { index: false, follow: false } };

export default async function FindContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ tool?: string; q?: string; location?: string; url?: string }>;
}) {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) return <NoAccountSelected />;

  const supabase = await createClient();
  if (!(await accountHasFeature(supabase, accountId, "contacts"))) {
    return <FeatureLocked feature="contacts" />;
  }

  const sp = await searchParams;
  const tool = sp.tool === "website" ? "website" : "search";

  return (
    <div>
      <Link href="/app/contacts" className="text-sm text-text-muted hover:text-gold">
        ← Back to Contacts
      </Link>
      <PageHeader eyebrow="Lead Generation" title="Find Contacts" />

      <div className="mt-6 flex gap-2 border-b border-border text-sm">
        <Link
          href="/app/contacts/find"
          className={`-mb-px border-b-2 px-1 pb-3 transition-colors ${
            tool === "search" ? "border-gold text-gold" : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          Business Search
        </Link>
        <Link
          href="/app/contacts/find?tool=website"
          className={`-mb-px border-b-2 px-1 pb-3 transition-colors ${
            tool === "website" ? "border-gold text-gold" : "border-transparent text-text-muted hover:text-text"
          }`}
        >
          Pull from a Website
        </Link>
      </div>

      {tool === "search" ? (
        <BusinessSearchTool accountId={accountId} query={sp.q} location={sp.location} />
      ) : (
        <WebsitePullTool url={sp.url} />
      )}
    </div>
  );
}

async function BusinessSearchTool({
  accountId,
  query,
  location,
}: {
  accountId: string;
  query?: string;
  location?: string;
}) {
  const supabase = await createClient();

  let results: Awaited<ReturnType<typeof searchPlaces>> = [];
  let searchError: string | null = null;

  if (query) {
    try {
      results = await searchPlaces(query, location);
      await supabase.from("lead_searches").insert({
        account_id: accountId,
        query: location ? `${query} in ${location}` : query,
        result_count: results.length,
      });
    } catch (error) {
      searchError = error instanceof Error ? error.message : "Search failed.";
    }
  }

  const placeIds = results.map((r) => r.placeId);
  const { data: existingContacts } = placeIds.length
    ? await supabase.from("contacts").select("place_id").eq("account_id", accountId).in("place_id", placeIds)
    : { data: [] as { place_id: string | null }[] };
  const alreadyAdded = new Set((existingContacts ?? []).map((c) => c.place_id));

  return (
    <div className="mt-6">
      <p className="max-w-2xl text-sm text-text-muted">
        Searches local businesses via the Google Places API — not a scraper, and ToS-compliant.
        Each search costs a small, real amount against your Google Cloud billing, so it only runs
        when you submit the form below. Email addresses aren&apos;t part of Google&apos;s data —
        where shown, they were pulled from the business&apos;s own website and may be missing or
        wrong for some results.
      </p>

      <form method="get" className="mt-4 flex flex-wrap gap-3">
        <input type="hidden" name="tool" value="search" />
        <Input type="text" name="q" required defaultValue={query} placeholder="e.g. plumbers" className="min-w-[14rem] flex-1" />
        <Input type="text" name="location" defaultValue={location} placeholder="e.g. Stoke-on-Trent" className="min-w-[12rem]" />
        <Button type="submit" icon={<IconSearch width={16} height={16} />}>
          Search
        </Button>
      </form>

      {searchError && <p className="mt-4 text-sm text-red-400">{searchError}</p>}

      {query && !searchError && (
        <form action={importPlacesAction} className="mt-6">
          <input type="hidden" name="query" value={location ? `${query} in ${location}` : query} />
          <input type="hidden" name="resultsJson" value={JSON.stringify(results)} />

          {results.length > 0 ? (
            <Table>
              <THead>
                <Th className="w-8">{results.some((r) => !alreadyAdded.has(r.placeId)) && <SelectAllCheckbox />}</Th>
                <Th>Name</Th>
                <Th>Address</Th>
                <Th>Phone</Th>
                <Th>Email</Th>
                <Th>Website</Th>
                <Th>Rating</Th>
              </THead>
              <TBody>
                {results.map((r) => {
                  const added = alreadyAdded.has(r.placeId);
                  return (
                    <Tr key={r.placeId}>
                      <Td>
                        {added ? (
                          <span className="text-xs text-text-muted">Added</span>
                        ) : (
                          <input type="checkbox" name="selectedPlaceIds" value={r.placeId} className="h-4 w-4 rounded border-border accent-[var(--color-gold)]" />
                        )}
                      </Td>
                      <Td className="text-text">{r.name}</Td>
                      <Td>{r.address}</Td>
                      <Td>{r.phone || "—"}</Td>
                      <Td>{r.email || "—"}</Td>
                      <Td>{r.website || "—"}</Td>
                      <Td>{r.rating ?? "—"}</Td>
                    </Tr>
                  );
                })}
              </TBody>
            </Table>
          ) : (
            <EmptyState icon={<IconSearch width={20} height={20} />} title="No results" description="Try a broader search term or a different location." />
          )}

          {results.length > 0 && (
            <Button type="submit" className="mt-4">
              Import Selected
            </Button>
          )}
        </form>
      )}
    </div>
  );
}

async function WebsitePullTool({ url }: { url?: string }) {
  let extracted: Awaited<ReturnType<typeof extractContactFromWebsite>> | null = null;
  let pullError: string | null = null;

  if (url) {
    try {
      extracted = await extractContactFromWebsite(url);
    } catch (error) {
      pullError = error instanceof Error ? error.message : "Could not fetch that site.";
    }
  }

  return (
    <div className="mt-6">
      <p className="max-w-2xl text-sm text-text-muted">
        Pulls publicly visible contact details from a single business&apos;s own website (and its
        /contact page, if reachable) — for when you already know the one business you want, rather
        than searching broadly.
      </p>

      <form method="get" className="mt-4 flex flex-wrap gap-3">
        <input type="hidden" name="tool" value="website" />
        <Input type="text" name="url" required defaultValue={url} placeholder="https://example-business.co.uk" className="min-w-[18rem] flex-1" />
        <Button type="submit">Fetch</Button>
      </form>

      {pullError && <p className="mt-4 text-sm text-red-400">{pullError}</p>}

      {extracted && !pullError && (
        <Card className="mt-4 max-w-lg">
          <CardBody>
            <p className="text-xs text-text-muted">
              Review and correct before creating the contact — extraction accuracy varies by site.
            </p>
            <form action={createContactFromExtractionAction} className="mt-3 grid gap-4">
              <input type="hidden" name="sourceUrl" value={extracted.sourceUrl} />
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" name="businessName" required defaultValue={extracted.businessName ?? ""} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" defaultValue={extracted.email ?? ""} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" defaultValue={extracted.phone ?? ""} />
              </div>
              {extracted.address && (
                <p className="text-xs text-text-muted">Possible address found: {extracted.address}</p>
              )}
              <Button type="submit" className="mt-2 w-fit">
                Create Contact
              </Button>
            </form>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
