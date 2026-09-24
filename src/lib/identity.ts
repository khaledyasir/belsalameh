import "server-only";
import { db } from "./db";
import { hasEnded } from "./membership";
import { nameKey, normalizeName } from "./checkout";

export type PersonCheck = {
  /** This name already has an active (not yet ended) membership, so it can't be registered again. */
  nameTaken: boolean;
  /** This email is already registered under a different name. Allowed, but the user is told. */
  emailShared: boolean;
};

/** Checks each {name, email} pair against existing members. Same order in, same order out. */
export async function checkPeople(people: { fullName: string; email: string }[]): Promise<PersonCheck[]> {
  const names = [...new Set(people.map((p) => normalizeName(p.fullName)).filter((n) => n.length >= 2))];
  const emails = [...new Set(people.map((p) => p.email.trim().toLowerCase()).filter(Boolean))];

  const [byName, byEmail] = await Promise.all([
    names.length
      ? db.member.findMany({ where: { status: "ACTIVE", fullName: { in: names } }, select: { fullName: true, expiryMonth: true, expiryYear: true } })
      : [],
    emails.length ? db.member.findMany({ where: { email: { in: emails } }, select: { email: true, fullName: true } }) : [],
  ]);

  const now = new Date();
  const activeNames = new Set(byName.filter((m) => !hasEnded(m, now)).map((m) => nameKey(m.fullName)));

  return people.map((p) => {
    const key = nameKey(p.fullName);
    const email = p.email.trim().toLowerCase();
    return {
      nameTaken: key.length >= 2 && activeNames.has(key),
      emailShared: email !== "" && byEmail.some((m) => m.email.toLowerCase() === email && nameKey(m.fullName) !== key),
    };
  });
}
