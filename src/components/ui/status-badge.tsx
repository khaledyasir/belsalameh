import { Badge } from "./badge";

const MEMBER_TONE = {
  ACTIVE: "success",
  EXPIRING_SOON: "warning",
  EXPIRED: "neutral",
  REVOKED: "danger",
} as const;

const TXN_TONE = {
  PENDING: "warning",
  AUTHORIZED: "info",
  CAPTURED: "success",
  FAILED: "danger",
  REFUNDED: "neutral",
} as const;

const EMAIL_TONE = {
  queued: "warning",
  sent: "info",
  delivered: "success",
  bounced: "danger",
  failed: "danger",
} as const;

const LABEL: Record<string, string> = {
  EXPIRING_SOON: "Expiring soon",
};

function pretty(value: string) {
  return LABEL[value] ?? value.charAt(0) + value.slice(1).toLowerCase();
}

export function MemberStatusBadge({ status }: { status: keyof typeof MEMBER_TONE }) {
  return <Badge tone={MEMBER_TONE[status]}>{pretty(status)}</Badge>;
}

export function TransactionStatusBadge({ status }: { status: keyof typeof TXN_TONE }) {
  return <Badge tone={TXN_TONE[status]}>{pretty(status)}</Badge>;
}

export function EmailStatusBadge({ status }: { status: keyof typeof EMAIL_TONE }) {
  return <Badge tone={EMAIL_TONE[status]}>{pretty(status)}</Badge>;
}
