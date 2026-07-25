import Link from "next/link";
import { FEATURE_LABELS, type FeatureKey } from "@/lib/features";

export function FeatureLocked({ feature }: { feature: FeatureKey }) {
  return (
    <div className="rounded-sm border border-border bg-bg-alt p-6 text-sm text-text-muted">
      <strong className="text-text">{FEATURE_LABELS[feature]}</strong> isn&apos;t available on
      this account&apos;s current plan. A platform admin can enable it from{" "}
      <Link href="/app/admin" className="text-gold hover:underline">
        Admin
      </Link>
      .
    </div>
  );
}
