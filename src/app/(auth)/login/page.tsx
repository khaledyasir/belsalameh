import type { Metadata } from "next";
import { Wordmark } from "@/components/admin/wordmark";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <Wordmark className="text-xl" />
          <p className="mt-2 text-sm text-brand-cream/70">Admin console</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-surface p-6 shadow-pop">
          <h1 className="font-display text-xl font-bold text-ink">Sign in</h1>

          {error && (
            <p role="alert" className="mt-3 rounded border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              Incorrect username or password.
            </p>
          )}

          <form action={signInAction} className="mt-5 space-y-4">
            <input type="hidden" name="next" value={next} />
            <Field label="Username" required>
              {(p) => <Input {...p} name="username" autoComplete="username" autoCapitalize="none" autoFocus required />}
            </Field>
            <Field label="Password" required>
              {(p) => <Input {...p} name="password" type="password" autoComplete="current-password" required />}
            </Field>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-brand-cream/50">
          Phase 1 authentication. Phase 3 replaces this with Auth.js, hashed
          credentials in the database, and two-factor authentication.
        </p>
      </div>
    </main>
  );
}
