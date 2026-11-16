import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// One super admin, set in .env.local (ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_SECRET).
// The session is a signed cookie: no database needed.

export const SESSION_COOKIE = "9m_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // a week

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET is missing or shorter than 32 characters (see .env.local)");
  return s;
}

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function createSession(email: string) {
  const payload = Buffer.from(JSON.stringify({ e: email, x: Date.now() + SESSION_MAX_AGE * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySession(token: string | undefined): string | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || !same(sig, sign(payload))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { e?: unknown; x?: unknown };
    if (typeof data.e !== "string" || typeof data.x !== "number" || data.x < Date.now()) return null;
    return data.e;
  } catch {
    return null;
  }
}

/** The signed-in super admin's email, or null. Checked again inside every admin route. */
export async function currentAdmin() {
  const jar = await cookies();
  return verifySession(jar.get(SESSION_COOKIE)?.value);
}

export function credentialsMatch(email: string, password: string) {
  const expectedEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";
  if (!expectedEmail || expectedPassword.length < 8) return false;
  // compare both, always, so the time taken says nothing about which one was wrong
  const a = same(email.trim().toLowerCase(), expectedEmail);
  const b = same(password, expectedPassword);
  return a && b;
}
