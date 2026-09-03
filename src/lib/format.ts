const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Spec: membership expiry is shown as "Month YYYY" — never a day. */
export function formatExpiry(month: number, year: number): string {
  const name = MONTHS[Math.min(Math.max(month, 1), 12) - 1];
  return `${name} ${year}`;
}

/**
 * Money is stored in minor units. Currency is a PLACEHOLDER (JOD) until the
 * business confirms it — see Settings › Membership product.
 */
export function formatMoney(amountMinor: number, currency = "JOD"): string {
  try {
    return new Intl.NumberFormat("en-JO", {
      style: "currency",
      currency,
      minimumFractionDigits: currency === "JOD" ? 3 : 2,
    }).format(amountMinor / (currency === "JOD" ? 1000 : 100));
  } catch {
    return `${(amountMinor / 100).toFixed(2)} ${currency}`;
  }
}

export function formatDate(value: Date | string): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateTime(value: Date | string): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export function relativeTime(value: Date | string): string {
  const d = typeof value === "string" ? new Date(value) : value;
  const diffMs = Date.now() - d.getTime();
  const mins = Math.round(diffMs / 60000);
  if (Math.abs(mins) < 1) return "just now";
  if (Math.abs(mins) < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (Math.abs(hrs) < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}
