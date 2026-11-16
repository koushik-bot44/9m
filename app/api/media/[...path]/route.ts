import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import type { NextRequest } from "next/server";
import { UPLOADS_DIR } from "@/lib/admin/store";

const TYPES: Record<string, string> = {
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

const body = (file: string, opts?: { start: number; end: number }) =>
  Readable.toWeb(createReadStream(file, opts)) as unknown as ReadableStream<Uint8Array>;

/** Serves uploaded reels and review photos, with byte ranges so videos can seek and play on iPhones. */
export async function GET(req: NextRequest, ctx: RouteContext<"/api/media/[...path]">) {
  const { path: parts } = await ctx.params;
  const rel = parts.join("/");
  const m = /^(reels|reviews)\/[0-9a-f-]{36}\.(mp4|webm|mov|jpg|png|webp)$/.exec(rel);
  if (!m) return new Response("Not found", { status: 404 });

  const file = path.join(UPLOADS_DIR, rel);
  let size: number;
  try {
    size = (await fs.stat(file)).size;
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const headers = { "Content-Type": TYPES[m[2]], "Accept-Ranges": "bytes", "Cache-Control": "public, max-age=31536000, immutable" };
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get("range") ?? "");
  if (range && (range[1] || range[2])) {
    let start: number;
    let end: number;
    if (range[1]) {
      start = Number(range[1]);
      end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    } else {
      start = Math.max(0, size - Number(range[2]));
      end = size - 1;
    }
    if (start > end || start >= size) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    }
    return new Response(body(file, { start, end }), {
      status: 206,
      headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": String(end - start + 1) },
    });
  }
  return new Response(body(file), { headers: { ...headers, "Content-Length": String(size) } });
}
