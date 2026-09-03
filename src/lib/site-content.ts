/**
 * Public website copy.
 *
 * ⚠️ EVERY STRING HERE IS PLACEHOLDER. The company supplies the final English
 * text in Phase 4. Nothing here states a real benefit, price, guarantee, or
 * legal position — only the "How it works" steps, which come straight from the
 * website spec.
 *
 * `PUBLIC_SITE_ENABLED` (env) gates the pre-launch preview ribbon and the
 * site-wide noindex.
 */
export const siteEnabled = process.env.PUBLIC_SITE_ENABLED === "true";

export const SITE = {
  isPlaceholder: true,

  hero: {
    eyebrow: "Balsalameh Membership",
    heading: "Travel with a little more ease",
    body: "Placeholder introduction. A warm, welcoming line or two about the membership. The company will provide the final wording describing what it includes and who it is for.",
    primaryCta: "Get your membership",
    secondaryCta: "See how it works",
  },

  included: {
    heading: "What's included",
    note: "Placeholder. The final list of membership benefits will be provided by the company.",
    items: [
      { title: "Benefit one", body: "Short placeholder description of the first membership benefit." },
      { title: "Benefit two", body: "Short placeholder description of the second membership benefit." },
      { title: "Benefit three", body: "Short placeholder description of the third membership benefit." },
    ],
  },

  // These three are from the website spec, not placeholder.
  steps: {
    heading: "How it works",
    items: [
      {
        title: "Enter your details",
        body: "Your full name exactly as it appears on your passport, and your email address.",
      },
      {
        title: "Pay securely",
        body: "Payment is handled on the payment provider's secure page. Card details never touch this website.",
      },
      {
        title: "Get your Proof of Membership",
        body: "An email is sent to you straight away with your name, a unique Membership ID and the expiry month and year.",
      },
    ],
  },

  faq: {
    heading: "Frequently asked questions",
    items: [
      { q: "Placeholder question one?", a: "Placeholder answer. Final wording to be provided by the company." },
      { q: "Placeholder question two?", a: "Placeholder answer. Final wording to be provided by the company." },
      { q: "Placeholder question three?", a: "Placeholder answer. Final wording to be provided by the company." },
    ],
  },

  finalCta: {
    heading: "Ready when you are",
    body: "Placeholder closing line, a friendly nudge to join.",
    cta: "Get your membership",
  },

  footer: {
    // PLACEHOLDER — real legal entity, address and support email come from the company.
    companyLine: "© {year} [Registered company name]",
    supportEmail: "support@example.com",
    note: "Content and pricing on this site are placeholders pending final confirmation.",
  },
} as const;

export const LEGAL_STUBS: Record<string, { title: string }> = {
  terms: { title: "Terms & Conditions and Fair Usage Policy" },
  privacy: { title: "Privacy Policy" },
};
