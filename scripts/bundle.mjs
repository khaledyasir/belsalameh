/**
 * Assembles the deploy bundle after `next build`.
 * Run via `npm run bundle` (which builds first).
 *
 * Output: belsalameh-deploy.zip  — everything the server needs, no npm/build.
 */
import { cpSync, rmSync, mkdirSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

const OUT = "deploy";
const ZIP = "belsalameh-deploy.zip";

if (!existsSync(".next/standalone/server.js")) {
  console.error("No .next/standalone — run `npm run build` first.");
  process.exit(1);
}

rmSync(OUT, { recursive: true, force: true });
rmSync(ZIP, { force: true });
mkdirSync(OUT, { recursive: true });

// standalone already contains .next/static, public and node_modules/.prisma
// (copied by the postbuild step).
cpSync(".next/standalone", OUT, { recursive: true });
cpSync("web.config", `${OUT}/web.config`);
cpSync(".env.example", `${OUT}/.env.example`);
cpSync("DEPLOY.md", `${OUT}/DEPLOY.md`);
cpSync("scripts", `${OUT}/scripts`, { recursive: true });
cpSync("db", `${OUT}/db`, { recursive: true });
mkdirSync(`${OUT}/logs`, { recursive: true });

// zip it (PowerShell is always present on Windows; zip on mac/linux)
if (process.platform === "win32") {
  execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${OUT}/*' -DestinationPath '${ZIP}' -Force"`, { stdio: "inherit" });
} else {
  execSync(`cd ${OUT} && zip -qr ../${ZIP} .`, { stdio: "inherit", shell: "/bin/bash" });
}

console.log(`\n✓ ${ZIP} ready — send this file to the server team.`);
