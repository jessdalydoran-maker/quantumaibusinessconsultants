import Link from "next/link";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "../../NoAccountSelected";
import { FeatureLocked } from "../../FeatureLocked";
import { accountHasFeature } from "@/lib/features";
import { searchPlaces } from "@/lib/google-places";
import { extractContactFromWebsite } from "@/lib/site-contact-extractor";
import { importPlacesAction, createContactFromExtractionAction } from "./actions";

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
      <h1 className="mt-2 font-display text-3xl text-text">Find Contacts</h1>

      <div className="mt-6 flex gap-4 border-b border-border text-sm">
        <Link
          href="/app/contacts/find"
          className={`pb-2 ${tool === "search" ? "border-b-2 border-gold text-gold" : "text-text-muted"}`}
        >
          Business Search
        </Link>
        <Link
          href="/app/contacts/find?tool=website"
          className={`pb-2 ${tool === "website" ? "border-b-2 border-gold text-gold" : "text-text-muted"}`}
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
        when you submit the form below.
      </p>

      <form method="get" className="mt-4 flex flex-wrap gap-3">
        <input type="hidden" name="tool" value="search" />
        <input
          type="text"
          name="q"
          required
          defaultValue={query}
          placeholder="e.g. plumbers"
          className="min-w-[14rem] flex-1 rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
        />
        <input
          type="text"
          name="location"
          defaultValue={location}
          placeholder="e.g. Stoke-on-Trent"
          className="min-w-[12rem] rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-sm bg-gold px-5 py-2 text-sm font-medium text-bg hover:bg-gold-soft"
        >
          Search
        </button>
      </form>

      {searchError && <p className="mt-4 text-sm text-red-400">{searchError}</p>}

      {query && !searchError && (
        <form action={importPlacesAction} className="mt-6">
          <input type="hidden" name="query" value={location ? `${query} in ${location}` : query} />
          <input type="hidden" name="resultsJson" value={JSON.stringify(results)} />

          <div className="overflow-x-auto rounded-sm border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg-alt text-text-muted">
                <tr>
                  <th className="px-4 py-3"></th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Website</th>
                  <th className="px-4 py-3">Rating</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => {
                  const added = alreadyAdded.has(r.placeId);
                  return (
                    <tr key={r.placeId} className="border-t border-border">
                      <td className="px-4 py-3">
                        {added ? (
                          <span className="text-xs text-text-muted">Added</span>
                        ) : (
                          <input type="checkbox" name="selectedPlaceIds" value={r.placeId} />
                        )}
                      </td>
                      <td className="px-4 py-3 text-text">{r.name}</td>
                      <td className="px-4 py-3 text-text-muted">{r.address}</td>
                      <td className="px-4 py-3 text-text-muted">{r.phone || "—"}</td>
                      <td className="px-4 py-3 text-text-muted">{r.website || "—"}</td>
                      <td className="px-4 py-3 text-text-muted">{r.rating ?? "—"}</td>
                    </tr>
                  );
                })}
                {results.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-text-muted">
                      No results.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {results.length > 0 && (
            <button
              type="submit"
              className="mt-4 rounded-sm bg-gold px-5 py-2 text-sm font-medium text-bg hover:bg-gold-soft"
            >
              Import Selected
            </button>
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
        <input
          type="text"
          name="url"
          required
          defaultValue={url}
          placeholder="https://example-business.co.uk"
          className="min-w-[18rem] flex-1 rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-sm bg-gold px-5 py-2 text-sm font-medium text-bg hover:bg-gold-soft"
        >
          Fetch
        </button>
      </form>

      {pullError && <p className="mt-4 text-sm text-red-400">{pullError}</p>}

      {extracted && !pullError && (
        <>
          <p className="mt-4 text-xs text-text-muted">
            Review and correct before creating the contact — extraction accuracy varies by site.
          </p>
          <form action={createContactFromExtractionAction} className="mt-3 grid max-w-lg gap-4">
            <input type="hidden" name="sourceUrl" value={extracted.sourceUrl} />
            <div>
              <label className="block text-xs uppercase tracking-wide text-text-muted">
                Business Name
              </label>
              <input
                name="businessName"
                required
                defaultValue={extracted.businessName ?? ""}
                className="mt-1 w-full rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-text-muted">Email</label>
              <input
                name="email"
                defaultValue={extracted.email ?? ""}
                className="mt-1 w-full rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-text-muted">Phone</label>
              <input
                name="phone"
                defaultValue={extracted.phone ?? ""}
                className="mt-1 w-full rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
              />
            </div>
            {extracted.address && (
              <p className="text-xs text-text-muted">Possible address found: {extracted.address}</p>
            )}
            <button
              type="submit"
              className="mt-2 w-fit rounded-sm bg-gold px-5 py-2 text-sm font-medium text-bg hover:bg-gold-soft"
            >
              Create Contact
            </button>
          </form>
        </>
      )}
    </div>
  );
}
