"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { accountHasFeature } from "@/lib/features";
import type { PlaceResult } from "@/lib/google-places";

async function requireContext() {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) throw new Error("No account selected.");
  const supabase = await createClient();
  if (!(await accountHasFeature(supabase, accountId, "contacts"))) {
    throw new Error("Contacts isn't available on this account's current plan.");
  }
  return { profile, accountId, supabase };
}

export async function importPlacesAction(formData: FormData) {
  const { accountId, supabase } = await requireContext();

  const resultsJson = String(formData.get("resultsJson") || "[]");
  const query = String(formData.get("query") || "");
  const selectedIds = formData.getAll("selectedPlaceIds").map(String);
  const results = JSON.parse(resultsJson) as PlaceResult[];

  const toImport = results.filter((r) => selectedIds.includes(r.placeId));
  if (toImport.length === 0) {
    redirect(`/app/contacts/find?q=${encodeURIComponent(query)}`);
  }

  const { data: existing } = await supabase
    .from("contacts")
    .select("place_id")
    .eq("account_id", accountId)
    .in(
      "place_id",
      toImport.map((r) => r.placeId)
    );
  const existingPlaceIds = new Set((existing ?? []).map((c) => c.place_id));

  const rows = toImport
    .filter((r) => !existingPlaceIds.has(r.placeId))
    .map((r) => ({
      account_id: accountId,
      first_name: r.name,
      company: r.name,
      phone: r.phone,
      email: r.email,
      website: r.website,
      source: "lead_search",
      source_detail: `Google Places search: ${query}`,
      place_id: r.placeId,
    }));

  if (rows.length > 0) {
    await supabase.from("contacts").insert(rows);
  }

  revalidatePath("/app/contacts");
  redirect("/app/contacts");
}

export async function createContactFromExtractionAction(formData: FormData) {
  const { accountId, supabase } = await requireContext();

  const firstName = String(formData.get("businessName") || "").trim();
  const email = String(formData.get("email") || "").trim() || null;
  const phone = String(formData.get("phone") || "").trim() || null;
  const sourceUrl = String(formData.get("sourceUrl") || "").trim();

  if (!firstName) throw new Error("Business name is required.");

  const { error } = await supabase.from("contacts").insert({
    account_id: accountId,
    first_name: firstName,
    company: firstName,
    email,
    phone,
    website: sourceUrl || null,
    source: "website_pull",
    source_detail: `Pulled from ${sourceUrl}`,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/app/contacts");
  redirect("/app/contacts");
}
