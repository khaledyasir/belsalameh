import "server-only";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

/**
 * Durable diagnostics for the transactional-email path.
 *
 * By default the log is written beside package.json as `email-flow.log`.
 * Set EMAIL_LOG_FILE to an absolute path when the application is started from
 * a read-only directory (for example, many container images).
 *
 * Deliberately do not write the SendGrid API key or rendered email content.
 */
const logFile = process.env.EMAIL_LOG_FILE || path.join(process.cwd(), "email-flow.log");

function serialize(value: unknown): string {
  const seen = new WeakSet<object>();
  try {
    return JSON.stringify(value, (_key, entry: unknown) => {
      if (entry instanceof Error) {
        return { name: entry.name, message: entry.message, stack: entry.stack };
      }
      if (typeof entry === "bigint") return entry.toString();
      if (typeof entry === "object" && entry !== null) {
        if (seen.has(entry)) return "[circular]";
        seen.add(entry);
      }
      return entry;
    });
  } catch {
    return JSON.stringify({ value: String(value) });
  }
}

export async function emailDebug(event: string, details: Record<string, unknown> = {}): Promise<void> {
  const line = `${new Date().toISOString()} [email-flow] ${event} ${serialize(details)}\n`;

  try {
    await mkdir(path.dirname(logFile), { recursive: true });
    await appendFile(logFile, line, "utf8");
  } catch (error) {
    // Keep payment processing and email delivery non-fatal if disk logging is unavailable.
    console.error("[email-flow] Could not write diagnostic log", { logFile, error });
  }
}

export function emailLogPath(): string {
  return logFile;
}
