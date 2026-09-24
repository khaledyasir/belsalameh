import type { Metadata } from "next";
import { Crimson_Text, Inter } from "next/font/google";
import "./globals.css";

// Brand typeface per Guidlines pdfs/Belsalameh Brand Guidelines.pdf: "Crimson",
// weights Regular/Semi bold/Bold — that's Google's Crimson Text, not Crimson
// Pro (a different, unrelated family despite the similar name). Feeds
// --font-heading, used by every heading site-wide (see tailwind.config.ts
// fontFamily.display) and by the landing page's own heading rules.
const heading = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

// Body copy sans — feeds --font-body (tailwind.config.ts fontFamily.sans).
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Belsalameh · Fly in relief",
    template: "%s · Belsalameh",
  },
  description:
    "Belsalameh unlocks protected flat rates for 1–3 kg of excess baggage, co-created with founding partner Royal Jordanian. Pay at the airport counter.",
  icons: {
    icon: "/plane.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
