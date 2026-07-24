import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { NoAccountSelected } from "../../NoAccountSelected";
import { createContactAction } from "../actions";

export const metadata = { robots: { index: false, follow: false } };

export default async function NewContactPage() {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) return <NoAccountSelected />;

  return (
    <div>
      <h1 className="font-display text-3xl text-text">New Contact</h1>
      <form action={createContactAction} className="mt-8 grid max-w-lg gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wide text-text-muted">First Name</label>
            <input
              name="firstName"
              required
              className="mt-1 w-full rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-text-muted">Last Name</label>
            <input
              name="lastName"
              className="mt-1 w-full rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-text-muted">Email</label>
          <input
            name="email"
            type="email"
            className="mt-1 w-full rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-text-muted">Phone</label>
          <input
            name="phone"
            className="mt-1 w-full rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-text-muted">Company</label>
          <input
            name="company"
            className="mt-1 w-full rounded-sm border border-border bg-bg-alt px-3 py-2 text-sm text-text focus:border-gold focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="mt-2 w-fit rounded-sm bg-gold px-5 py-2 text-sm font-medium text-bg hover:bg-gold-soft"
        >
          Create Contact
        </button>
      </form>
    </div>
  );
}
