import type { Metadata } from "next";
import { Wordmark } from "@/components/admin/wordmark";
import { Button } from "@/components/ui/button";
import { PlaceholderNote } from "@/components/ui/placeholder-badge";
import { ROLES, roleLabel } from "@/lib/rbac";
import { signInAction } from "../actions";

export const metadata: Metadata = { title: "Sign in · Balsalameh Admin" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next = "/admin", error } = await searchParams;

  return (
    <main className="grid min-h-dvh place-items-center bg-brand-indigo px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Wordmark className="text-xl" />
          <p className="mt-2 text-sm text-brand-cream/70">Admin console</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-surface p-6 shadow-pop">
          <h1 className="font-display text-xl font-bold text-ink">Sign in</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Choose a role to explore the console with that permission set.
          </p>

          {error && (
            <p className="mt-3 rounded border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              {error === "invalid-role" ? "That role is not recognised." : "Sign in failed."}
            </p>
          )}

          <form action={signInAction} className="mt-5 space-y-4">
            <input type="hidden" name="next" value={next} />
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-ink">Sign in as</legend>
              <div className="grid gap-2">
                {ROLES.slice().reverse().map((role, i) => (
                  <label
                    key={role}
                    className="flex cursor-pointer items-center gap-3 rounded border border-border px-3 py-2.5 text-sm hover:bg-surface-muted has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      defaultChecked={i === 0}
                      className="accent-brand-indigo"
                    />
                    <span className="font-medium text-ink">{roleLabel(role)}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>

          <div className="mt-5">
            <PlaceholderNote>
              Stub authentication for Phase 1 review only. Phase 3 replaces this with
              email + password, Argon2id hashing, and mandatory TOTP two-factor
              authentication (Auth.js).
            </PlaceholderNote>
          </div>
        </div>
      </div>
    </main>
  );
}
