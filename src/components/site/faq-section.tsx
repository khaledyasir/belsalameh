"use client";

import { useState } from "react";

const FAQS = [
  {
    question: "Is Belsalameh an insurance company, travel agency, or airline subsidiary?",
    answer:
      "None of the above. Belsalameh is an independent, standalone travel platform not managed or owned by airlines. We are not a travel agency, we do not book or sell flight tickets, and we are not a discount program. Instead, we operate as an exclusive multi-service membership model, co-creating brand-new, unlisted airport micro-services directly alongside partner carriers.",
  },
  {
    question: "Which airlines currently support Belsalameh services?",
    answer:
      "Our inaugural Micro-Excess Baggage Service is offered exclusively for passengers flying with our founding partner, Royal Jordanian. We are actively expanding to additional full-service partner carriers soon, as well as rolling out more exclusive micro-services with Royal Jordanian.",
  },
  {
    question: "Do I need to book or pay for airport services online in advance?",
    answer:
      "No. All Belsalameh micro-services are paid directly at the airport check-in counter when you arrive. This guarantees no online glitches, no refund or cancellation chaos, and total financial transparency.",
  },
  {
    question: "Why is there a membership fee, and what does it cover? Is it automatically renewed?",
    answer:
      "Your membership fee grants you access to unlisted member services and dedicated airport rates co-created with partner airlines that are simply not available to the public. As an exclusive launch promotion, Early Bird members enjoy full active benefits extended through December 31, 2028. Membership fees are strictly non-refundable and non-recurring: we never set up automatic deductions or auto-renewals.",
  },
  {
    question: "Are there any hidden fees or unpredictable payment charges?",
    answer:
      "None from Belsalameh. As a member, your flat rate for eligible micro-services is strictly fixed and protected: you will never face surprise heavy fees or unexpected platform markups. Any minor operational variances (such as local currency conversion or card issuer processing fees at the airport payment terminal) are the only external charges that may apply beyond our fixed member rate.",
  },
  {
    question: "How do I prove my active membership at the airport?",
    answer:
      "Upon payment, you will instantly receive an automated confirmation email. Simply show this confirmation email to the check-in agent whenever you need the service at the counter. No logins, accounts, or app downloads required.",
  },
  {
    question: "Are codeshare or interline flights eligible for Belsalameh services?",
    answer:
      "Currently, Belsalameh services apply strictly to flights operated directly by Royal Jordanian (where your booking reference / PNR starts with RJ). Codeshare and multi-carrier interline itineraries are currently excluded, but we are actively working to expand eligibility across broader partner networks in the future.",
  },
  {
    question: "What happens if a check-in agent is unfamiliar with Belsalameh or charges standard rates?",
    answer:
      "While our direct partner airline agreements make this extremely rare, operational shifts can occasionally happen. If you are charged standard airline rates by mistake, simply upload your airline payment receipt and baggage slip to our help team within 14 days of travel. We will verify your claim and issue a full reimbursement for the price difference within 5 working days.",
  },
  {
    question: "When should I activate my membership before my flight?",
    answer:
      "To ensure your confirmation email arrives before you reach the airport, activate your membership at least 14 days prior to your travel date.",
  },
  {
    question: "Can my travel companions use my Belsalameh membership?",
    answer:
      "Service eligibility depends on the specific service. For our launch service (1–4 kg Micro-Excess Baggage Service), protection is capped at one checked bag per active member, matching the passport name provided at payment.",
  },
  {
    question: "What if I don't receive my confirmation email or lose it?",
    answer:
      "First, check your spam or junk folder. If it is still missing, contact us at support@belsalameh.com with your full name and payment details. We will re-issue your confirmation email within up to 5 working days.",
  },
  {
    question: "Are Belsalameh services guaranteed on every single flight and destination?",
    answer:
      "All airport micro-services are provided and fulfilled directly by operating airlines. Due to operational factors (such as peak travel seasons, aircraft weight limits, or route restrictions), airlines reserve the right to temporarily restrict or cap services for specific dates. Because Belsalameh operates on a direct counter payment model upon arrival, you will never pay for a service that is unavailable.",
  },
  {
    question: "What happens if my bag exceeds the 27 kg limit?",
    answer:
      "Our premiere service covers micro-excess weights up to 4.00 kg over the standard 23 kg limit (up to 27.00 kg total). Any luggage weighing over 27.00 kg remains subject to standard excess baggage rates and policies at the airport.",
  },
];

const COLLAPSED_COUNT = 5;

export function FaqSection() {
  const [showAll, setShowAll] = useState(false);
  const visibleFaqs = showAll ? FAQS : FAQS.slice(0, COLLAPSED_COUNT);
  const hiddenCount = FAQS.length - COLLAPSED_COUNT;

  return (
    <section id="faq" className="faq">
      <p className="eyebrow">Questions</p>
      <h2>Frequently Asked Questions</h2>
      <div className="faq__list">
        {visibleFaqs.map((faq) => (
          <details className="faq-item" key={faq.question} name="faq-accordion">
            <summary className="faq-item__q">
              {faq.question}
              <span className="faq-icon" aria-hidden="true" />
            </summary>
            <p className="faq-item__a">{faq.answer}</p>
          </details>
        ))}
      </div>
      {!showAll && hiddenCount > 0 && (
        <button type="button" className="faq__more" onClick={() => setShowAll(true)}>
          View all {FAQS.length} questions
        </button>
      )}
    </section>
  );
}
