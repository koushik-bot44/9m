import { createWriteStream, promises as fs } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { ReadableStream as NodeReadableStream } from "node:stream/web";
import { NextResponse, type NextRequest } from "next/server";
import { currentAdmin } from "@/lib/admin/session";
import { mediaUrl, reels, UPLOADS_DIR } from "@/lib/admin/store";

const MAX = 300 * 1024 * 1024; // 300 MB
const TYPES: Record<string, string> = { "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov" };

/** Upload a reel. The video is the raw request body (streamed to disk, never held in memory);
 *  the title comes in the x-title header. */
export async function POST(req: NextRequest) {
  if (!(await currentAdmin())) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  const type = (req.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  const ext = TYPES[type];
  if (!ext) return NextResponse.json({ error: "Upload an MP4, MOV or WebM video." }, { status: 415 });
  if (Number(req.headers.get("content-length") ?? 0) > MAX) return NextResponse.json({ error: "That video is over 300 MB." }, { status: 413 });
  if (!req.body) return NextResponse.json({ error: "No video received." }, { status: 400 });

  let title = "New reel";
  try {
    title = decodeURIComponent(req.headers.get("x-title") ?? "").trim().slice(0, 80) || title;
  } catch {}

  const id = randomUUID();
  const file = `${id}.${ext}`;
  const dir = path.join(UPLOADS_DIR, "reels");
  await fs.mkdir(dir, { recursive: true });
  const dest = path.join(dir, file);

  let size = 0;
  const limit = new Transform({
    transform(chunk: Buffer, _enc, done) {
      size += chunk.length;
      done(size > MAX ? new Error("too large") : null, chunk);
    },
  });
  try {
    await pipeline(Readable.fromWeb(req.body as unknown as NodeReadableStream), limit, createWriteStream(dest));
  } catch {
    await fs.rm(dest, { force: true });
    const big = size > MAX;
    return NextResponse.json({ error: big ? "That video is over 300 MB." : "The upload stopped. Try again." }, { status: big ? 413 : 500 });
  }
  if (size === 0) {
    await fs.rm(dest, { force: true });
    return NextResponse.json({ error: "The file was empty." }, { status: 400 });
  }

  await reels.add({ id, title, file, createdAt: new Date().toISOString() });
  return NextResponse.json({ id, title, src: mediaUrl("reels", file) }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  if (!(await currentAdmin())) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id") ?? "";
  if (!/^[0-9a-f-]{36}$/.test(id)) return NextResponse.json({ error: "Unknown reel." }, { status: 400 });
  const ok = await reels.remove(id);
  return NextResponse.json({ ok }, { status: ok ? 200 : 404 });
}
