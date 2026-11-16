import { NextResponse, type NextRequest } from "next/server";
import { createSession, credentialsMatch, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/admin/session";

// Five wrong tries from one address locks that address out for a minute.
const tries = new Map<string, { n: number; until: number }>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const t = tries.get(ip);
  if (t && t.until > now && t.n >= 5) {
    return NextResponse.json({ error: "Too many tries. Wait a minute and try again." }, { status: 429 });
  }

  let body: { email?: unknown; password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const email = typeof body.email === "string" ? body.email : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!credentialsMatch(email, password)) {
    const cur = t && t.until > now ? t : { n: 0, until: now + 60_000 };
    tries.set(ip, { n: cur.n + 1, until: cur.until });
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ error: "Wrong email or password." }, { status: 401 });
  }

  tries.delete(ip);
  const res = NextResponse.json({ ok: true, email: email.trim().toLowerCase() });
  res.cookies.set(SESSION_COOKIE, createSession(email.trim().toLowerCase()), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
    secure: req.nextUrl.protocol === "https:" || req.headers.get("x-forwarded-proto") === "https",
  });
  return res;
}
