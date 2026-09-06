import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Belsalameh logo. `tone="light"` = white/gold artwork for dark backgrounds;
 * `tone="dark"` = indigo/gold artwork for light backgrounds.
 * Source art: content/logo-BESALAMA.png (cropped + recoloured into /public).
 */
export function Wordmark({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <Image
      src={tone === "light" ? "/logo-belsalameh.png" : "/logo-belsalameh-dark.png"}
      alt="Belsalameh — Fly in relief"
      width={524}
      height={284}
      priority
      className={cn("h-9 w-auto", className)}
    />
  );
}
