"use server";

import { redirect } from "next/navigation";
import { getSession, signIn, signOut, requireSession } from "@/lib/auth";
import { audit, changePassword, updateProfile } from "@/lib/admin-store";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const LOGIN_LIMIT = 10;
const LOGIN_WINDOW_MS = 15 * 60_000;

export async function signInAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  const keepNext = () => (next && next !== "/admin" ? `&next=${encodeURIComponent(next)}` : "");

  const ip = await clientIp();
  const throttled =
    !rateLimit(`login:ip:${ip}`, LOGIN_LIMIT, LOGIN_WINDOW_MS) ||
    !rateLimit(`login:user:${username.toLowerCase()}`, LOGIN_LIMIT, LOGIN_WINDOW_MS);
  if (throttled) {
    await audit("admin.login_blocked", { detail: `ip ${ip}, user ${username.slice(0, 40)}` });
    redirect(`/login?error=locked${keepNext()}`);
  }

  const ok = await signIn(username, password);
  if (!ok) {
    await audit("admin.login_failed", { detail: `ip ${ip}, user ${username.slice(0, 40)}` });
    redirect(`/login?error=1${keepNext()}`);
  }
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signOutAction() {
  const session = await getSession();
  if (session) await audit("admin.logout", { actorId: session.user.id, entityId: session.user.id });
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
  await audit("admin.profile_updated", { actorId: session.user.id, entityId: session.user.id });
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
  if (ok) await audit("admin.password_changed", { actorId: session.user.id, entityId: session.user.id });
  redirect(ok ? "/admin/account?password=ok" : "/admin/account?password=badcurrent");
}
