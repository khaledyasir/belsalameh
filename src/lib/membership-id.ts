import { customAlphabet } from "nanoid";

/**
 * Membership IDs are read aloud and visually matched by airport staff against a
 * passport, so the alphabet excludes visually ambiguous characters
 * (0/O, 1/I/L, U). Format: BSL-XXXX-XXXX.
 *
 * NOTE: the final prefix / length / optional checksum is a BUSINESS DECISION
 * (see plan §9.4). Change `PREFIX` and `SIZE` here when confirmed.
 */
const PREFIX = "BSL";
const SIZE = 8;
const nano = customAlphabet("23456789ABCDEFGHJKMNPQRSTVWXYZ", SIZE);

export function newMembershipId(): string {
  const raw = nano();
  return `${PREFIX}-${raw.slice(0, 4)}-${raw.slice(4)}`;
}

/** Normalise user-typed input for verification lookups (staff may add spaces). */
export function normaliseMembershipId(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, "").replace(/[^A-Z0-9-]/g, "");
}
