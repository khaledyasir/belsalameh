/**
 * Legal copy. Source: content/BELSALAMEH TERMS & CONDITIONS.docx and
 * content/BELSALAMEH PRIVACY POLICY.docx (lightly condensed for the web).
 */
import { CONTACT_EMAIL } from "./site-content";

const E = CONTACT_EMAIL; // single source for the support address

export type LegalDoc = {
  title: string;
  updated: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
};

export const TERMS: LegalDoc = {
  title: "Terms & Conditions",
  updated: "October 2026",
  intro:
    "By completing your payment details, paying the membership fee, or accessing our services, you agree to be bound by these Terms and Conditions. Please read them carefully before completing your membership activation.",
  sections: [
    {
      heading: "1. Business identity & standalone platform status",
      body: [
        "Independent entity: Belsalameh (“we,” “us,” or “our”) is an independent, standalone travel platform. Belsalameh is not an airline, travel agency, airline subsidiary, insurance company, or discount program.",
        "Scope of services: Belsalameh does not book, issue, or sell flight tickets, nor do we sell public airline products or manage frequent flyer loyalty programs or mile redemptions.",
        "Partnership & unlisted member services: Belsalameh co-creates brand-new, unlisted airport micro-services directly alongside full-service partner carriers. All physical service fulfilments occur directly at operating airline check-in counters upon arrival.",
      ],
    },
    {
      heading: "2. Annual membership, Early Bird terms & non-recurring fees",
      body: [
        "Standard annual membership: memberships are issued on an annual basis and remain active for twelve (12) calendar months from the date of activation.",
        "Early Bird launch promotion: a limited number of Early Bird memberships activated during the launch phase remain fully valid and active from the date of purchase until December 31, 2028, at no additional charge.",
        "Non-refundable & non-recurring fees: membership fees cover digital profile activation, administration, and access to unlisted member services and protected pricing. Membership fees are strictly non-refundable and non-recurring.",
        "Zero auto-renewals & no account creation: Belsalameh will never set up recurring billing, auto-renewals, or automatic deductions. Activation requires no login credentials, password setup, or digital account. Upon expiration you simply rejoin online at your convenience.",
        "14-day advance activation: to ensure proper database processing with operating carriers, memberships must be activated at least 14 days prior to your travel date. Later activations may suffer technical validation delays at the airport counter.",
        "Proof of membership: on successful payment, an automated confirmation email is issued containing the member’s full name (matching their passport). This email serves as your official proof of active membership and must be presented (on a mobile device or printed) to the check-in agent.",
        `Missing or lost confirmation emails: if you do not receive your email (including junk/spam) or delete it, contact ${E} immediately. We will re-issue it within up to 5 working days.`,
      ],
    },
    {
      heading: "3. Launch service terms (1–4 kg micro-excess baggage service)",
      body: [
        "Operational eligibility: valid strictly on flights operated directly by founding partner Royal Jordanian, where the passenger’s booking reference / PNR begins with “RJ”.",
        "Ineligible routes & booking types: codeshare flights operated by partner carriers, interline itineraries involving secondary airlines, and multi-airline tickets are strictly excluded.",
        "Weight allowance & capping: covers minor excess luggage between 1.00 kg and 4.00 kg over the standard allowance, capping total checked bag weight at a maximum of 27.00 kg. Luggage over 27.00 kg remains subject to standard published airline excess baggage fees.",
        "Account capping & companions: protection is capped at one (1) checked bag per active member (matching the passport name provided during payment, not per PNR or booking group). Travel companions must hold their own active Belsalameh membership.",
      ],
    },
    {
      heading: "4. Counter payments, operational disclaimers & currency charges",
      body: [
        "Counter-level payment model: Belsalameh does not charge or collect payment for airline airport services online. All protected flat rates are paid by the member directly to the operating airline check-in agent at the airport counter upon arrival.",
        "Airline operational caps: airport micro-services are provided under the direct operational authority of operating airlines. Due to payload limits, route restrictions, or peak seasons, airlines may temporarily restrict or cap services. Members will never pay for a service that is operationally unavailable.",
        "Airport payment methods & processing fees: counter payments are subject to local airport terminal constraints (e.g. card-only counters or local currency). Foreign exchange conversions or card issuer processing fees applied by airport terminals are external variances beyond our fixed member rates.",
      ],
    },
    {
      heading: "5. Service discrepancy & reimbursement resolution",
      body: [
        "Denied counter privileges: if a check-in agent is unfamiliar with Belsalameh or charges standard rates on an eligible RJ-operated flight, pay the counter fee to proceed with your travel and retain all receipts.",
        `Claim submission: file a claim within 14 days of travel by emailing ${E} with the official airline payment receipt (showing charges paid under the member’s full name) and the official baggage tag slip (proving the bag weighed 27.00 kg or below).`,
        "5-day resolution guarantee: Belsalameh reviews claims within 5 working days. For verified eligible claims we issue direct monetary compensation covering the exact price difference paid above the protected member rate.",
      ],
    },
    {
      heading: "6. Limitation of liability",
      body: [
        "Airline operational control: Belsalameh holds no operational ownership or control over airline personnel, flight schedules, aircraft loading, or terminal operations, and is not liable for flight delays, cancellations, denied boarding, or luggage damage/loss caused by operating carriers.",
        "Legal liability cap: Belsalameh’s total legal liability for any claim arising from a service failure or counter discrepancy is capped at the direct financial difference between the published airline counter charge and the protected Belsalameh member rate for the service in question.",
      ],
    },
    {
      heading: "7. Governing law & contact",
      body: [
        `These terms are governed by the applicable commercial laws of our operating jurisdiction. For claim submissions, membership inquiries, or confirmation email re-issuances, contact ${E}.`,
      ],
    },
  ],
};

export const PRIVACY: LegalDoc = {
  title: "Privacy Policy",
  updated: "October 2026",
  intro:
    "Belsalameh respects your privacy and is committed to protecting the personal data you share with us. This policy outlines how we collect, use, process, and safeguard your information when you activate a membership or interact with our platform.",
  sections: [
    {
      heading: "1. Information we collect",
      body: [
        "Because Belsalameh operates with no account creation or login credentials, we collect only the essential data required to process your membership and verify eligibility at the airport counter:",
        "Personal identification data: your full legal name, exactly as it appears on your passport.",
        "Contact information: your verified email address.",
        "Payment processing information: transaction details processed securely via third-party payment gateway providers. Belsalameh does not store credit card numbers or banking details on our servers.",
        `Support & reimbursement data: receipts, baggage slips, and communication logs submitted to ${E} in the event of a service discrepancy claim.`,
      ],
    },
    {
      heading: "2. How we use your information",
      body: [
        "Membership verification: generating and issuing your automated confirmation email, which serves as your official proof of active membership.",
        "Partner airline database synchronization: transmitting verified member names to operating partner carriers (including founding partner Royal Jordanian) to enable seamless counter verification at check-in.",
        "Claim processing: verifying and issuing reimbursements for valid counter price discrepancy claims within our 5-day guarantee.",
        "Service updates: sending essential membership updates, non-automated renewal notices, and notifications about new partner carriers or unlisted airport micro-services.",
      ],
    },
    {
      heading: "3. Data sharing & third-party disclosure",
      body: [
        "We do not sell, rent, trade, or monetize your personal information. Your data is shared strictly under the following circumstances:",
        "Operating airline partners: we share verified member full names with partner airlines solely to confirm eligibility for member rates at airport check-in counters.",
        "Secure payment gateways: payment transactions are handled entirely by PCI-DSS-compliant regional and international payment processing partners.",
        "Legal compliance: we may disclose information where required by applicable laws, court orders, or governmental regulations.",
      ],
    },
    {
      heading: "4. Data retention & security",
      body: [
        "Retention period: we retain your full name and email address for the active duration of your membership (including extended Early Bird validity through December 31, 2028) and for a standard administrative period thereafter to meet legal, tax, and accounting requirements.",
        "Data security: we implement industry-standard technical and organizational measures, including encrypted data transmission (SSL/TLS), to protect your information against unauthorized access, loss, or disclosure.",
      ],
    },
    {
      heading: "5. Your rights",
      body: [
        "Depending on your jurisdiction, you may have the right to access a copy of the personal information we hold about you, to request correction of inaccurate or incomplete details (such as a passport name spelling error), and to request deletion of your personal data where there is no overriding legal or operational obligation to retain it.",
      ],
    },
    {
      heading: "6. Contact",
      body: [
        `For any privacy-related inquiries, data access requests, or questions about how your information is handled, contact our help team at ${E}.`,
      ],
    },
  ],
};

export const LEGAL_DOCS: Record<string, LegalDoc> = { terms: TERMS, privacy: PRIVACY };
