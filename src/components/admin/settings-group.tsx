import { Card, CardBody } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { listSettings } from "@/lib/mock-data";

/**
 * Renders a settings group as a form of (currently read-only) fields. Editing
 * and persistence land in Phase 3 with a server action per group. Placeholder
 * values are badged and feed Launch readiness.
 */
export function SettingsGroup({ group, canEdit }: { group: string; canEdit: boolean }) {
  const rows = listSettings(group);
  return (
    <form className="space-y-4">
      <Card>
        <CardBody className="space-y-4">
          {rows.map((s) => {
            const value = String(s.value);
            const unset = value === "" || value === "false" || value.startsWith("[");
            return (
              <Field
                key={s.key}
                label={s.label}
                hint={s.key}
                error={s.placeholder && unset ? "Awaiting company-supplied value" : undefined}
              >
                {(p) => (
                  <div className="flex items-center gap-2">
                    <Input
                      {...p}
                      defaultValue={value === "false" ? "" : value}
                      placeholder={s.placeholder ? "Not set" : undefined}
                      disabled
                      className="flex-1"
                    />
                    {s.placeholder && <PlaceholderBadge />}
                  </div>
                )}
              </Field>
            );
          })}
        </CardBody>
      </Card>
      <Button type="submit" disabled title={canEdit ? "Editing wired in Phase 3" : "Requires Admin"}>
        Save changes
      </Button>
    </form>
  );
}
