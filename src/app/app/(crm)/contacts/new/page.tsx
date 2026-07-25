import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { NoAccountSelected } from "../../NoAccountSelected";
import { createContactAction } from "../actions";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { Card, CardBody } from "@/components/crm/ui/Card";
import { Input, Label } from "@/components/crm/ui/Field";
import { Button } from "@/components/crm/ui/Button";

export const metadata = { robots: { index: false, follow: false } };

export default async function NewContactPage() {
  const profile = await requireProfile();
  const accountId = await getEffectiveAccountId(profile);
  if (!accountId) return <NoAccountSelected />;

  return (
    <div>
      <PageHeader eyebrow="CRM" title="New Contact" description="Add a person or business manually." />
      <Card className="mt-6 max-w-lg">
        <CardBody>
          <form action={createContactAction} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" required />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input id="company" name="company" />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" name="website" placeholder="https://example.com" />
            </div>
            <Button type="submit" className="mt-2 w-fit">
              Create Contact
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
