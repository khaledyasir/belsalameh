"use server";

import { redirect } from "next/navigation";
import { signIn, signOut, requireSession } from "@/lib/auth";
import { changePassword, updateProfile } from "@/lib/admin-store";

export async function signInAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  const ok = await signIn(username, password);
  if (!ok) {
    const params = new URLSearchParams({ error: "1" });
    if (next && next !== "/admin") params.set("next", next);
    redirect(`/login?${params}`);
  }
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signOutAction() {
  await signOut();
}

export async function updateProfileAction(formData: FormData) {
  const session = await requireSession();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  if (!name || !email || !email.includes("@")) {
    redirect("/admin/account?profile=err");
  }
  await updateProfile(session.user.id, { name, email });
  redirect("/admin/account?profile=ok");
}

export async function changePasswordAction(formData: FormData) {
  const session = await requireSession();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next.length < 8) redirect("/admin/account?password=weak");
  if (next !== confirm) redirect("/admin/account?password=mismatch");

  const ok = await changePassword(session.user.id, current, next);
  redirect(ok ? "/admin/account?password=ok" : "/admin/account?password=badcurrent");
}
