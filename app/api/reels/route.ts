import { connection, NextResponse } from "next/server";
import { mediaUrl, reels } from "@/lib/admin/store";

/** Public: the reels uploaded in /admin, newest first. */
export async function GET() {
  await connection(); // read the list on every request, never at build time
  const rows = await reels.list();
  return NextResponse.json(
    rows.map((r) => ({ id: r.id, title: r.title, src: mediaUrl("reels", r.file) })),
    { headers: { "Cache-Control": "no-store" } },
  );
}
