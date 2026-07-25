import { requireProfile, getEffectiveAccountId } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { NoAccountSelected } from "../../NoAccountSelected";
import { createCustomFieldAction } from "../actions";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { Card, CardBody } from "@/components/crm/ui/Card";
import { Table, THead, Th, TBody, Tr, Td } from "@/components/crm/ui/Table";
import { Input, Select, Label } from "@/components/crm/ui/Field";
import { Button } from "@/components/crm/ui/Button";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { IconTemplates } from "@/components/crm/ui/icons";

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
      <PageHeader eyebrow="CRM" title="Custom Fields" description="Define extra fields to track on contacts, specific to your business." />

      <div className="mt-6">
        {fields && fields.length > 0 ? (
          <Table>
            <THead>
              <Th>Field Name</Th>
              <Th>Type</Th>
              <Th>Options</Th>
            </THead>
            <TBody>
              {fields.map((f) => (
                <Tr key={f.id}>
                  <Td className="text-text">{f.field_name}</Td>
                  <Td>{f.field_type}</Td>
                  <Td>{Array.isArray(f.options) ? f.options.join(", ") : "—"}</Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        ) : (
          <EmptyState icon={<IconTemplates width={20} height={20} />} title="No custom fields yet" />
        )}
      </div>

      <Card className="mt-8 max-w-lg">
        <CardBody>
          <form action={createCustomFieldAction} className="grid gap-4">
            <div>
              <Label htmlFor="fieldName">Field Name</Label>
              <Input id="fieldName" name="fieldName" required />
            </div>
            <div>
              <Label htmlFor="fieldType">Type</Label>
              <Select id="fieldType" name="fieldType">
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="boolean">Yes / No</option>
                <option value="select">Select (dropdown)</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="options">Options (for Select type only, comma-separated)</Label>
              <Input id="options" name="options" placeholder="e.g. Hot, Warm, Cold" />
            </div>
            <Button type="submit" className="mt-2 w-fit">
              Add Field
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
