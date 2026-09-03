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
    default: "Balsalameh",
    template: "%s · Balsalameh",
  },
  description: "Balsalameh Membership.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={display.variable}>
      <body>{children}</body>
    </html>
  );
}
