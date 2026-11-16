import { promises as fs } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { currentAdmin } from "@/lib/admin/session";
import { reviews, UPLOADS_DIR } from "@/lib/admin/store";

const MAX_PHOTO = 10 * 1024 * 1024; // 10 MB
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

const field = (form: FormData, key: string, max: number) => {
  const v = form.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
};

/** Add a review: the owner's name, car, service, stars, what they said, and a photo of the car. */
export async function POST(req: NextRequest) {
  if (!(await currentAdmin())) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const name = field(form, "name", 60);
  const car = field(form, "car", 60);
  const service = field(form, "service", 60);
  const text = field(form, "text", 400);
  const rating = Math.round(Number(form.get("rating")));
  const photo = form.get("photo");

  if (!name || !car || !service || !text) return NextResponse.json({ error: "Fill in the name, car, service and review." }, { status: 400 });
  if (!(rating >= 1 && rating <= 5)) return NextResponse.json({ error: "Choose 1 to 5 stars." }, { status: 400 });
  if (!(photo instanceof File) || photo.size === 0) return NextResponse.json({ error: "Add a photo of the car." }, { status: 400 });
  const ext = TYPES[photo.type];
  if (!ext) return NextResponse.json({ error: "The photo must be a JPG, PNG or WebP." }, { status: 415 });
  if (photo.size > MAX_PHOTO) return NextResponse.json({ error: "The photo is over 10 MB." }, { status: 413 });

  const id = randomUUID();
  const file = `${id}.${ext}`;
  const dir = path.join(UPLOADS_DIR, "reviews");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, file), Buffer.from(await photo.arrayBuffer()));
  await reviews.add({ id, name, car, service, rating, text, photo: file, createdAt: new Date().toISOString() });
  return NextResponse.json({ ok: true, id }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  if (!(await currentAdmin())) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id") ?? "";
  if (!/^[0-9a-f-]{36}$/.test(id)) return NextResponse.json({ error: "Unknown review." }, { status: 400 });
  const ok = await reviews.remove(id);
  return NextResponse.json({ ok }, { status: ok ? 200 : 404 });
}
