import { redirect } from "next/navigation";

// Phase 1: the platform root is the admin console.
// Phase 2 replaces this with the public landing page and moves the console
// under /admin (already its route).
export default function RootPage() {
  redirect("/admin");
}
