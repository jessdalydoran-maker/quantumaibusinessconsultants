"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";

async function requireAccountContext() {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) {
    throw new Error("No account selected.");
  }
  const supabase = await createClient();
  return { profile, accountId, supabase };
}

async function logActivity(
  supabase: Awaited<ReturnType<typeof createClient>>,
  accountId: string,
  userId: string,
  contactId: string,
  content: string,
  type: "note" | "status_change" | "system" = "system"
) {
  await supabase.from("activities").insert({
    account_id: accountId,
    contact_id: contactId,
    user_id: userId,
    type,
    content,
  });
}

export async function createContactAction(formData: FormData) {
  const { profile, accountId, supabase } = await requireAccountContext();

  const firstName = String(formData.get("firstName") || "").trim();
  const lastName = String(formData.get("lastName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const company = String(formData.get("company") || "").trim();

  if (!firstName) {
    throw new Error("First name is required.");
  }

  const { data: contact, error } = await supabase
    .from("contacts")
    .insert({
      account_id: accountId,
      first_name: firstName,
      last_name: lastName || null,
      email: email || null,
      phone: phone || null,
      company: company || null,
      source: "manual",
    })
    .select("id")
    .single();

  if (error || !contact) {
    throw new Error(error?.message || "Could not create the contact.");
  }

  await logActivity(
    supabase,
    accountId,
    profile.id,
    contact.id,
    `${profile.full_name || profile.email} created this contact.`
  );

  revalidatePath("/app/contacts");
  redirect(`/app/contacts/${contact.id}`);
}

export async function updateContactAction(formData: FormData) {
  const { profile, accountId, supabase } = await requireAccountContext();

  const contactId = String(formData.get("contactId") || "");
  const firstName = String(formData.get("firstName") || "").trim();
  const lastName = String(formData.get("lastName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const company = String(formData.get("company") || "").trim();

  if (!contactId || !firstName) {
    throw new Error("First name is required.");
  }

  const { error } = await supabase
    .from("contacts")
    .update({
      first_name: firstName,
      last_name: lastName || null,
      email: email || null,
      phone: phone || null,
      company: company || null,
    })
    .eq("id", contactId)
    .eq("account_id", accountId);

  if (error) throw new Error(error.message);

  await logActivity(
    supabase,
    accountId,
    profile.id,
    contactId,
    `${profile.full_name || profile.email} updated this contact's details.`
  );

  revalidatePath(`/app/contacts/${contactId}`);
  revalidatePath("/app/contacts");
}

export async function deleteContactAction(formData: FormData) {
  const { accountId, supabase } = await requireAccountContext();
  const contactId = String(formData.get("contactId") || "");

  const { error } = await supabase
    .from("contacts")
    .delete()
    .eq("id", contactId)
    .eq("account_id", accountId);

  if (error) throw new Error(error.message);

  revalidatePath("/app/contacts");
  redirect("/app/contacts");
}

export async function createTagAction(formData: FormData) {
  const { accountId, supabase } = await requireAccountContext();
  const name = String(formData.get("name") || "").trim();
  const color = String(formData.get("color") || "#d5b054");
  const returnTo = String(formData.get("returnTo") || "/app/contacts");

  if (!name) throw new Error("Tag name is required.");

  const { error } = await supabase.from("tags").insert({ account_id: accountId, name, color });
  if (error) throw new Error(error.message);

  revalidatePath("/app/contacts");
  redirect(returnTo);
}

export async function addTagToContactAction(formData: FormData) {
  const { profile, accountId, supabase } = await requireAccountContext();
  const contactId = String(formData.get("contactId") || "");
  const tagId = String(formData.get("tagId") || "");

  if (!contactId || !tagId) throw new Error("Missing contact or tag.");

  const { error } = await supabase.from("contact_tags").insert({ contact_id: contactId, tag_id: tagId });
  if (error) throw new Error(error.message);

  const { data: tag } = await supabase.from("tags").select("name").eq("id", tagId).single();
  await logActivity(
    supabase,
    accountId,
    profile.id,
    contactId,
    `${profile.full_name || profile.email} added the tag "${tag?.name ?? ""}".`
  );

  revalidatePath(`/app/contacts/${contactId}`);
}

export async function removeTagFromContactAction(formData: FormData) {
  const { accountId, supabase } = await requireAccountContext();
  const contactId = String(formData.get("contactId") || "");
  const tagId = String(formData.get("tagId") || "");

  await supabase.from("contact_tags").delete().eq("contact_id", contactId).eq("tag_id", tagId);
  void accountId;

  revalidatePath(`/app/contacts/${contactId}`);
}

export async function createCustomFieldAction(formData: FormData) {
  const { accountId, supabase } = await requireAccountContext();
  const fieldName = String(formData.get("fieldName") || "").trim();
  const fieldType = String(formData.get("fieldType") || "text");
  const optionsRaw = String(formData.get("options") || "").trim();

  if (!fieldName) throw new Error("Field name is required.");

  const options =
    fieldType === "select" && optionsRaw
      ? optionsRaw.split(",").map((o) => o.trim()).filter(Boolean)
      : null;

  const { error } = await supabase.from("custom_fields").insert({
    account_id: accountId,
    field_name: fieldName,
    field_type: fieldType,
    options,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/app/contacts/fields");
}

export async function setCustomFieldValueAction(formData: FormData) {
  const { profile, accountId, supabase } = await requireAccountContext();
  const contactId = String(formData.get("contactId") || "");
  const customFieldId = String(formData.get("customFieldId") || "");
  const value = String(formData.get("value") || "");

  const { error } = await supabase
    .from("custom_field_values")
    .upsert(
      { contact_id: contactId, custom_field_id: customFieldId, value },
      { onConflict: "contact_id,custom_field_id" }
    );
  if (error) throw new Error(error.message);

  void accountId;
  void profile;
  revalidatePath(`/app/contacts/${contactId}`);
}

export async function addNoteAction(formData: FormData) {
  const { profile, accountId, supabase } = await requireAccountContext();
  const contactId = String(formData.get("contactId") || "");
  const content = String(formData.get("content") || "").trim();

  if (!content) throw new Error("Note cannot be empty.");

  await logActivity(supabase, accountId, profile.id, contactId, content, "note");

  revalidatePath(`/app/contacts/${contactId}`);
}
