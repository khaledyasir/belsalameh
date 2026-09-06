/**
 * Public website copy. Source: content/BELSALAMEH CONTENT.docx.
 * Rates / membership price are still to be supplied (see `[rates pending]`).
 * `PUBLIC_SITE_ENABLED` gates the site-wide noindex until launch.
 */
export const siteEnabled = process.env.PUBLIC_SITE_ENABLED === "true";

export const CONTACT_EMAIL = "help@blsalameh.com";
export const PARTNER = "Royal Jordanian";
export const EARLY_BIRD_DATE = "December 31, 2028";

export const NAV_LINKS = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Member services", href: "/#member-services" },
  { label: "FAQ", href: "/faq" },
  { label: "Terms", href: "/legal/terms" },
];

export const SITE = {
  hero: {
    eyebrow: `Founding partner · ${PARTNER}`,
    heading: "Slightly overweight luggage? Pay less, right at the airport counter.",
    body: `No pre-booking, no pre-paying. Belsalameh unlocks protected flat rates for 1–4 kg of excess baggage, co-created with founding partner ${PARTNER}, paid directly at check-in.`,
    primaryCta: "Unlock member rates",
    microcopy: `One-time annual fee · Early Bird access through ${EARLY_BIRD_DATE} · Zero auto-renewals`,
  },

  trustBadges: [
    "100% counter-payment transparency",
    "Zero auto-renewals",
    "Instant email confirmation",
  ],

  earlyBird: {
    title: "Limited Early Bird launch offer",
    body: `Activate your membership today and keep full member benefits through ${EARLY_BIRD_DATE} at no additional cost. Limited launch slots available.`,
  },

  benefits: {
    heading: "Why smart travelers join Belsalameh",
    items: [
      {
        title: "Protected member rates",
        body: "No more unpredictable excess fees at check-in. Access unlisted member services and lock in fixed, transparent pricing.",
      },
      {
        title: "No online glitches or advance booking",
        body: "Every service payment happens at the official airport check-in counter on arrival. No online forms, no tech failures, no refund chaos.",
      },
      {
        title: "Zero auto-renewals",
        body: "Pay once for your annual membership. We never set up recurring billing or automatic deductions.",
      },
      {
        title: "Guaranteed member pricing",
        body: "Show your confirmation email at check-in to instantly unlock your protected, flat-rate airport pricing.",
      },
    ],
  },

  service: {
    heading: "The service",
    lead: `Belsalameh unlocks unlisted airport micro-services and protected rates, co-created with full-service partner carriers and not sold to the public. Today we run one launch service, with founding partner ${PARTNER}.`,
    name: "1–4 kg Micro-Excess Baggage Service",
    eligibility: `Exclusively for ${PARTNER} passengers, on flights with an RJ booking reference.`,
    body: "Slightly over your standard 23 kg allowance? Instead of steep excess-baggage charges, show your confirmation email at the check-in counter and pay a fixed, protected member rate on the spot.",
    points: [
      "Covers 1.00 to 4.00 kg over the standard 23 kg allowance",
      "Checked bag capped at 27.00 kg total",
      "One checked bag per member, matching the passport name on file",
      "Paid at the counter with full price transparency, no online booking",
    ],
    ratesNote:
      "Member rates are shown at the check-in counter. The published rate card will appear here at launch.",
  },

  steps: {
    heading: "How it works",
    items: [
      {
        title: "Enter your details & pay",
        body: "Enter your full name exactly as it appears on your passport and your email address. Confirm your email and complete payment.",
      },
      {
        title: "Save your confirmation email",
        body: "Payment triggers an automated confirmation email straight away. Keep it on your phone as your proof of membership. No logins, no account to create.",
      },
      {
        title: "Show email at check-in & fly in relief",
        body: "Arrive at check-in as usual. If your bag is up to 27 kg (1–4 kg over the standard allowance), show your confirmation email to unlock member rates and pay at the counter.",
      },
    ],
  },

  faq: {
    heading: "Frequently asked questions",
    items: [
      {
        q: "Is Belsalameh an insurance company, travel agency, or airline subsidiary?",
        a: "None of the above. Belsalameh is an independent, standalone travel platform, not managed or owned by airlines. We don't book or sell flight tickets, we don't re-sell existing public airline services, and we're not a discount program. We also don't award, issue, or redeem frequent flyer miles. We operate an exclusive multi-service membership model, co-creating brand-new, unlisted airport micro-services alongside partner carriers, at member rates you can't buy on public booking sites.",
      },
      {
        q: "Which airlines currently support Belsalameh services?",
        a: `Our inaugural Micro-Excess Baggage Service is offered exclusively for passengers flying with our founding partner, ${PARTNER}. We're actively expanding to additional full-service partner carriers, and rolling out more exclusive micro-services with ${PARTNER}.`,
      },
      {
        q: "Are codeshare or interline flights eligible?",
        a: `Belsalameh services apply strictly to flights operated directly by ${PARTNER} (booking reference / PNR starting with RJ). Codeshare flights operated by partner airlines and multi-carrier interline itineraries are currently excluded. We're working to expand eligibility across broader partner networks.`,
      },
      {
        q: "Do I need to book or pay for airport services online in advance?",
        a: "No. All Belsalameh micro-services are paid directly at the airport check-in counter when you arrive. This guarantees no online glitches, no refund or cancellation chaos, and total financial transparency.",
      },
      {
        q: "Why is there a membership fee, and is it automatically renewed?",
        a: `Your membership fee grants access to unlisted member services and dedicated airport rates co-created with partner airlines that simply aren't available to the public. Memberships are standard annual memberships; as a launch promotion, a limited number of Early Bird members enjoy full benefits extended through ${EARLY_BIRD_DATE}. Fees are strictly non-refundable and non-recurring, we never set up automatic deductions or auto-renewals. When your membership period ends, you simply rejoin online whenever you next travel.`,
      },
      {
        q: "Are there any hidden fees or unpredictable charges?",
        a: "None from Belsalameh. Your flat rate for eligible micro-services is fixed and protected, you'll never face surprise heavy fees or platform markups. Because payment is processed at the airport check-in counter, the only external charges that may apply are minor operational variances such as local currency conversion or card issuer processing fees applied by the airport payment terminal.",
      },
      {
        q: "What if a check-in agent is unfamiliar with Belsalameh or charges standard rates?",
        a: "While our direct partner airline agreements make this extremely rare, if you're charged standard airline rates by mistake, upload your airline payment receipt and baggage slip to our help team within 14 days of travel. We'll verify your claim and issue a full reimbursement for the price difference within 5 working days.",
      },
      {
        q: "When should I activate my membership before my flight?",
        a: "To ensure your confirmation email arrives before you reach the airport, activate your membership at least 14 days prior to your travel date.",
      },
      {
        q: "How do I prove my active membership at the airport?",
        a: "On payment you instantly receive an automated confirmation email. Keep it in your inbox or saved on your phone, and show it to the check-in agent whenever you need the service at the counter. No logins, accounts, or app downloads.",
      },
      {
        q: "Can my travel companions use my membership?",
        a: "It depends on the service. For our launch service (1–4 kg Micro-Excess Baggage), protection is capped at one checked bag per active member, matching the passport name provided at payment. Rules vary by service, and companion eligibility is listed for each one.",
      },
      {
        q: "What if I don't receive my confirmation email or lose it?",
        a: `First, check your spam or junk folder. If it's still missing, contact us at ${CONTACT_EMAIL} with your full name and payment details. We'll re-issue your confirmation email within up to 5 working days.`,
      },
      {
        q: "Are services guaranteed on every flight and destination?",
        a: "All airport micro-services are fulfilled directly by operating airlines. Due to operational factors such as peak seasons, aircraft weight limits, or route restrictions, airlines may temporarily restrict or cap services for specific dates or destinations. Because Belsalameh uses a direct counter-payment model on arrival, you'll never pay for a service that's unavailable.",
      },
      {
        q: "What happens if my bag exceeds the 27 kg limit?",
        a: "Our premiere service covers micro-excess weights up to 4.00 kg over the standard 23 kg limit (up to 27.00 kg total). Any luggage over 27.00 kg remains subject to standard excess baggage rates and policies at the airport.",
      },
    ],
  },

  finalCta: {
    heading: "Be first to know about new airport services",
    body: `We're continuously developing new, unlisted micro-services alongside full-service partner carriers. Activate your membership to lock in Early Bird benefits through ${EARLY_BIRD_DATE}.`,
    cta: "Activate membership",
    tagline: "Join Belsalameh today and fly in relief™.",
  },

  footer: {
    copyright: `© ${new Date().getFullYear()} Belsalameh. All rights reserved.`,
    tagline: "Fly in relief™",
  },
} as const;

export const LEGAL_STUBS: Record<string, { title: string }> = {
  terms: { title: "Terms & Conditions" },
  privacy: { title: "Privacy Policy" },
};
