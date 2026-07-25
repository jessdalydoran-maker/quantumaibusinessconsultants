import Link from "next/link";
import { FEATURE_LABELS, type FeatureKey } from "@/lib/features";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { IconSparkle } from "@/components/crm/ui/icons";

export function FeatureLocked({ feature }: { feature: FeatureKey }) {
  return (
    <EmptyState
      icon={<IconSparkle width={20} height={20} />}
      title={`${FEATURE_LABELS[feature]} isn't on your plan`}
      description="A platform admin can enable this feature from the Admin console."
      action={
        <Link href="/app/admin" className="text-sm font-medium text-gold hover:underline">
          Go to Admin →
        </Link>
      }
    />
  );
}
