import type { Metadata } from "next";
import Link from "next/link";
import { Pill, WaPill } from "@/components/site/pill";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="gut flex min-h-svh flex-col items-start justify-center gap-6 py-24">
      <Link href="/" className="font-brand text-[1.6rem] font-black tracking-[-0.02em]">
        9M <span className="text-[0.5em] font-semibold tracking-[0.2em]">CAR CARE</span>
      </Link>
      <p aria-hidden className="font-brand text-[clamp(5.5rem,24vw,13rem)] leading-[0.8] font-black tracking-[-0.04em]">
        404
      </p>
      <h1 className="max-w-[18ch] font-brand text-[clamp(1.9rem,4.4vw,3.2rem)] leading-[1] font-black tracking-[-0.02em]">This page took a wrong turn.</h1>
      <p className="max-w-[44ch] text-foreground/75">
        The link may be old or mistyped. Everything about the studio is on the home page, or ask us directly on WhatsApp.
      </p>
      <div className="flex flex-wrap gap-2.5">
        <Pill href="/">Back to the home page</Pill>
        <WaPill tone="line" />
      </div>
    </main>
  );
}
