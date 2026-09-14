import type { Metadata } from "next";
import { Crimson_Pro, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Brand display serif ("Crimson"). System serif covers the swap window on
// slow networks (font-display: swap).
const display = Crimson_Pro({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// "Departure board" mono — for weights, labels, membership IDs, step numbers.
// Deliberately evokes an airport information board, not a generic UI choice.
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-mono",
  display: "swap",
});

const description =
  "Belsalameh unlocks protected flat rates for 1–4 kg of excess baggage, co-created with founding partner Royal Jordanian. Pay at the airport counter.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Belsalameh · Fly in relief",
    template: "%s · Belsalameh",
  },
  description,
  alternates: { canonical: "/" },
  icons: {
    icon: "/plane.png",
  },
  openGraph: {
    type: "website",
    siteName: "Belsalameh",
    title: "Belsalameh · Fly in relief",
    description,
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "Belsalameh · Fly in relief",
    description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the beforeInteractive script below adds
    // `motion-ready` to this element before React hydrates, which would
    // otherwise be flagged as a client/server attribute mismatch. Only this
    // element is opted out — React still hydrates normally everywhere else.
    <html lang="en" className={`${display.variable} ${mono.variable}`} suppressHydrationWarning>
      {/* suppressHydrationWarning here too: browser extensions (Grammarly,
          password managers, etc.) commonly inject attributes like
          data-gr-ext-installed directly onto <body> before React hydrates.
          That's an extension artifact in the visitor's browser, not an app
          bug — this only silences the warning for attributes, not children. */}
      <body suppressHydrationWarning>
        {children}
        {/* Enables scroll-reveal animations (see .reveal in globals.css) only once
            JS has actually run, so content is never hidden with JS disabled. */}
        <Script id="motion-ready" strategy="beforeInteractive">
          {"document.documentElement.classList.add('motion-ready')"}
        </Script>
      </body>
    </html>
  );
}
