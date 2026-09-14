import { Plane } from "lucide-react";
import { PARTNER } from "@/lib/site-content";

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  const maskedUser = user.length <= 2 ? user[0] + "*" : user.slice(0, 2) + "*".repeat(Math.max(user.length - 2, 1));
  const [domainName, ...rest] = domain.split(".");
  const maskedDomain = domainName.length <= 1 ? domainName : domainName[0] + "*".repeat(domainName.length - 1);
  return `${maskedUser}@${maskedDomain}.${rest.join(".")}`;
}

type MembershipPassProps = {
  fullName: string;
  membershipId: string;
  expiry: string;
  email?: string;
};

/**
 * Premium visual explainer of what a member receives — not the actual
 * emailed proof (no barcode/QR, per spec; validation is visual name+ID match).
 * Used both illustratively on the homepage and, with real data, on
 * /checkout/success.
 */
export function MembershipPass({ fullName, membershipId, expiry, email }: MembershipPassProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-ink shadow-pop sm:p-8">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgb(var(--accent)) 0 2px, transparent 2px 28px)",
        }}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-heading-2 font-bold">Belsalameh</p>
          <p className="mt-0.5 text-body-sm text-primary-ink/70">Active member</p>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-accent-ink">
          <Plane className="h-5 w-5" aria-hidden />
        </span>
      </div>

      <dl className="relative mt-6 grid gap-4 border-t border-primary-ink/15 pt-5 sm:grid-cols-2">
        <div>
          <dt className="text-caption uppercase tracking-wide text-primary-ink/60">Member</dt>
          <dd className="mt-0.5 font-display text-heading-3 font-semibold">{fullName}</dd>
        </div>
        <div>
          <dt className="text-caption uppercase tracking-wide text-primary-ink/60">Membership status</dt>
          <dd className="mt-0.5 text-body font-semibold">Active</dd>
        </div>
        <div>
          <dt className="text-caption uppercase tracking-wide text-primary-ink/60">Membership ID</dt>
          <dd className="mt-0.5 font-mono text-body">{membershipId}</dd>
        </div>
        <div>
          <dt className="text-caption uppercase tracking-wide text-primary-ink/60">Validity</dt>
          <dd className="mt-0.5 text-body">{expiry}</dd>
        </div>
        {email && (
          <div>
            <dt className="text-caption uppercase tracking-wide text-primary-ink/60">Email</dt>
            <dd className="mt-0.5 text-body">{maskEmail(email)}</dd>
          </div>
        )}
        <div>
          <dt className="text-caption uppercase tracking-wide text-primary-ink/60">Founding service</dt>
          <dd className="mt-0.5 text-body">Micro-excess baggage</dd>
        </div>
      </dl>

      <p className="relative mt-5 border-t border-primary-ink/15 pt-4 text-caption text-primary-ink/60">
        Partner: {PARTNER} · Validated at check-in by matching this name and ID
      </p>
    </div>
  );
}
