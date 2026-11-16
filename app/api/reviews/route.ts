import { connection, NextResponse } from "next/server";
import { mediaUrl, reviews } from "@/lib/admin/store";

/** Public: the reviews added in /admin, newest first, in the shape the review cards use. */
export async function GET() {
  await connection(); // read the list on every request, never at build time
  const rows = await reviews.list();
  return NextResponse.json(
    rows.map((r) => ({
      id: r.id,
      name: r.name,
      sign: r.name.split(/\s+/)[0],
      car: r.car,
      service: r.service,
      rating: r.rating,
      text: r.text,
      photo: { src: mediaUrl("reviews", r.photo), alt: `${r.car} at 9M Car Care` },
    })),
    { headers: { "Cache-Control": "no-store" } },
  );
}
