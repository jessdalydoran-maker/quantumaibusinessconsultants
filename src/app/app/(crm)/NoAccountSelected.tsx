import Link from "next/link";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { IconAdmin } from "@/components/crm/ui/icons";

export function NoAccountSelected() {
  return (
    <EmptyState
      icon={<IconAdmin width={20} height={20} />}
      title="No account selected"
      description="You're viewing as a platform admin. Choose an account from Admin to view its contacts and deals."
      action={
        <Link href="/app/admin" className="text-sm font-medium text-gold hover:underline">
          Go to Admin →
        </Link>
      }
    />
  );
}
