import { Plus } from "lucide-react";
import { FAQS, PHOTOS } from "@/lib/site";
import { WaPill } from "./pill";

/** The questions owners ask before they book, beside a photograph that stays put while you read. */
export function Faq() {
  return (
    <section id="faq" className="gut py-[clamp(72px,10vw,150px)]">
      <div className="mx-auto grid max-w-[1480px] items-start gap-[clamp(20px,3vw,44px)] md:grid-cols-2">
        <div>
          <h2 className="display text-[clamp(2.4rem,5.6vw,5.4rem)]">
            Questions, <em>answered.</em>
          </h2>
          <p className="mt-4 max-w-md text-[clamp(1.02rem,1.3vw,1.2rem)] leading-snug text-muted-foreground">The things owners ask most before they book.</p>
          <div className="mt-8 grid gap-2.5">
            {FAQS.map((f, i) => (
              <details key={f.q} open={i === 0} className="group rounded-[12px] bg-paper px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[1.02rem] font-semibold">
                  {f.q}
                  <Plus className="size-5 shrink-0 transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <p className="mt-3 max-w-[60ch] leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
          <WaPill message="Hi 9M Car Care. I have a question about my car." className="mt-6">
            Ask us anything
          </WaPill>
        </div>
        <div className="relative overflow-hidden rounded-[14px] max-md:aspect-[4/3] md:sticky md:top-24 md:h-[min(78svh,760px)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PHOTOS.mustangInterior.src} alt={PHOTOS.mustangInterior.alt} loading="lazy" className="absolute inset-0 size-full object-cover" />
        </div>
      </div>
    </section>
  );
}
