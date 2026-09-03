"use server";

import { redirect } from "next/navigation";
import { signIn, signOut } from "@/lib/auth";
import { ROLES, type Role } from "@/lib/rbac";

/**
 * PHASE 0 STUB actions. Phase 3 replaces the body with Auth.js
 * `signIn("credentials", …)` + TOTP verification; the signatures stay.
 */
export async function signInAction(formData: FormData) {
  const role = String(formData.get("role") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  if (!(ROLES as readonly string[]).includes(role)) {
    redirect(`/login?error=invalid-role`);
  }
  await signIn(role as Role);
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signOutAction() {
  await signOut();
}
