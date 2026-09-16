import type { Metadata } from "next";
import { Crimson_Pro, Crimson_Text, Inter } from "next/font/google";
import "./globals.css";

// Brand display serif ("Crimson"). System serif covers the swap window on
// slow networks (font-display: swap). Still used by /admin, /login, /faq,
// /legal/* — only the landing page (below) moved to the new design's fonts.
const display = Crimson_Pro({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Landing page redesign fonts — feed the --font-heading/--font-body custom
// properties that the ported CSS (globals.css, "landing page" section) reads.
const landingHeading = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});
const landingBody = Inter({
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
    "Belsalameh unlocks protected flat rates for 1–4 kg of excess baggage, co-created with founding partner Royal Jordanian. Pay at the airport counter.",
  icons: {
    icon: "/plane.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${landingHeading.variable} ${landingBody.variable}`}>
      <body>{children}</body>
    </html>
  );
}
