"use client";

import { useActionState } from "react";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { initialWalkInState } from "@/lib/walk-in";
import { addWalkInMember } from "./actions";

export function WalkInForm() {
  const [state, formAction, isPending] = useActionState(addWalkInMember, initialWalkInState);

  return (
    <form action={formAction} className="space-y-5">
      {state.formError && (
        <p role="alert" className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm font-medium text-danger">
          {state.formError}
        </p>
      )}

      <Field label="Full name (as on passport)" required error={state.errors.fullName}>
        {(props) => <Input {...props} name="fullName" autoComplete="name" required />}
      </Field>

      <Field label="Email address" required error={state.errors.email}>
        {(props) => <Input {...props} name="email" type="email" autoComplete="email" required />}
      </Field>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating membership…" : "Create membership & send confirmation"}
      </Button>
    </form>
  );
}
