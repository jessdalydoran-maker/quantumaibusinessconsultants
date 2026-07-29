"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const changeTypes = [
  "Content update",
  "Design or branding tweak",
  "New feature",
  "Something's broken",
  "Other",
] as const;

const urgencies = [
  "No rush",
  "Within a couple of weeks",
  "Urgent — something's broken",
] as const;

type FormState = {
  name: string;
  email: string;
  company: string;
  website: string;
  changeType: (typeof changeTypes)[number] | "";
  pages: string;
  description: string;
  urgency: (typeof urgencies)[number] | "";
};

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  website: "",
  changeType: "",
  pages: "",
  description: "",
  urgency: "",
};

const steps = ["Who you are", "What's changing", "The details", "Review & send"];

export function ChangeRequestForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const stepValid = [
    form.name.trim() !== "" &&
      emailPattern.test(form.email) &&
      form.company.trim() !== "" &&
      form.website.trim() !== "",
    form.changeType !== "",
    form.description.trim() !== "" && form.urgency !== "",
    true,
  ];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!stepValid[2]) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/change-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, honeypot }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-sm border border-gold/40 bg-bg-alt p-8">
        <h3 className="font-display text-2xl text-gold">Request sent — thank you!</h3>
        <p className="mt-3 text-text-muted">
          We&apos;ve got your change request and we&apos;ll be in touch within 24 hours. If it&apos;s
          urgent, feel free to email us directly too.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="honeypot"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="flex gap-2">
        {steps.map((label, i) => (
          <div key={label} className="h-1 flex-1 rounded-full bg-border">
            <div
              className={`h-1 rounded-full transition-colors ${
                i <= step ? "bg-gold" : "bg-transparent"
              }`}
            />
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-text-muted">
        Step {step + 1} of {steps.length} &middot; {steps[step]}
      </p>

      <div className="mt-8">
        {step === 0 && (
          <div className="space-y-6">
            <h3 className="font-display text-xl text-text">First, can you tell us who you are?</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="text-sm text-text-muted">
                  Your name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="E.g. Sarah Johnson"
                  className="mt-2 w-full rounded-sm border border-border bg-bg px-4 py-3 text-text focus:border-gold"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm text-text-muted">
                  Your email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="E.g. sarah@smithphysio.co.uk"
                  className="mt-2 w-full rounded-sm border border-border bg-bg px-4 py-3 text-text focus:border-gold"
                />
              </div>
            </div>
            <div>
              <label htmlFor="company" className="text-sm text-text-muted">
                Your company name
              </label>
              <input
                id="company"
                type="text"
                required
                value={form.company}
                onChange={(e) => update("company", e.target.value)}
                placeholder="E.g. Smith Physiotherapy"
                className="mt-2 w-full rounded-sm border border-border bg-bg px-4 py-3 text-text focus:border-gold"
              />
            </div>
            <div>
              <label htmlFor="website" className="text-sm text-text-muted">
                Your website
              </label>
              <input
                id="website"
                type="text"
                required
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
                placeholder="E.g. smithphysio.co.uk"
                className="mt-2 w-full rounded-sm border border-border bg-bg px-4 py-3 text-text focus:border-gold"
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <h3 className="font-display text-xl text-text">What would you like us to change?</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {changeTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => update("changeType", type)}
                  className={`rounded-sm border px-4 py-3 text-left text-sm transition-colors ${
                    form.changeType === type
                      ? "border-gold bg-gold/10 text-text"
                      : "border-border text-text-muted hover:border-gold hover:text-text"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div>
              <label htmlFor="pages" className="text-sm text-text-muted">
                Which page(s) does this affect? (optional)
              </label>
              <input
                id="pages"
                type="text"
                value={form.pages}
                onChange={(e) => update("pages", e.target.value)}
                placeholder="E.g. Homepage, Contact page"
                className="mt-2 w-full rounded-sm border border-border bg-bg px-4 py-3 text-text focus:border-gold"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="font-display text-xl text-text">Tell us more</h3>
            <div>
              <label htmlFor="description" className="text-sm text-text-muted">
                What would you like us to do?
              </label>
              <textarea
                id="description"
                required
                rows={5}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="The more detail you can give us, the faster we can get it sorted."
                className="mt-2 w-full rounded-sm border border-border bg-bg px-4 py-3 text-text focus:border-gold"
              />
            </div>
            <div>
              <p className="text-sm text-text-muted">How urgent is this?</p>
              <div className="mt-2 grid gap-3 sm:grid-cols-3">
                {urgencies.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => update("urgency", option)}
                    className={`rounded-sm border px-4 py-3 text-left text-sm transition-colors ${
                      form.urgency === option
                        ? "border-gold bg-gold/10 text-text"
                        : "border-border text-text-muted hover:border-gold hover:text-text"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="font-display text-xl text-text">Review &amp; send</h3>
            <p className="text-sm text-text-muted">
              Here&apos;s what we&apos;ve got — take a quick look, then send it over.
            </p>
            <dl className="space-y-3 rounded-sm border border-border bg-bg p-6 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-text-muted">Name</dt>
                <dd className="text-text">{form.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-text-muted">Email</dt>
                <dd className="text-text">{form.email}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-text-muted">Company</dt>
                <dd className="text-text">{form.company}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-text-muted">Website</dt>
                <dd className="text-text">{form.website}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-text-muted">Type of change</dt>
                <dd className="text-text">{form.changeType}</dd>
              </div>
              {form.pages && (
                <div className="flex justify-between gap-4">
                  <dt className="text-text-muted">Page(s)</dt>
                  <dd className="text-text">{form.pages}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <dt className="text-text-muted">Urgency</dt>
                <dd className="text-text">{form.urgency}</dd>
              </div>
              <div>
                <dt className="text-text-muted">Details</dt>
                <dd className="mt-1 whitespace-pre-wrap text-text">{form.description}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      {status === "error" && <p className="mt-4 text-sm text-red-400">{errorMessage}</p>}

      <div className="mt-8 flex items-center justify-between">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="text-sm text-text-muted hover:text-text"
          >
            &larr; Back
          </button>
        ) : (
          <span />
        )}

        {step < steps.length - 1 ? (
          <button
            type="button"
            disabled={!stepValid[step]}
            onClick={() => setStep((s) => s + 1)}
            className="inline-flex items-center justify-center rounded-sm bg-gold px-8 py-3 text-sm font-medium text-bg transition-colors hover:bg-gold-soft disabled:cursor-not-allowed disabled:bg-border disabled:text-text-muted"
          >
            Continue &rarr;
          </button>
        ) : (
          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex items-center justify-center rounded-sm bg-gold px-8 py-3 text-sm font-medium text-bg transition-colors hover:bg-gold-soft disabled:opacity-60"
          >
            {status === "submitting" ? "Sending…" : "Send Request"}
          </button>
        )}
      </div>
    </form>
  );
}
