import { redirect } from "next/navigation";

// The checkout form now lives in a modal on the landing page. This route is
// kept as a deep link: it opens the landing page with the modal open.
export default function JoinRedirect() {
  redirect("/?join=1");
}
