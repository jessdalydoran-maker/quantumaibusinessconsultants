import "server-only";

// Simple in-memory sliding-window limiter. This resets on every cold start
// and is not shared across serverless instances/regions, so it's a soft
// backstop against a single runaway client, not a hard guarantee under real
// distributed load. If the widget sees abuse in practice, swap this for
// Upstash Redis (or Vercel's own rate-limit KV) without changing call sites —
// same function signature.
const buckets = new Map<string, number[]>();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = (buckets.get(key) || []).filter((t) => now - t < windowMs);

  if (timestamps.length >= limit) {
    buckets.set(key, timestamps);
    return false;
  }

  timestamps.push(now);
  buckets.set(key, timestamps);
  return true;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
