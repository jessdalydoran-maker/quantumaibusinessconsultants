"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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

const contentActions = [
  { value: "update", label: "Change something that's already there" },
  { value: "add", label: "Add something new" },
] as const;

const MAX_FILE_BYTES = 50 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "video/webm",
];

type Attachment = {
  id: string;
  name: string;
  url: string;
  status: "uploading" | "done" | "error";
  error?: string;
};

type FormState = {
  name: string;
  email: string;
  company: string;
  website: string;
  changeType: (typeof changeTypes)[number] | "";
  pageLocation: string;
  exactSpot: string;
  contentAction: (typeof contentActions)[number]["value"] | "";
  currentContent: string;
  desiredContent: string;
  newContent: string;
  placement: string;
  urgency: (typeof urgencies)[number] | "";
  notes: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  website: "",
  changeType: "",
  pageLocation: "",
  exactSpot: "",
  contentAction: "",
  currentContent: "",
  desiredContent: "",
  newContent: "",
  placement: "",
  urgency: "",
  notes: "",
};

const steps = ["Who you are", "What's changing", "The specifics", "Priority", "Review & send"];

export function ChangeRequestForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
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
    form.changeType !== "" && form.pageLocation.trim() !== "" && form.exactSpot.trim() !== "",
    form.contentAction === "update"
      ? form.currentContent.trim() !== "" && form.desiredContent.trim() !== ""
      : form.contentAction === "add"
        ? form.newContent.trim() !== "" && form.placement.trim() !== ""
        : false,
    form.urgency !== "",
    true,
  ];

  const uploading = attachments.some((a) => a.status === "uploading");

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const supabase = createClient();

    const files = Array.from(fileList);
    for (const file of files) {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      if (file.size > MAX_FILE_BYTES) {
        setAttachments((prev) => [
          ...prev,
          { id, name: file.name, url: "", status: "error", error: "File is larger than 50MB." },
        ]);
        continue;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        setAttachments((prev) => [
          ...prev,
          { id, name: file.name, url: "", status: "error", error: "Unsupported file type." },
        ]);
        continue;
      }

      setAttachments((prev) => [...prev, { id, name: file.name, url: "", status: "uploading" }]);

      const path = `${id}-${file.name}`;
      const { error } = await supabase.storage
        .from("change-request-attachments")
        .upload(path, file);

      if (error) {
        setAttachments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: "error", error: error.message } : a))
        );
        continue;
      }

      const { data } = supabase.storage.from("change-request-attachments").getPublicUrl(path);
      setAttachments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "done", url: data.publicUrl } : a))
      );
    }
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!stepValid[3] || uploading) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/change-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          attachments: attachments
            .filter((a) => a.status === "done")
            .map((a) => ({ name: a.name, url: a.url })),
          honeypot,
        }),
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
              <label htmlFor="pageLocation" className="text-sm text-text-muted">
                Which page is this on?
              </label>
              <input
                id="pageLocation"
                type="text"
                required
                value={form.pageLocation}
                onChange={(e) => update("pageLocation", e.target.value)}
                placeholder="E.g. Homepage, or smithphysio.co.uk/services"
                className="mt-2 w-full rounded-sm border border-border bg-bg px-4 py-3 text-text focus:border-gold"
              />
              <p className="mt-1 text-xs text-text-muted">
                The exact page name or URL — this is how we find it fast.
              </p>
            </div>
            <div>
              <label htmlFor="exactSpot" className="text-sm text-text-muted">
                Whereabouts on that page?
              </label>
              <input
                id="exactSpot"
                type="text"
                required
                value={form.exactSpot}
                onChange={(e) => update("exactSpot", e.target.value)}
                placeholder="E.g. the hero banner, the third pricing card, the footer"
                className="mt-2 w-full rounded-sm border border-border bg-bg px-4 py-3 text-text focus:border-gold"
              />
              <p className="mt-1 text-xs text-text-muted">
                Be as specific as you can — the section, heading, or element.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="font-display text-xl text-text">Tell us exactly what to do</h3>
            <div>
              <p className="text-sm text-text-muted">Is this an update, or something brand new?</p>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {contentActions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => update("contentAction", option.value)}
                    className={`rounded-sm border px-4 py-3 text-left text-sm transition-colors ${
                      form.contentAction === option.value
                        ? "border-gold bg-gold/10 text-text"
                        : "border-border text-text-muted hover:border-gold hover:text-text"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {form.contentAction === "update" && (
              <>
                <div>
                  <label htmlFor="currentContent" className="text-sm text-text-muted">
                    What does it currently say or show?
                  </label>
                  <textarea
                    id="currentContent"
                    required
                    rows={3}
                    value={form.currentContent}
                    onChange={(e) => update("currentContent", e.target.value)}
                    placeholder="Copy and paste the current text, or describe what's there now"
                    className="mt-2 w-full rounded-sm border border-border bg-bg px-4 py-3 text-text focus:border-gold"
                  />
                </div>
                <div>
                  <label htmlFor="desiredContent" className="text-sm text-text-muted">
                    What should it say or show instead?
                  </label>
                  <textarea
                    id="desiredContent"
                    required
                    rows={3}
                    value={form.desiredContent}
                    onChange={(e) => update("desiredContent", e.target.value)}
                    placeholder="Write out exactly what you'd like to replace it with"
                    className="mt-2 w-full rounded-sm border border-border bg-bg px-4 py-3 text-text focus:border-gold"
                  />
                </div>
              </>
            )}

            {form.contentAction === "add" && (
              <>
                <div>
                  <label htmlFor="newContent" className="text-sm text-text-muted">
                    What would you like added?
                  </label>
                  <textarea
                    id="newContent"
                    required
                    rows={3}
                    value={form.newContent}
                    onChange={(e) => update("newContent", e.target.value)}
                    placeholder="Describe or write out the new content, feature, or offer"
                    className="mt-2 w-full rounded-sm border border-border bg-bg px-4 py-3 text-text focus:border-gold"
                  />
                </div>
                <div>
                  <label htmlFor="placement" className="text-sm text-text-muted">
                    Exactly where should it go?
                  </label>
                  <input
                    id="placement"
                    type="text"
                    required
                    value={form.placement}
                    onChange={(e) => update("placement", e.target.value)}
                    placeholder="E.g. above the pricing table, as a new section at the bottom"
                    className="mt-2 w-full rounded-sm border border-border bg-bg px-4 py-3 text-text focus:border-gold"
                  />
                </div>
              </>
            )}

            <div>
              <p className="text-sm text-text-muted">
                Screenshots or a short video (optional, but they really help)
              </p>
              <label
                htmlFor="attachments"
                className="mt-2 flex cursor-pointer items-center justify-center rounded-sm border border-dashed border-border bg-bg px-4 py-6 text-sm text-text-muted hover:border-gold hover:text-text"
              >
                Click to upload images or video (up to 50MB each)
              </label>
              <input
                id="attachments"
                type="file"
                multiple
                accept="image/png,image/jpeg,image/gif,image/webp,video/mp4,video/quicktime,video/webm"
                onChange={(e) => {
                  handleFiles(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
              />
              {attachments.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {attachments.map((a) => (
                    <li
                      key={a.id}
                      className="flex items-center justify-between gap-3 rounded-sm border border-border bg-bg px-4 py-2 text-sm"
                    >
                      <span className="truncate text-text-muted">
                        {a.name}
                        {a.status === "uploading" && " — uploading…"}
                        {a.status === "error" && ` — ${a.error}`}
                        {a.status === "done" && " — uploaded"}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(a.id)}
                        className="shrink-0 text-text-muted hover:text-text"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="font-display text-xl text-text">How urgent is this?</h3>
            <div className="grid gap-3 sm:grid-cols-3">
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
            <div>
              <label htmlFor="notes" className="text-sm text-text-muted">
                Anything else we should know? (optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Deadlines, background, links to inspiration — anything that helps"
                className="mt-2 w-full rounded-sm border border-border bg-bg px-4 py-3 text-text focus:border-gold"
              />
            </div>
          </div>
        )}

        {step === 4 && (
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
              <div className="flex justify-between gap-4">
                <dt className="text-text-muted">Page</dt>
                <dd className="text-text">{form.pageLocation}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-text-muted">Location on page</dt>
                <dd className="text-text">{form.exactSpot}</dd>
              </div>
              {form.contentAction === "update" ? (
                <>
                  <div>
                    <dt className="text-text-muted">Currently</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-text">{form.currentContent}</dd>
                  </div>
                  <div>
                    <dt className="text-text-muted">Change to</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-text">{form.desiredContent}</dd>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <dt className="text-text-muted">Add</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-text">{form.newContent}</dd>
                  </div>
                  <div>
                    <dt className="text-text-muted">Placement</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-text">{form.placement}</dd>
                  </div>
                </>
              )}
              {attachments.filter((a) => a.status === "done").length > 0 && (
                <div>
                  <dt className="text-text-muted">Attachments</dt>
                  <dd className="mt-1 text-text">
                    {attachments
                      .filter((a) => a.status === "done")
                      .map((a) => a.name)
                      .join(", ")}
                  </dd>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <dt className="text-text-muted">Urgency</dt>
                <dd className="text-text">{form.urgency}</dd>
              </div>
              {form.notes && (
                <div>
                  <dt className="text-text-muted">Notes</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-text">{form.notes}</dd>
                </div>
              )}
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
            disabled={status === "submitting" || uploading}
            className="inline-flex items-center justify-center rounded-sm bg-gold px-8 py-3 text-sm font-medium text-bg transition-colors hover:bg-gold-soft disabled:opacity-60"
          >
            {status === "submitting" ? "Sending…" : uploading ? "Uploading files…" : "Send Request"}
          </button>
        )}
      </div>
    </form>
  );
}
