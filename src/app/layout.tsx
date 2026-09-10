import type { Metadata } from "next";
import { Crimson_Pro } from "next/font/google";
import "./globals.css";

// Brand display serif ("Crimson"). System serif covers the swap window on
// slow networks (font-display: swap).
const display = Crimson_Pro({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
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
    icon: "/planes-gold.webp",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={display.variable}>
      <body>{children}</body>
    </html>
  );
}
