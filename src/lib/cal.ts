// This account is EU-hosted, so the API lives at api.cal.eu, not the global api.cal.com.
const CAL_API_BASE = process.env.CAL_API_BASE || "https://api.cal.eu/v2";
const CAL_USERNAME = "jess-daly-doran-vaqkcv";
const CAL_EVENT_SLUG = "discovery-call";
const CAL_TIMEZONE = "Europe/London";

type Slot = { start: string };

export type AvailableSlot = { start: string };

export async function getAvailableSlots(daysAhead = 10): Promise<AvailableSlot[]> {
  const apiKey = process.env.CAL_API_KEY;
  if (!apiKey) throw new Error("CAL_API_KEY is not configured");

  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + daysAhead);

  const params = new URLSearchParams({
    eventTypeSlug: CAL_EVENT_SLUG,
    username: CAL_USERNAME,
    start: start.toISOString(),
    end: end.toISOString(),
    timeZone: CAL_TIMEZONE,
  });

  const res = await fetch(`${CAL_API_BASE}/slots?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "cal-api-version": "2024-09-04",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Cal.com slots request failed (${res.status}): ${body}`);
  }

  const json = await res.json();
  const byDate: Record<string, Slot[]> = json?.data || {};

  const flat: AvailableSlot[] = Object.values(byDate)
    .flat()
    .map((slot) => ({ start: slot.start }));

  return flat.slice(0, 8);
}

export async function createBooking(opts: {
  start: string;
  name: string;
  email: string;
  timeZone?: string;
}): Promise<{ start: string; end: string; status: string }> {
  const apiKey = process.env.CAL_API_KEY;
  if (!apiKey) throw new Error("CAL_API_KEY is not configured");

  const res = await fetch(`${CAL_API_BASE}/bookings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "cal-api-version": "2026-02-25",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      eventTypeSlug: CAL_EVENT_SLUG,
      username: CAL_USERNAME,
      start: opts.start,
      attendee: {
        name: opts.name,
        email: opts.email,
        timeZone: opts.timeZone || CAL_TIMEZONE,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Cal.com booking request failed (${res.status}): ${body}`);
  }

  const json = await res.json();
  const data = json?.data;

  return {
    start: data?.start,
    end: data?.end,
    status: data?.status || "unknown",
  };
}
