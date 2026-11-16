import { NextResponse } from "next/server";
import { currentAdmin } from "@/lib/admin/session";

export async function GET() {
  const email = await currentAdmin();
  return NextResponse.json({ admin: Boolean(email), email }, { headers: { "Cache-Control": "no-store" } });
}
