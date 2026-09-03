/**
 * Database seed (Phase 3+). Requires DATABASE_URL and a generated Prisma client:
 *   npm run prisma:generate && npm run prisma:migrate && npm run db:seed
 *
 * Seeds only structural + placeholder data — never invented company facts.
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  // ── Settings ─────────────────────────────────────────────────────────────
  const settings: { key: string; group: string; valueJson: unknown }[] = [
    { key: "general.siteName", group: "general", valueJson: "Balsalameh" },
    { key: "general.supportEmail", group: "general", valueJson: "support@example.com" }, // PLACEHOLDER
    { key: "general.timezone", group: "general", valueJson: "Asia/Amman" },
    { key: "membership.priceMinor", group: "membership", valueJson: 25000 }, // PLACEHOLDER
    { key: "membership.currency", group: "membership", valueJson: "JOD" }, // PLACEHOLDER
    { key: "membership.durationMonths", group: "membership", valueJson: 12 }, // PLACEHOLDER
    { key: "membership.idPrefix", group: "membership", valueJson: "BSL" },
    { key: "gateway.mode", group: "gateway", valueJson: "TEST" },
    { key: "email.fromAddress", group: "email", valueJson: "membership@example.com" }, // PLACEHOLDER
  ];
  for (const s of settings) {
    await db.setting.upsert({
      where: { key: s.key },
      create: { key: s.key, group: s.group, valueJson: s.valueJson as object },
      update: { valueJson: s.valueJson as object },
    });
  }

  // ── Owner admin account (password set out-of-band in Phase 3) ────────────
  await db.adminUser.upsert({
    where: { email: "owner@balsalameh.example" },
    create: { email: "owner@balsalameh.example", name: "Platform Owner", role: "OWNER", status: "INVITED" },
    update: {},
  });

  // ── Legal document stubs (empty — pending company text + legal review) ───
  for (const slug of ["terms", "privacy"] as const) {
    await db.legalDocument.upsert({
      where: { slug_version: { slug, version: "draft-0" } },
      create: {
        slug,
        version: "draft-0",
        title: slug === "terms" ? "Terms & Conditions and Fair Usage Policy" : "Privacy Policy",
        bodyMarkdown: "> PLACEHOLDER — awaiting company-supplied text and legal review.",
        effectiveAt: new Date(),
        published: false,
        isPlaceholder: true,
      },
      update: {},
    });
  }

  // ── Proof of Membership email template ─────────────────────────────────
  await db.emailTemplate.upsert({
    where: { key: "proof_of_membership" },
    create: {
      key: "proof_of_membership",
      subject: "Your Balsalameh membership confirmation",
      bodyHtml:
        "<h1>Welcome to Balsalameh</h1><p>Your membership is confirmed.</p>" +
        "<p><strong>Full Name (as on passport):</strong> {{fullName}}</p>" +
        "<p><strong>Membership ID:</strong> {{membershipId}}</p>" +
        "<p><strong>Expiry:</strong> {{expiry}}</p>",
      bodyText:
        "Welcome to Balsalameh\n\nFull Name (as on passport): {{fullName}}\nMembership ID: {{membershipId}}\nExpiry: {{expiry}}",
      variables: ["{{fullName}}", "{{membershipId}}", "{{expiry}}", "{{supportEmail}}", "{{companyLegalName}}"],
      isPlaceholder: true,
    },
    update: {},
  });

  console.log("Seed complete: settings, owner user, legal stubs, email template.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
