import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "../../NoAccountSelected";
import { createCustomFieldAction } from "../actions";

export const metadata = { robots: { index: false, follow: false } };

export default async function CustomFieldsPage() {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) return <NoAccountSelected />;

  const supabase = await createClient();
  const { data: fields } = await supabase
    .from("custom_fields")
    .select("id, field_name, field_type, options")
    .eq("account_id", accountId)
    .order("field_name");

  return (
    <div>
      <h1 className="font-display text-3xl text-text">Custom Fields</h1>
      <p className="mt-2 text-sm text-text-muted">
        Define extra fields to track on contacts, specific to your business.
      </p>

      <div className="mt-6 overflow-x-auto rounded-sm border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-alt text-text-muted">
            <tr>
              <th className="px-4 py-3">Field Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Options</th>
            </tr>
          </thead>
          <tbody>
            {(fields ?? []).map((f) => (
              <tr key={f.id} className="border-t border-border">
                <td className="px-4 py-3 text-text">{f.field_name}</td>
                <td className="px-4 py-3 text-text-muted">{f.field_type}</td>
                <td className="px-4 py-3 text-text-muted">
                  {Array.isArray(f.options) ? f.options.join(", ") : "—"}
                </td>
              </tr>
            ))}
            {(!fields || fields.length === 0) && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-text-muted">
                  No custom fields yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form action={createCustomFieldAction} className="mt-8 grid max-w-lg gap-4">
        <div>
          <label className="block text-xs uppercase tracking-wide text-text-muted">Field Name</label>
          <input
            name="fieldName"
            required
            className="mt-1 w-full rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-text-muted">Type</label>
          <select
            name="fieldType"
            className="mt-1 w-full rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
            <option value="boolean">Yes / No</option>
            <option value="select">Select (dropdown)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-text-muted">
            Options (for Select type only, comma-separated)
          </label>
          <input
            name="options"
            placeholder="e.g. Hot, Warm, Cold"
            className="mt-1 w-full rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="mt-2 w-fit rounded-sm bg-gold px-5 py-2 text-sm font-medium text-bg hover:bg-gold-soft"
        >
          Add Field
        </button>
      </form>
    </div>
  );
}
